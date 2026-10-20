import type { FastifyInstance } from 'fastify'
import { authenticate, authorize, type AuthenticatedRequest } from '@/middleware/auth'
import { prisma } from '@/lib/prisma'
import { validationMiddleware } from '@/middleware/validation'
import { z } from 'zod'

/* Craftlane — Project routes
 *
 * GET    /projects              List published projects (with filters, pagination)
 * GET    /projects/:id          Get a single project
 * POST   /projects              Create a project (client only)
 * PATCH  /projects/:id          Update a project (owner only)
 * POST   /projects/:id/close    Close a project (owner only)
 */

/* ------------------------------------------------------------------ */
/* Validation schemas                                                 */
/* ------------------------------------------------------------------ */
const ProjectQuerySchema = z.object({
  query: z.string().optional(),
  skills: z.string().optional(),
  project_type: z.enum(['fixed_price', 'hourly']).optional(),
  budget_min: z.coerce.number().nonnegative().optional(),
  budget_max: z.coerce.number().nonnegative().optional(),
  status: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  page_size: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'budget', 'deadline', 'title']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

const ProjectCreateSchema = z.object({
  title: z.string().min(3).max(255),
  description: z.string().min(10),
  project_type: z.enum(['fixed_price', 'hourly']).default('fixed_price'),
  budget_min: z.number().nonnegative().optional().nullable(),
  budget_max: z.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).default('USD'),
  deadline: z.string().datetime().optional().nullable(),
  skills: z.array(z.string()).optional(),
})

const ProjectUpdateSchema = z.object({
  title: z.string().min(3).max(255).optional(),
  description: z.string().min(10).optional(),
  project_type: z.enum(['fixed_price', 'hourly']).optional(),
  budget_min: z.number().nonnegative().optional().nullable(),
  budget_max: z.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).optional(),
  deadline: z.string().datetime().optional().nullable(),
  status: z
    .enum(['draft', 'published', 'paused', 'closed'])
    .optional(),
  skills: z.array(z.string()).optional(),
})

const ProjectIdSchema = z.object({
  id: z.string().uuid(),
})

/* ------------------------------------------------------------------ */
/* Route handlers                                                     */
/* ------------------------------------------------------------------ */

