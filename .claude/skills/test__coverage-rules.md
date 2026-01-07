# Skill: Test Coverage Rules

**Category**: Testing
**Purpose**: Define minimum test coverage requirements and standards
**Used By**: test-validator, gherkin-spec-writer

---

## Overview

This skill defines **comprehensive testing standards** for the IKP-Labs project. All code changes must meet minimum coverage thresholds and follow testing best practices to ensure system reliability, maintainability, and confidence in deployments.

**Core Principles:**
1. **Confidence** - Tests provide confidence that code works as expected
2. **Maintainability** - Tests are easy to understand and update
3. **Speed** - Test suite runs quickly to enable rapid feedback
4. **Reliability** - Tests are deterministic and don't flake
5. **Coverage** - Critical paths are thoroughly tested

**Testing Philosophy:**

We follow the **Testing Pyramid** approach:
```
         /\
        /  \  E2E (Few)
       /----\
      /      \  Integration (Some)
     /--------\
    /          \  Unit (Many)
   /____________\
```

- **Many Unit Tests**: Fast, isolated, test individual functions/components
- **Some Integration Tests**: Test interactions between modules/services
- **Few E2E Tests**: Slow but verify entire user workflows

---

## Coverage Requirements

### Minimum Coverage Thresholds

| Component | Line Coverage | Branch Coverage | Function Coverage | Statement Coverage |
|-----------|--------------|-----------------|-------------------|-------------------|
| **Frontend** | ≥ 70% | ≥ 65% | ≥ 70% | ≥ 70% |
| **Backend** | ≥ 80% | ≥ 75% | ≥ 80% | ≥ 80% |
| **Critical Paths** | **100%** | **100%** | **100%** | **100%** |

**Critical Paths** include:
- Authentication & authorization (login, JWT validation, role checks)
- Payment processing (if applicable)
- Data persistence (CRUD operations)
- Security-sensitive operations (password hashing, token generation)
- User data handling (PII, GDPR compliance)

### Per-Feature Requirements

When adding new features, ensure:
- ✅ **All new functions/methods have unit tests** (≥80% coverage)
- ✅ **All new API endpoints have integration tests**
- ✅ **All new user workflows have E2E tests**
- ✅ **Edge cases are covered** (null, empty, invalid inputs)
- ✅ **Error scenarios are tested** (API failures, network errors)

---

## Test Types

### 1. Unit Tests

**Definition:** Tests that verify individual functions, methods, or components in isolation.

**Characteristics:**
- **Fast**: Run in milliseconds
- **Isolated**: No external dependencies (DB, API, filesystem)
- **Deterministic**: Same input → same output
- **Focused**: Test one thing at a time

**When to Write:**
- ✅ Pure functions (data transformations, calculations)
- ✅ Business logic (validation, formatting)
- ✅ Component behavior (React component logic)
- ✅ Utility functions (helpers, formatters)

**Tools:**
- **Frontend**: Jest, React Testing Library, Vitest
- **Backend**: JUnit, Mockito, AssertJ

**Example (Frontend - Jest):**
```typescript
// File: frontend/src/utils/dateFormatter.test.ts

import { formatDate } from './dateFormatter';

describe('formatDate', () => {
  it('formats ISO date to readable format', () => {
    const input = '2025-01-07T10:30:00Z';
    const result = formatDate(input);
    expect(result).toBe('January 7, 2025');
  });

  it('handles null input gracefully', () => {
    const result = formatDate(null);
    expect(result).toBe('Unknown date');
  });

  it('handles invalid date string', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid date');
  });
});
```

