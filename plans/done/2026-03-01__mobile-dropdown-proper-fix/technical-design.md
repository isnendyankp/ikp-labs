# Fix Mobile Dropdown Toggle Bug - Technical Design

**Plan**: Fix Mobile Dropdown Toggle Bug (Proper Solution)
**Version**: 1.0
**Last Updated**: March 1, 2026

---

## Table of Contents

1. [Problem Analysis](#problem-analysis)
2. [Solution Design](#solution-design)
3. [Code Changes](#code-changes)
4. [Testing Strategy](#testing-strategy)

---

## Problem Analysis

### Root Cause Analysis

**Event Flow Problem**:
```
User clicks button (2nd time):
1. mousedown event -> handleClickOutside() -> set isOpen = false
2. click event -> handleFilterButtonClick() -> toggle isOpen = true
3. Result: Dropdown stays open (race condition)
```

### Why Previous Attempt (PR #9) Failed

**stopPropagation() Approach**:
- Button `onClick` = `click` event
- `handleClickOutside` = `mousedown` event
- Different event types = stopPropagation doesn't work across them

**The Fix That Didn't Work**:
```typescript
// This doesn't work because onClick is a different event than mousedown
const handleFilterButtonClick = (e: React.MouseEvent) => {
  e.stopPropagation(); // Only stops 'click' event propagation
  setIsFilterOpen(!isFilterOpen);
};
```

### Why This Solution Works

**Button Ref Check Approach**:
- Check happens in `mousedown` handler (same event type as handleClickOutside)
- No race condition between different event types
- Clean separation: button controls open/close, outside click only closes

---

## Solution Design

### Approach: Pass Button Ref to Dropdown

**Architecture**:
```
MobileHeaderControls
├── filterButtonRef (useRef<HTMLButtonElement>)
├── sortButtonRef (useRef<HTMLButtonElement>)
│
├── <button ref={filterButtonRef} onClick={...}>
├── <FilterDropdown triggerRef={filterButtonRef} ... />
│
├── <button ref={sortButtonRef} onClick={...}>
└── <SortByDropdown triggerRef={sortButtonRef} ... />
```

### Files to Modify

1. `frontend/src/components/FilterDropdown.tsx` - Add triggerRef prop
2. `frontend/src/components/SortByDropdown.tsx` - Add triggerRef prop
3. `frontend/src/components/gallery/MobileHeaderControls.tsx` - Pass refs

---

## Code Changes

### FilterDropdown.tsx

```typescript
interface FilterDropdownProps {
  // ... existing props
  triggerRef?: React.RefObject<HTMLElement>;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  // ... existing props
  triggerRef,
}) => {
  // Update handleClickOutside
  const handleClickOutside = (event: MouseEvent) => {
    // Check if click is on trigger button
    if (triggerRef?.current?.contains(event.target as Node)) {
      return; // Ignore clicks on trigger button
    }

    // Existing logic for outside clicks
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // ... rest of component
};
```

### SortByDropdown.tsx

```typescript
interface SortByDropdownProps {
  // ... existing props
  triggerRef?: React.RefObject<HTMLElement>;
}

const SortByDropdown: React.FC<SortByDropdownProps> = ({
  // ... existing props
  triggerRef,
}) => {
  // Update handleClickOutside
  const handleClickOutside = (event: MouseEvent) => {
    // Check if click is on trigger button
    if (triggerRef?.current?.contains(event.target as Node)) {
      return; // Ignore clicks on trigger button
    }

    // Existing logic for outside clicks
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  // ... rest of component
};
```

### MobileHeaderControls.tsx

```typescript
import { useRef } from 'react';

const MobileHeaderControls: React.FC<Props> = (props) => {
  // Create refs for buttons
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const sortButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      {/* Filter Button */}
      <button ref={filterButtonRef} onClick={() => setIsFilterOpen(!isFilterOpen)}>
        <FilterIcon />
      </button>

      {/* Filter Dropdown with triggerRef */}
      <FilterDropdown
        triggerRef={filterButtonRef}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        // ... other props
      />

      {/* Sort Button */}
      <button ref={sortButtonRef} onClick={() => setIsSortOpen(!isSortOpen)}>
        <SortIcon />
      </button>

      {/* Sort Dropdown with triggerRef */}
      <SortByDropdown
        triggerRef={sortButtonRef}
        isOpen={isSortOpen}
        onClose={() => setIsSortOpen(false)}
        // ... other props
      />
    </>
  );
};
```

---

## Testing Strategy

### Manual Testing

1. **Mobile viewport** (390x844 - iPhone 12 Pro):
   - Filter dropdown open/close toggle
   - Sort dropdown open/close toggle
   - Click outside to close
   - Keyboard Escape to close

2. **Desktop viewport** (1280x720):
   - Verify desktop dropdowns still work
   - No regressions

3. **Edge cases**:
   - Rapid clicking on button
   - Click button while other dropdown open
   - Tab navigation

### Automated Testing

- Existing E2E tests should still pass
- No new tests needed (behavior fix, not feature)

---

## Technical Highlights

- **Backward Compatible**: `triggerRef` is optional prop
- **TypeScript Safe**: Proper nullable ref handling
- **Clean Code**: No complex event handling logic
- **Maintainable**: Clear separation of concerns

---

**Technical Design Version**: 1.0
**Last Updated**: March 1, 2026
