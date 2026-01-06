# Skill: Documentation Quality Standards

**Category**: Documentation
**Purpose**: Define standards for high-quality documentation following Diátaxis framework
**Used By**: documentation-writer, docs-validator

---

## Overview

This skill provides comprehensive standards for creating high-quality technical documentation. All documentation must follow the **Diátaxis framework** and adhere to consistent writing standards to ensure clarity, accuracy, and maintainability.

**Core Principles:**
1. **Accuracy** - All information must be factual and verified
2. **Clarity** - Content must be easily understood by target audience
3. **Consistency** - Follow established patterns and conventions
4. **Completeness** - Cover all necessary information without gaps
5. **Maintainability** - Easy to update as project evolves

---

## Diátaxis Framework Overview

All documentation must be categorized into **one of four types**:

### 1. **Tutorials** (Learning-Oriented)
- **Purpose**: Help beginners learn by doing
- **Characteristics**: Step-by-step, beginner-friendly, complete working example
- **Location**: `docs/tutorials/`
- **Example**: "Getting Started with IKP-Labs"

### 2. **How-To Guides** (Problem-Solving)
- **Purpose**: Show how to solve specific problems
- **Characteristics**: Goal-oriented, assumes basic knowledge, focused on one task
- **Location**: `docs/how-to/`
- **Example**: "How to Run E2E Tests"

### 3. **Reference** (Information-Oriented)
- **Purpose**: Provide technical descriptions and specifications
- **Characteristics**: Factual, comprehensive, structured like a dictionary
- **Location**: `docs/reference/`
- **Example**: "API Endpoints Reference"

### 4. **Explanation** (Understanding-Oriented)
- **Purpose**: Clarify and illuminate concepts
- **Characteristics**: Discussion, context, background, alternatives
- **Location**: `docs/explanation/`
- **Example**: "Architecture Overview"

**Decision Tree:**
```
Is it teaching?      → Tutorial
Is it solving?       → How-To Guide
Is it describing?    → Reference
Is it explaining?    → Explanation
```

---

## Writing Style Guidelines

### 1. **Voice and Tone**

✅ **DO:**
- Use **active voice**: "Run the command" (not "The command should be run")
- Use **present tense**: "The API returns..." (not "The API will return...")
- Use **second person**: "You can configure..." (not "One can configure...")
- Be **direct and concise**: "Click Submit" (not "You might want to consider clicking Submit")

❌ **DON'T:**
- Use passive voice unless absolutely necessary
- Use future tense ("will") unless discussing future features
- Use first person plural ("we") in technical content
- Be unnecessarily wordy or vague

**Examples:**

✅ Good:
```markdown
## Configure Authentication

Run the following command to set up JWT authentication:

```bash
npm run setup:auth
```

The system generates a secret key and stores it in `.env`.
```

❌ Bad:
```markdown
## Configuring Authentication

To configure authentication, you will need to run the setup command.
This can be done by executing the command shown below, which will
generate a secret key that will be stored in the .env file.
```

---

### 2. **Clarity and Precision**

✅ **DO:**
- Define technical terms on first use
- Use consistent terminology throughout
- Provide context when needed
- Break complex concepts into digestible chunks

❌ **DON'T:**
- Use jargon without explanation
- Switch between synonyms for the same concept
- Assume reader knowledge
- Write long, dense paragraphs

**Examples:**

✅ Good:
```markdown
## JWT Tokens

JWT (JSON Web Token) is a compact token format used for authentication.
When you log in, the API returns a JWT that must be included in subsequent requests.

**Token Structure:**
- Header: Algorithm and token type
- Payload: User data (id, email, role)
- Signature: Verification code

**Lifetime:** Tokens expire after 24 hours.
```

❌ Bad:
```markdown
## Tokens

The system uses JWTs for auth. Include the token in requests.
```

---

### 3. **Formatting Standards**

