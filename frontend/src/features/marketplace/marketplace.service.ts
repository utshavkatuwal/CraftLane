/* Craftlane — Marketplace service
 * API boundary for project discovery. Calls the (future) FastAPI backend via
 * the shared API client. Returns honest empty/error states when no backend
 * is available — never fabricates projects.
 */

import { api } from '@/services/api-client';
import { API } from '@/services/endpoints';
import type { ProjectListResponse, ProjectFilters } from '@/types';

/* Fetch the published project list with the given filters. */
export async function fetchProjects(filters: ProjectFilters = {}): Promise<ProjectListResponse> {
  const params = new URLSearchParams();
  if (filters.query) params.set('query', filters.query);
  if (filters.skills?.length) {
    filters.skills.forEach((skill) => params.append('skills', skill));
  }
  if (filters.project_type) params.set('project_type', filters.project_type);
  if (filters.budget_min !== null && filters.budget_min !== undefined)
    params.set('budget_min', String(filters.budget_min));
  if (filters.budget_max !== null && filters.budget_max !== undefined)
    params.set('budget_max', String(filters.budget_max));
  if (filters.status) params.set('status', filters.status);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.page_size) params.set('page_size', String(filters.page_size));
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.order) params.set('order', filters.order);

  return api.get<ProjectListResponse>(`${API.projects.list}?${params.toString()}`);
}
