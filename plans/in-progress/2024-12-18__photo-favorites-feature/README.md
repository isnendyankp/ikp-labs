# Photo Favorites Feature - Planning Documents

**Last Updated:** December 18, 2024
**Status:** 📋 Planning Complete, Ready for Implementation
**Timeline:** December 19-23, 2024 (5 days: Thursday-Monday)

---

## Quick Navigation

**Start Here:**
1. 📄 **[Requirements](requirements.md)** ← **READ THIS FIRST**
   - Feature scope & user stories
   - What's in/out
   - Success criteria

**Implementation Details:**
2. 🔧 **[Technical Design](technical-design.md)**
   - Database schema (photo_favorites table)
   - API endpoints (3 endpoints)
   - Backend & Frontend architecture
   - Testing strategy (4 types)

3. ✅ **[Daily Checklist](checklist.md)**
   - Thursday-Monday breakdown
   - Task list with checkboxes
   - Progress tracking
   - Commit message templates

---

## Document Purpose

### 1. Requirements Document
**Who:** Product owner, developers, stakeholders
**Purpose:** Understand WHAT we're building and WHY
**Length:** ~15 min read

**Contains:**
- Feature overview
- Scope (In/Out items clearly defined)
- User stories
- Success criteria

**Use When:**
- Need to understand feature goals
- Making scope decisions
- Explaining to others

---

### 2. Technical Design Document
**Who:** Developers implementing the feature
**Purpose:** Technical blueprint for implementation
**Length:** ~25 min read

**Contains:**
- Database schema (SQL)
- API endpoint specifications
- Entity/Service/Controller design
- Frontend component architecture
- Testing strategy (Unit, Integration, API, E2E)

**Use When:**
- Writing backend code
- Designing frontend components
- Planning test cases

---

### 3. Daily Checklist Document
**Who:** Everyone on the team
**Purpose:** Track daily progress
**Length:** Living document (update daily)

**Contains:**
- Thursday-Monday daily breakdown
- Task list with checkboxes
- Commit message templates
- Progress tracking

**Use When:**
- Daily standup
- Planning your day
- End-of-day review
- Tracking completion

---

## How to Use These Plans

### For Today (Thursday - Planning Day)

**Step 1:** Read [Requirements](requirements.md)
- Understand feature scope
- Review user stories
- Confirm success criteria

**Step 2:** Review [Technical Design](technical-design.md)
- Study database schema
- Understand API design
- Review testing strategy

**Step 3:** Open [Daily Checklist](checklist.md)
- See today's tasks (Thursday)
- Plan your implementation order
- Prepare development environment

---

### For Implementation Days (Friday-Monday)

**Each Morning:**
1. Open [Daily Checklist](checklist.md)
2. Review today's planned tasks
3. Check dependencies from previous days

**While Coding:**
1. Reference [Technical Design](technical-design.md) for specs
2. Follow API specifications exactly
3. Check off tasks as you complete them

**End of Day:**
1. Update checklist with completed tasks
2. Commit & push with provided templates (ATOMIC COMMITS!)
3. Note any blockers
4. Preview tomorrow's tasks

---

## Timeline Overview

### Week Schedule (December 19-23, 2024)

| Day | Date | Focus | Deliverables | Hours |
|-----|------|-------|--------------|-------|
| **Thu** | Dec 19 | Backend Foundation + Gherkin | Database + 2 Gherkin specs | 6-7h |
| **Fri** | Dec 20 | Backend APIs + API Tests | Service + Controller + 8 API tests | 7-8h |
| **Sat** | Dec 21 | Unit + Integration Tests | 8 unit + 6 integration tests | 6-7h |
| **Sun** | Dec 22 | Frontend Implementation | Components + Pages | 7-8h |
| **Mon** | Dec 23 | E2E Tests + Polish | 10 E2E tests + Docs | 7-8h |
| **Tue** | Dec 24 | LinkedIn Post (Optional) | Feature announcement | 1-2h |

**Total Implementation Time:** 33-38 hours over 5 days

---

## Feature Summary

