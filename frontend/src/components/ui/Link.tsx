/* Craftlane — Link
 * A styled anchor. Uses React Router's `<Link>` when a `to` prop is given,
 * otherwise renders a regular `<a href>`. Keeps internal navigation consistent
 * and external links clearly identifiable.
 */

import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { NavLink as RRNavLink, type To } from 'react-router-dom';
import { cn } from '@/utils/cn';
import styles from './Link.module.css';

interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to?: To;
  href?: string;
  external?: boolean;
  children: ReactNode;
}

export function Link({ className, to, href, external = false, children, ...rest }: LinkProps) {
  const icon = external ? <span aria-hidden="true">↗</span> : null;

  if (to) {
    return (
      <RRNavLink
        to={to}
        className={({ isActive }) => cn(styles.link, isActive && styles.active, className)}
        {...rest}
      >
        {children}
        {icon}
      </RRNavLink>
    );
  }

  return (
    <a
      className={cn(styles.link, className)}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {children}
      {icon}
    </a>
  );
}

Link.displayName = 'Link';