**Example (Backend - JUnit):**
```java
// File: backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/service/GalleryServiceTest.java

@ExtendWith(MockitoExtension.class)
class GalleryServiceTest {

    @Mock
    private GalleryRepository galleryRepository;

    @InjectMocks
    private GalleryService galleryService;

    @Test
    void getPhotoById_ReturnsPhoto_WhenPhotoExists() {
        // Arrange
        Photo expectedPhoto = new Photo(1L, "sunset.jpg", "user123");
        when(galleryRepository.findById(1L)).thenReturn(Optional.of(expectedPhoto));

        // Act
        Photo result = galleryService.getPhotoById(1L);

        // Assert
        assertEquals(expectedPhoto.getId(), result.getId());
        assertEquals(expectedPhoto.getFilename(), result.getFilename());
        verify(galleryRepository, times(1)).findById(1L);
    }

    @Test
    void getPhotoById_ThrowsException_WhenPhotoNotFound() {
        // Arrange
        when(galleryRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(PhotoNotFoundException.class, () -> {
            galleryService.getPhotoById(999L);
        });
    }
}
```

---

### 2. Integration Tests

**Definition:** Tests that verify interactions between multiple components, modules, or services.

**Characteristics:**
- **Medium Speed**: Run in seconds
- **Limited Scope**: Test 2-3 components together
- **Real Dependencies**: May use real DB (in-memory or testcontainers)
- **API-Focused**: Often test HTTP endpoints end-to-end

**When to Write:**
- ✅ API endpoints (REST/GraphQL)
- ✅ Database operations (queries, transactions)
- ✅ Service layer interactions
- ✅ External API integrations (with mocks)

**Tools:**
- **Frontend**: MSW (Mock Service Worker), axios-mock-adapter
- **Backend**: Spring Boot Test (@SpringBootTest), RestAssured, TestContainers

**Example (Backend - Spring Boot):**
```java
// File: backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/controller/GalleryControllerIntegrationTest.java

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureTestDatabase
class GalleryControllerIntegrationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private GalleryRepository galleryRepository;

    @BeforeEach
    void setup() {
        galleryRepository.deleteAll();
    }

    @Test
    void getPublicPhotos_ReturnsPhotosList_WhenAuthenticated() {
        // Arrange: Insert test data
        Photo photo1 = new Photo("sunset.jpg", "user123", 10);
        Photo photo2 = new Photo("beach.jpg", "user123", 5);
        galleryRepository.saveAll(List.of(photo1, photo2));

        String token = generateTestJWT(); // Helper method

        // Act
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        ResponseEntity<PhotoListResponse> response = restTemplate.exchange(
            "http://localhost:" + port + "/api/gallery/public?sortBy=mostLiked",
            HttpMethod.GET,
            entity,
            PhotoListResponse.class
        );

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getPhotos().size());
        assertEquals("sunset.jpg", response.getBody().getPhotos().get(0).getFilename());
        assertEquals(10, response.getBody().getPhotos().get(0).getLikeCount());
    }

    @Test
    void getPublicPhotos_Returns401_WhenNotAuthenticated() {
        // Act
        ResponseEntity<String> response = restTemplate.getForEntity(
            "http://localhost:" + port + "/api/gallery/public",
            String.class
        );

        // Assert
        assertEquals(HttpStatus.UNAUTHORIZED, response.getStatusCode());
    }
}
```

---

### 3. End-to-End (E2E) Tests

**Definition:** Tests that verify complete user workflows from browser to database.

**Characteristics:**
- **Slow**: Run in seconds to minutes
- **Full Stack**: Test entire application (frontend + backend + DB)
- **User-Centric**: Simulate real user interactions
- **Flaky Risk**: Can be flaky due to timing, animations, network

**When to Write:**
- ✅ Critical user journeys (registration, login, checkout)
- ✅ Multi-page workflows (photo upload → gallery → sorting)
- ✅ Cross-component interactions
- ✅ UI state management

**Tools:**
- **Playwright** (primary for IKP-Labs)
- Cypress, Selenium (alternatives)

