package com.ikplabs.api.repository;

import com.ikplabs.api.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Unit Tests untuk UserRepository - Menggunakan PostgreSQL Testcontainer (Singleton Pattern)
 *
 * PENJELASAN UNTUK PEMULA:
 * ========================
 * UserRepository adalah JPA Repository interface, jadi kita test:
 * - Custom query methods (findByEmail, existsByEmail)
 * - Standard CRUD operations (save, findById, findAll, delete)
 * - Database interactions
 *
 * Mengapa pakai PostgreSQL Testcontainer (bukan H2)?
 * ---------------------------------------------------
 * Repository test berbeda dengan Service test:
 * - Service test: Mock dependencies (NO database)
 * - Repository test: Real database queries (YES database)
 *
 * PostgreSQL Testcontainer = Docker container running PostgreSQL
 * - REAL PostgreSQL: Same as production database (no compatibility issues)
 * - SINGLETON PATTERN: Container shared across ALL test classes (fast!)
 * - Isolated: Setiap test auto-rollback (clean state)
 * - Reliable: Test actual SQL queries with real PostgreSQL syntax
 *
 * @DataJpaTest Annotation:
 * ------------------------
 * - Auto-configure TestEntityManager (untuk test data setup)
 * - Auto-rollback setelah setiap test (clean state)
 * - ONLY load @Repository beans (lightweight)
 *
 * extends AbstractIntegrationTest:
 * --------------------------------
 * - Uses SINGLETON PostgreSQL Testcontainer (shared across all tests)
 * - Container started ONCE, reused for all test classes
 * - Faster than creating new container per test class
 * - Production-like environment (real PostgreSQL)
 *
 * TestEntityManager:
 * ------------------
 * - Helper untuk insert/query data dalam test
 * - Bypass JPA cache untuk accurate testing
 * - Similar to EntityManager tapi khusus untuk testing
 *
 * Pattern:
 * --------
 * - Arrange: Insert test data via TestEntityManager
 * - Act: Call repository method
 * - Assert: Verify results
 * - Auto-cleanup: @DataJpaTest auto-rollback setelah test
 *
 * @author Registration Form Team
 */
@SuppressWarnings("null")
@DisplayName("UserRepository Unit Tests - Using PostgreSQL Testcontainer (Singleton)")
@org.springframework.transaction.annotation.Transactional
public class UserRepositoryTest extends com.ikplabs.api.integration.AbstractIntegrationTest {

    /**
     * @Autowired UserRepository - Repository yang akan di-test
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * @Autowired EntityManager - Helper untuk manage test data
     * Digunakan untuk:
     * - Insert test data (persist)
     * - Flush changes to database
     * - Clear JPA cache
     */
    @org.springframework.beans.factory.annotation.Autowired
    private jakarta.persistence.EntityManager entityManager;

    // Test data
    private User testUser1;
    private User testUser2;

    /**
     * Setup test data sebelum SETIAP test method
     * @BeforeEach = Method ini dipanggil sebelum setiap @Test method
     */
    @BeforeEach
    void setUp() {
        // Clean database (optional, karena @DataJpaTest auto-rollback)
        // Tapi untuk kejelasan, kita explicit clean
        userRepository.deleteAll();
        entityManager.flush();

        // Create test users (belum di-save ke database)
        testUser1 = new User();
        testUser1.setFullName("John Doe");
        testUser1.setEmail("john@test.com");
        testUser1.setPassword("$2a$10$hashedPassword123");
        testUser1.setCreatedAt(LocalDateTime.now());
        testUser1.setUpdatedAt(LocalDateTime.now());

        testUser2 = new User();
        testUser2.setFullName("Jane Smith");
        testUser2.setEmail("jane@test.com");
        testUser2.setPassword("$2a$10$hashedPassword456");
        testUser2.setCreatedAt(LocalDateTime.now());
        testUser2.setUpdatedAt(LocalDateTime.now());
    }

    // ========================================================================
    // SAVE OPERATION TESTS
    // ========================================================================

    @Test
    @DisplayName("1. Save new user - Should persist to database with generated ID")
    void testSaveUser_NewUser_ShouldPersistWithGeneratedId() {
        // ACT: Save user
        User savedUser = userRepository.save(testUser1);

        // Flush to database dan clear cache
        entityManager.flush();
        entityManager.clear();

        // ASSERT: User tersimpan dengan ID
        assertNotNull(savedUser.getId(), "ID should be generated");
        assertTrue(savedUser.getId() > 0, "ID should be positive");
        assertEquals("John Doe", savedUser.getFullName());
        assertEquals("john@test.com", savedUser.getEmail());

        // Verify di database dengan fresh query
        User foundUser = entityManager.find(User.class, savedUser.getId());
        assertNotNull(foundUser, "User should exist in database");
        assertEquals("John Doe", foundUser.getFullName());
    }

