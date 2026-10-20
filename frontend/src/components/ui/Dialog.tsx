/* Craftlane — Dialog
 * Accessible modal dialog primitive with focus management, ESC-to-close, and
 * optional backdrop click-to-close. Returns focus to the triggering element
 * on close.
 */

import { useCallback, useEffect, useRef, type MouseEventHandler, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Dialog.module.css';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdropClick?: boolean;
}

const FOCUSABLE_SELECTORS = [
  'button:not(:disabled)',
  'a[href]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export function Dialog({
  open,
  onClose,
  title,
  children,
  closeOnBackdropClick = true,
}: DialogProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const previousActiveRef = useRef<Element | null>(null);

  // Ensure a portal container exists in the document.
  useEffect(() => {
    if (!containerRef.current) {
      containerRef.current = document.createElement('div');
      document.body.appendChild(containerRef.current);
    }
    return () => {
      if (containerRef.current && containerRef.current.parentNode) {
        containerRef.current.parentNode.removeChild(containerRef.current);
      }
    };
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveRef.current) {
      (previousActiveRef.current as HTMLElement).focus?.();
      previousActiveRef.current = null;
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }
      // Trap Tab inside the panel.
      if (event.key === 'Tab') {
        const panel = panelRef.current;
        if (!panel) return;
        const focusables = panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS);
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (!first || !last) return;
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    },
    [onClose]
  );

  const handleBackdropClick: MouseEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      if (closeOnBackdropClick && backdropRef.current && event.target === backdropRef.current) {
        onClose();
      }
    },
    [closeOnBackdropClick, onClose]
  );

  // Focus management: runs only when the dialog is open. The hook itself is
  // called unconditionally (before the early return) to satisfy the rules of
  // hooks; the effect body returns early when the dialog is closed.
  useEffect(() => {
    if (!open) return;
    previousActiveRef.current = document.activeElement as Element;
    const panel = panelRef.current;
    if (panel) {
      panel.focus();
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      restoreFocus();
    };
  }, [open, handleKeyDown, restoreFocus]);

  if (!open || !containerRef.current) return null;

  return createPortal(
    <div ref={backdropRef} className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        ref={panelRef}
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title || undefined}
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {title && <h2 className={styles.title}>{title}</h2>}
        <button className={styles.close} onClick={onClose} aria-label="Close dialog">
          ×
        </button>
        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    containerRef.current
  );
}

Dialog.displayName = 'Dialog';
