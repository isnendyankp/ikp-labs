# Technical Design

## Approach
Edit langsung file `specs/README.md` untuk memperbaiki scenario counts.

## Changes Required

### 1. Directory Structure Section
Update scenario counts di directory structure table:
```
specs/
├── authentication/
│   ├── registration.feature   # 6 → 5 scenarios
│   ├── login.feature           # 4 scenarios (no change)
│   └── home-page.feature       # 9 scenarios (no change)
├── gallery/
│   ├── photo-upload.feature    # 11 → 10 scenarios
│   ├── photo-management.feature # 19 scenarios (no change)
│   └── photo-privacy.feature   # 17 → 16 scenarios
└── README.md
```

### 2. Total Coverage Line
```
**Total Coverage:** 66 scenarios → 64 scenarios
```

### 3. Alignment Table
Update counts di Playwright alignment table untuk 3 files yang berubah.

## Calculation
- Old total: 66
- Changes: -1 (registration) -1 (upload) -1 (privacy) = -3
- New total: 66 - 3 = **64**

## Risk Assessment
- **Risk Level:** Low
- **Impact:** Documentation only, no code changes
- **Rollback:** Simple git revert
