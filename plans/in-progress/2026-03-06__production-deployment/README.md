# Production Deployment - VPS

**Status**: In Progress
**Created**: March 6, 2026
**Priority**: P0 (Critical)
**Type**: Deployment

---

## Overview

Deploy IKP-Labs application to production VPS (DigitalOcean) with custom domain kameravue.com. This includes updating hardcoded localhost URLs, configuring Nginx reverse proxy, and installing SSL certificates.

## Problem Statement

Currently, the application uses hardcoded localhost URLs that won't work in production:
- Frontend API calls point to `localhost:8081` instead of production API
- No SSL/HTTPS configured
- Nginx not configured for production domain

**Current State:**
- Backend: Deployed on VPS (170.64.130.3:8080)
- Frontend: Not deployed
- Domain: kameravue.com (DNS configured, pointing to VPS IP)
- SSL: Not installed
- Nginx: Installed but not configured

## Proposed Solution

1. **Update Frontend Code**: Replace hardcoded localhost URLs with environment variables
2. **Deploy Frontend**: Build and deploy Next.js to VPS
3. **Configure Nginx**: Setup reverse proxy for frontend and backend
4. **Install SSL**: Free SSL certificate via Certbot

### Architecture

```
                    ┌─────────────────────────────────────┐
                    │         Internet Users               │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │     Nginx (Port 80/443)             │
                    │   - kameravue.com → Frontend        │
                    │   - api.kameravue.com → Backend     │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────┴───────────────────┐
                    │                                     │
                    ▼                                     ▼
        ┌───────────────────┐             ┌───────────────────┐
        │   Next.js FE      │             │   Spring Boot BE  │
        │   (Port 3002)     │             │   (Port 8080)     │
        └───────────────────┘             └───────────────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────┐
                                        │   PostgreSQL 16   │
                                        │   (Port 5432)     │
                                        └───────────────────┘
```

## Scope

### In-Scope

1. **Frontend Code Changes**
   - Update API URLs from localhost to production
   - Use environment variables for API base URL
   - Files to modify:
     - `frontend/src/lib/apiClient.ts`
     - `frontend/src/services/api.ts`
     - `frontend/src/services/galleryService.ts`
     - `frontend/src/services/profileService.ts`
     - `frontend/src/services/photoLikeService.ts`
     - `frontend/src/services/photoFavoriteService.ts`

2. **Frontend Deployment**
   - Build Next.js production bundle
   - Deploy to VPS
   - Run with PM2

3. **Nginx Configuration**
   - Virtual host for kameravue.com (frontend)
   - Virtual host for api.kameravue.com (backend)
   - Reverse proxy configuration

4. **SSL Certificate**
   - Install Certbot
   - Generate SSL for kameravue.com
   - Generate SSL for api.kameravue.com
   - Configure auto-renewal

### Out-of-Scope

- CI/CD deployment automation (separate task)
- Database migration scripts
- Monitoring/logging setup
- Multiple environments (staging)

## Success Criteria

### Must Have (P0)
- [ ] Frontend accessible at https://kameravue.com
- [ ] Backend API accessible at https://api.kameravue.com
- [ ] SSL certificate installed and working
- [ ] All local tests pass before deployment

### Should Have (P1)
- [ ] HTTP redirects to HTTPS
- [ ] Nginx gzip compression enabled
- [ ] PM2 auto-restart configured

## Technical Details

| Component | Technology | Port |
|-----------|------------|------|
| Frontend | Next.js 15 | 3002 |
| Backend | Spring Boot 3 | 8080 |
| Database | PostgreSQL 16 | 5432 |
| Web Server | Nginx | 80, 443 |
| Process Manager | PM2 | - |

## Server Details

| Item | Value |
|------|-------|
| Provider | DigitalOcean |
| IP | 170.64.130.3 |
| OS | Ubuntu 24.04 LTS |
| Region | Sydney |
| User | nendy |

## Domain Details

| Domain | Type | Target |
|--------|------|--------|
| kameravue.com | A | 170.64.130.3 |
| api.kameravue.com | A | 170.64.130.3 |
| www.kameravue.com | CNAME | kameravue.com |

## Files Overview

- [requirements.md](./requirements.md) - Detailed requirements
- [technical-design.md](./technical-design.md) - Technical configuration details
- [checklist.md](./checklist.md) - Step-by-step implementation checklist

---

**Plan Version**: 1.0
**Last Updated**: March 6, 2026
**Status**: Ready to Start
