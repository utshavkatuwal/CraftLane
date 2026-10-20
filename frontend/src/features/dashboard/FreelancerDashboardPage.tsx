/* Craftlane — Freelancer dashboard
 * Dashboard for proposals, projects, milestones, and profile completion.
 * Fetches real data from the backend and shows honest empty states.
 */

import { useEffect, useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { Loader } from '@/components/ui/Loader';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Link } from '@/components/ui/Link';
import { fetchProposals } from '@/features/marketplace/proposal.service';
import { fetchProjects } from '@/features/marketplace/marketplace.service';
import { fetchMyProfile } from '@/features/profiles/profile.service';
import type { Proposal, Profile, Project } from '@/types';
import styles from './FreelancerDashboardPage.module.css';

export function FreelancerDashboardPage() {
  const [activeTab, setActiveTab] = useState<'proposals' | 'projects' | 'milestones' | 'profile'>(
    'proposals'
  );
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        const [proposalsData, projectsData, profileData] = await Promise.all([
          fetchProposals(''),
          fetchProjects({ status: 'published', page_size: 20 }),
          fetchMyProfile(),
        ]);

        if (!cancelled) {
          setProposals(proposalsData || []);
          setProjects(projectsData.projects || []);
          setProfile(profileData);
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
          <h2 className={styles.title}>Freelancer dashboard</h2>
          <p className={styles.subtitle}>
            Manage your proposals, projects, milestones, and profile.
          </p>
        </div>
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
                  <Badge variant="muted">{proposals.length} proposals</Badge>
                </div>
                {proposals.length > 0 ? (
                  <div className={styles.proposalList}>
                    {proposals.map((proposal: Proposal) => (
                      <div key={proposal.id} className={styles.proposalCard}>
                        <div className={styles.proposalCardInfo}>
                          <h4 className={styles.proposalCardTitle}>
                            Proposal for project {proposal.project_id}
                          </h4>
                          <span className={styles.proposalCardStatus}>{proposal.status}</span>
                        </div>
                        <div className={styles.proposalCardPrice}>
                          {proposal.proposed_price !== null ? `$${proposal.proposed_price}` : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
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
                )}
                <p className={styles.note}>
                  Proposal status, client decisions, and timelines appear here.
                </p>
              </section>
            )}
            {activeTab === 'projects' && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Active projects</h3>
                  <Badge variant="muted">{projects.length} projects</Badge>
                </div>
                {projects.length > 0 ? (
                  <div className={styles.projectList}>
                    {projects.map((project: Project) => (
                      <div key={project.id} className={styles.projectCard}>
                        <div className={styles.projectCardInfo}>
                          <h4 className={styles.projectCardTitle}>{project.title}</h4>
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
                    title="No active projects"
                    description={
                      'Projects you have been hired for will appear here once ' +
                      'the backend is connected.'
                    }
                  />
                )}
                <p className={styles.note}>
                  Project scopes, milestones, and deliverables appear here.
                </p>
              </section>
            )}
            {activeTab === 'milestones' && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Milestones</h3>
                  <Badge variant="muted">No data</Badge>
                </div>
                <EmptyState
                  title="No milestones"
                  description={
                    'Milestone deliverables, due dates, and approval status ' +
                    'appear here once the backend is connected.'
                  }
                />
                <p className={styles.note}>Milestone state and submission history appear here.</p>
              </section>
            )}
            {activeTab === 'profile' && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3 className={styles.sectionTitle}>Profile completion</h3>
                  <Badge variant="muted">Profile data</Badge>
                </div>
                {profile ? (
                  <div className={styles.profileCard}>
                    <p className={styles.profileField}>
                      <strong>Headline:</strong> {profile.headline || 'Not set'}
                    </p>
                    <p className={styles.profileField}>
                      <strong>Bio:</strong> {profile.bio || 'Not set'}
                    </p>
                    <p className={styles.profileField}>
                      <strong>Skills:</strong>
                      {profile.skills.length ? profile.skills.join(', ') : 'Not set'}
                    </p>
                    <p className={styles.profileField}>
                      <strong>Hourly rate:</strong>
                      {profile.hourly_rate !== null ? `$${profile.hourly_rate}` : 'Not set'}
                    </p>
                    <p className={styles.profileField}>
                      <strong>Availability:</strong>
                      {profile.availability || 'Not set'}
                    </p>
                  </div>
                ) : (
                  <EmptyState
                    title="Profile not yet complete"
                    description={
                      'Add your biography, skills, experience, and portfolio ' + 'items.'
                    }
                  />
                )}
                <p className={styles.note}>
                  Public profile fields and completion progress appear here.
                </p>
              </section>
            )}
          </main>
        </div>
      )}
    </div>
  );
}

FreelancerDashboardPage.displayName = 'FreelancerDashboardPage';
