/* Craftlane — Button
 * Accessible button primitive with clear variant, size, and state styling.
 * No fake functionality: onClick is the only behavior; callers own the logic.
 */

import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  leadingIcon,
  trailingIcon,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      className={cn(styles.button, styles[variant], styles[size], className)}
      {...props}
    >
      {isLoading ? (
        <span className={styles.spinner} aria-hidden="true" />
      ) : leadingIcon ? (
        <span className={styles.icon}>{leadingIcon}</span>
      ) : null}
      <span className={styles.label}>{children}</span>
      {trailingIcon && !isLoading ? <span className={styles.icon}>{trailingIcon}</span> : null}
    </button>
  );
}

Button.displayName = 'Button';
