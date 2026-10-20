/* Craftlane — Input
 * Text input with consistent sizing, focus ring, and error state.
 */

import type { InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ className, error = false, ...props }: InputProps) {
  return <input className={cn(styles.input, error && styles.error, className)} {...props} />;
}

Input.displayName = 'Input';
