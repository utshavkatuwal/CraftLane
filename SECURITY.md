# Craftlane — Security

## Supported Versions

Craftlane is in early development (Phase 1: project foundation). There are no
released versions. The frontend is a pre-alpha implementation that is not
connected to a production backend. Do not use Craftlane in production.

## Reporting a Vulnerability

Craftlane does not yet have a dedicated security contact or private reporting
channel. If you discover a security vulnerability, please do not publicly
disclose it until it has been remediated.

To report a vulnerability, contact the project maintainer through the
repository's issue tracker or other established contact method, marking the
report as confidential. Include as much of the following information as
possible:

- A clear description of the vulnerability and its impact
- Steps to reproduce the issue
- The affected component(s) and version(s)
- Any potential mitigations or workarounds

## Secret Management

- Never commit secrets, passwords, private keys, or credentials to the
  repository.
- Frontend configuration that is exposed to the browser must use `VITE_*`
  environment variables only. Never place backend secrets, JWT signing keys,
  payment provider credentials, or database connection strings in `VITE_*`
  variables.
- Local `.env` files are gitignored and must not be committed.

## Dependency Updates

Keep dependencies up to date and run `npm audit` regularly to check for
known vulnerabilities. The frontend dependency list is intentionally small to
minimize the attack surface.

## Frontend Security Practices

The Craftlane frontend follows these security boundaries:

- No secrets or credentials are stored in frontend source code or
  `VITE_*` variables.
- No passwords or authentication tokens are stored in localStorage,
  sessionStorage, or other browser-persistent state.
- All API responses are treated as untrusted input.
- `dangerouslySetInnerHTML` is not used.
- Client-side validation is never trusted as the sole validation layer;
  the backend enforces all authorization and business rules.
- Hiding a UI element does not enforce authorization.

## Important Limitation

Frontend security controls do not replace backend authorization.
Authentication, authorization, data validation, and business-rule enforcement
must be implemented and enforced by the backend. The frontend is a
presentation layer only.
