/* Craftlane — Client dashboard shell
 * A dashboard layout for clients to manage their projects, proposals, and
 * engagement activity. Shows honest empty states when the backend contains
 * no data. No fake activity is generated.
 */

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link } from '@/components/ui/Link';
import styles from './ClientDashboardPage.module.css';

export function ClientDashboardPage() {
  const [activeTab, setActiveTab] = useState<'projects' | 'proposals'>('projects');

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h2 className={styles.title}>Client dashboard</h2>
          <p className={styles.subtitle}>
            Manage your projects, proposals, and freelancer engagements.
          </p>
        </div>
        <Link to="/work">
          <Button>Post a project</Button>
        </Link>
      </header>

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
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="No projects yet"
                description={
                  'You have not published any projects. Use "Post a project" ' +
                  'to create one once the backend is connected.'
                }
                action={
                  <Link to="/work">
                    <Button variant="outline" size="sm">
                      Browse projects
                    </Button>
                  </Link>
                }
              />
              <p className={styles.note}>
                Project listings, budgets, and statuses appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          ) : (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Incoming proposals</h3>
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="No proposals"
                description={
                  'Proposals from freelancers will appear here once you ' +
                  'publish a project and the backend is connected.'
                }
              />
              <p className={styles.note}>
                Proposal details, proposed prices, and timelines appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

ClientDashboardPage.displayName = 'ClientDashboardPage';
