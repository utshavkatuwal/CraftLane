/* Craftlane — Application providers
 * Registers React context providers (auth, theme, analytics, etc.).
 * The AuthProvider manages session state across the application.
 */

import type { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/auth-context';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps): ReactNode {
  return <AuthProvider>{children}</AuthProvider>;
}

export default Providers;
