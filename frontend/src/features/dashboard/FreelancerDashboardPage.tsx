/* Craftlane — Freelancer dashboard shell
 * A dashboard for proposals, projects, milestones, and profile completion.
 * Shows honest empty states. No fake earnings, jobs, or activity are
 * generated.
 */

import { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Link } from '@/components/ui/Link';
import styles from './FreelancerDashboardPage.module.css';

export function FreelancerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'projects' | 'milestones' | 'profile'>(
    'proposals'
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <h2 className={styles.title}>Freelancer dashboard</h2>
          <p className={styles.subtitle}>
            Manage your proposals, projects, milestones, and profile.
          </p>
        </div>
      </header>

      <div className={styles.body}>
        <nav className={styles.tabs} aria-label="Dashboard sections">
          {[
            { key: 'proposals' as const, label: 'Proposals' },
            { key: 'projects' as const, label: 'Projects' },
            { key: 'milestones' as const, label: 'Milestones' },
            { key: 'profile' as const, label: 'Profile completion' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              className={cn(styles.tab, activeTab === item.key && styles.tabActive)}
              onClick={() => setActiveTab(item.key)}
              aria-pressed={activeTab === item.key}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main className={styles.content}>
          {activeTab === 'proposals' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Your proposals</h3>
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="No proposals yet"
                description={
                  'Proposals you submit will appear here once the backend ' + 'is connected.'
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
                Proposal status, client decisions, and timelines appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          )}
          {activeTab === 'projects' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Active projects</h3>
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="No active projects"
                description={
                  'Projects you have been hired for will appear here once ' +
                  'the backend is connected.'
                }
              />
              <p className={styles.note}>
                Project scopes, milestones, and deliverables appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          )}
          {activeTab === 'milestones' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Milestones</h3>
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="No milestones"
                description={
                  'Milestone deliverables, due dates, and approval status ' +
                  'appear here once the backend is connected.'
                }
              />
              <p className={styles.note}>
                Milestone state and submission history appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          )}
          {activeTab === 'profile' && (
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Profile completion</h3>
                <Badge variant="muted">No data from backend</Badge>
              </div>
              <EmptyState
                title="Profile not yet complete"
                description={
                  'Add your biography, skills, experience, and portfolio ' +
                  'items once the backend is connected.'
                }
              />
              <p className={styles.note}>
                Public profile fields and completion progress appear here once the backend API is
                connected. No data is simulated.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

FreelancerDashboardPage.displayName = 'FreelancerDashboardPage';
