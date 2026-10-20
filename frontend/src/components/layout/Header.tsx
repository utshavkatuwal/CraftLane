/* Craftlane — Header
 * Primary navigation: brand, product links, authentication entry points, and
 * a mobile menu. No user state is fabricated; links reflect the public,
 * unauthenticated surface until a backend auth contract exists.
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { Menu, X } from 'lucide-react';
import styles from './Header.module.css';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className={styles.header} role="banner">
      <a href="#content" className={styles.skipLink}>
        Skip to content
      </a>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.brand} aria-label="Craftlane home">
          Craft<span className={styles.brandAccent}>lane</span>
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
          className={cn(styles.menuButton, isMenuOpen && styles.menuButtonOpen)}
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <X className={styles.icon} aria-hidden="true" />
          ) : (
            <Menu className={styles.icon} aria-hidden="true" />
          )}
          <span className={styles.menuLabel}>{isMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile panel (overlay) */}
      <div
        id="mobile-menu"
        className={cn(styles.mobilePanel, isMenuOpen && styles.mobilePanelOpen)}
        role="panel"
      >
        <Link to="/work" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
          Find work
        </Link>
        <a href="#how-it-works" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
          How it works
        </a>
        <Link to="/sign-in" className={styles.mobileLink} onClick={() => setIsMenuOpen(false)}>
          Sign in
        </Link>
        <Link
          to="/sign-up"
          className={cn(styles.mobileLink, styles.mobileLinkCta)}
          onClick={() => setIsMenuOpen(false)}
        >
          Get started
        </Link>
      </div>
    </header>
  );
}