✅ **DO:**
- Use **headings** hierarchically (H1 → H2 → H3)
- Use **code blocks** with language tags (```typescript)
- Use **tables** for structured data
- Use **lists** for sequential or related items
- Use **bold** for important terms or actions
- Use **italic** for emphasis (sparingly)

❌ **DON'T:**
- Skip heading levels (H1 → H3)
- Use inline code without backticks
- Use ALL CAPS for emphasis
- Overuse formatting (visual noise)

**Example:**

✅ Good:
```markdown
## API Endpoints

### Authentication

#### POST /api/auth/login

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User email address |
| password | string | Yes | User password (min 8 chars) |

**Response:** Returns JWT token on success.
```

❌ Bad:
```markdown
API Endpoints
Authentication
POST /api/auth/login
Request: email (string, required), password (string, required)
Response: JWT token
```

---

## Code Example Standards

### 1. **Real Code Only**

✅ **DO:**
- Use **actual code** from the repository
- Include **file paths** in comments
- Provide **working examples** that can be copy-pasted
- Show **complete context** (imports, setup, etc.)

❌ **DON'T:**
- Use fictional or placeholder code
- Write code that doesn't actually work
- Show incomplete snippets without context
- Use `foo`, `bar`, `baz` as variable names

**Examples:**

✅ Good:
```markdown
## Upload Photo

```typescript
// File: frontend/src/services/galleryService.ts

import axios from 'axios';

export async function uploadPhoto(file: File): Promise<PhotoResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post('/api/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
}
```

Usage:
```typescript
const file = document.querySelector('input[type="file"]').files[0];
const result = await uploadPhoto(file);
console.log('Uploaded:', result.filePath);
```
```

❌ Bad:
```markdown
## Upload Photo

```typescript
function upload(file) {
  // Upload the file
  return fetch('/upload', { body: file });
}
```
```

---

### 2. **Command Examples**

✅ **DO:**
- Show **actual commands** with expected output
- Include **working directory** when relevant
- Show **error scenarios** and solutions
- Use **comments** to explain non-obvious parts

❌ **DON'T:**
- Show commands without context
- Omit expected output
- Skip error handling
- Leave commands unexplained

**Examples:**

✅ Good:
```markdown
## Run E2E Tests

From the project root directory:

```bash
cd frontend
npm run test:e2e

# Expected output:
# Running 24 tests...
# ✓ gallery-sorting.spec.ts (24)
# All tests passed in 1.3 minutes
```

**If tests fail:**
```bash
# Check if backend is running
lsof -i :8081

# If not, start backend first:
cd ../backend/ikp-labs-api
mvn spring-boot:run
```
```

❌ Bad:
```markdown
Run tests:
```bash
npm test
```
```

---

## Cross-Referencing Best Practices

✅ **DO:**
- Link to **related documentation** using relative paths
- Link to **code files** with line numbers when specific
- Use **descriptive link text** (not "click here")
- Verify links actually work

❌ **DON'T:**
- Use absolute URLs for internal docs
- Use generic link text
- Create broken links
- Over-link (every mention doesn't need a link)

**Examples:**

✅ Good:
```markdown
For API authentication, see [Authentication Guide](../how-to/authenticate.md).

The upload logic is implemented in [galleryService.ts:42-67](../../frontend/src/services/galleryService.ts#L42-L67).
```

❌ Bad:
```markdown
Click [here](https://github.com/user/repo/blob/main/docs/auth.md) for auth info.
See the code [here](link).
```

---

## Documentation Anti-Patterns

### ❌ 1. **Placeholder Content**

**Bad:**
```markdown
## Configuration

TODO: Add configuration details

Coming soon...

[Insert example here]
```

**Why Bad:** Breaks user trust, looks unprofessional

**Fix:** Either complete the section or remove it. Use issue tracker for planned docs.

---

### ❌ 2. **Outdated Information**

**Bad:**
```markdown
## API Endpoint

```bash
GET /api/photos  # This endpoint is deprecated, use /api/gallery instead
```
```

**Why Bad:** Confuses users, wastes time

**Fix:** Update immediately or remove deprecated content. Add migration guide if needed.

---

### ❌ 3. **Incorrect Diátaxis Category**

**Bad:**
```markdown
# API Reference

This tutorial will teach you how to use our API...
[Step-by-step walkthrough follows]
```

**Why Bad:** User expectations mismatch, hard to find content

**Fix:** Move to correct category (this should be in `docs/tutorials/`)

---

### ❌ 4. **Missing Context**

**Bad:**
```markdown
Run `npm start` and go to the dashboard.
```

**Why Bad:** Where do I run this? What's the URL? What should I see?

**Fix:**
```markdown
From the `frontend/` directory, run:

```bash
npm start
```

Open browser to http://localhost:3002/dashboard

You should see the Gallery page with photo upload button.
```

---

### ❌ 5. **Jargon Without Explanation**

**Bad:**
```markdown
Configure the JWT auth middleware with RBAC for authenticated routes.
```

**Why Bad:** Assumes reader knows JWT, RBAC, middleware

**Fix:**
```markdown
Configure JWT (JSON Web Token) authentication middleware:

**JWT**: A token format for secure user authentication
**RBAC**: Role-Based Access Control (admin, user roles)
**Middleware**: Code that runs before route handlers

[Configuration steps follow...]
```

---

## Good Documentation Examples

### Example 1: How-To Guide

✅ **Excellent:**
```markdown
# How to Sort Gallery Photos

**Prerequisites:**
- Backend server running on port 8081
- Frontend running on port 3002
- At least 5 photos uploaded

## Steps

### 1. Navigate to Gallery Page

Open http://localhost:3002/gallery

### 2. Open Sort Dropdown

Click the **Sort** dropdown (next to Filter dropdown)

You'll see 4 options:
- Newest First (default)
- Oldest First
- Most Liked
- Most Favorited

### 3. Select Sort Option

Click **Most Liked**

**Expected Result:**
- Photos reorder by like count (highest first)
- URL updates to: `/gallery?sortBy=mostLiked`
- Loading indicator shows briefly

### 4. Verify Sorting

Check the first photo's like count (should be highest)

## Troubleshooting

**Photos don't reorder:**
- Check browser console for errors
- Verify backend endpoint: `curl http://localhost:8081/api/gallery/public?sortBy=mostLiked`

**URL doesn't update:**
- This is expected on `/myprofile/liked-photos` page (state-based only)
```

---

### Example 2: API Reference

✅ **Excellent:**
```markdown
# Gallery API Reference

## GET /api/gallery/public

Retrieve paginated list of public photos with optional sorting.

**URL:** `GET /api/gallery/public`

**Authentication:** Required (JWT token)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-indexed) |
| size | integer | No | 12 | Items per page (max 100) |
| sortBy | string | No | newest | Sort option: `newest`, `oldest`, `mostLiked`, `mostFavorited` |

**Response 200 OK:**

```json
{
  "photos": [
    {
      "id": 123,
      "title": "Sunset Beach",
      "likeCount": 42,
      "createdAt": "2025-01-05T10:30:00"
    }
  ],
  "totalPages": 5,
  "currentPage": 0
}
```

**Response 400 Bad Request:**

```json
{
  "error": "Invalid sortBy value. Must be one of: newest, oldest, mostLiked, mostFavorited"
}
```

**Example Request:**

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8081/api/gallery/public?page=0&size=12&sortBy=mostLiked"
```

**Implementation:** [GalleryController.java:45](../../backend/ikp-labs-api/src/main/java/com/ikplabs/gallery/controller/GalleryController.java#L45)
```

---

## Decision Criteria

### When to Create Documentation

✅ **Create docs when:**
- New feature added (How-To + Reference)
- API endpoint created (Reference)
- Architecture changes (Explanation)
- Complex workflow exists (Tutorial)
- Users ask the same question 3+ times (How-To)

❌ **Don't create docs for:**
- Self-explanatory code (already clear)
- Implementation details (use code comments instead)
- Temporary/experimental features (wait for stability)
- Internal developer tools (use README in that directory)

---

### When to Update Documentation

✅ **Update immediately when:**
- API changes (breaking or non-breaking)
- UI changes (screenshots, flows)
- Configuration changes (env vars, setup)
- Commands change (CLI, scripts)
- Security updates (auth, permissions)

⏰ **Update soon when:**
- Non-critical improvements
- Performance optimizations
- New optional features

---

## Validation Checklist

Before publishing documentation, verify:

- [ ] **Category**: Correct Diátaxis category (Tutorial/How-To/Reference/Explanation)
- [ ] **Accuracy**: All code examples work as shown
- [ ] **Completeness**: No TODO or placeholder content
- [ ] **Links**: All internal links resolve correctly
- [ ] **Code**: Examples use actual code from repository
- [ ] **Formatting**: Consistent heading structure, code blocks have language tags
- [ ] **Clarity**: Technical terms defined on first use
- [ ] **Voice**: Active voice, present tense, second person
- [ ] **Examples**: At least one working example included
- [ ] **Context**: Sufficient background provided

---

## Related Skills

- **docs__diataxis-framework** - Detailed Diátaxis categorization guide
- **wow__criticality-assessment** - For classifying documentation gaps

---

**Last Updated**: January 6, 2025
**Version**: 1.0
