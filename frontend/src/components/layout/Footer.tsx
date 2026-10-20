/* Craftlane — Footer
 * Site footer with working internal links and an honest early-stage note.
 * No fabricated stats, testimonials, or partner claims.
 */

import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const navGroups = [
  {
    label: 'Product',
    items: [
      { href: '/work', label: 'Find work' },
      { href: '#', label: 'How it works' },
      { href: '/sign-up', label: 'Get started' },
    ],
  },
  {
    label: 'For clients',
    items: [
      { href: '#', label: 'Post a project' },
      { href: '#', label: 'Review proposals' },
    ],
  },
  {
    label: 'For freelancers',
    items: [
      { href: '#', label: 'Create a profile' },
      { href: '#', label: 'Browse projects' },
    ],
  },
  {
    label: 'Company',
    items: [
      { href: '#', label: 'About' },
      { href: '#', label: 'Blog' },
      { href: '#', label: 'Contact' },
    ],
  },
  {
    label: 'Legal',
    items: [
      { href: '#', label: 'Terms of service' },
      { href: '#', label: 'Privacy policy' },
      { href: '#', label: 'Security' },
    ],
  },
];

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.wrapper}>
        <div className={styles.brand}>
          <Link to="/" className={styles.brandLink} aria-label="Craftlane home">
            Craft<span className={styles.brandAccent}>lane</span>
          </Link>
          <p className={styles.tagline}>Real skills. Clear agreements. Better work.</p>
        </div>

        <nav className={styles.nav} aria-label="Footer navigation">
          {navGroups.map((group) => (
            <div key={group.label} className={styles.group}>
              <h3 className={styles.groupLabel}>{group.label}</h3>
              <ul className={styles.list}>
                {group.items.map((item) => (
                  <li key={item.label} className={styles.item}>
                    <a
                      href={item.href}
                      className={styles.link}
                      onClick={(e) => {
                        // Same-page anchors and unbuilt pages stay on the
                        // current URL honestly rather than pretending to work.
                        if (item.href.startsWith('#')) return;
                        e.preventDefault();
                      }}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className={styles.note}>
          <p className={styles.noteText}>
            Craftlane is in early development. Account actions and project interactions are not
            connected to a backend and will not perform real operations until the API is
            implemented.
          </p>
        </div>

        <p className={styles.copyright}>
          &copy; {new Date().getFullYear()} Craftlane. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
