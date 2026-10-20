/* Craftlane — Profile service
 * API boundary for profile-related operations. Calls the backend through the
 * shared API client. Returns honest empty/error states when no backend
 * is available — never fabricates profiles.
 */

import { api } from '@/services/api-client';
import { API } from '@/services/endpoints';

/* Fetch a freelancer's public profile by ID. */
export async function fetchFreelancerProfile(id: string): Promise<any> {
  return api.get<any>(API.profiles.freelancer(id));
}

/* Fetch a client's public profile by ID. */
export async function fetchClientProfile(id: string): Promise<any> {
  return api.get<any>(API.profiles.client(id));
}

/* Fetch the current user's profile. */
export async function fetchMyProfile(): Promise<any> {
  return api.get<any>(API.profiles.me);
}

/* Update the current user's freelancer profile. */
export async function updateFreelancerProfile(data: {
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  hourly_rate?: number | null;
  currency?: string | null;
  availability?: 'available' | 'busy' | 'unavailable' | null;
  is_public?: boolean;
  skills?: string[];
}): Promise<any> {
  return api.patch<any>(API.profiles.me, data);
}
