/* Craftlane — Project card
 * A single project listing item. Renders only supplied fields; missing
 * details (budget, deadline) are shown honestly as "—" rather than invented.
 */

import type { Project } from '@/types';
import { formatCurrency, formatDate, projectTypeLabel } from '@/utils/format';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/work/${project.id}`} className={styles.card}>
      <div className={styles.top}>
        <h3 className={styles.title}>{project.title}</h3>
        <Badge variant="default">{project.status}</Badge>
      </div>
      <p className={styles.description}>{truncate(project.description, 140)}</p>

      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <MapPin className={styles.metaIcon} aria-hidden="true" />
          {projectTypeLabel(project.project_type)}
        </span>
        {project.budget_min !== null && project.budget_min !== undefined && project.currency ? (
          <span className={styles.metaItem}>
            <Clock className={styles.metaIcon} aria-hidden="true" />
            {formatCurrency(project.budget_min, project.currency)}
          </span>
        ) : null}
        {project.deadline ? (
          <span className={styles.metaItem}>
            <Clock className={styles.metaIcon} aria-hidden="true" />
            {formatDate(project.deadline)}
          </span>
        ) : null}
      </div>

      <div className={styles.skills}>
        {project.skills.slice(0, 5).map((skill) => (
          <Badge key={skill} variant="brand">
            {skill}
          </Badge>
        ))}
        {project.skills.length > 5 && (
          <span className={styles.moreSkills}>+{project.skills.length - 5}</span>
        )}
      </div>
    </Link>
  );
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return `${value.slice(0, max).trimEnd()}…`;
}

ProjectCard.displayName = 'ProjectCard';