export default async function projectRoutes(fastify: FastifyInstance) {
  /* List projects */
  fastify.get(
    '/',
    {
      preHandler: [validationMiddleware({ query: ProjectQuerySchema })],
    },
    async (request, reply) => {
      const q = request.query as z.infer<typeof ProjectQuerySchema>
      const skip = (q.page - 1) * q.page_size
      const take = q.page_size

      const where: Record<string, unknown> = {
        status: q.status || 'PUBLISHED',
      }

      if (q.query) {
        where.OR = [
          { title: { contains: q.query, mode: 'insensitive' } },
          { description: { contains: q.query, mode: 'insensitive' } },
        ]
      }
      if (q.project_type) {
        where.project_type = q.project_type
      }
      if (q.budget_min !== undefined) {
        where.budget_min_cents = { gte: q.budget_min * 100 }
      }
      if (q.budget_max !== undefined) {
        where.budget_max_cents = { lte: q.budget_max * 100 }
      }

      const [projects, total] = await prisma.$transaction([
        prisma.project.findMany({
          where,
          skip,
          take,
          orderBy: { [q.sort]: q.order },
          include: {
            client: {
              select: {
                id: true,
                organization: true,
                bio: true,
                location: true,
              },
            },
            skills: {
              include: { skill: true },
            },
          },
        }),
        prisma.project.count({ where }),
      ])

      const totalPages = Math.ceil(total / q.page_size)

      return reply.status(200).send({
        projects: projects.map((p) => ({
          id: p.id,
          client_id: p.client_id,
          title: p.title,
          description: p.description,
          status: p.status,
          project_type: p.project_type,
          budget_min: p.budget_min_cents
            ? p.budget_min_cents / 100
            : null,
          budget_max: p.budget_max_cents
            ? p.budget_max_cents / 100
            : null,
          currency: p.currency,
          deadline: p.deadline,
          skills: p.skills.map((ps) => ps.skill.name),
          client: p.client,
          created_at: p.created_at,
          updated_at: p.updated_at,
        })),
        pagination: {
          page: q.page,
          page_size: q.page_size,
          total,
          total_pages: totalPages,
        },
      })
    },
  )

  /* Get a single project */
  fastify.get(
    '/:id',
    {
      preHandler: [validationMiddleware({ params: ProjectIdSchema })],
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof ProjectIdSchema>

      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          client: {
            select: {
              id: true,
              organization: true,
              bio: true,
              location: true,
              user: {
                select: { email: true },
              },
            },
          },
          skills: {
            include: { skill: true },
          },
          proposals: {
            select: {
              id: true,
              freelancer_id: true,
              cover_message: true,
              proposed_price_cents: true,
              proposed_timeline: true,
              status: true,
              created_at: true,
            },
          },
        },
      })

      if (!project) {
        return reply.status(404).send({ error: 'not_found', message: 'Project not found' })
      }

      return reply.status(200).send({
        id: project.id,
        client_id: project.client_id,
        title: project.title,
        description: project.description,
        status: project.status,
        project_type: project.project_type,
        budget_min: project.budget_min_cents
          ? project.budget_min_cents / 100
          : null,
        budget_max: project.budget_max_cents
          ? project.budget_max_cents / 100
          : null,
        currency: project.currency,
        deadline: project.deadline,
        skills: project.skills.map((ps) => ps.skill.name),
        client: project.client,
        proposals: project.proposals,
        created_at: project.created_at,
        updated_at: project.updated_at,
      })
    },
  )

  /* Create a project (client only) */
  fastify.post(
    '/',
    {
      preHandler: [
        authenticate,
        authorize(['CLIENT', 'ADMIN']),
        validationMiddleware({ body: ProjectCreateSchema }),
      ],
    },
    async (request, reply) => {
      const req = request as AuthenticatedRequest
      const userId = req.user?.id
      const body = request.body as z.infer<typeof ProjectCreateSchema>

      // Get or create client profile
      let clientProfile = await prisma.clientProfile.findUnique({
        where: { user_id: userId },
      })

      if (!clientProfile) {
        clientProfile = await prisma.clientProfile.create({
          data: { user_id: userId },
        })
      }

      // Validate budget range
      if (
        body.budget_min !== null &&
        body.budget_min !== undefined &&
        body.budget_max !== null &&
        body.budget_max !== undefined &&
        body.budget_min > body.budget_max
      ) {
        return reply.status(400).send({
          error: 'validation_error',
          message: 'budget_min must be less than or equal to budget_max',
        })
      }

      // Get or create skills and build skill connects
      const skillConnects: { skill: { connect: { id: string } } }[] = []
      if (body.skills?.length) {
        for (const skillName of body.skills) {
          let skill = await prisma.skill.findUnique({
            where: { name: skillName },
          })
          if (!skill) {
            skill = await prisma.skill.create({
              data: {
                name: skillName,
                slug: skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              },
            })
          }
          skillConnects.push({ skill: { connect: { id: skill.id } } })
        }
      }

      const project = await prisma.project.create({
        data: {
          client_id: clientProfile.id,
          title: body.title,
          description: body.description,
          project_type:
            body.project_type === 'hourly'
              ? 'HOURLY'
              : ('FIXED_PRICE' as const),
          budget_min_cents: body.budget_min
            ? Math.round(body.budget_min * 100)
            : null,
          budget_max_cents: body.budget_max
            ? Math.round(body.budget_max * 100)
            : null,
          currency: body.currency,
          deadline: body.deadline ? new Date(body.deadline) : null,
          status: 'PUBLISHED',
          skills: skillConnects.length > 0 ? { create: skillConnects } : undefined,
        },
        include: {
          skills: { include: { skill: true } },
        },
      })

      return reply.status(201).send({
        id: project.id,
        client_id: project.client_id,
        title: project.title,
        description: project.description,
        status: project.status,
        project_type: project.project_type,
        budget_min: project.budget_min_cents
          ? project.budget_min_cents / 100
          : null,
        budget_max: project.budget_max_cents
          ? project.budget_max_cents / 100
          : null,
        currency: project.currency,
        deadline: project.deadline,
        skills: project.skills.map((ps) => ps.skill.name),
        created_at: project.created_at,
        updated_at: project.updated_at,
      })
    },
  )

  /* Update a project (owner only) */
  fastify.patch(
    '/:id',
    {
      preHandler: [
        authenticate,
        validationMiddleware({ params: ProjectIdSchema, body: ProjectUpdateSchema }),
      ],
    },
    async (request, reply) => {
      const req = request as AuthenticatedRequest
      const { id } = request.params as z.infer<typeof ProjectIdSchema>
      const body = request.body as z.infer<typeof ProjectUpdateSchema>
      const userId = req.user?.id

      const project = await prisma.project.findUnique({
        where: { id },
        include: { client: true },
      })

      if (!project) {
        return reply.status(404).send({ error: 'not_found', message: 'Project not found' })
      }

      if (project.client.user_id !== userId && req.user?.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'forbidden', message: 'Not the project owner' })
      }

      // Cannot modify closed/completed projects
      if (project.status === 'CLOSED' || project.status === 'COMPLETED') {
        return reply.status(400).send({
          error: 'invalid_transition',
          message: 'Cannot modify a closed or completed project',
        })
      }

      const updateData: Record<string, unknown> = {}
      if (body.title !== undefined) updateData.title = body.title
      if (body.description !== undefined) updateData.description = body.description
      if (body.project_type !== undefined) updateData.project_type = body.project_type
      if (body.budget_min !== null && body.budget_min !== undefined)
        updateData.budget_min_cents = Math.round(body.budget_min * 100)
      if (body.budget_max !== null && body.budget_max !== undefined)
        updateData.budget_max_cents = Math.round(body.budget_max * 100)
      if (body.currency !== undefined) updateData.currency = body.currency
      if (body.deadline !== null && body.deadline !== undefined)
        updateData.deadline = body.deadline ? new Date(body.deadline) : null
      if (body.status !== undefined) updateData.status = body.status

      const updated = await prisma.project.update({
        where: { id },
        data: updateData,
        include: { skills: { include: { skill: true } } },
      })

      return reply.status(200).send({
        id: updated.id,
        title: updated.title,
        status: updated.status,
        skills: updated.skills.map((ps) => ps.skill.name),
        updated_at: updated.updated_at,
      })
    },
  )

  /* Close a project (owner only) */
  fastify.post(
    '/:id/close',
    {
      preHandler: [
        authenticate,
        validationMiddleware({ params: ProjectIdSchema }),
      ],
    },
    async (request, reply) => {
      const req = request as AuthenticatedRequest
      const { id } = request.params as z.infer<typeof ProjectIdSchema>
      const userId = req.user?.id

      const project = await prisma.project.findUnique({
        where: { id },
        include: { client: true },
      })

      if (!project) {
        return reply.status(404).send({ error: 'not_found', message: 'Project not found' })
      }

      if (project.client.user_id !== userId && req.user?.role !== 'ADMIN') {
        return reply.status(403).send({ error: 'forbidden', message: 'Not the project owner' })
      }

      if (project.status === 'CLOSED' || project.status === 'COMPLETED') {
        return reply.status(400).send({
          error: 'invalid_transition',
          message: 'Project is already closed or completed',
        })
      }

      const updated = await prisma.project.update({
        where: { id },
        data: { status: 'CLOSED' },
      })

      return reply.status(200).send({
        id: updated.id,
        status: updated.status,
      })
    },
  )
}
