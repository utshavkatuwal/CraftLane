import type { FastifyInstance } from 'fastify'
import { prisma } from '@/lib/prisma'

/* Craftlane — Health route
 *
 * GET /health — Basic process health
 * GET /health/db — Database connectivity check
 */

export default async function healthRoutes(fastify: FastifyInstance) {
  fastify.get('/health', async (_, reply) => {
    return reply.status(200).send({ status: 'ok', service: 'craftlane-backend' })
  })

  fastify.get('/health/db', async (_, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`
      return reply.status(200).send({ status: 'ok', database: 'connected' })
    } catch (_err) {
      return reply.status(503).send({ status: 'error', database: 'disconnected' })
    }
  })
}
