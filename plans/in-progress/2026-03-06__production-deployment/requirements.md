# Production Deployment - Detailed Requirements

**Plan**: Production Deployment - VPS
**Version**: 1.0
**Last Updated**: March 6, 2026

---

## Table of Contents

1. [Frontend Code Requirements](#frontend-code-requirements)
2. [Nginx Requirements](#nginx-requirements)
3. [SSL Certificate Requirements](#ssl-certificate-requirements)
4. [PM2 Requirements](#pm2-requirements)
5. [Testing Requirements](#testing-requirements)

---

## Frontend Code Requirements

### FE-1: Environment Variables

**Requirement**: API URLs must be configurable via environment variables

**Current State**:
```typescript
// frontend/src/lib/apiClient.ts
const API_BASE_URL = "http://localhost:8081"; // HARDCODED

// frontend/src/services/api.ts
const API_BASE_URL = "http://localhost:8081"; // HARDCODED
```

**Target State**:
```typescript
// Use environment variable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
```

**Files to Modify**:
- `frontend/src/lib/apiClient.ts`
- `frontend/src/services/api.ts`
- `frontend/src/services/galleryService.ts`
- `frontend/src/services/profileService.ts`
- `frontend/src/services/photoLikeService.ts`
- `frontend/src/services/photoFavoriteService.ts`

**Acceptance Criteria**:
- [ ] All hardcoded localhost URLs replaced
- [ ] Environment variable `NEXT_PUBLIC_API_URL` used
- [ ] Fallback to localhost for development
- [ ] No breaking changes to local development

---

### FE-2: Environment Configuration Files

**Requirement**: Production environment configuration file must exist

**Files to Create**:
- `frontend/.env.production` (local, not committed)

**Content**:
```bash
NEXT_PUBLIC_API_URL=https://api.kameravue.com
```

**Acceptance Criteria**:
- [ ] `.env.production` file created
- [ ] File added to `.gitignore` (if contains secrets)
- [ ] Environment variable loaded correctly

---

## Nginx Requirements

### NGINX-1: Frontend Virtual Host

**Requirement**: Nginx must serve frontend at kameravue.com

**Configuration**:
```nginx
server {
    listen 80;
    server_name kameravue.com www.kameravue.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Acceptance Criteria**:
- [ ] Virtual host file created at `/etc/nginx/sites-available/kameravue.com`
- [ ] Symlink created in `/etc/nginx/sites-enabled/`
- [ ] Nginx config test passes (`sudo nginx -t`)
- [ ] Nginx reloaded successfully

---

### NGINX-2: Backend API Virtual Host

**Requirement**: Nginx must proxy backend API at api.kameravue.com

**Configuration**:
```nginx
server {
    listen 80;
    server_name api.kameravue.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Acceptance Criteria**:
- [ ] Virtual host file created at `/etc/nginx/sites-available/api.kameravue.com`
- [ ] Symlink created in `/etc/nginx/sites-enabled/`
- [ ] Nginx config test passes
- [ ] API accessible via api.kameravue.com

---

### NGINX-3: Gzip Compression

**Requirement**: Gzip compression must be enabled for better performance

**Configuration**:
```nginx
gzip on;
gzip_comp_level 6;
gzip_min_length 1000;
gzip_types text/plain text/css application/javascript application/json image/svg+xml;
```

**Acceptance Criteria**:
- [ ] Gzip enabled in Nginx config
- [ ] Compression level set to 6 (balance)
- [ ] Static assets not compressed (images already compressed)

---

## SSL Certificate Requirements

### SSL-1: Certbot Installation

**Requirement**: Certbot must be installed for SSL certificates

**Installation**:
```bash
sudo apt install certbot python3-certbot-nginx
```

**Acceptance Criteria**:
- [ ] Certbot installed
- [ ] Nginx plugin installed

---

### SSL-2: SSL Certificate Generation

**Requirement**: SSL certificates must be generated for both domains

**Domains**:
- kameravue.com
- www.kameravue.com
- api.kameravue.com

**Command**:
```bash
sudo certbot --nginx -d kameravue.com -d www.kameravue.com -d api.kameravue.com
```

**Acceptance Criteria**:
- [ ] SSL certificate generated successfully
- [ ] HTTPS working for all domains
- [ ] Nginx config updated by Certbot

---

### SSL-3: Auto-Renewal

**Requirement**: SSL certificates must auto-renew

**Setup**:
```bash
sudo systemctl status certbot.timer
sudo certbot renew --dry-run
```

**Acceptance Criteria**:
- [ ] Certbot timer active
- [ ] Dry-run renewal successful

---

## PM2 Requirements

### PM2-1: Frontend Process Management

**Requirement**: Frontend must run as PM2 process

**Commands**:
```bash
pm2 start npm --name "ikp-labs-frontend" -- start
pm2 save
pm2 startup
```

**Acceptance Criteria**:
- [ ] Frontend running as PM2 process
- [ ] Process auto-starts on server reboot
- [ ] Process name is `ikp-labs-frontend`

---

### PM2-2: Backend Process Management

**Requirement**: Backend must run as PM2 process

**Commands**:
```bash
pm2 start ikp-labs-api-1.0.0.jar --name "ikp-labs-backend"
pm2 save
```

**Acceptance Criteria**:
- [ ] Backend running as PM2 process
- [ ] Process auto-starts on server reboot
- [ ] Process name is `ikp-labs-backend`

---

## Testing Requirements

### TEST-1: Local Tests Must Pass

**Requirement**: All tests must pass locally before deployment

**Test Commands**:
```bash
# Frontend
cd frontend && npm run lint:check
cd frontend && npm run test

# Backend
cd backend/ikp-labs-api && mvn test
```

**Acceptance Criteria**:
- [ ] Frontend lint passes
- [ ] Frontend unit tests pass
- [ ] Backend unit tests pass
- [ ] Backend integration tests pass

---

### TEST-2: Production Verification

**Requirement**: Production must be verified after deployment

**Verification Steps**:
1. Frontend loads at https://kameravue.com
2. API health check at https://api.kameravue.com/api/auth/health
3. User registration works
4. User login works
5. SSL certificate valid

**Acceptance Criteria**:
- [ ] All verification steps pass
- [ ] No console errors in browser
- [ ] API returns expected responses

---

## Acceptance Criteria Summary

### Must Pass (P0)
- [ ] All hardcoded localhost URLs replaced
- [ ] Frontend deployed to VPS
- [ ] Nginx configured for both domains
- [ ] SSL certificates installed
- [ ] All local tests pass
- [ ] Production verification passes

### Should Pass (P1)
- [ ] Gzip compression enabled
- [ ] PM2 auto-restart configured
- [ ] HTTP redirects to HTTPS

---

**Requirements Version**: 1.0
**Last Updated**: March 6, 2026
