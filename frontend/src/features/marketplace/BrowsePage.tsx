/* Craftlane — Browse work page
 * Marketplace listing: search, filter, sort, and view projects. Displays an
 * honest empty state when no projects exist and an error state when the
 * backend is unreachable. Never fabricates projects.
 */

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { Loader } from '@/components/ui/Loader';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Badge } from '@/components/ui/Badge';
import { fetchProjects } from './marketplace.service';
import type { Project, ProjectFilters, ProjectType } from '@/types';
import styles from './BrowsePage.module.css';

const PROJECT_TYPES: ProjectType[] = ['fixed_price', 'hourly'];

const DEFAULT_SKILLS = ['Design', 'Development', 'Writing', 'Marketing', 'Consulting'];

export function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<{
    items: Project[];
    total: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [projectType, setProjectType] = useState<ProjectType | null>(
    (searchParams.get('project_type') as ProjectType) || null
  );
  const [sort, setSort] = useState<'created_at' | 'budget' | 'deadline' | 'title'>('created_at');

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const filters: ProjectFilters = {
        query: query || undefined,
        skills: selectedSkills.length ? selectedSkills : undefined,
        project_type: projectType || undefined,
        sort,
        order: 'desc',
        page: 1,
        page_size: 20,
      };
      const response = await fetchProjects(filters);
      setProjects({
        items: response.projects,
        total: response.pagination.total,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects.');
      setProjects(null);
    } finally {
      setIsLoading(false);
    }
  }, [query, selectedSkills, projectType, sort]);

  const handleSearch = (nextQuery: string) => {
    setQuery(nextQuery);
    setSearchParams({ q: nextQuery }, { replace: true });
  };

  // Load projects on mount and whenever filters change.
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className={styles.page}>
      <header className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <h2 className={styles.toolbarTitle}>Find work</h2>
          <p className={styles.toolbarSubtitle}>
            Browse published projects and apply with a proposal.
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <Search className={styles.searchIcon} aria-hidden="true" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch(query);
                }
              }}
              placeholder="Search projects by keyword or skill"
            />
            <Button variant="outline" size="sm" onClick={() => handleSearch(query)}>
              Search
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedSkills([]);
              setProjectType(null);
              setSort('created_at');
              setSearchParams({}, { replace: true });
            }}
          >
            <SlidersHorizontal className={styles.filterIcon} aria-hidden="true" />
            Reset filters
          </Button>
        </div>
      </header>

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Skills</label>
          <div className={styles.skillChips}>
            {DEFAULT_SKILLS.map((skill) => (
              <button
                key={skill}
                type="button"
                className={cn(
                  styles.skillChip,
                  selectedSkills.includes(skill) && styles.skillChipActive
                )}
                onClick={() =>
                  setSelectedSkills((prev) =>
                    prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
                  )
                }
                aria-pressed={selectedSkills.includes(skill)}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Project type</label>
          <div className={styles.pillGroup}>
            {PROJECT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={cn(styles.pill, projectType === type && styles.pillActive)}
                onClick={() => setProjectType(type)}
                aria-pressed={projectType === type}
              >
                {type.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Sort by</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className={styles.sortSelect}
            aria-label="Sort projects"
          >
            <option value="created_at">Newest first</option>
            <option value="budget">Budget (low to high)</option>
            <option value="deadline">Deadline (soonest)</option>
            <option value="title">Title (A–Z)</option>
          </select>
        </div>
      </div>

      <div className={styles.resultsHeader}>
        <Badge variant="muted">
          {projects?.items.length ?? 0} of {projects?.total ?? 0} projects
        </Badge>
      </div>

      {isLoading && projects === null ? (
        <div className={styles.loadingWrapper}>
          <Loader label="Loading projects" />
        </div>
      ) : error ? (
        <div className={styles.errorWrapper}>
          <ErrorMessage
            title="Unable to load projects"
            message={error}
            retry={
              <Button variant="outline" size="sm" onClick={loadProjects}>
                Try again
              </Button>
            }
          />
        </div>
      ) : projects?.items.length === 0 ? (
        <EmptyState
          title="No projects found"
          description={
            <span>
              There are no published projects matching your filters. Try{' '}
              <button
                type="button"
                className={styles.linkish}
                onClick={() => {
                  setQuery('');
                  setSelectedSkills([]);
                }}
              >
                clearing the filters
              </button>{' '}
              or{' '}
              <button
                type="button"
                className={styles.linkish}
                onClick={() => setSelectedSkills([])}
              >
                adjusting your skills
              </button>
              .
            </span>
          }
          action={
            <Button variant="outline" size="sm" onClick={() => setQuery('')}>
              Clear all
            </Button>
          }
        />
      ) : projects ? (
        <div className={styles.grid}>
          {projects.items.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

BrowsePage.displayName = 'BrowsePage';
