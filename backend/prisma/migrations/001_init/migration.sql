-- Craftlane — Initial migration (001_init)
-- Creates all tables for the MVP marketplace.
-- Run against a fresh PostgreSQL database.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- Authentication & accounts
-- --------------------------------------------------------

CREATE TABLE "User" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'CLIENT',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    email_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_email ON "User"(email);
CREATE INDEX idx_user_status ON "User"(status);
CREATE INDEX idx_user_role ON "User"(role);

CREATE TABLE "AuthToken" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    type VARCHAR(30) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    used_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_auth_token_user_id ON "AuthToken"(user_id);
CREATE INDEX idx_auth_token_token_hash ON "AuthToken"(token_hash);
CREATE INDEX idx_auth_token_type_expires ON "AuthToken"(type, expires_at);

CREATE TABLE "Session" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    token_prefix VARCHAR(12) NOT NULL, -- First 12 chars of token, for lookup
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_used_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_user_id ON "Session"(user_id);
CREATE INDEX idx_session_token_prefix ON "Session"(token_prefix);
CREATE INDEX idx_session_token_hash ON "Session"(token_hash);
CREATE INDEX idx_session_expires_at ON "Session"(expires_at);

-- --------------------------------------------------------
-- Profiles
-- --------------------------------------------------------

CREATE TABLE "FreelancerProfile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
    headline VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    hourly_rate_cents INTEGER,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    availability VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_freelancer_profile_user_id ON "FreelancerProfile"(user_id);
CREATE INDEX idx_freelancer_profile_availability ON "FreelancerProfile"(availability);
CREATE INDEX idx_freelancer_profile_is_public ON "FreelancerProfile"(is_public);

CREATE TABLE "ClientProfile" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES "User"(id) ON DELETE CASCADE,
    organization VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_client_profile_user_id ON "ClientProfile"(user_id);
CREATE INDEX idx_client_profile_is_public ON "ClientProfile"(is_public);

-- --------------------------------------------------------
-- Skills
-- --------------------------------------------------------

CREATE TABLE "Skill" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_skill_slug ON "Skill"(slug);

-- Junction: freelancer profile ↔ skills
CREATE TABLE "ProfileSkill" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES "FreelancerProfile"(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES "Skill"(id) ON DELETE CASCADE,
    UNIQUE(profile_id, skill_id)
);

CREATE INDEX idx_profile_skill_profile_id ON "ProfileSkill"(profile_id);
CREATE INDEX idx_profile_skill_skill_id ON "ProfileSkill"(skill_id);

-- Junction: project ↔ skills
CREATE TABLE "ProjectSkill" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES "Skill"(id) ON DELETE CASCADE,
    UNIQUE(project_id, skill_id)
);

CREATE INDEX idx_project_skill_project_id ON "ProjectSkill"(project_id);
CREATE INDEX idx_project_skill_skill_id ON "ProjectSkill"(skill_id);

-- --------------------------------------------------------
-- Portfolio
-- --------------------------------------------------------

CREATE TABLE "PortfolioItem" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES "FreelancerProfile"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_portfolio_item_profile_id ON "PortfolioItem"(profile_id);
CREATE INDEX idx_portfolio_item_created_at ON "PortfolioItem"(created_at);

-- --------------------------------------------------------
-- Projects
-- --------------------------------------------------------

CREATE TABLE "Project" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES "ClientProfile"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    project_type VARCHAR(20) NOT NULL DEFAULT 'FIXED_PRICE',
    budget_min_cents INTEGER,
    budget_max_cents INTEGER,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_client_id ON "Project"(client_id);
CREATE INDEX idx_project_status ON "Project"(status);
CREATE INDEX idx_project_project_type ON "Project"(project_type);
CREATE INDEX idx_project_created_at ON "Project"(created_at);
CREATE INDEX idx_project_deadline ON "Project"(deadline);

-- --------------------------------------------------------
-- Proposals
-- --------------------------------------------------------

CREATE TABLE "Proposal" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    cover_message TEXT NOT NULL,
    proposed_price_cents INTEGER,
    proposed_timeline VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(project_id, freelancer_id)
);

CREATE INDEX idx_proposal_project_id ON "Proposal"(project_id);
CREATE INDEX idx_proposal_freelancer_id ON "Proposal"(freelancer_id);
CREATE INDEX idx_proposal_status ON "Proposal"(status);

