import type { FastifyRequest, FastifyReply } from 'fastify'
import { prisma } from '@/lib/prisma'

/* Craftlane — Authentication middleware
 *
 * Extracts a session token from the Authorization header (Bearer scheme).
 * Sessions are stored with a token_prefix (first 12 chars) for lookup and
 * an Argon2id hash (token_hash) for verification. The incoming token is
 * hashed and compared against the stored hash after a prefix-based lookup.
 *
 * Raw tokens are never emitted to clients or stored in plaintext.
 */

interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string
    email: string
    role: string
  }
  session?: {
    id: string
    user_id: string
    token_hash: string
    expires_at: Date
  }
}

/* Generate a token prefix (first 12 chars) for database lookup. */
function tokenPrefix(token: string): string {
  return token.slice(0, 12)
}

export const authenticate: (
  request: AuthenticatedRequest,
  reply: FastifyReply,
) => Promise<void | undefined> = async (request, reply) => {
  const authHeader = request.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    await reply.status(401).send({
      error: 'unauthenticated',
      message: 'Authentication required',
    })
    return
  }

  const token = authHeader.slice('Bearer '.length)
  const prefix = tokenPrefix(token)

  try {
    const session = await prisma.session.findFirst({
      where: { token_prefix: prefix },
      include: { user: true },
    })

    if (!session) {
      await reply.status(401).send({
        error: 'unauthenticated',
        message: 'Session not found',
      })
      return
    }

    if (new Date(session.expires_at) < new Date()) {
      await reply.status(401).send({
        error: 'unauthenticated',
        message: 'Session expired',
      })
      return
    }

    const valid = await verifyTokenHash(token, session.token_hash)
    if (!valid) {
      await reply.status(401).send({
        error: 'unauthenticated',
        message: 'Invalid session token',
      })
      return
    }

    // Refresh last_used_at
    await prisma.session.update({
      where: { id: session.id },
      data: { last_used_at: new Date() },
    })

    request.user = {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role,
    }
    request.session = {
      id: session.id,
      user_id: session.user_id,
      token_hash: session.token_hash,
      expires_at: session.expires_at,
    }
  } catch {
    await reply.status(401).send({
      error: 'unauthenticated',
      message: 'Authentication failed',
    })
  }
}

/* Role-based authorization middleware factory.
 * Only allows requests from users with the specified roles. */
export function authorize(allowedRoles: string[]) {
  return (request: AuthenticatedRequest, reply: FastifyReply) => {
    if (!request.user) {
      reply.status(401).send({
        error: 'unauthenticated',
        message: 'Authentication required',
      })
      return
    }
    if (!allowedRoles.includes(request.user.role)) {
      reply.status(403).send({
        error: 'forbidden',
        message: 'Insufficient permissions',
      })
      return
    }
  }
}

/* Verify a plaintext token against a stored Argon2id hash. */
async function verifyTokenHash(
  token: string,
  hashValue: string,
): Promise<boolean> {
  const { verify } = await import('argon2')
  return verify(hashValue, token)
}
