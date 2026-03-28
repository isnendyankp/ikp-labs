# IKP Labs Backend Documentation

Dokumentasi lengkap untuk backend API IKP Labs - Photo Gallery Application.

---

## Contents

### Planning Documents
- **[BACKEND_PLAN.md](BACKEND_PLAN.md)** - Complete backend development plan with step-by-step implementation guide

### Testing Documents
- **[TESTING_STEP_5.3.md](TESTING_STEP_5.3.md)** - Registration endpoint testing (completed)
- **[TESTING_STEP_5.4.md](TESTING_STEP_5.4.md)** - Login endpoint testing (completed)

---

## Implemented Features

### Authentication & Security
| Feature | Status | Description |
|---------|--------|-------------|
| User Registration | Completed | Register with email, password, full name |
| User Login | Completed | JWT-based authentication |
| JWT Token Refresh | Completed | Refresh expired tokens |
| Token Validation | Completed | Validate JWT tokens |
| BCrypt Password Hashing | Completed | Secure password storage |
| CORS Configuration | Completed | Cross-origin support for frontend |
| Spring Security | Completed | Request filtering and authorization |

### Gallery Features
| Feature | Status | Description |
|---------|--------|-------------|
| Photo Upload | Completed | Upload photos with title and description |
| My Photos | Completed | Get current user's photos |
| Public Gallery | Completed | View all public photos |
| Photo Details | Completed | Get, update, delete photos |
| Privacy Toggle | Completed | Make photos public/private |

### Social Features
| Feature | Status | Description |
|---------|--------|-------------|
| Photo Likes | Completed | Like/unlike photos |
| Liked Photos List | Completed | View user's liked photos |
| Photo Favorites | Completed | Favorite/unfavorite photos |
| Favorited Photos List | Completed | View user's favorited photos |

### Profile Features
| Feature | Status | Description |
|---------|--------|-------------|
| Profile Picture Upload | Completed | Upload profile picture |
| Profile Picture Management | Completed | Get, delete profile pictures |
| User Profile | Completed | View user profile |
| User Dashboard | Completed | Dashboard data |
| User Settings | Completed | User settings |

### User Management
| Feature | Status | Description |
|---------|--------|-------------|
| CRUD Operations | Completed | Create, read, update, delete users |
| Email Lookup | Completed | Find users by email |
| User Count | Completed | Get total user count |
| Email Validation | Completed | Check if email exists |

---

## API Endpoints Summary

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register new user |
| POST | `/login` | Login and get JWT |
| POST | `/refresh` | Refresh JWT token |
| POST | `/validate` | Validate token |
| GET | `/health` | Health check |

### Gallery (`/api/gallery`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload` | Upload photo |
| GET | `/my-photos` | Get user's photos |
| GET | `/public` | Get public photos |
| GET | `/user/{userId}/public` | Get user's public photos |
| GET | `/photo/{photoId}` | Get photo by ID |
| PUT | `/photo/{photoId}` | Update photo |
| DELETE | `/photo/{photoId}` | Delete photo |
| PUT | `/photo/{photoId}/toggle-privacy` | Toggle privacy |
| POST | `/photo/{photoId}/like` | Like photo |
| DELETE | `/photo/{photoId}/like` | Unlike photo |
| GET | `/liked-photos` | Get liked photos |
| POST | `/photo/{photoId}/favorite` | Favorite photo |
| DELETE | `/photo/{photoId}/favorite` | Unfavorite photo |
| GET | `/favorited-photos` | Get favorited photos |

### Profile (`/api/profile`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-picture` | Upload profile picture |
| DELETE | `/picture` | Delete profile picture |
| GET | `/picture` | Get own profile picture |
| GET | `/picture/{userId}` | Get user's profile picture |

### User (`/api/users`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/` | Create user |
| GET | `/` | Get all users |
| GET | `/{id}` | Get user by ID |
| PUT | `/{id}` | Update user |
| DELETE | `/{id}` | Delete user |
| GET | `/email/{email}` | Get user by email |
| GET | `/count` | Get user count |
| GET | `/check-email/{email}` | Check email exists |

### User Profile (`/api/user`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get user profile |
| GET | `/dashboard` | Get dashboard |
| GET | `/settings` | Get settings |

---

## Architecture

### Controllers (10)
- `AuthController` - Authentication endpoints
- `GalleryController` - Photo gallery management
- `PhotoLikeController` - Photo likes
- `PhotoFavoriteController` - Photo favorites
- `ProfileController` - Profile picture management
- `UserController` - User CRUD operations
- `UserProfileController` - User profile data
- `HelloController` - Basic API test
- `JwtTestController` - JWT testing
- `TestAdminController` - Test administration

### Entities (4)
- `User` - User account data
- `GalleryPhoto` - Photo gallery items
- `PhotoLike` - Photo like records
- `PhotoFavorite` - Photo favorite records

### Services (6)
- `AuthService` - Authentication logic
- `GalleryService` - Gallery operations
- `PhotoLikeService` - Like operations
- `PhotoFavoriteService` - Favorite operations
- `UserService` - User management
- `FileStorageService` - File upload handling

---

## Related Documentation

- [Backend README](../README.md) - Quick start guide
- [Frontend Documentation](../../frontend/docs/) - Frontend docs
- [Project README](../../README.md) - Main project overview
- [Deployment Guide](../../deployment/deployment-guide.md) - Production deployment

---

## How to Use These Docs

1. **For Development**: Follow BACKEND_PLAN.md step-by-step
2. **For Testing**: Use TESTING_STEP_5.x.md files as testing checklists
3. **For API Reference**: Check API Endpoints Summary above
4. **For Architecture**: Review Controllers, Entities, and Services

---

Last updated: March 2026
