/* Craftlane — Page
 * Standard page wrapper: a content region with consistent max-width and
 * padding. Individual pages may opt out and manage their own layout.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Page.module.css';

interface PageProps extends HTMLAttributes<HTMLDivElement> {
  narrow?: boolean;
}

export function Page({ className, narrow = false, children, ...props }: PageProps) {
  return (
    <div className={cn(styles.page, narrow && styles.narrow, className)} {...props}>
      {children}
    </div>
  );
}

Page.displayName = 'Page';
