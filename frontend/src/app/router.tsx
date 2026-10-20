/* Craftlane — Router configuration
 * Explicit, readable routes using React Router. Each route maps to a page
 * component; lazy loading keeps the initial bundle small. A not-found route
 * catches any undefined path.
 *
 * Routes use React.lazy() with Suspense (provided in App.tsx) for code
 * splitting. Page modules use named exports, so each lazy import adapts the
 * named export to the default-export shape that React.lazy expects.
 */

import { lazy } from 'react';
import { createBrowserRouter, type RouteObject } from 'react-router-dom';

const LandingPage = lazy(() =>
  import('@/pages/LandingPage').then((m) => ({ default: m.LandingPage }))
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage }))
);
const SignUpPage = lazy(() =>
  import('@/features/auth/SignUpPage').then((m) => ({ default: m.SignUpPage }))
);
const SignInPage = lazy(() =>
  import('@/features/auth/SignInPage').then((m) => ({ default: m.SignInPage }))
);
const BrowsePage = lazy(() =>
  import('@/features/marketplace/BrowsePage').then((m) => ({ default: m.BrowsePage }))
);
const ProjectDetailPage = lazy(() =>
  import('@/features/projects/ProjectDetailPage').then((m) => ({ default: m.ProjectDetailPage }))
);
const ProjectCreatePage = lazy(() =>
  import('@/features/projects/ProjectCreatePage').then((m) => ({ default: m.ProjectCreatePage }))
);
const FreelancerProfilePage = lazy(() =>
  import('@/features/profiles/FreelancerProfilePage').then((m) => ({
    default: m.FreelancerProfilePage,
  }))
);
const ClientDashboardPage = lazy(() =>
  import('@/features/dashboard/ClientDashboardPage').then((m) => ({
    default: m.ClientDashboardPage,
  }))
);
const FreelancerDashboardPage = lazy(() =>
  import('@/features/dashboard/FreelancerDashboardPage').then((m) => ({
    default: m.FreelancerDashboardPage,
  }))
);

/* Craftlane's public route table. Routes are ordered from most specific to
 * least specific; the path "*" not-found route must remain last. */
export const routes: RouteObject[] = [
  { path: '/', element: <LandingPage /> },
  { path: '/sign-up', element: <SignUpPage /> },
  { path: '/sign-in', element: <SignInPage /> },
  { path: '/work', element: <BrowsePage /> },
  { path: '/work/:projectId', element: <ProjectDetailPage /> },
  { path: '/work/post', element: <ProjectCreatePage /> },
  { path: '/freelancers/:id', element: <FreelancerProfilePage /> },
  { path: '/dashboard/client', element: <ClientDashboardPage /> },
  { path: '/dashboard/freelancer', element: <FreelancerDashboardPage /> },
  { path: '*', element: <NotFoundPage /> },
];

export const router = createBrowserRouter(routes);
