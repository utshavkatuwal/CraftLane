/* Craftlane — Freelancer profile page
 * Layout for a freelancer's public profile. Fetches profile data from the
 * backend and renders only supplied fields; portfolio items, skills, and
 * experience are shown honestly — never fabricated.
 */

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { fetchFreelancerProfile } from '@/features/profiles/profile.service';
import styles from './FreelancerProfilePage.module.css';

export function FreelancerProfilePage() {
  const { id } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Profile ID not found');
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetchFreelancerProfile(id)
      .then((data) => {
        if (!cancelled) setProfile(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load profile.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

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
          ) : profile ? (
            <article className={styles.card}>
              <header className={styles.profileHeader}>
                <div className={styles.identity}>
                  <Avatar size="lg" name={profile.full_name || 'Freelancer'} />
                  <div>
                    <h1 className={styles.name}>{profile.full_name || 'Freelancer'}</h1>
                    <p className={styles.headline}>
                      {profile.headline || 'Professional headline not available'}
                    </p>
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
                  {profile.bio || 'No biography has been provided.'}
                </p>
              </section>

              <section className={styles.skills}>
                <h2 className={styles.sectionTitle}>Skills</h2>
                {profile.skills?.length ? (
                  <div className={styles.skillList}>
                    {profile.skills.map((skill: string) => (
                      <span key={skill} className={styles.skillChip}>
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className={styles.emptyNote}>No skills listed.</p>
                )}
              </section>

              <section className={styles.portfolio}>
                <h2 className={styles.sectionTitle}>Portfolio</h2>
                {profile.portfolio?.length ? (
                  <div className={styles.portfolioList}>
                    {profile.portfolio.map((item: any) => (
                      <div key={item.id} className={styles.portfolioItem}>
                        <h4 className={styles.portfolioItemTitle}>{item.title}</h4>
                        <p className={styles.portfolioItemDesc}>
                          {item.description || 'No description provided.'}
                        </p>
                        {item.url && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className={styles.portfolioItemLink}>
                            View project
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No portfolio items"
                    description={
                      'Portfolio items will appear here once they are added.'
                    }
                  />
                )}
              </section>
            </article>
          ) : null}
        </div>
      </main>
    </div>
  );
}

FreelancerProfilePage.displayName = 'FreelancerProfilePage';
