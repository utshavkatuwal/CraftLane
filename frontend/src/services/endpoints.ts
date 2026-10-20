/* Craftlane — API endpoint paths
 * Centralized backend route paths. Kept separate from the HTTP client so the
 * surface area for future backend integration is obvious and auditable.
 */

export const API = {
  auth: {
    signup: '/auth/signup',
    signin: '/auth/signin',
    signout: '/auth/signout',
    me: '/auth/me',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    me: '/users/me',
  },
  projects: {
    list: '/projects',
    detail: (id: string) => `/projects/${id}`,
    create: '/projects',
    update: (id: string) => `/projects/${id}`,
    close: (id: string) => `/projects/${id}/close`,
  },
  proposals: {
    list: (projectId: string) => `/projects/${projectId}/proposals`,
    create: (projectId: string) => `/projects/${projectId}/proposals`,
    detail: (id: string) => `/proposals/${id}`,
    decide: (id: string) => `/proposals/${id}/decide`,
  },
  profiles: {
    me: '/profiles/me',
    freelancer: (id: string) => `/profiles/freelancer/${id}`,
    client: (id: string) => `/profiles/client/${id}`,
  },
  skills: {
    list: '/skills',
  },
} as const;

export type EndpointPath = string;
