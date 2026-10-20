import type { FastifyInstance } from 'fastify';
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth';
import { prisma } from '@/lib/prisma';
import { validationMiddleware } from '@/middleware/validation';
import { z } from 'zod';

/* Craftlane — Profile routes
 *
 * GET    /profiles/me             Get own profile (requires authentication)
 * GET    /profiles/freelancer/:id Get a freelancer's public profile
 * GET    /profiles/client/:id     Get a client's public profile
 * PATCH  /profiles/me             Update own profile (requires authentication)
 */

const FreelancerProfileUpdateSchema = z.object({
  headline: z.string().max(255).optional().nullable(),
  bio: z.string().optional().nullable(),
  location: z.string().max(255).optional().nullable(),
  hourly_rate: z.number().nonnegative().optional().nullable(),
  currency: z.string().length(3).optional(),
  availability: z.enum(['available', 'busy', 'unavailable']).optional(),
  is_public: z.boolean().optional(),
  skills: z.array(z.string()).optional(),
});

const ProfileIdSchema = z.object({
  id: z.string().uuid(),
});

export default async function profileRoutes(fastify: FastifyInstance) {
  /* Get own profile */
  fastify.get('/me', { preHandler: [authenticate] }, async (request, reply) => {
    const req = request as AuthenticatedRequest;
    const userId = req.user?.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        freelancer_profile: {
          include: {
            skills: { include: { skill: true } },
            portfolio: true,
          },
        },
        client_profile: true,
      },
    });

    if (!user) {
      return reply.status(404).send({ error: 'not_found', message: 'User not found' });
    }

    if (user.role === 'FREELANCER' && user.freelancer_profile) {
      const p = user.freelancer_profile;
      return reply.status(200).send({
        id: p.id,
        user_id: p.user_id,
        headline: p.headline,
        bio: p.bio,
        location: p.location,
        hourly_rate: p.hourly_rate_cents ? p.hourly_rate_cents / 100 : null,
        currency: p.currency,
        availability: p.availability,
        is_public: p.is_public,
        skills: p.skills.map((ps) => ps.skill.name),
        portfolio: p.portfolio.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          created_at: item.created_at,
        })),
        created_at: p.created_at,
        updated_at: p.updated_at,
      });
    }

    if (user.role === 'CLIENT' && user.client_profile) {
      const p = user.client_profile;
      return reply.status(200).send({
        id: p.id,
        user_id: p.user_id,
        organization: p.organization,
        bio: p.bio,
        location: p.location,
        is_public: p.is_public,
        created_at: p.created_at,
        updated_at: p.updated_at,
      });
    }

    return reply.status(200).send({
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      message: 'No profile configured yet',
    });
  });

  /* Get a freelancer's public profile */
  fastify.get(
    '/freelancer/:id',
    {
      preHandler: [validationMiddleware({ params: ProfileIdSchema })],
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof ProfileIdSchema>;

      const profile = await prisma.freelancerProfile.findUnique({
        where: { id },
        include: {
          user: { select: { id: true, email: true, full_name: true } },
          skills: { include: { skill: true } },
          portfolio: true,
        },
      });

      if (!profile || !profile.is_public) {
        return reply.status(404).send({ error: 'not_found', message: 'Profile not found' });
      }

      return reply.status(200).send({
        id: profile.id,
        user: profile.user,
        headline: profile.headline,
        bio: profile.bio,
        location: profile.location,
        hourly_rate: profile.hourly_rate_cents ? profile.hourly_rate_cents / 100 : null,
        currency: profile.currency,
        availability: profile.availability,
        skills: profile.skills.map((ps) => ps.skill.name),
        portfolio: profile.portfolio.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          url: item.url,
          thumbnail_url: item.thumbnail_url,
          created_at: item.created_at,
        })),
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      });
    }
  );

  /* Get a client's public profile */
  fastify.get(
    '/client/:id',
    {
      preHandler: [validationMiddleware({ params: ProfileIdSchema })],
    },
    async (request, reply) => {
      const { id } = request.params as z.infer<typeof ProfileIdSchema>;

      const profile = await prisma.clientProfile.findUnique({
        where: { id },
        include: { user: { select: { id: true, email: true, full_name: true } } },
      });

      if (!profile || !profile.is_public) {
        return reply.status(404).send({ error: 'not_found', message: 'Profile not found' });
      }

      return reply.status(200).send({
        id: profile.id,
        user: profile.user,
        organization: profile.organization,
        bio: profile.bio,
        location: profile.location,
        is_public: profile.is_public,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      });
    }
  );

  /* Update own profile */
  fastify.patch(
    '/me',
    {
      preHandler: [authenticate, validationMiddleware({ body: FreelancerProfileUpdateSchema })],
    },
    async (request, reply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user?.id;
      const body = request.body as z.infer<typeof FreelancerProfileUpdateSchema>;
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return reply.status(404).send({ error: 'not_found', message: 'User not found' });
      }

      if (user.role !== 'FREELANCER') {
        return reply
          .status(403)
          .send({ error: 'forbidden', message: 'Only freelancers can update freelancer profiles' });
      }

      let profile = await prisma.freelancerProfile.findUnique({
        where: { user_id: userId },
      });

      if (!profile) {
        profile = await prisma.freelancerProfile.create({
          data: { user_id: userId },
        });
      }

      const updateData: Record<string, unknown> = {};
      if (body.headline !== null && body.headline !== undefined)
        updateData.headline = body.headline;
      if (body.bio !== null && body.bio !== undefined) updateData.bio = body.bio;
      if (body.location !== null && body.location !== undefined)
        updateData.location = body.location;
      if (body.hourly_rate !== null && body.hourly_rate !== undefined)
        updateData.hourly_rate_cents = Math.round(body.hourly_rate * 100);
      if (body.currency !== undefined) updateData.currency = body.currency;
      if (body.availability !== undefined) updateData.availability = body.availability;
      if (body.is_public !== undefined) updateData.is_public = body.is_public;

      const updated = await prisma.freelancerProfile.update({
        where: { id: profile.id },
        data: updateData,
      });

      // Handle skills separately (replace all)
      if (body.skills !== undefined) {
        await prisma.profileSkill.deleteMany({ where: { profile_id: profile.id } });
        for (const skillName of body.skills) {
          let skill = await prisma.skill.findUnique({ where: { name: skillName } });
          if (!skill) {
            skill = await prisma.skill.create({
              data: {
                name: skillName,
                slug: skillName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
              },
            });
          }
          await prisma.profileSkill.create({
            data: { profile_id: profile.id, skill_id: skill.id },
          });
        }
      }

      return reply.status(200).send({
        id: updated.id,
        headline: updated.headline,
        bio: updated.bio,
        location: updated.location,
        hourly_rate: updated.hourly_rate_cents ? updated.hourly_rate_cents / 100 : null,
        currency: updated.currency,
        availability: updated.availability,
        is_public: updated.is_public,
        updated_at: updated.updated_at,
      });
    }
  );
}
