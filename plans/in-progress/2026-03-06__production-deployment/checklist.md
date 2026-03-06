# Production Deployment - Implementation Checklist

## Status Legend
- [ ] Not started
- [🔄] In progress
- [✅] Completed
- [⏸️] Blocked/Waiting

---

## Phase 1: Code Changes (Local)

### Task 1.1: Update API URLs to Environment Variables
**Estimated Time**: 30 minutes

**Files to Modify**:
- `frontend/src/lib/apiClient.ts`
- `frontend/src/services/api.ts`
- `frontend/src/services/galleryService.ts`
- `frontend/src/services/profileService.ts`
- `frontend/src/services/photoLikeService.ts`
- `frontend/src/services/photoFavoriteService.ts`

**Steps**:
1. [ ] Read current implementation in each file
2. [ ] Replace hardcoded `localhost:8081` with `process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081"`
3. [ ] Verify no other hardcoded URLs exist
4. [ ] **COMMIT**: "refactor(fe): use environment variable for API URL"

**Acceptance Criteria**:
- [ ] All 6 files updated
- [ ] Fallback to localhost for development
- [ ] No hardcoded production URLs

---

### Task 1.2: Create Production Environment File
**Estimated Time**: 10 minutes

**File to Create**:
- `frontend/.env.production` (local only, not committed)

**Content**:
```bash
NEXT_PUBLIC_API_URL=https://api.kameravue.com
```

**Steps**:
1. [ ] Create `.env.production` file
2. [ ] Add NEXT_PUBLIC_API_URL
3. [ ] Verify `.env*.local` is in .gitignore

**Acceptance Criteria**:
- [ ] File created locally
- [ ] Not committed to git
- [ ] Variable correctly named

---

## Phase 2: Local Testing

### Task 2.1: Run Frontend Lint
**Estimated Time**: 5 minutes

**Command**:
```bash
cd frontend && npm run lint:check
```

**Steps**:
1. [ ] Run lint command
2. [ ] Fix any errors if found
3. [ ] Verify all warnings resolved

**Acceptance Criteria**:
- [ ] Lint passes with 0 warnings
- [ ] No errors

---

### Task 2.2: Run Frontend Unit Tests
**Estimated Time**: 10 minutes

**Command**:
```bash
cd frontend && npm run test
```

**Steps**:
1. [ ] Run test command
2. [ ] Verify all tests pass
3. [ ] Check coverage if needed

**Acceptance Criteria**:
- [ ] All tests pass
- [ ] No failures

---

### Task 2.3: Run Backend Tests
**Estimated Time**: 15 minutes

**Command**:
```bash
cd backend/ikp-labs-api && mvn test
```

**Steps**:
1. [ ] Run Maven test
2. [ ] Verify all tests pass
3. [ ] Check for any errors

**Acceptance Criteria**:
- [ ] All tests pass (298 tests expected)
- [ ] No failures

---

### Task 2.4: Manual Integration Test (Local)
**Estimated Time**: 15 minutes

**Steps**:
1. [ ] Start PostgreSQL (if not running)
2. [ ] Start backend: `mvn spring-boot:run`
3. [ ] Start frontend: `npm run dev`
4. [ ] Test registration flow
5. [ ] Test login flow
6. [ ] Verify API calls work

**Acceptance Criteria**:
- [ ] Backend starts successfully
- [ ] Frontend starts successfully
- [ ] Registration works
- [ ] Login works
- [ ] No console errors

---

## Phase 3: Commit & Push

### Task 3.1: Commit Changes
**Estimated Time**: 10 minutes

**Steps**:
1. [ ] Review all changes with `git status`
2. [ ] Stage modified files
3. [ ] Commit with message: "feat: configure production API URL via environment variable"
4. [ ] Verify commit

**Acceptance Criteria**:
- [ ] All changes committed
- [ ] Commit message follows convention
- [ ] On work branch `feature/production-deployment`

---

### Task 3.2: Push to Remote
**Estimated Time**: 5 minutes

**Command**:
```bash
git push -u origin feature/production-deployment
```

**Steps**:
1. [ ] Push to remote
2. [ ] Verify push successful

**Acceptance Criteria**:
- [ ] Branch pushed to origin
- [ ] No errors

---

## Phase 4: Server Setup (VPS)

### Task 4.1: Build Frontend on Server
**Estimated Time**: 15 minutes

**Commands**:
```bash
# SSH to server
ssh nendy@170.64.130.3

# Navigate to app directory
cd ~/app

# Clone or pull latest code
git pull origin feature/production-deployment

# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Build for production
NEXT_PUBLIC_API_URL=https://api.kameravue.com npm run build
```

**Steps**:
1. [ ] SSH to VPS
2. [ ] Pull latest code
3. [ ] Install dependencies
4. [ ] Build with production env
5. [ ] Verify build output

**Acceptance Criteria**:
- [ ] Build completes without errors
- [ ] `.next` directory created

---

### Task 4.2: Configure Nginx - Frontend
**Estimated Time**: 15 minutes

**File**: `/etc/nginx/sites-available/kameravue.com`

**Steps**:
1. [ ] Create virtual host file
2. [ ] Add configuration for kameravue.com
3. [ ] Enable site (symlink)
4. [ ] Test Nginx config
5. [ ] **COMMIT**: (documentation update)

**Acceptance Criteria**:
- [ ] Virtual host created
- [ ] Symlink in sites-enabled
- [ ] `sudo nginx -t` passes

---

### Task 4.3: Configure Nginx - Backend API
**Estimated Time**: 15 minutes

**File**: `/etc/nginx/sites-available/api.kameravue.com`

