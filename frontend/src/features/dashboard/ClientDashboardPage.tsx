/* Craftlane — Client dashboard
 * Dashboard layout for clients to manage their projects, proposals, and
 * freelancer engagements. Fetches real data from the backend and shows
 * honest empty states when no data exists.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Link } from '@/components/ui/Link';
import { fetchProjects } from '@/features/marketplace/marketplace.service';
import styles from './ClientDashboardPage.module.css';

export function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'proposals'>('projects');
  const [projects, setProjects] = useState<
    { id: string; title: string; description: string; status: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const projectsData = await fetchProjects({ status: 'published', page_size: 20 });

        if (!cancelled) {
          setProjects(projectsData.projects || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load dashboard data.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h2 className={styles.title}>Client dashboard</h2>
          <p className={styles.subtitle}>
            Manage your projects, proposals, and freelancer engagements.
          </p>
        </div>
        <Link to="/work/post">
          <Button>Post a project</Button>
        </Link>
      </header>

      {isLoading ? (
        <div className={styles.loadingWrapper}>
          <Loader label="Loading dashboard" />
        </div>
      ) : error ? (
        <div className={styles.errorWrapper}>
          <ErrorMessage
            title="Unable to load dashboard"
            message={error}
            retry={
              <Button variant="outline" size="sm">
                Try again
              </Button>
            }
          />
        </div>
      ) : (
        <div className={styles.body}>
          <nav className={styles.tabs} aria-label="Dashboard sections">
            <button
              type="button"
              className={cn(styles.tab, activeTab === 'projects' && styles.tabActive)}
              onClick={() => setActiveTab('projects')}
              aria-pressed={activeTab === 'projects'}
            >
              Projects
            </button>
            <button
              type="button"
              className={cn(styles.tab, activeTab === 'proposals' && styles.tabActive)}
              onClick={() => setActiveTab('proposals')}
              aria-pressed={activeTab === 'proposals'}
            >
              Proposals
            </button>
          </nav>

          <main className={styles.content}>
            {activeTab === 'projects' ? (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Your projects</h3>
                  <Badge variant="muted">{projects.length} projects</Badge>
                </div>
                {projects.length > 0 ? (
                  <div className={styles.projectList}>
                    {projects.map((project) => (
                      <div key={project.id} className={styles.projectCard}>
                        <div className={styles.projectCardInfo}>
                          <h4 className={styles.projectCardTitle}>{project.title}</h4>
                          <p className={styles.projectCardDesc}>
                            {project.description?.slice(0, 100)}...
                          </p>
                          <span className={styles.projectCardStatus}>{project.status}</span>
                        </div>
                        <Link to={`/work/${project.id}`}>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No projects yet"
                    description={
                      'You have not published any projects. Use "Post a project" ' +
                      'to create one.'
                    }
                    action={
                      <Link to="/work/post">
                        <Button variant="outline" size="sm">
                          Post a project
                        </Button>
                      </Link>
                    }
                  />
                )}
                <p className={styles.note}>Project listings, budgets, and statuses appear here.</p>
              </section>
            ) : (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Incoming proposals</h3>
                  <Badge variant="muted">0 proposals</Badge>
                </div>
                <EmptyState
                  title="No proposals"
                  description={
                    'Proposals from freelancers will appear here once you ' + 'publish a project.'
                  }
                />
                <p className={styles.note}>
                  Proposal details, proposed prices, and timelines appear here.
                </p>
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

ClientDashboardPage.displayName = 'ClientDashboardPage';