**Example (Playwright):**
```typescript
// File: frontend/tests/gallery-sorting.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Gallery Photo Sorting', () => {
  test.beforeEach(async ({ page }) => {
    // Login and navigate to gallery
    await page.goto('http://localhost:3002/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await page.goto('http://localhost:3002/gallery');
  });

  test('should sort photos by most liked', async ({ page }) => {
    // Arrange: Wait for photos to load
    await page.waitForSelector('.photo-card', { state: 'visible' });

    // Act: Open sort dropdown and select "Most Liked"
    await page.click('select[name="sortBy"]');
    await page.selectOption('select[name="sortBy"]', 'mostLiked');

    // Assert: Verify URL updated
    await expect(page).toHaveURL(/sortBy=mostLiked/);

    // Assert: Verify photos reordered (first photo has highest like count)
    const firstPhotoLikes = await page.locator('.photo-card').first().locator('.like-count').textContent();
    const secondPhotoLikes = await page.locator('.photo-card').nth(1).locator('.like-count').textContent();

    const firstLikes = parseInt(firstPhotoLikes || '0');
    const secondLikes = parseInt(secondPhotoLikes || '0');
    expect(firstLikes).toBeGreaterThanOrEqual(secondLikes);
  });

  test('should handle empty gallery gracefully', async ({ page }) => {
    // Arrange: Delete all photos first (via API or UI)
    // ... deletion logic ...

    // Act: Open gallery page
    await page.goto('http://localhost:3002/gallery');

    // Assert: Show empty state message
    await expect(page.locator('text=No photos yet')).toBeVisible();
  });
});
```

**E2E Best Practices:**
- ✅ Use **page object model** for reusable page logic
- ✅ Use **data-testid** attributes instead of CSS selectors
- ✅ **Wait for elements** explicitly (avoid fixed timeouts)
- ✅ **Clean up test data** after each test
- ✅ **Run E2E tests in CI/CD** to catch regressions
- ❌ Don't test every edge case in E2E (use unit tests instead)

---

## Testing Strategies

### Test Pyramid Distribution

For IKP-Labs, aim for this distribution:

| Test Type | Percentage | Quantity (approx) | Execution Time |
|-----------|-----------|-------------------|----------------|
| **Unit** | 70% | 200+ tests | < 10 seconds |
| **Integration** | 20% | 50+ tests | 30-60 seconds |
| **E2E** | 10% | 24+ tests | 1-3 minutes |

### What to Test (Priority)

#### ✅ **ALWAYS Test:**
1. **Happy Path** - Expected user flow works correctly
2. **Error Cases** - Handles failures gracefully (null, undefined, 404, 500)
3. **Edge Cases** - Boundary conditions (empty arrays, max values, special characters)
4. **Security** - Authentication, authorization, input validation
5. **Critical Business Logic** - Payment, data integrity, compliance

#### ⚠️ **Consider Testing:**
- UI component rendering (snapshot tests)
- Complex conditional logic
- Data transformations
- State management (Redux, Context)

#### ❌ **Don't Test:**
- Third-party libraries (already tested by maintainers)
- Simple getters/setters (no logic)
- Framework internals (React, Spring Boot)
- Generated code (Prisma models, OpenAPI clients)

---

## Coverage Exclusions

### Files to Exclude from Coverage

These files/directories should be excluded from coverage calculation:

**Frontend:**
```javascript
// File: frontend/jest.config.js or vitest.config.ts

export default {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',              // Type definitions
    '!src/**/*.stories.tsx',       // Storybook stories
    '!src/**/*.test.{ts,tsx}',     // Test files themselves
    '!src/index.tsx',              // Entry point
    '!src/setupTests.ts',          // Test setup
    '!src/reportWebVitals.ts',     // Performance monitoring
    '!src/mocks/**',               // MSW mocks
    '!src/generated/**',           // Generated code (GraphQL, OpenAPI)
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      branches: 65,
      functions: 70,
      statements: 70,
    },
  },
};
```

**Backend:**
```xml
<!-- File: backend/ikp-labs-api/pom.xml -->

<plugin>
  <groupId>org.jacoco</groupId>
  <artifactId>jacoco-maven-plugin</artifactId>
  <configuration>
    <excludes>
      <!-- Entity/Model classes (mostly data holders) -->
      <exclude>**/entity/**</exclude>
      <exclude>**/model/**</exclude>
      <exclude>**/dto/**</exclude>

      <!-- Configuration classes -->
      <exclude>**/config/**</exclude>

      <!-- Main application class -->
      <exclude>**/IkpLabsApiApplication.class</exclude>

      <!-- Generated code -->
      <exclude>**/generated/**</exclude>
    </excludes>
  </configuration>
</plugin>
```

