# Database Schema Reference

PostgreSQL database schema for the Registration Form application.

## Overview

The application uses a PostgreSQL relational database with JPA (Java Persistence API) for object-relational mapping.

**Database Name:** `registration_form_db`
**PostgreSQL Version:** 14+
**ORM:** Spring Data JPA
**Migration Strategy:** JPA Auto DDL (hibernate.ddl-auto=update)

---

## Tables

### `users` Table

Stores registered user information with authentication credentials.

#### Schema

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | BIGSERIAL | PRIMARY KEY | Auto-incrementing user ID |
| `full_name` | VARCHAR(100) | NOT NULL | User's full name |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | User's email address (used for login) |
| `password` | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| `profile_picture` | VARCHAR(255) | NULL | Path to profile picture file (e.g., "profiles/user-83.jpg") |
| `created_at` | TIMESTAMP | NOT NULL | User creation timestamp |
| `updated_at` | TIMESTAMP | NULL | Last update timestamp |

#### Indexes

- **Primary Key**: `id`
- **Unique Index**: `email` (automatic via UNIQUE constraint)

#### SQL Create Statement

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on email for faster lookups
CREATE UNIQUE INDEX idx_users_email ON users(email);
```

---

## Entity Mappings

### User Entity

**Java Class:** `com.registrationform.api.entity.User`

**JPA Annotations:**
- `@Entity` - Marks class as JPA entity
- `@Table(name = "users")` - Maps to `users` table
- `@Id` - Primary key field
- `@GeneratedValue(strategy = GenerationType.IDENTITY)` - Auto-increment ID
- `@Column` - Column-level constraints

**Lifecycle Callbacks:**
- `@PrePersist` - Sets `created_at` and `updated_at` before insert
- `@PreUpdate` - Updates `updated_at` before update

**Example Entity Usage:**

```java
// Create new user
User user = new User("John Doe", "john@example.com", "hashedPassword");
userRepository.save(user);  // id, created_at, updated_at auto-set

// Update user
user.setFullName("John Smith");
userRepository.save(user);  // updated_at auto-updated
```

---

## Data Types & Constraints

### String Fields

| Field | Max Length | Validation |
|-------|-----------|------------|
| `full_name` | 100 chars | Min 2 chars (application-level) |
| `email` | 255 chars | Valid email format (application-level) |
| `password` | 255 chars | BCrypt hash (60 chars), min 8 chars plain (application-level) |
| `profile_picture` | 255 chars | Optional, relative file path (e.g., "profiles/user-83.jpg") |

### Timestamp Fields

- **Format:** ISO 8601 (`YYYY-MM-DD HH:MM:SS`)
- **Timezone:** Server local time (typically UTC in production)
- **Auto-managed:** `created_at` on insert, `updated_at` on update

### ID Generation

- **Strategy:** `IDENTITY` (PostgreSQL SERIAL)
- **Type:** BIGINT (supports up to 9,223,372,036,854,775,807 users)
- **Starting Value:** 1
- **Increment:** 1

---

## Database Configuration

### Application Properties

Located in: `backend/registration-form-api/src/main/resources/application.properties`

```properties
# Database connection
spring.datasource.url=jdbc:postgresql://localhost:5432/registration_form_db
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA/Hibernate configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### DDL Auto Modes

| Mode | Behavior |
|------|----------|
| `update` | **Current** - Updates schema, preserves data |
| `create` | Drops and creates schema on startup (data loss!) |
| `create-drop` | Creates on startup, drops on shutdown (testing) |
| `validate` | Validates schema matches entities (production) |
| `none` | No automatic schema management |

**Note:** Use `validate` or `none` in production with proper migrations (Flyway/Liquibase).

---

## Profile Picture Storage

### Overview

Profile pictures are stored in the filesystem and referenced in the database via the `profile_picture` column.

**Storage Pattern:**
- **Database:** Stores relative file path (e.g., `"profiles/user-83.jpg"`)
- **Filesystem:** Actual image files stored in `uploads/profiles/` directory
- **Access URL:** Served via `/uploads/profiles/user-83.jpg` endpoint

### File Naming Convention

```
Pattern: user-{userId}.{extension}
Examples:
  - user-1.jpg
  - user-83.png
  - user-150.gif
```

**Why this pattern?**
- Unique per user (one picture per user)
- Easy to identify file owner
- Automatic replacement when uploading new picture
- No orphaned files (old file replaced automatically)

### Database Operations

**Update profile picture on upload:**
```java
User user = userRepository.findById(userId).orElseThrow();
user.setProfilePicture("profiles/user-83.jpg");
userRepository.save(user);
```

**SQL equivalent:**
```sql
UPDATE users
SET profile_picture = 'profiles/user-83.jpg', updated_at = NOW()
WHERE id = 83;
```

**Delete profile picture:**
```java
User user = userRepository.findById(userId).orElseThrow();
user.setProfilePicture(null);
userRepository.save(user);
```

**SQL equivalent:**
```sql
UPDATE users
SET profile_picture = NULL, updated_at = NOW()
WHERE id = 83;
```

**Get users with profile pictures:**
```sql
SELECT id, full_name, email, profile_picture
FROM users
WHERE profile_picture IS NOT NULL;
```

**Get users without profile pictures:**
```sql
SELECT id, full_name, email
FROM users
WHERE profile_picture IS NULL;
```

### Migration Script

If adding this feature to existing database:

```sql
-- Add profile_picture column to existing users table
ALTER TABLE users ADD COLUMN profile_picture VARCHAR(255);

-- Optional: Add comment for documentation
COMMENT ON COLUMN users.profile_picture IS 'Relative path to user profile picture file';

-- Verify column added
\d users
```

