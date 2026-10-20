/* Craftlane — Avatar
 * Circular avatar showing an image or initials. Falls back to initials when
 * no image is supplied; never invents a person.
 */

import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';
import styles from './Avatar.module.css';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ className, src, alt, name, size = 'md', ...props }: AvatarProps) {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';
  const hasImage = !!src;

  return (
    <div
      className={cn(styles.avatar, styles[size], className)}
      {...props}
      aria-label={alt || name || 'Avatar'}
    >
      {hasImage ? (
        <img src={src} alt={alt || ''} className={styles.image} />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  );
}

Avatar.displayName = 'Avatar';