### What We're Building

**Photo Favorites Feature** - Personal bookmarking system allowing users to save photos for later viewing.

**Core Functionality:**
- ⭐ Favorite any photo (public or own)
- 🔖 Unfavorite photos you've saved
- 📋 View all your favorited photos in dedicated page
- 🔒 Private collection (only you can see your favorites)
- ⚡ Optimistic UI updates (instant feedback)

**Scope:** Photo Favorites ONLY (Likes feature completed last week)

---

## Key Differences: Favorites vs Likes

### Likes Feature (Already Completed) ❤️
- **Purpose:** Social engagement & appreciation
- **Visibility:** PUBLIC - everyone can see like count
- **Icon:** Heart ❤️
- **Business Rule:** Cannot like own photos
- **Use Case:** "I appreciate this photo!"

### Favorites Feature (This Week) ⭐
- **Purpose:** Personal bookmarks & saving for later
- **Visibility:** PRIVATE - only you see your favorites
- **Icon:** Star ⭐
- **Business Rule:** CAN favorite own photos
- **Use Case:** "I want to save this for later!"

**Both features work together** - You can like AND favorite the same photo!

---

## Testing Strategy

### 4 Types of Testing (32 tests total)

**1. Unit Tests (8 tests)**
- File: `PhotoFavoriteServiceTest.java`
- Database: ❌ NO (all mocked)
- Purpose: Test business logic in isolation

**2. Integration Tests (6 tests)**
- File: `PhotoFavoriteControllerIntegrationTest.java`
- Database: ❌ NO (MockBean)
- Purpose: Test Controller + Service interaction

**3. API Tests (8 tests)**
- File: `tests/api/photo-favorites.api.spec.ts`
- Database: ✅ YES (Real PostgreSQL)
- Tool: **Playwright API** (automated, not manual Postman!)
- Purpose: Test full backend cycle

**4. E2E Tests (10 tests)**
- File: `tests/e2e/photo-favorites.spec.ts`
- Database: ✅ YES (Real PostgreSQL)
- Tool: Playwright browser automation
- Purpose: Test full FE + BE flow

---

## Key Metrics

**Project Scope:**
- **API Endpoints:** 3 (POST /favorite, DELETE /favorite, GET /favorited-photos)
- **Database Tables:** 1 new (photo_favorites)
- **Frontend Components:** 2 new (FavoriteButton, FavoritedPhotosPage)
- **Tests:** 32 total (4 types)
- **Gherkin Scenarios:** 12 scenarios
- **Estimated Duration:** 5 days

**Current Progress:**
- **Planning:** ✅ 100% Complete
- **Backend:** ⏳ Not Started (0%)
- **Frontend:** ⏳ Not Started (0%)
- **Testing:** ⏳ Not Started (0%)
- **Docs:** ⏳ Not Started (0%)

**Overall:** 0% (Ready to start!)

---

## Related Documentation

**Gherkin Specifications:**
- 🆕 [Photo Favorites Gherkin Spec](../../../specs/gallery/photo-favorites.feature) - 12 scenarios (NEW)

**Similar Features (for reference):**
- [Photo Likes Feature Plan](../../done/2024-12-10__photo-likes-feature/) - Similar CRUD pattern
- [Gallery Feature Plan](../../done/photo-gallery-feature/) - Similar pagination pattern

**Project Documentation:**
- [Feature Roadmap](../../../docs/explanation/feature-roadmap-recommendations.md) - Overall roadmap
- [Test Plan Checklist Strategy](../../../docs/explanation/testing/test-plan-checklist-strategy.md) - Testing methodology

---

## Success Criteria

### Feature Completion

✅ **Functionality:**
- Users can favorite any photo (public or own)
- Users can unfavorite photos they've saved
- Favorited Photos page shows all user's favorited photos with pagination
- Favorites are private (only user can see their own)
- Optimistic UI updates work (instant feedback before API confirms)
- Error handling for all edge cases

✅ **Quality:**
- 32 tests with 100% pass rate (all 4 types)
- No duplicate favorites (database constraint enforced)
- Clean code following project conventions
- Proper error messages for users