-- --------------------------------------------------------
-- Contracts
-- --------------------------------------------------------

CREATE TABLE "Contract" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES "Project"(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES "ClientProfile"(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
    agreed_price_cents INTEGER NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING_ACCEPTANCE',
    terms TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contract_project_id ON "Contract"(project_id);
CREATE INDEX idx_contract_client_id ON "Contract"(client_id);
CREATE INDEX idx_contract_freelancer_id ON "Contract"(freelancer_id);
CREATE INDEX idx_contract_status ON "Contract"(status);

-- --------------------------------------------------------
-- Milestones
-- --------------------------------------------------------

CREATE TABLE "Milestone" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES "Contract"(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount_cents INTEGER,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    due_date TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_milestone_contract_id ON "Milestone"(contract_id);
CREATE INDEX idx_milestone_status ON "Milestone"(status);
CREATE INDEX idx_milestone_due_date ON "Milestone"(due_date);

-- --------------------------------------------------------
-- Moderation & audit
-- --------------------------------------------------------

CREATE TABLE "Report" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_report_reporter_id ON "Report"(reporter_id);
CREATE INDEX idx_report_target ON "Report"(target_type, target_id);
CREATE INDEX idx_report_status ON "Report"(status);

CREATE TABLE "AuditEvent" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES "User"(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_event_actor_id ON "AuditEvent"(actor_id);
CREATE INDEX idx_audit_event_action ON "AuditEvent"(action);
CREATE INDEX idx_audit_event_entity ON "AuditEvent"(entity_type, entity_id);
CREATE INDEX idx_audit_event_created_at ON "AuditEvent"(created_at);

-- --------------------------------------------------------
-- Check constraints
-- --------------------------------------------------------

ALTER TABLE "Project"
    ADD CONSTRAINT chk_project_budget_range
    CHECK (budget_min_cents IS NULL OR budget_max_cents IS NULL OR budget_min_cents <= budget_max_cents);

ALTER TABLE "Project"
    ADD CONSTRAINT chk_project_budget_positive
    CHECK (budget_min_cents IS NULL OR budget_min_cents >= 0)
    CHECK (budget_max_cents IS NULL OR budget_max_cents >= 0);

ALTER TABLE "Contract"
    ADD CONSTRAINT chk_contract_price_positive
    CHECK (agreed_price_cents >= 0);

ALTER TABLE "Milestone"
    ADD CONSTRAINT chk_milestone_amount_positive
    CHECK (amount_cents IS NULL OR amount_cents >= 0);

-- --------------------------------------------------------
-- Comments for documentation
-- --------------------------------------------------------

COMMENT ON TABLE "User" IS 'Authentication identity, account status, and system role.';
COMMENT ON TABLE "FreelancerProfile" IS 'Professional details for freelancer users.';
COMMENT ON TABLE "ClientProfile" IS 'Client or organization details.';
COMMENT ON TABLE "Skill" IS 'Normalized, searchable skill tags.';
COMMENT ON TABLE "Project" IS 'Published job with requirements, budget, and lifecycle.';
COMMENT ON TABLE "Proposal" IS 'Freelancer offer to complete a project.';
COMMENT ON TABLE "Contract" IS 'Agreed engagement between a client and freelancer.';
COMMENT ON TABLE "Milestone" IS 'Contract deliverable, amount, deadline, and state.';
COMMENT ON TABLE "PortfolioItem" IS 'Evidence of skills and completed work.';
COMMENT ON TABLE "AuthToken" IS 'Password reset and email verification tokens.';
COMMENT ON TABLE "Session" IS 'Authenticated user sessions.';
COMMENT ON TABLE "Report" IS 'User-submitted abuse or safety reports.';
COMMENT ON TABLE "AuditEvent" IS 'Important administrative and business events.';

COMMENT ON COLUMN "Project"."budget_min_cents" IS 'Budget minimum in minor units (cents). Never floating point.';
COMMENT ON COLUMN "Project"."budget_max_cents" IS 'Budget maximum in minor units (cents). Never floating point.';
COMMENT ON COLUMN "Contract"."agreed_price_cents" IS 'Agreed price in minor units (cents). Never floating point.';
COMMENT ON COLUMN "Milestone"."amount_cents" IS 'Milestone amount in minor units (cents). Never floating point.';
