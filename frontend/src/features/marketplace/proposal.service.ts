/* Craftlane — Proposal service
 * API boundary for proposal-related operations. Calls the backend through the
 * shared API client. Returns honest empty/error states when no backend
 * is available — never fabricates proposals.
 */

import { api } from '@/services/api-client';
import { API } from '@/services/endpoints';

/* Fetch proposals for a project. */
export async function fetchProposals(projectId: string): Promise<any[]> {
  return api.get<any[]>(API.proposals.list(projectId));
}

/* Submit a proposal for a project. */
export async function createProposal(projectId: string, data: {
  cover_message: string;
  proposed_price?: number | null;
  proposed_timeline?: string | null;
}): Promise<any> {
  return api.post<any>(API.proposals.create(projectId), data);
}

/* Get a single proposal by ID. */
export async function fetchProposal(id: string): Promise<any> {
  return api.get<any>(API.proposals.detail(id));
}

/* Accept or reject a proposal. */
export async function decideProposal(id: string, decision: 'accept' | 'reject'): Promise<any> {
  return api.post<any>(API.proposals.decide(id), { decision });
}
