# 🚀 Registration Form Backend - Learning Plan

## 📋 Project Overview
Membuat backend API untuk Registration Form menggunakan **Java Spring Boot + PostgreSQL** yang akan terintegrasi dengan frontend React/Next.js yang sudah ada.

## 🎯 Learning Objectives
Setelah menyelesaikan project ini, Anda akan memahami:
1. **Spring Boot Fundamentals** - Setup project, annotations, dependency injection
2. **REST API Development** - Controllers, HTTP methods, request/response handling
3. **Database Integration** - PostgreSQL, JPA/Hibernate, repository pattern
4. **Authentication & Security** - JWT tokens, password hashing, Spring Security
5. **API Integration** - Connect backend dengan frontend React
6. **Testing & Documentation** - Unit tests, API testing dengan Postman

## 🛠️ Tech Stack
- **Backend Framework:** Spring Boot 3.2+
- **Language:** Java 17+
- **Database:** PostgreSQL
- **Security:** Spring Security + JWT
- **Build Tool:** Maven
- **Testing:** JUnit, Postman

## 📊 Database Schema (Basic)
```sql
-- users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🔌 API Endpoints (Planned)
```
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login user
GET  /api/user/profile     # Get user profile (protected)
PUT  /api/user/profile     # Update user profile (protected)
```

## 📚 Step-by-Step Learning Phases

### 🏗️ Phase 1: Environment Setup & Hello World ✅ COMPLETED
**Goal:** Setup development environment dan buat basic Spring Boot app
- [x] **Step 1.1:** Verify Java 17+ installation
- [x] **Step 1.2:** Verify PostgreSQL installation
- [x] **Step 1.3:** Create Spring Boot project structure
- [x] **Step 1.4:** Add basic dependencies (web, jpa, postgresql)
- [x] **Step 1.5:** Create simple "Hello World" controller
- [x] **Step 1.6:** Test basic HTTP endpoints
- [x] **Step 1.7:** Understand project structure

**Expected Output:** Server running di http://localhost:8081 dengan basic endpoints ✅

---

### 🗄️ Phase 2: Database Connection & Setup ✅ COMPLETED
**Goal:** Connect ke PostgreSQL dan setup basic database operations
- [x] **Step 2.1:** Create PostgreSQL database "registrationform_db"
- [x] **Step 2.2:** Configure application.properties untuk database connection
- [x] **Step 2.3:** Test database connection startup
- [x] **Step 2.4:** Create User entity dengan JPA annotations
- [x] **Step 2.5:** Create UserRepository interface
- [x] **Step 2.6:** Test database dengan simple CRUD operations

**Expected Output:** Database terhubung, table users ter-create otomatis ✅

---

### 👤 Phase 3: User Management (Tanpa Security)
**Goal:** Buat basic user operations (CRUD) tanpa authentication dulu
- [x] **Step 3.1:** Create UserService untuk business logic ✅
- [x] **Step 3.2:** Create UserController dengan endpoints ✅
- [x] **Step 3.3:** Create DTOs (UserRequest, UserResponse) ✅
- [x] **Step 3.4:** Implement user registration (tanpa password hashing) ✅
- [x] **Step 3.5:** Implement get user by ID ✅
- [x] **Step 3.6:** Add input validation ✅
- [x] **Step 3.7:** Test dengan Postman ✅

**Expected Output:** CRUD operations working, data tersimpan di database

---

### 🔐 Phase 4: Authentication & Security
**Goal:** Add JWT authentication dan password security
- [ ] **Step 4.1:** Add Spring Security dependencies
- [ ] **Step 4.2:** Configure password encoder (BCrypt)
- [ ] **Step 4.3:** Update registration untuk hash password
- [ ] **Step 4.4:** Create JWT utility class
- [ ] **Step 4.5:** Create login endpoint dengan JWT generation
- [ ] **Step 4.6:** Create JWT authentication filter
- [ ] **Step 4.7:** Configure Spring Security filter chain
- [ ] **Step 4.8:** Protect user profile endpoints

**Expected Output:** Login menghasilkan JWT token, protected endpoints butuh token

---

### 🌐 Phase 5: Frontend Integration
**Goal:** Connect backend dengan frontend React registration form
- [ ] **Step 5.1:** Configure CORS untuk frontend (port 3001)
- [ ] **Step 5.2:** Update frontend untuk call backend APIs
- [ ] **Step 5.3:** Test registration flow end-to-end
- [ ] **Step 5.4:** Test login flow end-to-end
- [ ] **Step 5.5:** Handle API errors di frontend
- [ ] **Step 5.6:** Add loading states

**Expected Output:** Frontend registration/login form working dengan backend

---

### ✅ Phase 6: Testing & Documentation
**Goal:** Add proper testing dan documentation
- [ ] **Step 6.1:** Write unit tests untuk services
- [ ] **Step 6.2:** Write integration tests untuk controllers
- [ ] **Step 6.3:** Create Postman collection
- [ ] **Step 6.4:** Add API documentation comments
- [ ] **Step 6.5:** Add error handling improvements
- [ ] **Step 6.6:** Add logging

**Expected Output:** Tested, documented, production-ready backend

---

## 📁 Expected Project Structure
```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/registrationform/api/
│   │   │   ├── config/              # Spring configurations
│   │   │   │   ├── SecurityConfig.java
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/          # REST controllers
│   │   │   │   ├── AuthController.java
│   │   │   │   └── UserController.java
│   │   │   ├── dto/                 # Data Transfer Objects
│   │   │   │   ├── UserRegistrationRequest.java
│   │   │   │   ├── UserLoginRequest.java
│   │   │   │   └── UserResponse.java
│   │   │   ├── entity/              # JPA entities
│   │   │   │   └── User.java
│   │   │   ├── repository/          # Data access layer
│   │   │   │   └── UserRepository.java
│   │   │   ├── security/            # JWT & Security
│   │   │   │   ├── JwtUtil.java
│   │   │   │   └── JwtAuthenticationFilter.java
│   │   │   ├── service/             # Business logic
│   │   │   │   ├── UserService.java
│   │   │   │   └── AuthService.java
│   │   │   └── RegistrationFormApiApplication.java
│   │   └── resources/
│   │       ├── application.properties
│   │       └── application-dev.properties
│   └── test/                        # Unit & Integration tests
├── pom.xml                          # Maven dependencies
└── BACKEND_PLAN.md                  # This file
```

## 🎯 Success Metrics

### Phase 1 Success:
- [x] Server starts tanpa error
- [x] GET /api/hello returns response
- [x] Understand Spring Boot structure

### Phase 2 Success:
- [x] Database connection berhasil
- [x] User table ter-create
- [x] Basic repository operations working

### Phase 3 Success:
- [x] POST /api/users creates new user ✅
- [x] GET /api/users/{id} returns user data ✅
- [x] GET /api/users returns all users ✅
- [x] PUT /api/users/{id} updates user data ✅
- [x] DELETE /api/users/{id} deletes user ✅
- [x] GET /api/users/email/{email} finds user by email ✅
- [ ] Input validation working (basic validation sudah ada)

### Phase 4 Success:
- [ ] POST /api/auth/register returns JWT token
- [ ] POST /api/auth/login validates credentials & returns JWT
- [ ] Protected endpoints require valid JWT

### Phase 5 Success:
- [ ] Frontend registration calls backend successfully
- [ ] Frontend login calls backend successfully
- [ ] Error handling works properly

### Phase 6 Success:
- [ ] All tests passing
- [ ] Postman collection completed
- [ ] Ready for production

## 🚨 Important Notes

### 🎓 Learning Approach:
- **Step-by-Step:** Jangan skip steps, ikuti urutan
- **Test Each Step:** Pastikan working sebelum lanjut
- **Understand Before Code:** Pahami konsep dulu baru coding
- **Debugging:** Learn to read error messages

### 🔧 Development Tips:
- **Start Simple:** Begin dengan basic features
- **Incremental:** Add one feature at a time
- **Git Commits:** Commit after each successful step
- **Documentation:** Comment your code untuk future reference

### 🎯 Focus Areas:
1. **Understanding Spring Boot** fundamentals
2. **Database operations** dengan JPA
3. **API design** best practices
4. **Security concepts** (JWT, password hashing)
5. **Frontend-Backend integration**

---

## 📖 Next Steps
1. Mulai dengan **Phase 1** - Environment Setup
2. Follow step-by-step, jangan rush
3. Test setiap step dengan Postman
4. Ask questions if stuck
5. Document learning progress

**Happy Learning! 🚀**