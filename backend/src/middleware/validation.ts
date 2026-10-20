import type { FastifyPluginAsync, FastifyRequest } from 'fastify'
import { ZodSchema, ZodError } from 'zod'

/* Craftlane — Zod validation middleware
 *
 * Validates request body, query, and params against Zod schemas.
 * Returns structured 400 errors with field-level details.
 */

export interface ValidationSchemas {
  body?: ZodSchema
  query?: ZodSchema
  params?: ZodSchema
}

const validationMiddleware: FastifyPluginAsync<ValidationSchemas> = async (
  fastify,
  opts,
) => {
  fastify.addHook('preHandler', async (request: FastifyRequest, reply) => {
    const errors: Record<string, string[]> = {}

    if (opts.body) {
      try {
        request.body = opts.body.parse(request.body)
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'body'
            if (!errors[path]) errors[path] = []
            errors[path].push(issue.message)
          }
        }
      }
    }

    if (opts.query) {
      try {
        request.query = opts.query.parse(request.query)
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'query'
            if (!errors[path]) errors[path] = []
            errors[path].push(issue.message)
          }
        }
      }
    }

    if (opts.params) {
      try {
        request.params = opts.params.parse(request.params)
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'params'
            if (!errors[path]) errors[path] = []
            errors[path].push(issue.message)
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      return reply.status(400).send({
        error: 'validation_error',
        message: 'Request validation failed',
        details: errors,
      })
    }
  })
}

export default validationMiddleware
export { validationMiddleware }
