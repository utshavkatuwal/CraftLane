import { describe, it, expect } from 'vitest';
import { SignupSchema, SigninSchema } from '@/services/auth.service';

/* Craftlane — Auth validation tests
 *
 * These tests verify Zod validation schemas for auth forms.
 * They do not require a database connection.
 */

describe('SignupSchema validation', () => {
  it('accepts valid signup data', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'password123',
      terms: true,
    });
    expect(result.success).toBe(true);
  });

  it('rejects mismatched passwords', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'different',
      terms: true,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.some((e) => e.path.includes('password_confirm'))).toBe(true);
    }
  });

  it('rejects short passwords', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'short',
      password_confirm: 'short',
      terms: true,
    });
    expect(result.success).toBe(false);
  });

  it('rejects unchecked terms', () => {
    const result = SignupSchema.safeParse({
      full_name: 'Alex Rivera',
      email: 'alex@example.com',
      password: 'password123',
      password_confirm: 'password123',
      terms: false,
    });
    expect(result.success).toBe(false);
  });
});

describe('SigninSchema validation', () => {
  it('accepts valid signin data', () => {
    const result = SigninSchema.safeParse({
      email: 'alex@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects missing password', () => {
    const result = SigninSchema.safeParse({
      email: 'alex@example.com',
    });
    expect(result.success).toBe(false);
  });
});
