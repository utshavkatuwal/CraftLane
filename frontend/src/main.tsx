/* Craftlane — Application entry point
 * Bootstraps React 19 with React Router and renders the root App component.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './app/App';

const container = document.getElementById('root');
if (!container) {
  throw new Error('Craftlane: #root element not found in index.html');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>
);
