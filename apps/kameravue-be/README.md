# IKP Labs Backend API

Backend API untuk aplikasi IKP Labs - Photo Gallery dengan fitur autentikasi, upload foto, likes, dan favorites.

---

## Tech Stack

| Technology      | Version            |
| --------------- | ------------------ |
| Java            | 17+                |
| Spring Boot     | 3.3+               |
| PostgreSQL      | 16                 |
| Spring Security | JWT Authentication |
| Maven           | Build Tool         |

---

## Project Structure

```text
backend/
├── ikp-labs-api/           # Main Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ikplabs/api/
│   │   │   │   ├── config/        # Configuration classes
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── entity/        # JPA Entities
│   │   │   │   ├── repository/    # JPA Repositories
│   │   │   │   ├── security/      # Security & JWT
│   │   │   │   └── service/       # Business Logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/                  # Test files
│   └── pom.xml
└── docs/                          # Documentation
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint    | Description             | Auth Required |
| ------ | ----------- | ----------------------- | ------------- |
| POST   | `/register` | Register new user       | No            |
| POST   | `/login`    | Login user, returns JWT | No            |
| POST   | `/refresh`  | Refresh JWT token       | Yes           |
| POST   | `/validate` | Validate JWT token      | Yes           |
| GET    | `/health`   | Health check endpoint   | No            |

### Gallery (`/api/gallery`)

| Method | Endpoint                          | Description               | Auth Required |
| ------ | --------------------------------- | ------------------------- | ------------- |
| POST   | `/upload`                         | Upload new photo          | Yes           |
| GET    | `/my-photos`                      | Get current user's photos | Yes           |
| GET    | `/public`                         | Get all public photos     | No            |
| GET    | `/user/{userId}/public`           | Get user's public photos  | No            |
| GET    | `/photo/{photoId}`                | Get photo by ID           | Yes           |
| PUT    | `/photo/{photoId}`                | Update photo details      | Yes           |
| DELETE | `/photo/{photoId}`                | Delete photo              | Yes           |
| PUT    | `/photo/{photoId}/toggle-privacy` | Toggle photo privacy      | Yes           |

### Photo Likes (`/api/gallery`)

| Method | Endpoint                | Description             | Auth Required |
| ------ | ----------------------- | ----------------------- | ------------- |
| POST   | `/photo/{photoId}/like` | Like a photo            | Yes           |
| DELETE | `/photo/{photoId}/like` | Unlike a photo          | Yes           |
| GET    | `/liked-photos`         | Get user's liked photos | Yes           |

### Photo Favorites (`/api/gallery`)

| Method | Endpoint                    | Description                 | Auth Required |
| ------ | --------------------------- | --------------------------- | ------------- |
| POST   | `/photo/{photoId}/favorite` | Favorite a photo            | Yes           |
| DELETE | `/photo/{photoId}/favorite` | Unfavorite a photo          | Yes           |
| GET    | `/favorited-photos`         | Get user's favorited photos | Yes           |

### Profile (`/api/profile`)

| Method | Endpoint            | Description                | Auth Required |
| ------ | ------------------- | -------------------------- | ------------- |
| POST   | `/upload-picture`   | Upload profile picture     | Yes           |
| DELETE | `/picture`          | Delete profile picture     | Yes           |
| GET    | `/picture`          | Get own profile picture    | Yes           |
| GET    | `/picture/{userId}` | Get user's profile picture | Yes           |

### User (`/api/users`)

| Method | Endpoint               | Description           | Auth Required |
| ------ | ---------------------- | --------------------- | ------------- |
| POST   | `/`                    | Create new user       | Yes           |
| GET    | `/`                    | Get all users         | Yes           |
| GET    | `/{id}`                | Get user by ID        | Yes           |
| PUT    | `/{id}`                | Update user           | Yes           |
| DELETE | `/{id}`                | Delete user           | Yes           |
| GET    | `/email/{email}`       | Get user by email     | Yes           |
| GET    | `/count`               | Get total user count  | Yes           |
| GET    | `/check-email/{email}` | Check if email exists | Yes           |

### User Profile (`/api/user`)

| Method | Endpoint     | Description        | Auth Required |
| ------ | ------------ | ------------------ | ------------- |
| GET    | `/profile`   | Get user profile   | Yes           |
| GET    | `/dashboard` | Get user dashboard | Yes           |
| GET    | `/settings`  | Get user settings  | Yes           |

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Gallery Photos Table

```sql
CREATE TABLE gallery_photos (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    title VARCHAR(255),
    description TEXT,
    file_path VARCHAR(500) NOT NULL,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Photo Likes Table

```sql
CREATE TABLE photo_likes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    photo_id BIGINT REFERENCES gallery_photos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, photo_id)
);
```

### Photo Favorites Table

```sql
CREATE TABLE photo_favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    photo_id BIGINT REFERENCES gallery_photos(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, photo_id)
);
```

---

## Getting Started

### Prerequisites

- Java 17+
- PostgreSQL 16+
- Maven 3.6+

### Local Development

1. **Clone repository**

   ```bash
   git clone https://github.com/isnendyankp/ikp-labs.git
   cd ikp-labs/backend/ikp-labs-api
   ```

2. **Configure database**

   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ikp_labs
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Create database**

   ```bash
   createdb ikp_labs
   ```

4. **Run application**

   ```bash
   ./mvnw spring-boot:run
   ```

5. **Verify**
   - API running at: <http://localhost:8081>
   - Health check: <http://localhost:8081/api/auth/health>

---

## Testing

```bash
# Run all tests
./mvnw test

# Run integration tests
./mvnw verify
```

---

## Production

Production deployment guide available in:

- [deployment/deployment-guide.md](../deployment/deployment-guide.md)

Production URL: <https://api.kameravue.com>

---

## Related Documentation

- [Backend Documentation](docs/README.md) - Detailed development docs
- [Frontend README](../frontend/README.md) - Frontend documentation
- [Main README](../README.md) - Project overview

---

Last updated: March 2026
