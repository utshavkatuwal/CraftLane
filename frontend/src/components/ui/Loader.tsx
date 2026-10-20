/* Craftlane — Loader
 * A subtle loading indicator. Used for route transitions and async content
 * while real data is being fetched — never to simulate activity that does
 * not exist.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Loader.module.css';

interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export function Loader({ className, size = 'md', label, ...props }: LoaderProps) {
  return (
    <div
      className={cn(styles.loader, styles[size], className)}
      {...props}
      role="status"
      aria-label={label || 'Loading'}
    >
      <div className={styles.spinner} aria-hidden="true" />
      {label && <span className={styles.label}>{label}</span>}
    </div>
  );
}

Loader.displayName = 'Loader';
