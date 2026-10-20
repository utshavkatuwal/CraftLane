/* Craftlane — FormField
 * A labeled input with associated error/helper text and proper ARIA wiring
 * so screen readers announce validation errors. The child element receives
 * an id and aria-describedby automatically when not already set.
 */

import { cloneElement, isValidElement, type ReactElement, type ReactNode } from 'react';
import { Label } from './Label';
import styles from './FormField.module.css';

interface FormFieldProps {
  id: string;
  label: ReactNode;
  children: ReactNode;
  error?: string;
  helper?: ReactNode;
  required?: boolean;
}

export function FormField({
  id,
  label,
  children,
  error,
  helper,
  required: _required,
}: FormFieldProps) {
  const errorId = `${id}-error`;
  const helperId = `${id}-helper`;
  const describedBy = error ? errorId : helper ? helperId : undefined;

  const fieldChild = isValidElement(children)
    ? cloneElement(
        children as ReactElement,
        {
          id: ((children as ReactElement).props as Record<string, unknown>).id ?? id,
          ...(describedBy ? { 'aria-describedby': describedBy } : {}),
          ...(error ? { 'aria-invalid': true } : {}),
          ...(_required ? { required: true } : {}),
        } as Parameters<typeof cloneElement>[1]
      )
    : children;

  return (
    <div className={styles.field}>
      <Label htmlFor={id}>{label}</Label>
      <div className={styles.inputWrapper}>{fieldChild}</div>
      {error && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
      {helper && !error && (
        <p id={helperId} className={styles.helperText}>
          {helper}
        </p>
      )}
    </div>
  );
}

FormField.displayName = 'FormField';