**Steps**:
1. [ ] Create virtual host file
2. [ ] Add configuration for api.kameravue.com
3. [ ] Enable site (symlink)
4. [ ] Test Nginx config
5. [ ] Reload Nginx

**Acceptance Criteria**:
- [ ] Virtual host created
- [ ] Symlink in sites-enabled
- [ ] `sudo nginx -t` passes
- [ ] `sudo systemctl reload nginx` successful

---

### Task 4.4: Install SSL Certificates
**Estimated Time**: 15 minutes

**Commands**:
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificates
sudo certbot --nginx -d kameravue.com -d www.kameravue.com -d api.kameravue.com

# Test auto-renewal
sudo certbot renew --dry-run
```

**Steps**:
1. [ ] Install Certbot
2. [ ] Generate SSL certificates
3. [ ] Verify HTTPS works
4. [ ] Test auto-renewal

**Acceptance Criteria**:
- [ ] Certbot installed
- [ ] Certificates generated for all domains
- [ ] HTTPS works
- [ ] Auto-renewal configured

---

### Task 4.5: Start Services with PM2
**Estimated Time**: 10 minutes

**Commands**:
```bash
# Start backend (if not running)
cd ~/app
pm2 start ikp-labs-api-1.0.0.jar --name "ikp-labs-backend"

# Start frontend
cd ~/app/frontend
pm2 start npm --name "ikp-labs-frontend" -- start

# Save PM2 config
pm2 save

# Setup startup
pm2 startup
```

**Steps**:
1. [ ] Start backend with PM2
2. [ ] Start frontend with PM2
3. [ ] Save PM2 configuration
4. [ ] Configure startup script

**Acceptance Criteria**:
- [ ] Both services running
- [ ] PM2 list shows both processes
- [ ] Auto-start configured

---

## Phase 5: Production Verification

### Task 5.1: Verify Frontend
**Estimated Time**: 10 minutes

**URLs to Test**:
- https://kameravue.com
- https://www.kameravue.com

**Steps**:
1. [ ] Open frontend in browser
2. [ ] Check SSL certificate valid
3. [ ] Verify no console errors
4. [ ] Check HTTP redirects to HTTPS

**Acceptance Criteria**:
- [ ] Frontend loads
- [ ] SSL valid
- [ ] No console errors
- [ ] HTTP → HTTPS redirect works

---

### Task 5.2: Verify Backend API
**Estimated Time**: 10 minutes

**URLs to Test**:
- https://api.kameravue.com/api/auth/health

**Steps**:
1. [ ] Test health endpoint
2. [ ] Test registration endpoint
3. [ ] Verify SSL valid
4. [ ] Check CORS headers

**Acceptance Criteria**:
- [ ] Health check returns OK
- [ ] Registration works
- [ ] SSL valid
- [ ] CORS configured correctly

---

### Task 5.3: End-to-End Test
**Estimated Time**: 15 minutes

**Steps**:
1. [ ] Register new user
2. [ ] Login with new user
3. [ ] Access protected routes
4. [ ] Test API integration from frontend

**Acceptance Criteria**:
- [ ] Registration flow works
- [ ] Login flow works
- [ ] Protected routes accessible
- [ ] Frontend can call backend API

---

## Phase 6: Create PR & Merge

### Task 6.1: Create Pull Request
**Estimated Time**: 10 minutes

**Steps**:
1. [ ] Go to GitHub
2. [ ] Create PR from `feature/production-deployment` to `main`
3. [ ] Add concise description
4. [ ] Wait for CI checks

**PR Title**: "feat: configure production deployment with environment variables"

**PR Body** (concise):
```markdown
## Summary
- Replace hardcoded localhost URLs with environment variable
- Configure API URL for production (api.kameravue.com)

## Changes
- Updated 6 frontend files to use `NEXT_PUBLIC_API_URL`
- Fallback to localhost for development

## Test Plan
- [x] Frontend lint passes
- [x] Frontend tests pass
- [x] Backend tests pass
- [x] Manual testing complete
```

**Acceptance Criteria**:
- [ ] PR created
- [ ] CI checks pass
- [ ] Ready to merge

---

### Task 6.2: Merge with Rebase
**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Click "Rebase and Merge"
2. [ ] Confirm merge
3. [ ] Delete branch after merge

**Acceptance Criteria**:
- [ ] Merged with rebase (preserves commits)
- [ ] Branch deleted

---

### Task 6.3: Update Local Main
**Estimated Time**: 5 minutes

**Commands**:
```bash
git checkout main
git pull origin main
```

**Steps**:
1. [ ] Switch to main
2. [ ] Pull latest changes
3. [ ] Verify code is updated

**Acceptance Criteria**:
- [ ] On main branch
- [ ] Code updated with merge

---

## Phase 7: Update Plan

### Task 7.1: Move Plan to Done
**Estimated Time**: 5 minutes

**Steps**:
1. [ ] Update checklist with completion status
2. [ ] Move plan folder from `in-progress` to `done`
3. [ ] Commit plan update

**Acceptance Criteria**:
- [ ] Checklist fully updated
- [ ] Plan moved to done folder
- [ ] Committed

---

## Success Criteria Summary

### Must Have (P0)
- [ ] All hardcoded URLs replaced
- [ ] All local tests pass
- [ ] PR merged to main
- [ ] Frontend accessible at https://kameravue.com
- [ ] Backend accessible at https://api.kameravue.com
- [ ] SSL certificates installed

### Should Have (P1)
- [ ] HTTP → HTTPS redirect
- [ ] PM2 auto-start configured
- [ ] Gzip compression enabled

---

**Checklist Version**: 1.0
**Created**: March 6, 2026
**Last Updated**: March 6, 2026
**Estimated Total Time**: 3-4 hours
