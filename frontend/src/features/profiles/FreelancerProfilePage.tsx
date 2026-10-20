/* Craftlane — Freelancer profile page
 * Layout for a freelancer's public profile. Renders only supplied fields;
 * portfolio items, skills, and experience are shown honestly — never
 * fabricated.
 */

import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './FreelancerProfilePage.module.css';

export function FreelancerProfilePage() {
  const { id } = useParams();
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // NOTE: No freelancer data is fabricated. This page is prepared for backend
  // integration; until a real profile is available it renders an honest state.

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to="/work" className={styles.backLink} aria-label="Back to projects">
          ← Back to projects
        </Link>
      </header>

      <main id="content" className={styles.main}>
        <div className={styles.container}>
          {isLoading ? (
            <div className={styles.loadingWrapper}>
              <Loader label="Loading profile" />
            </div>
          ) : error ? (
            <div className={styles.errorWrapper}>
              <ErrorMessage
                title="Unable to load profile"
                message={error}
                retry={
                  <Button variant="outline" size="sm">
                    Try again
                  </Button>
                }
              />
            </div>
          ) : (
            <article className={styles.card}>
              <header className={styles.profileHeader}>
                <div className={styles.identity}>
                  <Avatar size="lg" name={id || 'Freelancer'} />
                  <div>
                    <h1 className={styles.name}>Freelancer profile</h1>
                    <p className={styles.headline}>Professional headline not available</p>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Button variant="outline">Message</Button>
                </div>
              </header>

              <div className={styles.tabs}>
                <Link to="#" className={cn(styles.tab, styles.tabActive)}>
                  Overview
                </Link>
                <Link to="#" className={styles.tab}>
                  Portfolio
                </Link>
              </div>

              <section className={styles.bio}>
                <h2 className={styles.sectionTitle}>About</h2>
                <p className={styles.bioText}>
                  No biography has been provided. When a backend is connected, this section will
                  show the freelancer's self-reported biography and verifiable profile information.
                </p>
              </section>

              <section className={styles.skills}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                <p className={styles.emptyNote}>No skills listed.</p>
              </section>

              <section className={styles.portfolio}>
                <h2 className={styles.sectionTitle}>Portfolio</h2>
                <EmptyState
                  title="No portfolio items"
                  description={
                    'Portfolio items will appear here once the backend is connected. ' +
                    'Any examples shown during development are structural illustrations only.'
                  }
                />
              </section>

              <section className={styles.experience}>
                <h2 className={styles.sectionTitle}>Experience</h2>
                <p className={styles.emptyNote}>No experience listed.</p>
              </section>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}

FreelancerProfilePage.displayName = 'FreelancerProfilePage';
