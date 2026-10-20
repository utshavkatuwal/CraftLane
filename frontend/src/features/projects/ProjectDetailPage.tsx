/* Craftlane — Project detail page
 * Structured page for a single project. Fetches project data from the
 * backend and displays it honestly. Missing details are shown as "—"
 * rather than invented.
 */

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { Link } from '@/components/ui/Link';
import { fetchProject } from '@/features/projects/project.service';
import styles from './ProjectDetailPage.module.css';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) {
      setError('Project ID not found');
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    fetchProject(projectId)
      .then((data) => {
        if (!cancelled) setProject(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load project.');
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [projectId]);

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
          ) : project ? (
            <article className={styles.card}>
              <header className={styles.cardHeader}>
                <div className={styles.badgeRow}>
                  <Badge variant="default">{project.status}</Badge>
                  <Badge variant="brand">{project.project_type}</Badge>
                </div>
                <h1 className={styles.title}>{project.title}</h1>
                <p className={styles.subtitle}>
                  {project.description}
                </p>
                <p className={styles.meta}>
                  <span>Budget: {project.budget_min !== null ? `$${project.budget_min}` : '—'}</span>
                  {project.budget_max !== null ? (
                    <span> – ${project.budget_max}</span>
                  ) : null}
                  {project.currency ? ` ${project.currency}` : ''}
                </p>
                <p className={styles.meta}>
                  {project.deadline ? `Deadline: ${new Date(project.deadline).toLocaleDateString()}` : 'No deadline set'}
                </p>
              </header>

              <section className={styles.fields}>
                <div className={styles.fieldGroup}>
                  <h3 className={styles.fieldLabel}>Required skills</h3>
                  <p className={styles.fieldValue}>
                    {project.skills?.length ? project.skills.join(', ') : '—'}
                  </p>
                </div>
              </section>

              <div className={styles.actions}>
                <Link to="/work">
                  <Button variant="outline">Browse projects</Button>
                </Link>
              </div>
            </article>
          ) : null}
        </div>
      </main>
    </div>
  );
}

ProjectDetailPage.displayName = 'ProjectDetailPage';
