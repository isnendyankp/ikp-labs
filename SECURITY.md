# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest (main) | ✅ |
| Older branches | ❌ |

Only the latest version on `main` receives security fixes.

---

## Reporting a Vulnerability

If you discover a security vulnerability in IKP-Labs or the live application at [kameravue.com](https://kameravue.com), **please do not open a public GitHub issue.**

### How to Report

Send an email to: **isnendyankp@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

### What to Expect

- **Acknowledgement** within 48 hours
- **Status update** within 7 days
- Credit in the fix commit if you'd like

---

## Scope

### In Scope
- Authentication bypass (JWT, session)
- SQL injection or data exposure
- XSS or CSRF vulnerabilities
- Sensitive data leakage via API endpoints
- Unauthorized access to private photos or user data

### Out of Scope
- Issues in development environment only
- Theoretical vulnerabilities without proof of concept
- Social engineering attacks
- Denial of service (DoS)

---

## Security Principles

This project follows **Principle 7: Security by Default** from [`governance/principles/general.md`](governance/principles/general.md):

- Passwords hashed with BCrypt
- JWT tokens with expiry validation
- CORS configured per environment
- No secrets committed to the repository
- Input validation on both frontend and backend

---

**Contact**: isnendyankp@gmail.com
**Live App**: [kameravue.com](https://kameravue.com)