✅ **Documentation:**
- All planning docs complete
- Gherkin specs align with implementation
- API documentation updated
- README updated with feature

✅ **Portfolio:**
- 10 atomic commits (good GitHub activity)
- Professional commit messages
- LinkedIn post ready for Tuesday (optional)

---

## Atomic Commit Strategy

### 10 Commits Over 5 Days (2 commits/day)

**Thursday:**
1. `feat(db): add photo_favorites table with migration`
2. `docs(gherkin): add spec for photo favorites feature`

**Friday:**
3. `feat(backend): add PhotoFavoriteService with business logic`
4. `test(api): add automated photo favorites API tests (8 tests)`

**Saturday:**
5. `test(unit): add PhotoFavoriteService unit tests (8 tests)`
6. `test(integration): add PhotoFavoriteController integration tests (6 tests)`

**Sunday:**
7. `feat(ui): add FavoriteButton component with optimistic updates`
8. `feat(ui): add FavoritedPhotosPage and integrate favorite functionality`

**Monday:**
9. `test(e2e): add photo favorites E2E tests (10 scenarios)`
10. `docs(readme): update with photo favorites feature`

**Result:** Consistent GitHub activity visible to recruiters! 📈

**IMPORTANT:** Each commit is pushed individually (1 commit at a time) for:
- ✅ Better git history for recovery
- ✅ More GitHub activity (looks good to recruiters!)
- ✅ Easier code review
- ✅ Atomic changes (easy to revert if needed)

---

## LinkedIn Post Preparation (Tuesday - Optional)

After completing Monday, prepare LinkedIn post with:

**Metrics to Highlight:**
- ✅ 32 tests across 4 types (Unit, Integration, API, E2E)
- ✅ 3 new REST API endpoints
- ✅ 12 Gherkin BDD scenarios
- ✅ 100% test pass rate
- ✅ Private bookmarking system
- ✅ Works alongside Likes feature

**Technical Highlights:**
- Spring Boot + React integration
- Playwright API testing (automated!)
- Database constraints for data integrity
- Component-based architecture
- Privacy-focused design

**Visuals:**
- Screenshot of favorite button in action
- GIF of optimistic update behavior
- Screenshot of Favorited Photos page
- Comparison with Likes feature

**Hashtags:**
#FullStackDevelopment #ReactJS #SpringBoot #Testing #WebDevelopment #SoftwareEngineering #PostgreSQL #Playwright

---

## Next Steps

**Today (Thursday):**
1. ✅ Review all planning documents
2. ⏳ Set up development environment
3. ⏳ Create database migration
4. ⏳ Create Gherkin specs
5. ⏳ Commit & push (2 atomic commits)

**Tomorrow (Friday):**
- Implement backend service & APIs
- Write Playwright API tests (automated)

**See [Daily Checklist](checklist.md) for detailed task breakdown!**

---

## Document Status

| Document | Status | Last Updated | Purpose |
|----------|--------|--------------|---------|
| [README.md](README.md) | ✅ Complete | Dec 18, 2024 | Navigation & overview |
| [requirements.md](requirements.md) | ✅ Complete | Dec 18, 2024 | Feature scope & stories |
| [technical-design.md](technical-design.md) | ✅ Complete | Dec 18, 2024 | Architecture & specs |
| [checklist.md](checklist.md) | ✅ Complete | Dec 18, 2024 | Daily task tracking |

**Total Planning Documentation:** ~50 pages

---

## Contact & Questions

**Questions About:**
- **Feature Scope:** Review [Requirements](requirements.md)
- **Technical Implementation:** Review [Technical Design](technical-design.md)
- **Daily Tasks:** Check [Daily Checklist](checklist.md)
- **Testing Strategy:** See Technical Design - Testing section

**Blockers?**
- Document blockers in Daily Checklist
- Ask questions early
- Adjust plan if needed

---

**Next Action:** Read [Requirements Document](requirements.md) to understand feature scope! 🚀

Good luck with the implementation! You got this! 💪