**Rationale:**
- **Type definitions**: No runtime logic
- **Configuration**: Declarative code, hard to test meaningfully
- **Entry points**: Minimal logic, mostly framework bootstrapping
- **DTOs/Entities**: Simple data holders (getters/setters)
- **Generated code**: Already validated by code generator

---

## Measuring Coverage

### Running Coverage Reports

**Frontend (Jest):**
```bash
cd frontend
npm run test:coverage

# Open HTML report
open coverage/lcov-report/index.html
```

**Backend (Maven + JaCoCo):**
```bash
cd backend/ikp-labs-api
mvn clean test jacoco:report

# Open HTML report
open target/site/jacoco/index.html
```

**Playwright (E2E Coverage):**
```bash
cd frontend
npm run test:e2e -- --coverage

# Coverage for E2E tests measures which application code is exercised
# (requires instrumentation setup)
```

### Interpreting Coverage Metrics

**Line Coverage:**
- Measures which lines of code were executed
- **Goal**: ≥70% frontend, ≥80% backend

**Branch Coverage:**
- Measures which decision branches were taken (if/else, switch, ternary)
- **Goal**: ≥65% frontend, ≥75% backend
- More important than line coverage for catching logic errors

**Function Coverage:**
- Measures which functions/methods were called
- **Goal**: ≥70% frontend, ≥80% backend

**Statement Coverage:**
- Similar to line coverage but counts logical statements
- **Goal**: ≥70% frontend, ≥80% backend

**Example Coverage Report:**
```
File                    | % Stmts | % Branch | % Funcs | % Lines | Uncovered Lines
------------------------|---------|----------|---------|---------|------------------
galleryService.ts       |   85.71 |    75.00 |   100.0 |   85.71 | 42-45
authMiddleware.ts       |   100.0 |    100.0 |   100.0 |   100.0 |
userController.ts       |   66.67 |    50.00 |   66.67 |   66.67 | 23-28, 45-50
------------------------|---------|----------|---------|---------|------------------
All files               |   78.45 |    70.12 |   82.35 |   78.45 |
```

**Action Items from Report:**
- ❌ `userController.ts` below threshold (66.67% < 70%) → Add tests for lines 23-28, 45-50
- ✅ `authMiddleware.ts` at 100% (critical security path) → Good!
- ⚠️ `galleryService.ts` at 85.71% but missing lines 42-45 → Review if critical

---

## Common Testing Pitfalls

### ❌ 1. Testing Implementation Details

**Bad:**
```typescript
// Testing internal state/implementation
it('updates internal counter', () => {
  const component = mount(<Counter />);
  component.instance().incrementCounter(); // Accessing internal method
  expect(component.state('count')).toBe(1); // Checking internal state
});
```

**Good:**
```typescript
// Testing user-visible behavior
it('increments count when button clicked', () => {
  render(<Counter />);
  const button = screen.getByRole('button', { name: /increment/i });

  fireEvent.click(button);

  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Why Bad:** Tests break when refactoring internal implementation, even if behavior is unchanged.

---

### ❌ 2. Brittle Selectors in E2E Tests

**Bad:**
```typescript
// Fragile CSS selectors
await page.click('.css-abc123 > div:nth-child(2) > button');
await expect(page.locator('div.some-generated-class')).toBeVisible();
```

**Good:**
```typescript
// Semantic selectors with data-testid
await page.click('[data-testid="submit-button"]');
await expect(page.getByRole('heading', { name: 'Success' })).toBeVisible();
```

**Why Bad:** CSS class names change, component structure refactors → tests break.

---

### ❌ 3. Not Testing Error Scenarios

**Bad:**
```typescript
// Only testing happy path
it('fetches photos successfully', async () => {
  const photos = await galleryService.getPhotos();
  expect(photos.length).toBeGreaterThan(0);
});
```

**Good:**
```typescript
// Testing both success and failure
it('fetches photos successfully', async () => {
  const photos = await galleryService.getPhotos();
  expect(photos.length).toBeGreaterThan(0);
});

