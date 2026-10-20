import type { FastifyInstance } from 'fastify'
import { authenticate, type AuthenticatedRequest } from '@/middleware/auth'
import {
  signup as signupService,
  signin as signinService,
  signout as signoutService,
  getMe as getMeService,
  forgotPassword,
  resetPassword,
  verifyEmail,
  SignupSchema,
  SigninSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from '@/services/auth.service'
import { validationMiddleware } from '@/middleware/validation'
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { z } from 'zod'

/* Craftlane — Auth routes
 *
 * POST   /auth/signup       Register a new account
 * POST   /auth/signin       Sign in and create a session
 * POST   /auth/signout      Sign out (requires authentication)
 * GET    /auth/me           Get current user (requires authentication)
 * POST   /auth/forgot-password  Request a password reset
 * POST   /auth/reset-password   Reset password using a token
 * POST   /auth/verify-email Verify email using a token
 */

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    '/signup',
    {
      preHandler: [validationMiddleware({ body: SignupSchema })],
    },
    async (request, reply) => {
      try {
        const result = await signupService(request.body as z.infer<typeof SignupSchema>)
        return reply.status(201).send(result)
      } catch (err) {
        const e = err as Error & { statusCode?: number }
        if (e.statusCode === 409) {
          return reply.status(409).send({ error: 'conflict', message: e.message })
        }
        throw err
      }
    },
  )

  fastify.post(
    '/signin',
    {
      preHandler: [validationMiddleware({ body: SigninSchema })],
    },
    async (request, reply) => {
      try {
        const result = await signinService(request.body as z.infer<typeof SigninSchema>)
        return reply.status(200).send(result)
      } catch (err) {
        const e = err as Error & { statusCode?: number }
        if (e.statusCode === 401 || e.statusCode === 403) {
          return reply
            .status(e.statusCode)
            .send({ error: 'auth_failed', message: e.message })
        }
        throw err
      }
    },
  )

  fastify.post(
    '/signout',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const req = request as AuthenticatedRequest
      const session = req.session
      if (session) {
        await signoutService(session.id)
      }
      return reply.status(200).send({ success: true })
    },
  )

  fastify.get(
    '/me',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const req = request as AuthenticatedRequest
      const userId = req.user?.id
      const result = await getMeService(userId)
      return reply.status(200).send(result)
    },
  )

  fastify.post(
    '/forgot-password',
    {
      preHandler: [validationMiddleware({ body: ForgotPasswordSchema })],
    },
    async (request, reply) => {
      const result = await forgotPassword(
        request.body as z.infer<typeof ForgotPasswordSchema>,
      )
      return reply.status(200).send(result)
    },
  )

  fastify.post(
    '/reset-password',
    {
      preHandler: [validationMiddleware({ body: ResetPasswordSchema })],
    },
    async (request, reply) => {
      const result = await resetPassword(
        request.body as z.infer<typeof ResetPasswordSchema>,
      )
      return reply.status(200).send(result)
    },
  )

  fastify.post(
    '/verify-email',
    {
      preHandler: [validationMiddleware({ body: VerifyEmailSchema })],
    },
    async (request, reply) => {
      const result = await verifyEmail(
        request.body as z.infer<typeof VerifyEmailSchema>,
      )
      return reply.status(200).send(result)
    },
  )
}
