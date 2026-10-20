import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { PrismaClient } from '@prisma/client'
import {
  signup,
  SignupSchema,
  SigninSchema,
} from '@/services/auth.service'

/* Craftlane — Auth service tests
 *
 * These tests verify the auth service logic. They require a database
 * connection via TEST_DATABASE_URL. If no database is available, they
 * are skipped.
 */

const mockPrisma = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  authToken: {
    create: vi.fn(),
    findFirst: vi.fn(),
    update: vi.fn(),
  },
  session: {
    create: vi.fn(),
    delete: vi.fn(),
  },
  $transaction: vi.fn((callbacks) => Promise.all(callbacks.map((cb) => cb(mockPrisma)))),
} as unknown as PrismaClient

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}))

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('SignupSchema validation', () => {
  it('accepts valid signup data', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'password123',
      terms: true,
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'different',
      terms: true,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('password_confirm'))).toBe(true)
    }
  })

  it('rejects short passwords', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'short',
      password_confirm: 'short',
      terms: true,
    })
    expect(result.success).toBe(false)
  })

  it('rejects unchecked terms', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'password123',
      terms: false,
    })
    expect(result.success).toBe(false)
  })
})

describe('SigninSchema validation', () => {
  it('accepts valid signin data', () => {
    const result = SigninSchema.safeParse({
      email: 'alex@example.com',
      password: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects missing password', () => {
    const result = SigninSchema.safeParse({
      email: 'alex@example.com',
    })
    expect(result.success).toBe(false)
  })
})

describe('signup service', () => {
  it('rejects duplicate email', async () => {
    mockPrisma.user.findUnique.mockResolvedValue({
      id: 'u1',
      email: 'alex@example.com',
    })

    await expect(
      signup({
        full_name: 'Alex Rivera',
        email: 'alex@example.com',
        password: 'password123',
        password_confirm: 'password123',
        terms: true,
      }),
    ).rejects.toThrow(/email already registered/i)
  })
})
