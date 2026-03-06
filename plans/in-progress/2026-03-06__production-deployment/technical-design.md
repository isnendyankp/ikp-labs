# Production Deployment - Technical Design

**Plan**: Production Deployment - VPS
**Version**: 1.0
**Last Updated**: March 6, 2026

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Frontend Configuration](#frontend-configuration)
3. [Nginx Configuration](#nginx-configuration)
4. [SSL Configuration](#ssl-configuration)
5. [PM2 Configuration](#pm2-configuration)
6. [Security Considerations](#security-considerations)

---

## Architecture Overview

### Current Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    User's MacBook (Local)                    │
│  ┌─────────────────┐         ┌─────────────────┐           │
│  │   Next.js FE    │ ──────> │  Spring Boot BE │           │
│  │ localhost:3002  │         │  localhost:8081 │           │
│  └─────────────────┘         └─────────────────┘           │
└─────────────────────────────────────────────────────────────┘
```

### Target Architecture

```
                    ┌─────────────────────────────────────┐
                    │         Internet Users               │
                    │      https://kameravue.com          │
                    └─────────────────┬───────────────────┘
                                      │
                                      ▼
                    ┌─────────────────────────────────────┐
                    │        Nginx (Port 80/443)          │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ kameravue.com               │   │
                    │  │ → proxy_pass localhost:3002 │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  ┌─────────────────────────────┐   │
                    │  │ api.kameravue.com           │   │
                    │  │ → proxy_pass localhost:8080 │   │
                    │  └─────────────────────────────┘   │
                    │                                     │
                    │  Features:                          │
                    │  - SSL termination                  │
                    │  - Gzip compression                 │
                    │  - Reverse proxy                    │
                    └─────────────────┬───────────────────┘
                                      │
                    ┌─────────────────┴───────────────────┐
                    │                                     │
                    ▼                                     ▼
        ┌───────────────────┐             ┌───────────────────┐
        │   Next.js FE      │             │   Spring Boot BE  │
        │   PM2: ikp-fe     │             │   PM2: ikp-be     │
        │   Port 3002       │             │   Port 8080       │
        └───────────────────┘             └───────────────────┘
                                                    │
                                                    ▼
                                        ┌───────────────────┐
                                        │   PostgreSQL 16   │
                                        │   Port 5432       │
                                        │   DB: ikp_labs    │
                                        └───────────────────┘
```

### Server Details

| Component | Specification |
|-----------|--------------|
| Provider | DigitalOcean Droplet |
| IP Address | 170.64.130.3 |
| OS | Ubuntu 24.04 LTS |
| Region | Sydney, Australia |
| RAM | 1 GB |
| CPU | 1 vCPU |
| Storage | 25 GB SSD |
| Cost | $4/month |

---

## Frontend Configuration

### Environment Variables

**File**: `frontend/.env.production` (on server)

```bash
# Production API URL
NEXT_PUBLIC_API_URL=https://api.kameravue.com
```

**File**: `frontend/.env.development` (local, already exists)

```bash
# Development API URL
NEXT_PUBLIC_API_URL=http://localhost:8081
```

### Code Changes

**Before** (`frontend/src/lib/apiClient.ts`):
```typescript
const API_BASE_URL = "http://localhost:8081";
```

**After**:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";
```

### Build Command

```bash
# On local machine (for testing)
cd frontend
npm run build

# On server
cd ~/app/frontend
npm run build
```

### PM2 Configuration

**File**: `frontend/ecosystem.config.js` (to be created on server)

```javascript
module.exports = {
  apps: [{
    name: 'ikp-labs-frontend',
    script: 'npm',
    args: 'start',
    cwd: '/home/nendy/app/frontend',
    env: {
      NODE_ENV: 'production',
      PORT: 3002
    }
  }]
};
```

---

## Nginx Configuration

### Frontend Virtual Host

**File**: `/etc/nginx/sites-available/kameravue.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name kameravue.com www.kameravue.com;

    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain text/css application/javascript application/json image/svg+xml;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Backend Virtual Host

**File**: `/etc/nginx/sites-available/api.kameravue.com`

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name api.kameravue.com;

    # Gzip compression
    gzip on;
    gzip_comp_level 6;
    gzip_min_length 1000;
    gzip_types text/plain application/json;

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

### Enable Sites

```bash
# Create symlinks
sudo ln -s /etc/nginx/sites-available/kameravue.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/api.kameravue.com /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## SSL Configuration

### Certbot Commands

```bash
# Install Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Generate certificates (interactive)
sudo certbot --nginx -d kameravue.com -d www.kameravue.com -d api.kameravue.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Post-SSL Nginx Config

Certbot will automatically modify the Nginx configs to include SSL:

```nginx
server {
    listen 443 ssl http2;
    server_name kameravue.com www.kameravue.com;

    ssl_certificate /etc/letsencrypt/live/kameravue.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kameravue.com/privkey.pem;

    # SSL settings (auto-configured by Certbot)
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ... rest of config
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name kameravue.com www.kameravue.com;
    return 301 https://$server_name$request_uri;
}
```

---

## PM2 Configuration

### Start Commands

```bash
# Start backend
cd ~/app
pm2 start ikp-labs-api-1.0.0.jar --name "ikp-labs-backend"

# Start frontend
cd ~/app/frontend
pm2 start npm --name "ikp-labs-frontend" -- start

# Save PM2 configuration
pm2 save

# Setup startup script (auto-start on reboot)
pm2 startup
```

### PM2 Commands Reference

```bash
# List processes
pm2 list

# Monitor
pm2 monit

# Logs
pm2 logs

# Restart specific
pm2 restart ikp-labs-frontend
pm2 restart ikp-labs-backend

# Restart all
pm2 restart all
```

---

## Security Considerations

### UFW Firewall

Current rules (already configured):
- Port 22 (SSH) - Open
- Port 80 (HTTP) - Open
- Port 443 (HTTPS) - Open
- Port 8080 (Backend) - Should be closed (accessed via Nginx only)

```bash
# Close direct backend access
sudo ufw deny 8080
sudo ufw deny 3002

# Verify
sudo ufw status
```

### Nginx Security Headers

Add to Nginx configs:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
```

### Spring Boot Security

Backend already configured with:
- JWT authentication
- Password hashing (bcrypt)
- CORS configuration (needs update for production)

**Update CORS** in `application-prod.properties`:
```properties
# CORS - Update for production
cors.allowed-origins=https://kameravue.com,https://www.kameravue.com
```

---

## Deployment Checklist Summary

1. [ ] Update frontend code with environment variables
2. [ ] Test locally (lint, tests pass)
3. [ ] Commit and push to work branch
4. [ ] Build frontend on server
5. [ ] Configure Nginx virtual hosts
6. [ ] Install SSL certificates
7. [ ] Configure UFW (close direct ports)
8. [ ] Start services with PM2
9. [ ] Verify production deployment

---

**Technical Design Version**: 1.0
**Last Updated**: March 6, 2026
