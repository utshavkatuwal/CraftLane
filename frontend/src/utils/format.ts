/* Craftlane — Formatting utilities
 * Pure, dependency-free formatting for currency, dates, and text.
 * No fake data is produced here; these only format values supplied by the
 * backend (or left unset when unknown).
 */

import type { Project } from '@/types';

/* Format a number as currency using an explicit ISO 4217 currency code.
 * Craftlane never guesses a currency; the code must be supplied. */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string | null | undefined = 'USD'
): string {
  if (amount === null || amount === undefined) {
    return '—';
  }
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency as string,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // Fall back to a plain numeric render if the currency code is invalid.
    return `${amount.toFixed(2)} ${currency}`;
  }
}

/* Format an ISO-8601 timestamp into a concise local date string. */
export function formatDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleDateString('en-US', options);
  } catch {
    return '—';
  }
}

/* Format a relative date (e.g. "2 days ago") where helpful. */
export function formatRelativeDate(value: string | null | undefined): string {
  if (!value) return '—';
  try {
    const d = new Date(value);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 1) return 'today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    return formatDate(value);
  } catch {
    return '—';
  }
}

/* Capitalize the first letter of a string. */
export function capitalize(value: string): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/* Turn a project type value into a human-readable label. */
export function projectTypeLabel(type: Project['project_type']): string {
  switch (type) {
    case 'fixed_price':
      return 'Fixed price';
    case 'hourly':
      return 'Hourly';
    default:
      return capitalize(String(type));
  }
}

/* Truncate text to a maximum length with an ellipsis. */
export function truncate(value: string, max: number): string {
  if (!value || value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}
