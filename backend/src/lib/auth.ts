import { verify, hash } from 'argon2'
import { sign, verify as jwtVerify, type SignOptions, type VerifyOptions } from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

/* Craftlane — Authentication utilities
 *
 * Passwords are hashed with Argon2id (via the argon2 package).
 * Sessions are represented by opaque token hashes stored in the database;
 * no raw secrets are ever emitted to the client.
 */

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required')
}

/* Hash a plaintext password using Argon2id. */
export async function hashPassword(password: string): Promise<string> {
  return hash(password)
}

/* Verify a plaintext password against a stored Argon2id hash. */
export async function verifyPassword(
  password: string,
  hashValue: string,
): Promise<boolean> {
  return verify(hashValue, password)
}

/* Sign a JWT with the configured secret. */
export function signToken(
  payload: Record<string, unknown>,
  options: SignOptions = {},
): string {
  return sign(payload, JWT_SECRET, {
    algorithm: 'HS256',
    ...options,
  })
}

/* Verify a JWT and return its payload. */
export function verifyToken<T = Record<string, unknown>>(
  token: string,
  options: VerifyOptions = {},
): T {
  return jwtVerify(token, JWT_SECRET, {
    algorithms: ['HS256'],
    ...options,
  }) as T
}

/* Hash an arbitrary token (e.g. password reset token) for storage. */
export async function hashToken(token: string): Promise<string> {
  return hash(token)
}

/* Verify a plaintext token against a stored hash. */
export async function verifyTokenHash(
  token: string,
  hashValue: string,
): Promise<boolean> {
  return verify(hashValue, token)
}

/* Look up a user by email. Returns null if not found. */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
  })
}

/* Look up a user by ID. Returns null if not found. */
export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
  })
}
