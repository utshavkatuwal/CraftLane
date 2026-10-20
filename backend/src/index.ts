import fastify from 'fastify'
import { prisma } from '@/lib/prisma'
import authRoutes from '@/routes/auth'
import projectRoutes from '@/routes/projects'
import proposalRoutes from '@/routes/proposals'
import profileRoutes from '@/routes/profiles'
import skillRoutes from '@/routes/skills'
import healthRoutes from '@/routes/health'

/* Craftlane — Backend entry point
 *
 * Creates and configures the Fastify application, registers all route
 * plugins, and starts the server.
 *
 * Environment variables:
 *   PORT              Server port (default: 8000)
 *   NODE_ENV          development | production | test
 *   JWT_SECRET        Secret for signing session-related tokens
 *   DATABASE_URL      PostgreSQL connection string
 */

export function buildApp() {
  const app = fastify({
    logger: process.env.NODE_ENV === 'development',
    requestTimeout: 30000,
    keepAliveTimeout: 5000,
  })

  // Health routes (no auth required)
  app.register(healthRoutes, { prefix: '/health' })

  // Auth routes
  app.register(authRoutes, { prefix: '/auth' })

  // Project routes
  app.register(projectRoutes, { prefix: '/projects' })

  // Proposal routes
  app.register(proposalRoutes, { prefix: '/proposals' })

  // Profile routes
  app.register(profileRoutes, { prefix: '/profiles' })

  // Skills routes
  app.register(skillRoutes, { prefix: '/skills' })

  // 404 handler
  app.setNotFoundHandler((_, reply) => {
    return reply.status(404).send({ error: 'not_found', message: 'Route not found' })
  })

  // Global error handler
  app.setErrorHandler((error, _, reply) => {
    app.log.error(error)

    if (error.statusCode) {
      return reply.status(error.statusCode).send({
        error: error.name,
        message: error.message,
      })
    }

    return reply.status(500).send({
      error: 'internal_server_error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'An unexpected error occurred',
    })
  })

  return app
}

const app = buildApp()

const PORT = parseInt(process.env.PORT || '8000', 10)
const HOST = process.env.HOST || '0.0.0.0'

async function start() {
  try {
    await app.listen({ port: PORT, host: HOST })
    app.log.info(`Craftlane backend listening on ${HOST}:${PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  app.log.info('SIGTERM received, shutting down')
  await app.close()
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGINT', async () => {
  app.log.info('SIGINT received, shutting down')
  await app.close()
  await prisma.$disconnect()
  process.exit(0)
})

// Only start if run directly (not imported in tests)
if (process.env.NODE_ENV !== 'test') {
  start()
}

export { app }
