package com.registrationform.api.controller;

import com.registrationform.api.entity.User;
import com.registrationform.api.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * UserController - REST API Controller untuk User operations
 *
 * Controller bertanggung jawab untuk:
 * 1. Menerima HTTP requests dari frontend
 * 2. Validasi basic request
 * 3. Delegate business logic ke Service
 * 4. Return HTTP responses yang sesuai
 *
 * @RestController = Kombinasi @Controller + @ResponseBody
 * @RequestMapping = Base path untuk semua endpoints dalam controller
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    /**
     * Dependency injection UserService
     * Controller → Service → Repository → Database
     */
    @Autowired
    private UserService userService;

    /**
     * Endpoint: POST /api/users
     * Purpose: Register user baru
     *
     * @RequestBody = Data user dari request body (JSON)
     * @return ResponseEntity<User> dengan status HTTP
     */
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        try {
            // Delegate ke Service untuk business logic
            User savedUser = userService.registerUser(user);

            // Return HTTP 201 Created dengan data user
            return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);

        } catch (RuntimeException e) {
            // Return HTTP 400 Bad Request jika ada error validation
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Endpoint: GET /api/users/{id}
     * Purpose: Get user berdasarkan ID
     *
     * @PathVariable = Ambil {id} dari URL path
     * @return ResponseEntity<User> atau 404 jika tidak ditemukan
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            // Return HTTP 200 OK dengan data user
            return ResponseEntity.ok(user.get());
        } else {
            // Return HTTP 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint: GET /api/users
     * Purpose: Get semua users
     *
     * @return ResponseEntity<List<User>> semua users
     */
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // Return HTTP 200 OK dengan list users
        return ResponseEntity.ok(users);
    }

    /**
     * Endpoint: PUT /api/users/{id}
     * Purpose: Update user data
     *
     * @PathVariable id = ID user yang akan diupdate
     * @RequestBody updatedUser = Data baru dari request body
     * @return ResponseEntity<User> dengan data updated
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser) {
        try {
            // Delegate ke Service untuk business logic
            User user = userService.updateUser(id, updatedUser);

            // Return HTTP 200 OK dengan data updated
            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {
            // Return HTTP 404 Not Found atau 400 Bad Request
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    /**
     * Endpoint: DELETE /api/users/{id}
     * Purpose: Hapus user berdasarkan ID
     *
     * @PathVariable id = ID user yang akan dihapus
     * @return ResponseEntity<String> dengan message
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        try {
            // Delegate ke Service untuk business logic
            userService.deleteUser(id);

            // Return HTTP 200 OK dengan success message
            return ResponseEntity.ok("User berhasil dihapus");

        } catch (RuntimeException e) {
            // Return HTTP 404 Not Found
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User tidak ditemukan");
        }
    }

    /**
     * Endpoint: GET /api/users/email/{email}
     * Purpose: Get user berdasarkan email
     *
     * @PathVariable email = Email user yang dicari
     * @return ResponseEntity<User> atau 404 jika tidak ditemukan
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);

        if (user.isPresent()) {
            // Return HTTP 200 OK dengan data user
            return ResponseEntity.ok(user.get());
        } else {
            // Return HTTP 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint: GET /api/users/count
     * Purpose: Get total jumlah users
     *
     * @return ResponseEntity<Long> total users
     */
    @GetMapping("/count")
    public ResponseEntity<Long> getUserCount() {
        long count = userService.getUserCount();

        // Return HTTP 200 OK dengan count
        return ResponseEntity.ok(count);
    }

    /**
     * Endpoint: GET /api/users/check-email/{email}
     * Purpose: Check apakah email sudah terdaftar
     *
     * @PathVariable email = Email yang akan dicek
     * @return ResponseEntity<Boolean> true jika email sudah ada
     */
    @GetMapping("/check-email/{email}")
    public ResponseEntity<Boolean> checkEmailExists(@PathVariable String email) {
        boolean exists = userService.isEmailExists(email);

        // Return HTTP 200 OK dengan boolean result
        return ResponseEntity.ok(exists);
    }
}