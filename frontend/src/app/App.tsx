/* Craftlane — Root application component
 * Wraps the router with Suspense (for lazy route loading) and the Providers
 * shell. Renders RouterProvider so route changes are handled by React Router.
 */

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Providers from './providers';
import { Loader } from '@/components/ui/Loader';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

export function App() {
  return (
    <Providers>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <RouterProvider router={router} />
        </Suspense>
      </ErrorBoundary>
    </Providers>
  );
}

export default App;
