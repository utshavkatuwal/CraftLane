/* eslint-disable @typescript-eslint/no-explicit-any */

/* Craftlane — Router configuration
 * Explicit, readable routes using React Router. Each route maps to a page
 * component; lazy loading keeps the initial bundle small. A not-found route
 * catches any undefined path.
 */

import type { ReactNode } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

const Lazy = {
  Landing: () => import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }) as any),
  NotFound: () => import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }) as any),
  SignUp: () =>
    import('@/features/auth/SignUpPage').then((m) => ({ default: m.SignUpPage }) as any),
  SignIn: () =>
    import('@/features/auth/SignInPage').then((m) => ({ default: m.SignInPage }) as any),
  Browse: () =>
    import('@/features/marketplace/BrowsePage').then((m) => ({ default: m.BrowsePage }) as any),
  ProjectDetail: () =>
    import('@/features/projects/ProjectDetailPage').then(
      (m) => ({ default: m.ProjectDetailPage }) as any
    ),
  FreelancerProfile: () =>
    import('@/features/profiles/FreelancerProfilePage').then(
      (m) => ({ default: m.FreelancerProfilePage }) as any
    ),
  ClientDashboard: () =>
    import('@/features/dashboard/ClientDashboardPage').then(
      (m) => ({ default: m.ClientDashboardPage }) as any
    ),
  FreelancerDashboard: () =>
    import('@/features/dashboard/FreelancerDashboardPage').then(
      (m) => ({ default: m.FreelancerDashboardPage }) as any
    ),
};

export interface RouteContext {
  /* Optional data loaders can attach contextual info here in later phases. */
  readonly title?: string;
}

export interface LazyRouteModule {
  default: (props: { routeContext?: RouteContext }) => ReactNode;
}

/* Craftlane's public route table. Routes are ordered from most specific to
 * least specific; the path "*" not-found route must remain last. */
export const routes: RouteObject[] = [
  {
    path: '/',
    lazy: Lazy.Landing,
  },
  {
    path: '/sign-up',
    lazy: Lazy.SignUp,
  },
  {
    path: '/sign-in',
    lazy: Lazy.SignIn,
  },
  {
    path: '/work',
    lazy: Lazy.Browse,
  },
  {
    path: '/work/:projectId',
    lazy: Lazy.ProjectDetail,
  },
  {
    path: '/freelancers/:id',
    lazy: Lazy.FreelancerProfile,
  },
  {
    path: '/dashboard/client',
    lazy: Lazy.ClientDashboard,
  },
  {
    path: '/dashboard/freelancer',
    lazy: Lazy.FreelancerDashboard,
  },
  {
    path: '*',
    lazy: Lazy.NotFound,
  },
];

export const router = createBrowserRouter(routes);