it('handles API error gracefully', async () => {
  jest.spyOn(axios, 'get').mockRejectedValue(new Error('Network error'));

  await expect(galleryService.getPhotos()).rejects.toThrow('Failed to fetch photos');
});

it('handles empty response', async () => {
  jest.spyOn(axios, 'get').mockResolvedValue({ data: [] });

  const photos = await galleryService.getPhotos();
  expect(photos).toEqual([]);
});
```

**Why Bad:** Real-world failures (network errors, empty data, invalid responses) are not tested.

---

### ❌ 4. Flaky Tests with Fixed Timeouts

**Bad:**
```typescript
// Fixed timeout - flaky on slow machines/CI
await page.click('#submit');
await page.waitForTimeout(2000); // ❌ Hardcoded wait
expect(await page.locator('.success-message').isVisible()).toBe(true);
```

**Good:**
```typescript
// Wait for specific condition
await page.click('#submit');
await page.waitForSelector('.success-message', { state: 'visible', timeout: 5000 });
expect(await page.locator('.success-message')).toBeVisible();
```

**Why Bad:** Tests fail intermittently based on system speed, not actual bugs.

---

### ❌ 5. Over-Mocking in Integration Tests

**Bad:**
```typescript
// Mocking everything defeats purpose of integration test
jest.mock('../../services/galleryService');
jest.mock('../../database/connection');
jest.mock('../../utils/logger');

it('API endpoint returns photos', async () => {
  galleryService.getPhotos.mockResolvedValue([{ id: 1 }]);
  const response = await request(app).get('/api/gallery');
  expect(response.status).toBe(200);
});
```

**Good:**
```typescript
// Use real implementations, only mock external services
// (Use in-memory DB or testcontainers for real database)
it('API endpoint returns photos', async () => {
  // Insert real test data into test DB
  await testDb.photos.insert({ id: 1, filename: 'test.jpg' });

  const response = await request(app).get('/api/gallery');
  expect(response.status).toBe(200);
  expect(response.body.photos).toHaveLength(1);
});
```

**Why Bad:** Over-mocking means you're not actually testing integration between components.

---

## Testing Checklist

Before marking a feature as "complete", verify:

- [ ] **Unit Tests Written**: All new functions/methods have unit tests
- [ ] **Integration Tests Written**: All new API endpoints have integration tests
- [ ] **E2E Tests Written**: All new user workflows have E2E tests
- [ ] **Coverage Thresholds Met**: Frontend ≥70%, Backend ≥80%
- [ ] **Edge Cases Covered**: Null, empty, invalid inputs tested
- [ ] **Error Scenarios Tested**: API failures, validation errors handled
- [ ] **Tests Pass Locally**: `npm test` and `mvn test` pass
- [ ] **Tests Pass in CI**: GitHub Actions or equivalent passes
- [ ] **No Flaky Tests**: Tests are deterministic, no random failures
- [ ] **Performance Acceptable**: Test suite runs in reasonable time (< 5 min total)

---

## Examples: Good Test Suites

### Example 1: Complete Service Test (Backend)

```java
// File: backend/ikp-labs-api/src/test/java/com/ikplabs/gallery/service/PhotoSortingServiceTest.java

@ExtendWith(MockitoExtension.class)
class PhotoSortingServiceTest {

    @Mock
    private GalleryRepository galleryRepository;

    @InjectMocks
    private PhotoSortingService photoSortingService;

