// Craftlane — Test render utility
// Wraps React Testing Library's render with a router and providers so
// components that use useNavigate/useParams/useAuth work in tests.
import type { RenderOptions } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import type { ReactElement } from 'react';

import { render as rtlRender, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '@/features/auth/auth-context';

const customRender = (
  ui: ReactElement,
  options?: RenderOptions,
) => {
  return rtlRender(
    ui,
    {
      wrapper: (Component) => (
        <MemoryRouter>
          <AuthProvider>
            <Component />
          </AuthProvider>
        </MemoryRouter>
      ),
      ...options,
    },
  );
}

export { customRender as render, screen, fireEvent, waitFor };
