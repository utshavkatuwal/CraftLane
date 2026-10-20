/* Craftlane — Card
 * A bordered, elevated surface container. Used sparingly to group related
 * content; never overused as decoration.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Card.module.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ className, padding = 'md', children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        styles[`pad${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.displayName = 'Card';
