/* Craftlane — Domain types
 * Shared TypeScript types for the frontend. These model the data shapes the
 * frontend expects from the (future) FastAPI backend. They are deliberately
 * minimal and explicit; no `any` unless a documented reason exists.
 */

export type Role = 'client' | 'freelancer' | 'admin';

export type UserStatus = 'pending' | 'active' | 'suspended' | 'deactivated';

export type ProjectStatus =
  'draft' | 'published' | 'paused' | 'closed' | 'in_progress' | 'completed' | 'cancelled';

export type ProposalStatus =
  'submitted' | 'shortlisted' | 'accepted' | 'rejected' | 'withdrawn' | 'expired';

export type ProjectType = 'fixed_price' | 'hourly';

/* ------------------------------------------------------------------ */
/* Core entities                                                      */
/* ------------------------------------------------------------------ */
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status: UserStatus;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProfileBase {
  id: string;
  user_id: string;
  headline?: string | null;
  bio?: string | null;
  location?: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile extends ProfileBase {
  role: 'freelancer';
  skills: string[];
  hourly_rate?: number | null;
  availability?: 'available' | 'busy' | 'unavailable' | null;
  portfolio: PortfolioItem[];
}

export interface ClientProfile extends ProfileBase {
  role: 'client';
  organization?: string | null;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string | null;
  skills: string[];
  url?: string | null;
  thumbnail_url?: string | null;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  client_id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  project_type: ProjectType;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string | null;
  deadline?: string | null;
  skills: string[];
  created_at: string;
  updated_at: string;
}

export interface Proposal {
  id: string;
  project_id: string;
  freelancer_id: string;
  cover_message: string;
  proposed_price?: number | null;
  proposed_timeline?: string | null;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
}

/* ------------------------------------------------------------------ */
/* API request / response shapes                                      */
/* ------------------------------------------------------------------ */
export interface Pagination {
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface ProjectListResponse {
  projects: Project[];
  pagination: Pagination;
}

export interface ProjectFilters {
  query?: string | null;
  skills?: string[];
  project_type?: ProjectType | null;
  budget_min?: number | null;
  budget_max?: number | null;
  status?: ProjectStatus | null;
  page?: number;
  page_size?: number;
  sort?: 'created_at' | 'budget' | 'deadline' | 'title';
  order?: 'asc' | 'desc';
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: Record<string, string[]>;
}

/* ------------------------------------------------------------------ */
/* Form data shapes                                                   */
/* ------------------------------------------------------------------ */
export interface SignUpForm {
  full_name: string;
  email: string;
  password: string;
  password_confirm: string;
  terms: boolean;
}

export interface SignInForm {
  email: string;
  password: string;
}

export interface ProjectForm {
  title: string;
  description: string;
  project_type: ProjectType;
  budget_min?: number | null;
  budget_max?: number | null;
  currency?: string | null;
  deadline?: string | null;
  skills: string[];
}

export interface ProposalForm {
  cover_message: string;
  proposed_price?: number | null;
  proposed_timeline?: string | null;
}

/* ------------------------------------------------------------------ */
/* UI state                                                           */
/* ------------------------------------------------------------------ */
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AsyncState<T = unknown> {
  status: AsyncStatus;
  data: T | null;
  error: ApiError | null;
}
