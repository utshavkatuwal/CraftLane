/* Craftlane — Auth service
 * Authentication API boundary. These functions call the (future) FastAPI
 * backend through the shared API client. They do NOT fabricate accounts,
 * sessions, or tokens. Until a backend is implemented, calls will fail with
 * an honest network/API error that the UI surfaces.
 */

import { api } from '@/services/api-client';
import { API } from '@/services/endpoints';
import type { SignUpForm, SignInForm, User, ApiError } from '@/types';

export interface AuthResult {
  user: User;
}

/* Register a new account. Returns the created user on success.
 * Throws ApiErrorResponse on validation or network failure. */
export async function signup(form: SignUpForm): Promise<User> {
  const { user } = await api.post<{ user: User }>(API.auth.signup, {
    full_name: form.full_name,
    email: form.email,
    password: form.password,
    password_confirm: form.password_confirm,
  });
  return user;
}

/* Sign in an existing account. Returns the authenticated user on success.
 * Throws ApiErrorResponse on invalid credentials or network failure. */
export async function signin(form: SignInForm): Promise<User> {
  const { user } = await api.post<{ user: User }>(API.auth.signin, {
    email: form.email,
    password: form.password,
  });
  return user;
}

/* Fetch the currently authenticated user. */
export async function getMe(): Promise<User> {
  return api.get<User>(API.auth.me);
}

/* Normalize an error thrown by the API client or a network failure into a
 * user-facing message. Network failures (backend unreachable) are reported
 * honestly rather than converted into a fake success. */
export function toAuthError(error: unknown): ApiError {
  if (error instanceof Error) {
    // Network failure (e.g. backend not running).
    if (!('status' in error)) {
      return {
        message:
          'Unable to reach the Craftlane backend. Account actions are not available until the API is implemented.',
        code: 'network_error',
      };
    }
    return {
      message: error.message,
      status: (error as { status?: number }).status,
      code: (error as { code?: string }).code,
      details: (error as { details?: Record<string, string[]> }).details,
    };
  }
  return {
    message: 'An unexpected error occurred.',
    code: 'unknown_error',
  };
}