    @Test
    @DisplayName("2. Save and update user - Should update existing user")
    void testSaveUser_UpdateExistingUser_ShouldUpdateFields() {
        // ARRANGE: Persist user dulu
        entityManager.persist(testUser1);
        entityManager.flush();
        Long userId = testUser1.getId();

        // Modify user
        testUser1.setFullName("John Updated");
        testUser1.setEmail("johnupdated@test.com");

        // ACT: Update via save
        User updatedUser = userRepository.save(testUser1);
        entityManager.flush();
        entityManager.clear();

        // ASSERT: User ter-update
        assertEquals(userId, updatedUser.getId(), "ID should remain same");
        assertEquals("John Updated", updatedUser.getFullName());
        assertEquals("johnupdated@test.com", updatedUser.getEmail());

        // Verify di database
        User foundUser = entityManager.find(User.class, userId);
        assertEquals("John Updated", foundUser.getFullName());
    }

    // ========================================================================
    // FIND BY ID TESTS
    // ========================================================================

    @Test
    @DisplayName("3. Find by ID - Should return user when exists")
    void testFindById_WhenUserExists_ShouldReturnUser() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        Long savedUserId = testUser1.getId();
        entityManager.clear(); // Clear cache untuk test fresh query

        // ACT: Find by ID
        Optional<User> result = userRepository.findById(savedUserId);

        // ASSERT
        assertTrue(result.isPresent(), "User should be found");
        assertEquals(savedUserId, result.get().getId());
        assertEquals("John Doe", result.get().getFullName());
        assertEquals("john@test.com", result.get().getEmail());
    }

    @Test
    @DisplayName("4. Find by ID - Should return empty when user not exists")
    void testFindById_WhenUserNotExists_ShouldReturnEmpty() {
        // ACT: Find non-existent user
        Optional<User> result = userRepository.findById(999L);

        // ASSERT
        assertFalse(result.isPresent(), "User should not be found");
    }

    // ========================================================================
    // FIND BY EMAIL TESTS (Custom Query Method)
    // ========================================================================

    @Test
    @DisplayName("5. Find by email - Should return user when email exists")
    void testFindByEmail_WhenEmailExists_ShouldReturnUser() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.clear();

        // ACT: Find by email (custom query method)
        Optional<User> result = userRepository.findByEmail("john@test.com");

        // ASSERT
        assertTrue(result.isPresent(), "User should be found by email");
        assertEquals("John Doe", result.get().getFullName());
        assertEquals("john@test.com", result.get().getEmail());
    }

    @Test
    @DisplayName("6. Find by email - Should return empty when email not exists")
    void testFindByEmail_WhenEmailNotExists_ShouldReturnEmpty() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.clear();

        // ACT: Find non-existent email
        Optional<User> result = userRepository.findByEmail("notfound@test.com");

        // ASSERT
        assertFalse(result.isPresent(), "User should not be found");
    }

    @Test
    @DisplayName("7. Find by email - Should be case-sensitive")
    void testFindByEmail_ShouldBeCaseSensitive() {
        // ARRANGE: Persist user dengan lowercase email
        entityManager.persist(testUser1);
        entityManager.flush(); // email: john@test.com
        entityManager.clear();

        // ACT: Search dengan UPPERCASE
        Optional<User> result = userRepository.findByEmail("JOHN@TEST.COM");

        // ASSERT: Tidak ditemukan (case-sensitive)
        assertFalse(result.isPresent(), "Email search should be case-sensitive");
    }

    // ========================================================================
    // EXISTS BY EMAIL TESTS (Custom Query Method)
    // ========================================================================

    @Test
    @DisplayName("8. Exists by email - Should return true when email exists")
    void testExistsByEmail_WhenEmailExists_ShouldReturnTrue() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.clear();

        // ACT: Check if email exists
        boolean exists = userRepository.existsByEmail("john@test.com");

        // ASSERT
        assertTrue(exists, "Should return true for existing email");
    }

    @Test
    @DisplayName("9. Exists by email - Should return false when email not exists")
    void testExistsByEmail_WhenEmailNotExists_ShouldReturnFalse() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.clear();

        // ACT: Check non-existent email
        boolean exists = userRepository.existsByEmail("notfound@test.com");

        // ASSERT
        assertFalse(exists, "Should return false for non-existing email");
    }

    // ========================================================================
    // FIND ALL TESTS
    // ========================================================================

    @Test
    @DisplayName("10. Find all - Should return all users")
    void testFindAll_ShouldReturnAllUsers() {
        // ARRANGE: Persist 2 users
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.persist(testUser2);
        entityManager.flush();
        entityManager.clear();

        // ACT: Find all
        List<User> users = userRepository.findAll();

        // ASSERT
        assertNotNull(users);
        assertEquals(2, users.size(), "Should return 2 users");

        // Verify user data
        assertTrue(users.stream().anyMatch(u -> u.getEmail().equals("john@test.com")));
        assertTrue(users.stream().anyMatch(u -> u.getEmail().equals("jane@test.com")));
    }

    @Test
    @DisplayName("11. Find all - Should return empty list when no users")
    void testFindAll_WhenNoUsers_ShouldReturnEmptyList() {
        // ACT: Find all (database kosong)
        List<User> users = userRepository.findAll();

        // ASSERT
        assertNotNull(users, "List should not be null");
        assertTrue(users.isEmpty(), "List should be empty");
        assertEquals(0, users.size());
    }

    // ========================================================================
    // DELETE OPERATION TESTS
    // ========================================================================

    @Test
    @DisplayName("12. Delete by ID - Should remove user from database")
    void testDeleteById_ShouldRemoveUserFromDatabase() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        Long userId = testUser1.getId();
        entityManager.clear();

        // Verify user exists
        assertTrue(userRepository.existsById(userId), "User should exist before delete");

        // ACT: Delete user
        userRepository.deleteById(userId);
        entityManager.flush();
        entityManager.clear();

        // ASSERT: User tidak ada lagi
        assertFalse(userRepository.existsById(userId), "User should not exist after delete");
        Optional<User> result = userRepository.findById(userId);
        assertFalse(result.isPresent(), "User should not be found after delete");
    }

    @Test
    @DisplayName("13. Delete all - Should remove all users from database")
    void testDeleteAll_ShouldRemoveAllUsers() {
        // ARRANGE: Persist 2 users
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.persist(testUser2);
        entityManager.flush();
        entityManager.clear();

        // Verify users exist
        assertEquals(2, userRepository.count(), "Should have 2 users before delete");

        // ACT: Delete all
        userRepository.deleteAll();
        entityManager.flush();
        entityManager.clear();

        // ASSERT: No users
        assertEquals(0, userRepository.count(), "Should have 0 users after deleteAll");
        List<User> users = userRepository.findAll();
        assertTrue(users.isEmpty(), "FindAll should return empty list");
    }

    // ========================================================================
    // COUNT TESTS
    // ========================================================================

    @Test
    @DisplayName("14. Count - Should return correct number of users")
    void testCount_ShouldReturnCorrectCount() {
        // ARRANGE: Persist 2 users
        entityManager.persist(testUser1);
        entityManager.flush();
        entityManager.persist(testUser2);
        entityManager.flush();
        entityManager.clear();

        // ACT: Count users
        long count = userRepository.count();

        // ASSERT
        assertEquals(2L, count, "Should return 2");
    }

    @Test
    @DisplayName("15. Count - Should return 0 when no users")
    void testCount_WhenNoUsers_ShouldReturnZero() {
        // ACT: Count (database kosong)
        long count = userRepository.count();

        // ASSERT
        assertEquals(0L, count, "Should return 0 for empty database");
    }

    // ========================================================================
    // EXISTS BY ID TESTS
    // ========================================================================

    @Test
    @DisplayName("16. Exists by ID - Should return true when user exists")
    void testExistsById_WhenUserExists_ShouldReturnTrue() {
        // ARRANGE: Persist user
        entityManager.persist(testUser1);
        entityManager.flush();
        Long userId = testUser1.getId();
        entityManager.clear();

        // ACT: Check if exists
        boolean exists = userRepository.existsById(userId);

        // ASSERT
        assertTrue(exists, "Should return true for existing user ID");
    }

    @Test
    @DisplayName("17. Exists by ID - Should return false when user not exists")
    void testExistsById_WhenUserNotExists_ShouldReturnFalse() {
        // ACT: Check non-existent ID
        boolean exists = userRepository.existsById(999L);

        // ASSERT
        assertFalse(exists, "Should return false for non-existing user ID");
    }
}

