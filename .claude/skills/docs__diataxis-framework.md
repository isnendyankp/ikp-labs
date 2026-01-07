# Skill: Diátaxis Framework

**Category**: Documentation
**Purpose**: Guide for categorizing documentation using Diátaxis framework
**Used By**: documentation-writer, docs-validator

---

## Overview

The **Diátaxis framework** is a systematic approach to organizing technical documentation into **four distinct types**, each serving a different user need and purpose.

**Framework Philosophy:**
> Documentation should be structured around **what the user needs to do**, not around the system's architecture.

**The Four Quadrants:**

```
                    LEARNING              DOING
               ┌─────────────┬─────────────┐
               │             │             │
  ACQUISITION  │  TUTORIALS  │  HOW-TO     │  PRACTICAL
               │             │  GUIDES     │
               │  Teaching   │  Problem-   │
               │             │  solving    │
               ├─────────────┼─────────────┤
               │             │             │
  THEORETICAL  │ EXPLANATION │  REFERENCE  │  INFORMATION
               │             │             │
               │Understanding│ Information │
               │             │  lookup     │
               └─────────────┴─────────────┘
                 UNDERSTANDING          KNOWLEDGE
```

---

## The Four Categories

### 1. **Tutorials** (Learning-Oriented)

**Purpose**: Help beginners **learn** by doing a complete task

**Characteristics:**
- **Learning-oriented**: Designed for absolute beginners
- **Step-by-step**: Sequential instructions (1, 2, 3...)
- **Complete project**: User builds something working from scratch
- **Safe to follow**: Guaranteed to work if followed exactly
- **Educational**: Explains *what* they're doing as they do it
- **Forgiving**: Anticipates mistakes, provides solutions

**Analogy**: A cooking class where the teacher guides you through making a complete dish

**Location**: `docs/tutorials/`

**Examples from IKP-Labs:**
- `getting-started.md` - First-time setup and hello world
- `first-photo-upload.md` - Upload your first gallery photo
- `build-your-first-feature.md` - Add a like button step-by-step

**Structure:**
```markdown
# Tutorial Title

**What you'll build**: [Brief description]
**Time**: 30 minutes
**Prerequisites**: None (or minimal)

## Before you begin
- Requirement 1
- Requirement 2

## Step 1: [First action]
[Detailed instructions with expected output]

## Step 2: [Next action]
[Continue building...]

## What you learned
- Concept 1
- Concept 2

## Next steps
- Related tutorial
- Next skill level
```

**Writing Guidelines:**

✅ **DO:**
- Start from zero (assume no prior knowledge)
- Provide ALL code, don't skip steps
- Show expected output at each step
- Use encouraging language ("Great! You've just...")
- Test tutorial yourself before publishing

❌ **DON'T:**
- Skip "obvious" steps (not obvious to beginners!)
- Use advanced concepts without explanation
- Branch into alternatives ("You could also...")
- Make user make decisions (remove cognitive load)

**Example Good Tutorial Section:**

```markdown
## Step 3: Upload Your First Photo

Now let's upload a photo to the gallery.

### 1. Click the Upload Button

On the Gallery page, find the blue **Upload Photo** button in the top right.

### 2. Select a Photo

When the file picker opens, choose any image file (JPG or PNG).

**Note**: For this tutorial, use an image smaller than 5MB.

### 3. Add a Title

In the title field, type: "My First Photo"

### 4. Click Submit

Click the green **Submit** button.

**What should happen:**
- A loading spinner appears briefly
- Your photo appears at the top of the gallery
- Success message: "Photo uploaded successfully!"

**Screenshot**: [Image showing the result]

✅ **Success!** You've just uploaded your first photo to IKP-Labs gallery!
```

---

### 2. **How-To Guides** (Problem-Solving)

**Purpose**: Show **how to solve** a specific, real-world problem

**Characteristics:**
- **Goal-oriented**: User has a specific problem to solve
- **Assumes knowledge**: User knows basics already
- **Focused**: Solves ONE problem, not everything
- **Practical**: Real-world scenarios, not idealized
- **Flexible**: May show alternatives/options
- **Concise**: Gets to the point quickly

