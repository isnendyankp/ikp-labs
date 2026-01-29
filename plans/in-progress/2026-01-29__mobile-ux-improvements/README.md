# Mobile UX Improvements - Sticky Filter & FAB Upload

**Status**: 🔄 In Progress (Planning)
**Created**: January 29, 2026
**Priority**: P1 (High)
**Type**: UX Enhancement

---

## Overview

Improve mobile user experience on the gallery page by implementing compact controls that remain accessible without scrolling back to the top. This includes compact filter/sort icons in the header, a floating action button (FAB) for upload, and a back-to-top button for easy navigation.

---

## Problem Statements

### Problem 1: Lost Controls on Mobile ✅ IDENTIFIED
The gallery page has filter/sort controls in an action bar below the header. On mobile, after scrolling down to view photos, users lose access to these controls.

**Impact**: Users must scroll back up to change filters or sort options

**Status**: ✅ **SOLVED** - Will implement compact header with icon controls

---

### Problem 2: Upload Button Accessibility ✅ IDENTIFIED
The upload button is in the action bar, which is not easily accessible when users are viewing photos at the bottom of the page.

**Impact**: Inconvenient to upload photos when scrolling through gallery

**Status**: ✅ **SOLVED** - Will implement FAB upload button

---

### Problem 3: Scroll Fatigue ✅ IDENTIFIED
Users experience fatigue when they have to scroll back up to access controls after browsing photos.

**Impact**: Poor user experience, reduced engagement

**Status**: ✅ **SOLVED** - Will implement back-to-top button

---

## Proposed Solutions

### Phase 1: Compact Header (Mobile) ✅ PLANNED

**Approach**: Responsive header with icon-only controls for mobile

**Implementation**:
- Filter icon (🔍) and Sort icon (⚙️) in header
- Hide action bar on mobile
- Icons show dropdown when tapped
- Touch-friendly tap targets (min 44x44px)

---

### Phase 2: FAB Upload Button ✅ PLANNED

**Approach**: Floating action button for upload (bottom-right corner)

**Implementation**:
- Circular design with upload icon (📤)
- Fixed position: `fixed bottom-4 right-4`
- Green background: `bg-green-600`
- Smooth hover animation

---

### Phase 3: Sticky Action Bar (Desktop) ✅ PLANNED

**Approach**: Make current action bar sticky on desktop

**Implementation**:
- Add `sticky top-0 z-10` classes
- Keep existing layout unchanged
- Only visible on desktop (≥ 640px)

---

### Phase 4: Back to Top Button ✅ PLANNED

**Approach**: Integrate existing BackToTop component

**Implementation**:
- Show after scrolling past threshold (400px)
- Position bottom-left (avoid FAB conflict)
- Smooth scroll to top animation

---

## Success Criteria

### Phase 1 (✅ Complete):
- [ ] Filter/sort icons visible on mobile
- [ ] Icons hidden on desktop
- [ ] Dropdowns open when icons tapped
- [ ] All options available in dropdowns

### Phase 2 (✅ Complete):
- [ ] FAB button visible and positioned correctly
- [ ] FAB navigates to upload page
- [ ] FAB styled correctly (green, circular, icon)
- [ ] FAB has hover/active states

### Phase 3 (✅ Complete):
- [ ] Action bar sticks on desktop
- [ ] Action bar hidden on mobile
- [ ] Controls accessible when scrolled
- [ ] No layout shift when scrolling

### Phase 4 (✅ Complete):
- [ ] Button appears after scroll threshold
- [ ] Button hides at top of page
- [ ] Smooth scroll animation works
- [ ] Button positioned correctly

---

## Design Reference

### Mobile Layout (FAB Style):
```
┌──────────────────────────────┐
│ Photo Gallery         🔍 ⚙️  │ ← Compact header
├──────────────────────────────┤
│  Photo Grid Content         │
│  (scrollable)               │
│                    ┌───┐   │
│                    │ 📤 │   │ ← FAB Upload
│                    └───┘   │
│                    ⬆️      │ ← Back to Top
└──────────────────────────────┘
```

### Desktop Layout (Sticky Action Bar):
```
┌─────────────────────────────────────────────────┐
│ Photo Gallery                    [Filter▼] [Sort▼] [+ Upload] │ ← Sticky
├─────────────────────────────────────────────────┤
│  Photo Grid (3-4 columns)                        │
└─────────────────────────────────────────────────┘
```

---

## Estimated Time

| Phase | Tasks | Estimated Time | Status |
|-------|-------|----------------|--------|
| Phase 1 | Compact Header (Mobile) | ~1.5 hours | 🔄 Planning |
| Phase 2 | FAB Upload Button | ~1 hour | 🔄 Planning |
| Phase 3 | Sticky Action Bar (Desktop) | ~30 minutes | 🔄 Planning |
| Phase 4 | Back to Top Button | ~1 hour | 🔄 Planning |
| Phase 5 | Responsive Testing & Polish | ~2 hours | 🔄 Planning |
| Phase 6 | E2E Testing | ~2 hours | 🔄 Planning |
| **Total** | **24 tasks** | **~6-8 hours** | **🔄 Planning** |

---

## Summary

This plan improves mobile UX on the gallery page by implementing compact, always-accessible controls. The FAB-style design maximizes content space while keeping essential features available. Desktop users get sticky controls for better accessibility.

**Key Benefits**:
- ✅ Filter/sort always accessible on mobile
- ✅ Upload button always available
- ✅ Quick navigation with back to top
- ✅ Maximized content space on mobile
- ✅ Desktop sticky controls
- ✅ Feature parity maintained
