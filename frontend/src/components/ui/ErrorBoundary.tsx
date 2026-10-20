/* Craftlane — ErrorBoundary
 * Catches JavaScript errors in the component tree and displays them honestly
 * instead of a blank white screen. Helps diagnose issues during development.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[Craftlane] ErrorBoundary caught an error:', error, errorInfo);
  }

  override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
            color: '#0f172a',
          }}
        >
          <h2 style={{ color: '#dc2626' }}>Craftlane encountered an error</h2>
          <p>{this.state.error?.message || 'An unknown error occurred.'}</p>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: null });
            }}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
