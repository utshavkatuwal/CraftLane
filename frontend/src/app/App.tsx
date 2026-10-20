/* Craftlane — Root application component
 * Wraps the router with Suspense (for lazy route loading) and the Providers
 * shell. Renders RouterProvider so route changes are handled by React Router.
 */

import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import Providers from './providers';
import { Loader } from '@/components/ui/Loader';

export function App() {
  return (
    <Providers>
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </Providers>
  );
}

export default App;
