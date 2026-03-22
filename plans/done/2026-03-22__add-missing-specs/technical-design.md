# Technical Design

## Approach
Edit `specs/README.md` untuk menambahkan dokumentasi feature files yang missing.

## Changes Required

### 1. Directory Structure Section
Add new entries:
```
specs/
├── authentication/
│   ├── registration.feature   # 5 scenarios
│   ├── login.feature           # 4 scenarios
│   └── home-page.feature       # 9 scenarios
├── gallery/
│   ├── photo-upload.feature    # 10 scenarios
│   ├── photo-management.feature # 19 scenarios
│   ├── photo-privacy.feature   # 16 scenarios
│   ├── photo-likes.feature     # 15 scenarios ← NEW
│   └── photo-sorting.feature   # 28 scenarios ← NEW
├── profile/                    ← NEW FOLDER
│   └── profile-picture.feature # 15 scenarios ← NEW
└── README.md
```

### 2. Total Coverage Line
```
**Total Coverage:** 121 scenarios across 9 feature files
```

### 3. Playwright Alignment Table
Add 3 new rows dan update status "planned" → implemented:

| Feature File | Playwright Test File | Scenarios |
|--------------|---------------------|-----------|
| `photo-likes.feature` | `photo-likes.spec.ts` | 15 |
| `photo-sorting.feature` | `gallery-sorting.spec.ts` | 28 |
| `profile-picture.feature` | `profile-picture.spec.ts` | 15 |

Update existing gallery entries dari "(planned)" ke implemented.

## Calculation
- Authentication: 5 + 4 + 9 = 18
- Gallery: 10 + 19 + 16 + 15 + 28 = 88
- Profile: 15
- **Total: 18 + 88 + 15 = 121**

## Risk Assessment
- **Risk Level:** Low
- **Impact:** Documentation only, no code changes
- **Rollback:** Simple git revert