**Analogy**: A recipe in a cookbook (you already know how to cook, just need this recipe)

**Location**: `docs/how-to/`

**Examples from IKP-Labs:**
- `run-e2e-tests.md` - How to run end-to-end tests
- `sort-gallery-photos.md` - How to use photo sorting feature
- `configure-authentication.md` - How to set up JWT auth
- `deploy-to-production.md` - How to deploy the application

**Structure:**
```markdown
# How to [Achieve Goal]

**Goal**: [What user will accomplish]
**Prerequisites**: [What they need to know/have]
**Time**: 10-15 minutes

## Overview
[Brief context of the problem]

## Steps

### 1. [First action]
[Clear instructions]

### 2. [Next action]
[Continue...]

## Troubleshooting

**Problem**: [Common issue]
**Solution**: [How to fix]

## Related guides
- [Link to related how-to]
```

**Writing Guidelines:**

✅ **DO:**
- State the goal upfront (user knows if this is for them)
- List prerequisites (required knowledge/tools)
- Provide alternatives when multiple solutions exist
- Include troubleshooting section
- Link to related guides

❌ **DON'T:**
- Teach basics (user already knows them)
- Explain *why* at length (save for Explanation docs)
- Cover every edge case (focus on common scenario)
- Make it a tutorial (assume competence)

**Example Good How-To Section:**

```markdown
# How to Sort Gallery Photos

**Goal**: Sort photos by different criteria (newest, oldest, most liked)
**Prerequisites**:
- Backend and frontend servers running
- At least 5 photos in gallery
**Time**: 5 minutes

## Steps

### 1. Navigate to Gallery Page

Go to http://localhost:3002/gallery

### 2. Select Sort Option

Click the **Sort** dropdown and choose:
- **Newest First** - Most recent uploads (default)
- **Oldest First** - Earliest uploads
- **Most Liked** - Sorted by like count
- **Most Favorited** - Sorted by favorite count

### 3. Verify Sorting

Photos reorder immediately. Check the URL updates to include `?sortBy=[option]`.

## Combining Filters and Sorting

You can combine any filter with any sort:
- Liked photos + Oldest first
- My photos + Most liked

## Troubleshooting

**Photos don't reorder:**
Check browser console for errors. Verify backend is running:
```bash
curl http://localhost:8081/api/gallery/public?sortBy=mostLiked
```

**Expected**: JSON array of photos sorted by like count.

## Related
- [API Reference: Gallery Endpoints](../reference/api-endpoints.md)
- [How to Like Photos](./like-photos.md)
```

---

### 3. **Reference** (Information-Oriented)

**Purpose**: Provide **technical descriptions** - the "dictionary" of your project

**Characteristics:**
- **Information-oriented**: Pure facts, no teaching
- **Comprehensive**: Covers all options/parameters
- **Structured**: Consistent format (like a table)
- **Searchable**: Easy to find specific information
- **Dry**: No narrative, just facts
- **Up-to-date**: Must be accurate at all times

**Analogy**: A dictionary or encyclopedia (look up facts)

**Location**: `docs/reference/`

**Examples from IKP-Labs:**
- `api-endpoints.md` - All API endpoints with parameters
- `environment-variables.md` - All env vars and their purpose
- `database-schema.md` - All tables and columns
- `error-codes.md` - All error codes and meanings

**Structure:**
```markdown
# [Component] Reference

## [Item 1]

**Description**: [What it is]

**Parameters/Properties:**
| Name | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| ... | ... | ... | ... | ... |

**Example**:
```[language]
[Code example]
```

**Returns/Response**: [What it returns]

## [Item 2]
[Repeat structure]
```

**Writing Guidelines:**

✅ **DO:**
- Use consistent format for all entries
- Provide complete parameter lists
- Include type information
- Show request/response examples
- Link to implementation (code files)

❌ **DON'T:**
- Add explanatory prose (save for Explanation)
- Include "how to use" (save for How-To)
- Skip any parameters/options
- Use narrative style

