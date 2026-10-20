import type { FastifyInstance } from 'fastify';
import { authenticate, authorize, type AuthenticatedRequest } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { validationMiddleware } from '@/middleware/validation';
import { z } from 'zod';

/* Craftlane — Proposal routes
 *
 * GET    /projects/:projectId/proposals   List proposals for a project
 * POST   /projects/:projectId/proposals   Submit a proposal (freelancer only)
 * GET    /proposals/:id                   Get a single proposal
 * POST   /proposals/:id/decide            Accept or reject (client only)
 */

const ProposalQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(20),
  status: z.string().optional(),
});

const ProposalCreateSchema = z.object({
  cover_message: z.string().min(10),
  proposed_price: z.number().nonnegative().optional().nullable(),
  proposed_timeline: z.string().max(255).optional(),
});

const ProposalIdSchema = z.object({
  id: z.string().uuid(),
});

const ProjectIdParamSchema = z.object({
  projectId: z.string().uuid(),
});

const ProposalDecideSchema = z.object({
  decision: z.enum(['accept', 'reject']),
});

export default async function proposalRoutes(fastify: FastifyInstance) {
  /* List proposals for a project */
  fastify.get(
    '/projects/:projectId/proposals',
    {
      preHandler: [
        authenticate,
        validationMiddleware({ params: ProjectIdParamSchema, query: ProposalQuerySchema }),
      ],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamSchema>;
      const q = request.query as z.infer<typeof ProposalQuerySchema>;
      const req = request as AuthenticatedRequest;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { id: true, client_id: true, status: true },
      });

      if (!project) {
        return reply.status(404).send({ error: 'not_found', message: 'Project not found' });
      }

      // Only the client or admins can see all proposals; freelancers see their own
      let where: Record<string, unknown> = { project_id: projectId };
      if (userRole !== 'ADMIN') {
        const clientProfile = await prisma.clientProfile.findUnique({
          where: { user_id: userId },
          select: { id: true },
        });
        const isClient = clientProfile?.id === project.client_id;
        if (!isClient) {
          where = { ...where, freelancer_id: userId };
        }
      }

      if (q.status) {
        where.status = q.status;
      }

      const skip = (q.page - 1) * q.page_size;
      const take = q.page_size;

      const [proposals, total] = await prisma.$transaction([
        prisma.proposal.findMany({
          where,
          skip,
          take,
          orderBy: { created_at: 'desc' },
          include: {
            freelancer: {
              select: {
                id: true,
                email: true,
                full_name: true,
              },
            },
          },
        }),
        prisma.proposal.count({ where }),
      ]);

      return reply.status(200).send({
        proposals: proposals.map((p) => ({
          id: p.id,
          project_id: p.project_id,
          freelancer_id: p.freelancer_id,
          cover_message: p.cover_message,
          proposed_price: p.proposed_price_cents ? p.proposed_price_cents / 100 : null,
          proposed_timeline: p.proposed_timeline,
          status: p.status,
          freelancer: p.freelancer,
          created_at: p.created_at,
          updated_at: p.updated_at,
        })),
        pagination: {
          page: q.page,
          page_size: q.page_size,
          total,
          total_pages: Math.ceil(total / q.page_size),
        },
      });
    }
  );

  /* Submit a proposal (freelancer only) */
  fastify.post(
    '/projects/:projectId/proposals',
    {
      preHandler: [
        authenticate,
        authorize(['FREELANCER', 'ADMIN']),
        validationMiddleware({ params: ProjectIdParamSchema, body: ProposalCreateSchema }),
      ],
    },
    async (request, reply) => {
      const { projectId } = request.params as z.infer<typeof ProjectIdParamSchema>;
      const body = request.body as z.infer<typeof ProposalCreateSchema>;
      const req = request as AuthenticatedRequest;
      const userId = req.user?.id;

      if (!userId) {
        return reply
          .status(401)
          .send({ error: 'unauthenticated', message: 'Authentication required' });
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: {
          id: true,
          status: true,
          client_id: true,
        },
      });

      if (!project) {
        return reply.status(404).send({ error: 'not_found', message: 'Project not found' });
      }

      if (project.status !== 'PUBLISHED') {
        return reply.status(400).send({
          error: 'invalid_transition',
          message: 'Cannot propose to a non-published project',
        });
      }

      // Check for existing proposal
      const existing = await prisma.proposal.findUnique({
        where: {
          project_id_freelancer_id: { project_id: projectId, freelancer_id: userId },
        },
      });

      if (existing) {
        return reply.status(409).send({
          error: 'conflict',
          message: 'You have already submitted a proposal for this project',
        });
      }

      const proposal = await prisma.proposal.create({
        data: {
          project_id: projectId,
          freelancer_id: userId,
          cover_message: body.cover_message,
          proposed_price_cents: body.proposed_price ? Math.round(body.proposed_price * 100) : null,
          proposed_timeline: body.proposed_timeline,
          status: 'SUBMITTED',
        },
        include: {
          freelancer: {
            select: { id: true, email: true, full_name: true },
          },
        },
      });

      return reply.status(201).send({
        id: proposal.id,
        project_id: proposal.project_id,
        freelancer_id: proposal.freelancer_id,
        cover_message: proposal.cover_message,
        proposed_price: proposal.proposed_price_cents ? proposal.proposed_price_cents / 100 : null,
        proposed_timeline: proposal.proposed_timeline,
        status: proposal.status,
        created_at: proposal.created_at,
      });
    }
  );

  /* Get a single proposal */
  fastify.get(
    '/:id',
    {
      preHandler: [authenticate, validationMiddleware({ params: ProposalIdSchema })],
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof ProposalIdSchema>;
      const req = request as AuthenticatedRequest;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: {
          project: {
            select: { id: true, title: true, client_id: true, status: true },
          },
          freelancer: {
            select: { id: true, email: true, full_name: true },
          },
        },
      });

      if (!proposal) {
        return reply.status(404).send({ error: 'not_found', message: 'Proposal not found' });
      }

      // Authorization: client of the project, the freelancer, or admin
      const clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
        select: { id: true },
      });
      const isClient = clientProfile?.id === proposal.project.client_id;
      const isFreelancer = proposal.freelancer_id === userId;

      if (userRole !== 'ADMIN' && !isClient && !isFreelancer) {
        return reply
          .status(403)
          .send({ error: 'forbidden', message: 'Not authorized to view this proposal' });
      }

      return reply.status(200).send({
        id: proposal.id,
        project_id: proposal.project_id,
        freelancer_id: proposal.freelancer_id,
        cover_message: proposal.cover_message,
        proposed_price: proposal.proposed_price_cents ? proposal.proposed_price_cents / 100 : null,
        proposed_timeline: proposal.proposed_timeline,
        status: proposal.status,
        project: {
          id: proposal.project.id,
          title: proposal.project.title,
          status: proposal.project.status,
        },
        freelancer: proposal.freelancer,
        created_at: proposal.created_at,
        updated_at: proposal.updated_at,
      });
    }
  );

  /* Accept or reject a proposal (client only) */
  fastify.post(
    '/:id/decide',
    {
      preHandler: [
        authenticate,
        authorize(['CLIENT', 'ADMIN']),
        validationMiddleware({ params: ProposalIdSchema, body: ProposalDecideSchema }),
      ],
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof ProposalIdSchema>;
      const { decision } = request.body as z.infer<typeof ProposalDecideSchema>;
      const req = request as AuthenticatedRequest;
      const userId = req.user?.id;
      const userRole = req.user?.role;

      const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: {
          project: { include: { client: true } },
        },
      });

      if (!proposal) {
        return reply.status(404).send({ error: 'not_found', message: 'Proposal not found' });
      }

      if (proposal.project.client.user_id !== userId && userRole !== 'ADMIN') {
        return reply.status(403).send({ error: 'forbidden', message: 'Not the project client' });
      }

      if (proposal.status !== 'SUBMITTED') {
        return reply.status(400).send({
          error: 'invalid_transition',
          message: 'Proposal is no longer in submitted state',
        });
      }

      const newStatus = decision === 'accept' ? 'ACCEPTED' : 'REJECTED';

      // When accepting, prevent conflicting hires — check if project already has an accepted proposal
      if (decision === 'accept') {
        const existingAccepted = await prisma.proposal.findFirst({
          where: {
            project_id: proposal.project_id,
            status: 'ACCEPTED',
            id: { not: id },
          },
        });
        if (existingAccepted) {
          return reply.status(409).send({
            error: 'conflict',
            message: 'Project already has an accepted proposal',
          });
        }
      }

      const updated = await prisma.proposal.update({
        where: { id },
        data: { status: newStatus },
      });

      return reply.status(200).send({
        id: updated.id,
        status: updated.status,
      });
    }
  );
}
