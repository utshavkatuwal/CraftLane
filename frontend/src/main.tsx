/* Craftlane — Application entry point
 * Bootstraps React 19 with React Router and renders the root App component.
 * Uncaught errors are logged to the console and displayed by the ErrorBoundary
 * in App.tsx instead of a blank white screen.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

// Import global styles so Vite bundles and injects them into the page.
import './styles/tokens.css';
import './styles/global.css';
import './styles/utilities.css';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Craftlane: #root element not found in index.html');
}

// Surface uncaught JavaScript errors so they are visible instead of a
// silent white screen. In development this helps diagnose runtime issues.
window.onerror = (message, source, lineno, colno, error) => {
  console.error('[Craftlane] Uncaught error:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('[Craftlane] Unhandled promise rejection:', event.reason);
};

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
