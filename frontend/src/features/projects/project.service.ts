/* Craftlane — Project service
 * API boundary for project-related operations. Calls the backend through the
 * shared API client. Returns honest empty/error states when no backend
 * is available — never fabricates projects.
 */

import { api } from '@/services/api-client';
import { API } from '@/services/endpoints';
import type { Project } from '@/types';

/* Fetch a single project by ID. */
export async function fetchProject(id: string): Promise<Project> {
  return api.get<Project>(API.projects.detail(id));
}

/* Create a new project. */
export async function createProject(data: {
  title: string;
  description: string;
  project_type: 'fixed_price' | 'hourly';
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string | null;
  deadline?: string | null;
  skills?: string[];
}): Promise<Project> {
  return api.post<Project>(API.projects.create, data);
}

/* Update an existing project. */
export async function updateProject(
  id: string,
  data: {
    title?: string;
    description?: string;
    project_type?: 'fixed_price' | 'hourly';
    budget_min?: number | null;
    budget_max?: number | null;
    currency?: string | null;
    deadline?: string | null;
    status?: string;
  },
): Promise<Project> {
  return api.patch<Project>(API.projects.update(id), data);
}

/* Close a project. */
export async function closeProject(id: string): Promise<{ id: string; status: string }> {
  return api.post<{ id: string; status: string }>(API.projects.close(id));
}
