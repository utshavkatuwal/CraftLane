/* Craftlane — className utility
 * Simple conditional class composition built on clsx. Kept intentionally
 * minimal; no design-system token merging is needed for this phase.
 */
import { clsx } from 'clsx';

export function cn(...inputs: unknown[]): string {
  return clsx(inputs);
}
