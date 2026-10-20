/* Craftlane — Header
 * Primary navigation: brand, product links, authentication entry points, and
 * a mobile menu. No user state is fabricated; links reflect the public,
 * unauthenticated surface until a backend auth contract exists.
 */

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { CircleHelp, LogIn, Menu, Search, UserRoundPlus, X } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={cn(styles.header, isMenuOpen && styles.headerMenuOpen)} role="banner">
      <a href="#content" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.brand} aria-label="Craftlane home">
          <svg className={styles.brandMark} viewBox="0 0 40 40" aria-hidden="true">
            <rect x="1" y="1" width="38" height="38" rx="13" fill="currentColor" />
            <path
              d="M12 26V14h4v4.2c1.1-2.8 3.5-4.5 7.2-4.5 3.6 0 5.8 1.8 5.8 5.3V26h-4v-6.3c0-1.8-1-2.8-2.9-2.8-2.9 0-5.1 2-6.1 5.2V26H12Z"
              fill="#f8f6ef"
            />
          </svg>
          <span className={styles.wordmark}>
            craft<span>lane</span>
          </span>
        </Link>

        <nav className={cn(styles.nav, isMenuOpen && styles.navOpen)} aria-label="Main navigation">
          <Link to="/work" className={styles.navLink}>
            Find work
          </Link>
          <a href="#how-it-works" className={styles.navLink}>
            How it works
          </a>
          <Link to="/sign-in" className={styles.navLink}>
            Sign in
          </Link>
          <Link to="/sign-up" className={cn(styles.navLink, styles.navLinkCta)}>
            Get started
          </Link>
        </nav>

        <button
          type="button"
          className={cn(styles.menuButton, isMenuOpen && styles.menuButtonOpen)}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {isMenuOpen ? (
            <X className={styles.icon} aria-hidden="true" />
          ) : (
            <Menu className={styles.icon} aria-hidden="true" />
          )}
          <span className={styles.menuLabel}>{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {isMenuOpen &&
        createPortal(
          <>
            <button
              type="button"
              className={styles.menuBackdrop}
              aria-label="Dismiss navigation menu"
              onClick={() => setIsMenuOpen(false)}
            />
            <nav id="mobile-menu" className={styles.mobilePanel} aria-label="Mobile navigation">
              <div className={styles.menuHeading}>Explore Craftlane</div>
              <Link to="/work" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
                <Search className={styles.mobileLinkIcon} aria-hidden="true" />
                <span>Find work</span>
              </Link>
              <Link
                to="/#how-it-works"
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                <CircleHelp className={styles.mobileLinkIcon} aria-hidden="true" />
                <span>How it works</span>
              </Link>
              <Link
                to="/sign-in"
                className={styles.mobileLink}
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className={styles.mobileLinkIcon} aria-hidden="true" />
                <span>Sign in</span>
              </Link>
              <Link
                to="/sign-up"
                className={cn(styles.mobileLink, styles.mobileLinkCta)}
                onClick={() => setIsMenuOpen(false)}
              >
                <UserRoundPlus className={styles.mobileLinkIcon} aria-hidden="true" />
                Get started
              </Link>
            </nav>
          </>,
          document.body
        )}
    </header>
  );
}
