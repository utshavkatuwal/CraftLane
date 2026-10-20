/* Craftlane — ErrorMessage
 * Surfaces network or validation errors honestly, with an optional retry
 * action. Never hides a failure behind a fake success.
 */

import type { ReactNode } from 'react';
import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  title?: string;
  message: ReactNode;
  retry?: ReactNode;
}

export function ErrorMessage({ title, message, retry }: ErrorMessageProps) {
  return (
    <div className={styles.errorMessage} role="alert" aria-live="polite">
      {title && <h3 className={styles.title}>{title}</h3>}
      <p className={styles.message}>{message}</p>
      {retry && <div className={styles.retry}>{retry}</div>}
    </div>
  );
}

ErrorMessage.displayName = 'ErrorMessage';
