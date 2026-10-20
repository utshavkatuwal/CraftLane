/* Craftlane — Label
 * Accessible form label. Always pairs with an input via htmlFor / id.
 */

import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Label.module.css';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, htmlFor, ...props }: LabelProps) {
  return <label htmlFor={htmlFor} className={cn(styles.label, className)} {...props} />;
}

Label.displayName = 'Label';