**Example Good Reference Section:**

```markdown
# Gallery API Reference

## GET /api/gallery/public

Retrieve paginated list of public photos.

**Endpoint**: `GET /api/gallery/public`

**Authentication**: Required (JWT token)

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| page | integer | No | 0 | Page number (0-indexed) |
| size | integer | No | 12 | Items per page (1-100) |
| sortBy | string | No | newest | Sort: `newest`, `oldest`, `mostLiked`, `mostFavorited` |

**Response 200 OK**:

```json
{
  "photos": [
    {
      "id": 123,
      "title": "Sunset",
      "likeCount": 42,
      "createdAt": "2025-01-06T10:00:00"
    }
  ],
  "totalPages": 5,
  "currentPage": 0
}
```

**Response 400 Bad Request**:

```json
{
  "error": "Invalid sortBy value"
}
```

**Response 401 Unauthorized**:

```json
{
  "error": "Authentication required"
}
```

**Implementation**: [GalleryController.java:45](../../backend/.../GalleryController.java#L45)

**Tests**: [gallery.api.spec.ts:12](../../tests/api/gallery.api.spec.ts#L12)
```

---

### 4. **Explanation** (Understanding-Oriented)

**Purpose**: **Clarify and illuminate** concepts, design decisions, architecture

**Characteristics:**
- **Understanding-oriented**: Helps user comprehend *why*
- **Contextual**: Provides background and history
- **Discursive**: Can be narrative and exploratory
- **Alternative perspectives**: Discusses trade-offs
- **Theoretical**: Not tied to specific tasks
- **Illuminating**: Connects concepts

**Analogy**: A lecture or essay explaining a concept

**Location**: `docs/explanation/`

**Examples from IKP-Labs:**
- `architecture-overview.md` - System design and component interaction
- `authentication-strategy.md` - Why JWT, not sessions
- `diátaxis-framework.md` - Why we organize docs this way
- `testing-philosophy.md` - Our testing approach and rationale

**Structure:**
```markdown
# [Concept] Explained

## Overview
[What this is about]

## Context
[Why this matters, historical background]

## The Problem
[What challenge does this address]

## Our Approach
[How we address it]

## Why This Way
[Rationale for decisions]

## Alternatives Considered
[What else we could have done]

## Trade-offs
[Pros and cons]

## Related Concepts
[Links to other explanations]
```

**Writing Guidelines:**

✅ **DO:**
- Provide context and background
- Discuss trade-offs openly
- Mention alternatives considered
- Explain *why*, not just *what*
- Connect to broader concepts

