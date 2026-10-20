import { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

/* Craftlane — Skills route
 *
 * GET /skills — List all available skills
 */

export default async function skillRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (_, reply) => {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    })
    return reply.status(200).send(skills)
  })
}