    @Test
    void sortByNewest_ReturnsPhotosInDescendingOrder() {
        // Arrange
        List<Photo> unsorted = List.of(
            new Photo(1L, "old.jpg", LocalDateTime.of(2024, 1, 1, 10, 0)),
            new Photo(2L, "new.jpg", LocalDateTime.of(2025, 1, 1, 10, 0)),
            new Photo(3L, "medium.jpg", LocalDateTime.of(2024, 6, 1, 10, 0))
        );
        when(galleryRepository.findAll()).thenReturn(unsorted);

        // Act
        List<Photo> result = photoSortingService.sort(SortBy.NEWEST);

        // Assert
        assertEquals(3, result.size());
        assertEquals(2L, result.get(0).getId()); // Newest first
        assertEquals(3L, result.get(1).getId());
        assertEquals(1L, result.get(2).getId()); // Oldest last
    }

    @Test
    void sortByMostLiked_ReturnsPhotosInDescendingLikeCount() {
        // Arrange
        List<Photo> unsorted = List.of(
            new Photo(1L, "unpopular.jpg", 5),
            new Photo(2L, "popular.jpg", 100),
            new Photo(3L, "medium.jpg", 50)
        );
        when(galleryRepository.findAll()).thenReturn(unsorted);

        // Act
        List<Photo> result = photoSortingService.sort(SortBy.MOST_LIKED);

        // Assert
        assertEquals(3, result.size());
        assertEquals(2L, result.get(0).getId()); // Most liked first (100)
        assertEquals(3L, result.get(1).getId()); // Medium (50)
        assertEquals(1L, result.get(2).getId()); // Least liked (5)
    }

    @Test
    void sort_HandlesEmptyList() {
        // Arrange
        when(galleryRepository.findAll()).thenReturn(Collections.emptyList());

        // Act
        List<Photo> result = photoSortingService.sort(SortBy.NEWEST);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void sort_ThrowsException_ForInvalidSortOption() {
        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            photoSortingService.sort(null);
        });
    }
}
```

**Why This is Good:**
- ✅ Tests happy path (newest, most liked)
- ✅ Tests edge case (empty list)
- ✅ Tests error case (null/invalid sort option)
- ✅ Clear Arrange-Act-Assert structure
- ✅ Descriptive test names
- ✅ Uses mocks appropriately (only for repository)

---

### Example 2: Complete Component Test (Frontend)

```typescript
// File: frontend/src/components/GallerySortDropdown.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { GallerySortDropdown } from './GallerySortDropdown';

describe('GallerySortDropdown', () => {
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    mockOnSortChange.mockClear();
  });

  it('renders with default "Newest" option selected', () => {
    render(<GallerySortDropdown onSortChange={mockOnSortChange} />);

    const dropdown = screen.getByRole('combobox', { name: /sort by/i });
    expect(dropdown).toHaveValue('newest');
  });

  it('calls onSortChange when option selected', async () => {
    render(<GallerySortDropdown onSortChange={mockOnSortChange} />);

    const dropdown = screen.getByRole('combobox', { name: /sort by/i });
    fireEvent.change(dropdown, { target: { value: 'mostLiked' } });

    await waitFor(() => {
      expect(mockOnSortChange).toHaveBeenCalledWith('mostLiked');
    });
  });

  it('displays all sort options', () => {
    render(<GallerySortDropdown onSortChange={mockOnSortChange} />);

    expect(screen.getByRole('option', { name: /newest first/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /oldest first/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /most liked/i })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /most favorited/i })).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<GallerySortDropdown onSortChange={mockOnSortChange} disabled />);

    const dropdown = screen.getByRole('combobox', { name: /sort by/i });
    expect(dropdown).toBeDisabled();
  });

  it('shows loading spinner when isLoading is true', () => {
    render(<GallerySortDropdown onSortChange={mockOnSortChange} isLoading />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });
});
```

**Why This is Good:**
- ✅ Tests rendering with default props
- ✅ Tests user interaction (onChange)
- ✅ Tests different states (disabled, loading)
- ✅ Uses semantic queries (getByRole)
- ✅ Uses waitFor for async updates
- ✅ Cleans up mocks between tests

---

## Related Skills

- **test__playwright-patterns** - Playwright-specific best practices
- **wow__criticality-assessment** - For prioritizing test scenarios

---

**Last Updated**: January 7, 2026
**Version**: 1.0
