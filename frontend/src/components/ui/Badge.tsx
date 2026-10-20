/* Craftlane — Badge
 * Small status/label indicator. Use for skills, project status, and tags —
 * never as a decorative counter or fake metric.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'brand' | 'success' | 'danger' | 'warning' | 'muted';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)} {...props} />;
}

Badge.displayName = 'Badge';