/**
 * SUMMARY TEST COVERAGE:
 * ======================
 *
 * Total Test Cases: 17
 *
 * Save Operations (2 tests):
 * - save new user (with ID generation)
 * - save/update existing user
 *
 * Find Operations (4 tests):
 * - findById (exists/not exists)
 * - findByEmail (exists/not exists)
 *
 * Custom Query Tests (4 tests):
 * - findByEmail (custom query)
 * - findByEmail case-sensitivity
 * - existsByEmail (exists/not exists)
 *
 * FindAll Operations (2 tests):
 * - findAll with users
 * - findAll empty
 *
 * Delete Operations (2 tests):
 * - deleteById
 * - deleteAll
 *
 * Count Operations (2 tests):
 * - count with users
 * - count empty
 *
 * Exists Operations (1 test):
 * - existsById (exists/not exists)
 *
 * Database Technology: H2 In-Memory
 * Expected Coverage: ~95%+
 *
 * CARA MENJALANKAN:
 * ================
 * mvn test -Dtest=UserRepositoryTest
 *
 * NOTES:
 * ======
 * - H2 database auto-configured oleh @DataJpaTest
 * - Setiap test method isolated (auto-rollback)
 * - TestEntityManager untuk accurate test data setup
 * - No manual cleanup needed (@DataJpaTest handles it)
 */
