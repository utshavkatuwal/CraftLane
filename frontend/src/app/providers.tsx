/* Craftlane — Application providers
 *
 * A single place to register React context providers (auth, theme, analytics,
 * etc.) as the backend is integrated. For Phase 1 there is no real
 * authentication backend, so no auth state is fabricated here. Providers are
 * added here as they become justified by a real integration.
 */

import type { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

/* Phase 1: no backend-auth integration exists, so this provider intentionally
 * does not manage tokens, sessions, or a signed-in state. Any component that
 * needs authentication status must treat it as unavailable until a backend
 * contract is agreed upon. */
export function Providers({ children }: ProvidersProps): ReactNode {
  return <>{children}</>;
}

export default Providers;
