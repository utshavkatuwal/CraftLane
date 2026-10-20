/* Craftlane — API client
 * A small, typed fetch wrapper that centralizes the backend base URL and
 * error handling. All API calls go through this client so network failures
 * are surfaced consistently and never silently replaced with fabricated
 * success responses.
 *
 * The base URL comes from Vite environment (VITE_API_BASE_URL). Vite embeds
 * VITE_* variables at build time, so no secrets belong here.
 *
 * Session tokens are set via setAuthToken() and are sent as an
 * Authorization: Bearer header on every request. Tokens are held in memory
 * only — never in localStorage or sessionStorage — so a page refresh clears
 * the session and the user must sign in again.
 */

import type { ApiError } from '@/types';

const getBaseUrl = (): string => {
  const configured = import.meta.env.VITE_API_BASE_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }
  // Sensible local-development default (frontend and backend on same origin).
  return '/api';
};

/* Session token held in memory only. */
let authToken: string | null = null;

/* Set the session token used for Authorization headers. Call this after a
 * successful sign in, and null it out on sign out. */
export function setAuthToken(token: string | null): void {
  authToken = token;
}

/* Get the current session token (if any). */
export function getAuthToken(): string | null {
  return authToken;
}

export class ApiErrorResponse extends Error {
  public readonly status: number;
  public readonly code: string | undefined;
  public readonly details: Record<string, string[]> | undefined;

  constructor(
    message: string,
    status: number,
    code?: string,
    details?: Record<string, string[]>,
  ) {
    super(message);
    this.name = 'ApiErrorResponse';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type RequestInitExtend = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

/* Parse a JSON error response body into an ApiError, falling back to the
 * response status text when the body is not usable JSON. */
async function parseErrorResponse(response: Response): Promise<ApiError> {
  let message = response.statusText || 'Request failed';
  let code: string | undefined;
  let details: Record<string, string[]> | undefined;

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      const body = (await response.json()) as {
        message?: string;
        code?: string;
        detail?: unknown;
        errors?: Record<string, string[]>;
      };
      message = body.message || message;
      code = body.code;
      if (body.errors) {
        details = body.errors;
      } else if (body.detail !== undefined) {
        details = { _server: [String(body.detail)] };
      }
    } catch {
      // Ignore parse errors and use status text.
    }
  }

  return { message, status: response.status, code, details };
}

/* Typed JSON request. Throws ApiErrorResponse on non-ok responses so
 * callers decide how to surface failures (error UI, empty state, etc.). */
export async function apiRequest<T>(
  path: string,
  init: RequestInitExtend = {},
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.body !== undefined && init.method !== 'GET'
      ? { 'Content-Type': 'application/json' }
      : {}),
    ...(init.headers as Record<string, string> | undefined),
  };

  // Attach the session token if one is set.
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const body = init.body !== undefined ? JSON.stringify(init.body) : undefined;

  const response = await fetch(url, {
    ...init,
    headers,
    body,
    // Never send credentials cross-origin unless the backend is on the same
    // origin. This avoids leaking tokens to third parties.
    credentials: 'same-origin',
  });

  if (!response.ok) {
    const apiError = await parseErrorResponse(response);
    throw new ApiErrorResponse(apiError.message, response.status, apiError.code, apiError.details);
  }

  // 204 No Content / empty responses.
  if (response.status === 204) {
    return null as unknown as T;
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    return text as unknown as T;
  }

  return (await response.json()) as T;
}

/* Convenience method wrappers. */
export const api = {
  get: <T>(path: string, init?: Omit<RequestInitExtend, 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'GET' }),
  post: <T>(path: string, body?: unknown, init?: Omit<RequestInitExtend, 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, init?: Omit<RequestInitExtend, 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, init?: Omit<RequestInitExtend, 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'PATCH', body }),
  delete: <T>(path: string, init?: Omit<RequestInitExtend, 'body'>) =>
    apiRequest<T>(path, { ...init, method: 'DELETE' }),
};

export { getBaseUrl };
export type { RequestInitExtend };