❌ **DON'T:**
- Give step-by-step instructions (use How-To)
- List all parameters (use Reference)
- Teach from scratch (use Tutorial)
- Skip the "why" (that's the whole point!)

**Example Good Explanation Section:**

```markdown
# Authentication Strategy Explained

## Overview

IKP-Labs uses **JWT (JSON Web Tokens)** for authentication instead of traditional server-side sessions.

## Context

When we started the project, we needed to decide how users would authenticate. The two main approaches were:

1. **Session-based**: Server stores session data
2. **Token-based**: Client stores token, server verifies

## The Problem

Our requirements:
- Stateless API (for horizontal scaling)
- Mobile app support (future)
- Microservices architecture (future)

Session-based authentication would require:
- Shared session store (Redis cluster)
- Session synchronization across servers
- Complex mobile client implementation

## Our Approach: JWT Tokens

We chose JWT because:

### 1. Stateless
Server doesn't store session data. Token contains all necessary information:
```json
{
  "userId": 123,
  "email": "user@example.com",
  "role": "USER",
  "exp": 1704567890
}
```

### 2. Self-Contained
Token is cryptographically signed. Server can verify authenticity without database lookup.

### 3. Scalable
Any server can validate any token. No session synchronization needed.

### 4. Mobile-Friendly
Token stored in mobile app, sent with each request. No cookies needed.

## Alternatives Considered

### Sessions + Redis
**Pros**:
- Can revoke immediately (server controls)
- Smaller payload size

**Cons**:
- Requires Redis cluster (infrastructure cost)
- Network latency for session lookup
- Complex multi-datacenter setup

**Why we rejected**: Added complexity outweighed benefits for our scale.

### OAuth 2.0
**Pros**:
- Industry standard
- Third-party login (Google, GitHub)

**Cons**:
- More complex implementation
- Requires OAuth provider setup

**Why we rejected**: Too complex for MVP. Can add later if needed.

## Trade-offs

### JWT Advantages
✅ Stateless (scales horizontally)
✅ No session store required
✅ Works across microservices
✅ Mobile-friendly

### JWT Disadvantages
❌ Cannot revoke before expiry (logout is client-side only)
❌ Larger payload than session ID
❌ Sensitive data in token (must not include secrets)

### Our Mitigation
- Short expiry time (24 hours)
- Refresh token mechanism (planned)
- Token blacklist for critical logout (future)

## How It Works

1. User logs in → Server generates JWT
2. Client stores JWT (localStorage)
3. Client includes JWT in every request (Authorization header)
4. Server verifies signature + expiry
5. Request proceeds if valid

See: [How to Authenticate](../how-to/authenticate.md) for implementation details

## Related
- [Security Best Practices](./security.md)
- [API Authentication Reference](../reference/api-endpoints.md#authentication)
```

---

## Decision Tree for Categorization

Use this flowchart to categorize documentation:

```
START: I need to write documentation

   ↓

Q1: Is this teaching a complete beginner?
   YES → TUTORIAL
   NO  → Continue

   ↓

Q2: Is this solving a specific problem?
   YES → HOW-TO GUIDE
   NO  → Continue

   ↓

Q3: Is this describing technical specifications?
   YES → REFERENCE
   NO  → Continue

   ↓

Q4: Is this explaining concepts or design decisions?
   YES → EXPLANATION
   NO  → Re-evaluate (must be one of the four!)
```

**Alternative Decision Questions:**

| Question | Tutorial | How-To | Reference | Explanation |
|----------|----------|--------|-----------|-------------|
| **Purpose?** | Learn | Solve | Lookup | Understand |
| **User is...** | Studying | Working | Searching | Thinking |
| **User wants...** | Skills | Solution | Facts | Insight |
| **Answers what?** | "Can you teach me?" | "How do I?" | "What is?" | "Why?" |
| **Must be...** | Safe to follow | Practical | Accurate | Illuminating |

---

## Project-Specific Examples

### Current Documentation in IKP-Labs

#### Tutorials (`docs/tutorials/`)
*Currently:* None (opportunity to create!)

**Suggestions**:
- `getting-started.md` - Setup and first photo upload
- `build-like-feature.md` - Add like functionality from scratch

#### How-To Guides (`docs/how-to/`)
✅ **Existing**:
- `run-e2e-tests.md` - Run Playwright tests
- `sort-gallery-photos.md` - Use sorting feature

**Could add**:
- `deploy-frontend.md`
- `add-new-api-endpoint.md`

#### Reference (`docs/reference/`)
✅ **Existing**:
- `api-endpoints.md` - All API endpoints

**Could add**:
- `environment-variables.md`
- `database-schema.md`
- `component-props.md` (React components)

#### Explanation (`docs/explanation/`)
*Currently:* None

**Suggestions**:
- `architecture-overview.md` - System design
- `why-monorepo.md` - Monorepo decision rationale
- `testing-strategy.md` - Our testing philosophy

---

## Common Categorization Mistakes

### ❌ Mistake 1: Tutorial in How-To Location

**Bad**: `docs/how-to/getting-started.md`
```markdown
# How to Get Started

Step 1: Install Node.js
Step 2: Clone repository
[Complete beginner walkthrough...]
```

**Why wrong**: This is teaching beginners (Tutorial), not solving a specific problem (How-To)

**Fix**: Move to `docs/tutorials/getting-started.md`

---

### ❌ Mistake 2: Explanation in Reference

**Bad**: `docs/reference/authentication.md`
```markdown
# Authentication Reference

We chose JWT because it's stateless and scalable.
Traditional sessions require Redis...
[Long discussion of trade-offs]
```

**Why wrong**: This is explaining *why* (Explanation), not listing facts (Reference)

**Fix**:
- Create `docs/explanation/authentication-strategy.md` for the "why"
- Keep `docs/reference/api-endpoints.md#authentication` for the technical specs

---

### ❌ Mistake 3: How-To as Tutorial

**Bad**: `docs/tutorials/deploy-app.md`
```markdown
# Deploy Application Tutorial

Prerequisites:
- AWS account configured
- Docker installed
- CI/CD pipeline setup

Step 1: Push to main branch
[Assumes lots of prior knowledge]
```

**Why wrong**: Assumes too much knowledge for a tutorial, more like a How-To

**Fix**: Move to `docs/how-to/deploy-to-aws.md`

---

### ❌ Mistake 4: Reference with Instructions

**Bad**: `docs/reference/api-endpoints.md`
```markdown
## POST /api/auth/login

To log in, first make sure you have an account.
Then, send a POST request with email and password.
The server will validate...
[Narrative instructions]
```

**Why wrong**: Reference should be factual, not instructional

**Fix**:
- Reference: Just list endpoint, parameters, responses
- How-To: Create `docs/how-to/authenticate.md` for step-by-step

---

## Migration Guide

### Converting Existing Docs to Diátaxis

If you have existing documentation not following Diátaxis:

**Step 1: Audit Current Docs**
```bash
# List all markdown files
find docs/ -name "*.md"

# For each file, ask: Tutorial/How-To/Reference/Explanation?
```

**Step 2: Categorize**
Create a spreadsheet:

| Current File | Category | New Location | Action |
|--------------|----------|--------------|--------|
| setup.md | Tutorial | docs/tutorials/getting-started.md | Move |
| api.md | Reference | docs/reference/api-endpoints.md | Keep |
| deploy.md | How-To | docs/how-to/deploy-to-production.md | Move |

**Step 3: Reorganize**
```bash
# Move files to correct locations
mv docs/setup.md docs/tutorials/getting-started.md
mv docs/deploy.md docs/how-to/deploy-to-production.md
```

**Step 4: Update Links**
```bash
# Find all references to moved files
grep -r "setup.md" docs/

# Update links in other docs
```

**Step 5: Update Navigation**
Update `docs/README.md` to reflect new structure:

```markdown
# Documentation

## Tutorials
- [Getting Started](tutorials/getting-started.md)

## How-To Guides
- [Deploy to Production](how-to/deploy-to-production.md)
- [Run E2E Tests](how-to/run-e2e-tests.md)

## Reference
- [API Endpoints](reference/api-endpoints.md)

## Explanation
- [Architecture Overview](explanation/architecture.md)
```

---

## Validation Checklist

Before publishing categorized documentation:

**Category Validation:**
- [ ] File is in correct directory (`docs/tutorials/`, `how-to/`, `reference/`, `explanation/`)
- [ ] Content matches category purpose (teaching/solving/describing/explaining)
- [ ] Writing style matches category (step-by-step vs concise vs factual vs discursive)

**Tutorial Checklist:**
- [ ] Starts from zero (beginner-friendly)
- [ ] Every step included (no gaps)
- [ ] Expected output shown
- [ ] Tested recently (actually works)

**How-To Checklist:**
- [ ] Clear goal stated upfront
- [ ] Prerequisites listed
- [ ] Focused on one problem
- [ ] Troubleshooting section included

**Reference Checklist:**
- [ ] All parameters documented
- [ ] Consistent format used
- [ ] No narrative prose
- [ ] Examples provided

**Explanation Checklist:**
- [ ] Context provided
- [ ] Trade-offs discussed
- [ ] Alternatives mentioned
- [ ] Links to related concepts

---

## Related Skills

- **docs__quality-standards** - Overall documentation quality rules
- **wow__criticality-assessment** - For classifying documentation gaps

---

**Last Updated**: January 6, 2025
**Version**: 1.0
**Reference**: https://diataxis.fr/
