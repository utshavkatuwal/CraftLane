import { prisma } from '@/lib/prisma';
import { hashPassword, findUserByEmail, findUserById, hashToken } from '@/lib/auth';
import { z } from 'zod';

/* Craftlane — Auth service
 * Business logic for authentication: signup, signin, signout, me,
 * password reset, email verification.
 *
 * Passwords are hashed with Argon2id and never stored in plaintext.
 * Session tokens are stored as hashes; only a prefix is kept for lookup.
 * Email verification and password-reset tokens are single-use and time-limited.
 */

/* ------------------------------------------------------------------ */
/* Validation schemas                                                 */
/* ------------------------------------------------------------------ */
export const SignupSchema = z
  .object({
    full_name: z.string().min(2).max(255),
    email: z.string().email().max(255),
    password: z.string().min(8).max(128),
    password_confirm: z.string(),
    terms: z.literal(true),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ['password_confirm'],
    message: 'Passwords do not match',
  });

export const SigninSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8).max(128),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1),
});

/* ------------------------------------------------------------------ */
/* Service functions                                                  */
/* ------------------------------------------------------------------ */

/* Register a new account. Returns the created user (without password hash). */
export async function signup(data: z.infer<typeof SignupSchema>) {
  const existing = await findUserByEmail(data.email);
  if (existing) {
    const err = new Error('Email already registered');
    err.statusCode = 409;
    throw err;
  }

  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      password_hash: passwordHash,
      full_name: data.full_name.trim(),
      role: 'CLIENT',
      status: 'PENDING',
    },
    select: {
      id: true,
      email: true,
      full_name: true,
      role: true,
      status: true,
      email_verified: true,
      created_at: true,
    },
  });

  // Create email verification token
  const rawToken = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.authToken.create({
    data: {
      user_id: user.id,
      token_hash: tokenHash,
      type: 'EMAIL_VERIFICATION',
      expires_at: expiresAt,
    },
  });

  // In production, send the rawToken via email. Here we return it
  // only in development for testing purposes.
  const verificationToken = process.env.NODE_ENV === 'development' ? rawToken : undefined;

  return { user, verification_token: verificationToken };
}

/* Sign in an existing account. Returns a session token and user. */
export async function signin(data: z.infer<typeof SigninSchema>) {
  const user = await findUserByEmail(data.email);
  if (!user) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  const { verify } = await import('argon2');
  const valid = await verify(user.password_hash, data.password);
  if (!valid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    throw err;
  }

  if (user.status === 'SUSPENDED' || user.status === 'DEACTIVATED') {
    const err = new Error('Account is not active');
    err.statusCode = 403;
    throw err;
  }

  // Create a session
  const rawToken = crypto.randomUUID() + crypto.randomUUID();
  const { hash } = await import('argon2');
  const tokenHash = await hash(rawToken);
  const prefix = rawToken.slice(0, 12);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      user_id: user.id,
      token_prefix: prefix,
      token_hash: tokenHash,
      expires_at: expiresAt,
    },
  });

  return {
    session_token: rawToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
      email_verified: user.email_verified,
    },
  };
}

/* Sign out — delete the session. */
export async function signout(sessionId: string) {
  await prisma.session.delete({
    where: { id: sessionId },
  });
  return { success: true };
}

/* Get the current user. */
export async function getMe(userId: string) {
  const user = await findUserById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }
  return {
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    status: user.status,
    email_verified: user.email_verified,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };
}

/* Request a password reset. Creates a single-use, time-limited token. */
export async function forgotPassword(data: z.infer<typeof ForgotPasswordSchema>) {
  const user = await findUserByEmail(data.email);
  if (!user) {
    // Don't reveal whether the email exists
    return { message: 'If an account exists, a reset link has been sent' };
  }

  const rawToken = crypto.randomUUID() + crypto.randomUUID();
  const tokenHash = await hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.authToken.create({
    data: {
      user_id: user.id,
      token_hash: tokenHash,
      type: 'PASSWORD_RESET',
      expires_at: expiresAt,
    },
  });

  // In production, send the rawToken via email.
  const resetToken = process.env.NODE_ENV === 'development' ? rawToken : undefined;

  return {
    message: 'If an account exists, a reset link has been sent',
    reset_token: resetToken,
  };
}

/* Reset password using a reset token. */
export async function resetPassword(data: z.infer<typeof ResetPasswordSchema>) {
  const { verify } = await import('argon2');
  const { hash } = await import('argon2');

  const tokenRecord = await prisma.authToken.findFirst({
    where: {
      type: 'PASSWORD_RESET',
      expires_at: { gt: new Date() },
      used_at: null,
    },
  });

  if (!tokenRecord || !(await verify(tokenRecord.token_hash, data.token))) {
    const err = new Error('Invalid or expired reset token');
    err.statusCode = 400;
    throw err;
  }

  const user = await findUserById(tokenRecord.user_id);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  const passwordHash = await hash(data.password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password_hash: passwordHash },
    }),
    prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { used_at: new Date() },
    }),
  ]);

  return { message: 'Password reset successfully' };
}

/* Verify email using a verification token. */
export async function verifyEmail(data: z.infer<typeof VerifyEmailSchema>) {
  const { verify } = await import('argon2');

  const tokenRecord = await prisma.authToken.findFirst({
    where: {
      type: 'EMAIL_VERIFICATION',
      expires_at: { gt: new Date() },
      used_at: null,
    },
  });

  if (!tokenRecord || !(await verify(tokenRecord.token_hash, data.token))) {
    const err = new Error('Invalid or expired verification token');
    err.statusCode = 400;
    throw err;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: tokenRecord.user_id },
      data: { email_verified: true },
    }),
    prisma.authToken.update({
      where: { id: tokenRecord.id },
      data: { used_at: new Date() },
    }),
  ]);

  return { message: 'Email verified successfully' };
}
