# Requirements

## Acceptance Criteria

### AC-1: Add Missing Feature Files to Directory Structure
Tambahkan 3 feature files yang belum terdokumentasi:

| Feature File | Scenarios | Status |
|--------------|-----------|--------|
| `gallery/photo-likes.feature` | 15 | Missing |
| `gallery/photo-sorting.feature` | 28 | Missing |
| `profile/profile-picture.feature` | 15 | Missing |

### AC-2: Add profile/ Folder to Directory Structure
Tambahkan folder baru `profile/` dengan 1 feature file.

### AC-3: Update Playwright Alignment Table
Update tabel untuk menunjukkan bahwa Playwright tests sudah implemented (bukan "planned"):

| Feature File | Playwright Test |
|--------------|-----------------|
| `photo-likes.feature` | `photo-likes.spec.ts` |
| `photo-sorting.feature` | `gallery-sorting.spec.ts` |
| `profile-picture.feature` | `profile-picture.spec.ts` |

### AC-4: Update Total Scenarios
- Current: 63 scenarios (6 feature files)
- After: **121** scenarios (9 feature files)

Calculation: 63 + 15 + 28 + 15 = 121

## Verification
- [ ] All 9 feature files documented
- [ ] Scenario counts match actual files
- [ ] Total calculated correctly (121)
- [ ] Playwright tests marked as implemented