### File Cleanup Strategy

**Manual cleanup (development):**
```sql
-- Find orphaned files (files exist but not in database)
-- Run this query to get current file paths
SELECT profile_picture FROM users WHERE profile_picture IS NOT NULL;

-- Compare with files in uploads/profiles/ directory
-- Delete files not in database
```

**Automatic cleanup (recommended):**
- Before uploading new file, delete old file if exists
- On user deletion, delete associated profile picture file
- Periodic cleanup job to remove orphaned files

### Storage Size Estimation

**Per user:**
- Average image size: 100-500 KB
- Maximum image size: 5 MB (enforced by application)

**For 1000 users:**
- Estimated: 100-500 MB storage
- Maximum: 5 GB (if all users upload max size)

**Database impact:**
- Column storage: ~30 bytes per row (VARCHAR path + NULL overhead)
- 1000 users: ~30 KB in database
- Minimal database size impact

---

## Queries & Operations

### Common Queries

**Find user by email:**
```java
Optional<User> user = userRepository.findByEmail("john@example.com");
```

**Find user by ID:**
```java
Optional<User> user = userRepository.findById(1L);
```

**Check if email exists:**
```java
boolean exists = userRepository.existsByEmail("john@example.com");
```

**Count total users:**
```java
long count = userRepository.count();
```

**Get all users:**
```java
List<User> users = userRepository.findAll();
```

**Get user with profile picture:**
```java
Optional<User> user = userRepository.findById(1L);
String pictureUrl = user.map(User::getProfilePicture)
    .map(path -> "http://localhost:8081/uploads/" + path)
    .orElse(null);
```

**Delete user:**
```java
userRepository.deleteById(1L);
```

### Repository Interface

**Location:** `com.registrationform.api.repository.UserRepository`

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}
```

**Extends:** `JpaRepository<User, Long>`
- Provides CRUD operations
- Automatic query derivation from method names
- Pagination and sorting support

---

## Security Considerations

### Password Storage

- **Never** store plain-text passwords
- Use **BCrypt** hashing (60-character hash)
- Hash strength: 10 rounds (configurable)
- Example hash: `$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy`

### Email Uniqueness

- Enforced at database level (UNIQUE constraint)
- Validated at application level before save
- Prevents duplicate account creation
- Case-insensitive checking recommended (application-level)

### SQL Injection Prevention

- **JPA/Hibernate** handles parameterized queries
- **Never** use string concatenation for queries
- Repository methods are injection-safe

---

## Database Setup

### PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Database Creation

```sql
-- Connect to PostgreSQL
psql -U postgres

-- Create database
CREATE DATABASE registration_form_db;

-- Create user (if not using default postgres user)
CREATE USER regform_user WITH PASSWORD 'your_password';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE registration_form_db TO regform_user;
```

### Table Creation

JPA will auto-create tables when application starts (with `ddl-auto=update`).

Or manually:
```sql
-- Connect to database
\c registration_form_db

-- Create users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Testing Data

### Sample Data for Development

```sql
-- Insert test users (passwords are BCrypt hashed "password123")
INSERT INTO users (full_name, email, password, profile_picture, created_at, updated_at) VALUES
('Test User', 'test@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', NULL, NOW(), NOW()),
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'profiles/user-2.jpg', NOW(), NOW());
```

### Cleanup Test Data

```sql
-- Delete test users
DELETE FROM users WHERE email LIKE '%@example.com';

-- Or delete specific user
DELETE FROM users WHERE email = 'test@example.com';
```

---

## Maintenance

### Backup Database

```bash
# Backup
pg_dump -U postgres registration_form_db > backup.sql

# Restore
psql -U postgres registration_form_db < backup.sql
```

### View Table Info

```sql
-- Connect to database
\c registration_form_db

-- Describe table
\d users

-- Count users
SELECT COUNT(*) FROM users;

-- View recent users
SELECT id, full_name, email, created_at FROM users ORDER BY created_at DESC LIMIT 10;

-- View users with profile pictures
SELECT id, full_name, email, profile_picture FROM users WHERE profile_picture IS NOT NULL;
```

---

## Future Schema Changes

### Potential Additions

**User Roles/Permissions:**
```sql
ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'USER';
```

**Email Verification:**
```sql
ALTER TABLE users ADD COLUMN email_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN verification_token VARCHAR(255);
```

**Account Status:**
```sql
ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN last_login TIMESTAMP;
```

**Extended User Profile:**
```sql
CREATE TABLE user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    bio TEXT,
    phone_number VARCHAR(20),
    location VARCHAR(100),
    website_url VARCHAR(255)
);
```

**Profile Picture Metadata (if needed):**
```sql
CREATE TABLE profile_pictures (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) UNIQUE,
    file_path VARCHAR(255) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(50),
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Note: Current implementation stores profile picture path directly in `users` table, which is simpler and sufficient for most use cases.

---

## Related Documentation

- [API Endpoints](./api-endpoints.md) - REST API reference
- [Authentication Architecture](../explanation/authentication-architecture.md) - JWT authentication flow
- [Profile Picture Upload How-to](../how-to/upload-profile-picture.md) - Implementation guide
- [Getting Started Tutorial](../tutorials/getting-started.md) - Setup guide

---

## Troubleshooting

### Common Issues

**Connection refused:**
```
# Check if PostgreSQL is running
brew services list  # macOS
sudo systemctl status postgresql  # Linux
```

**Database doesn't exist:**
```sql
-- List databases
\l

-- Create if missing
CREATE DATABASE registration_form_db;
```

**Permission denied:**
```sql
-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE registration_form_db TO postgres;
```

---

**Last Updated:** 2025-10-31
**Schema Version:** 1.1 (Added profile_picture column)
