import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from 'fastify';
import type { ZodSchema } from 'zod';
import { ZodError } from 'zod';

/* Craftlane — Zod validation middleware
 *
 * Validates request body, query, and params against Zod schemas.
 * Returns structured 400 errors with field-level details.
 * Intended for use as a Fastify preHandler hook.
 */

export interface ValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export function validationMiddleware(schemas: ValidationSchemas) {
  return async (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
    const errors: Record<string, string[]> = {};

    if (schemas.body) {
      try {
        request.body = schemas.body.parse(request.body);
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'body';
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        }
      }
    }

    if (schemas.query) {
      try {
        request.query = schemas.query.parse(request.query);
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'query';
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        }
      }
    }

    if (schemas.params) {
      try {
        request.params = schemas.params.parse(request.params);
      } catch (err) {
        if (err instanceof ZodError) {
          for (const issue of err.issues) {
            const path = issue.path.join('.') || 'params';
            if (!errors[path]) errors[path] = [];
            errors[path].push(issue.message);
          }
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      reply.status(400).send({
        error: 'validation_error',
        message: 'Request validation failed',
        details: errors,
      });
      done(new Error('validation failed'));
      return;
    }
    done();
  };
}
