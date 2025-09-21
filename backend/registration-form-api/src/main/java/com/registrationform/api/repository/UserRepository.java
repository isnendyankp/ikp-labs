package com.registrationform.api.repository;

import com.registrationform.api.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * UserRepository - Interface untuk database operations User entity
 *
 * Extends JpaRepository<Entity, ID_Type> memberikan method auto-generated:
 * - save(user) = INSERT atau UPDATE
 * - findById(id) = SELECT by ID
 * - findAll() = SELECT semua data
 * - deleteById(id) = DELETE by ID
 * - count() = COUNT total data
 * - existsById(id) = CHECK apakah ID ada
 *
 * @Repository = Menandai ini sebagai repository component
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Custom method - Spring Data JPA akan auto-generate query berdasarkan nama method
     *
     * Method name pattern: findBy + PropertyName + Condition
     * findByEmail = SELECT * FROM users WHERE email = ?
     */
    Optional<User> findByEmail(String email);

    /**
     * Custom method - check apakah email sudah ada
     * existsBy + PropertyName = SELECT COUNT(*) FROM users WHERE email = ? > 0
     */
    boolean existsByEmail(String email);

    /**
     * Custom method dengan @Query annotation - untuk query yang lebih complex
     *
     * JPQL (Java Persistence Query Language) - mirip SQL tapi pakai entity names
     * :email = named parameter
     */
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.id != :id")
    Optional<User> findByEmailAndIdNot(@Param("email") String email, @Param("id") Long id);

    /**
     * Native SQL query - kalau butuh query SQL native
     * nativeQuery = true artinya pakai SQL biasa, bukan JPQL
     */
    @Query(value = "SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE", nativeQuery = true)
    Long countUsersCreatedToday();

    /*
     * Method auto-generated yang tersedia dari JpaRepository:
     *
     * 1. CRUD Operations:
     *    - save(User user)                    = INSERT/UPDATE
     *    - findById(Long id)                  = SELECT by ID
     *    - findAll()                          = SELECT all
     *    - deleteById(Long id)                = DELETE by ID
     *    - delete(User user)                  = DELETE entity
     *    - deleteAll()                        = DELETE all
     *
     * 2. Query Operations:
     *    - count()                            = COUNT all
     *    - existsById(Long id)                = EXISTS by ID
     *    - findAll(Pageable pageable)         = SELECT with pagination
     *    - findAll(Sort sort)                 = SELECT with sorting
     *
     * 3. Batch Operations:
     *    - saveAll(Iterable<User> users)      = INSERT/UPDATE multiple
     *    - deleteAll(Iterable<User> users)    = DELETE multiple
     *    - deleteAllInBatch()                 = DELETE all in batch
     */
}