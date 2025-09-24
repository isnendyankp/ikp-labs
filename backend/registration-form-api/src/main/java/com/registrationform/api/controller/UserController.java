package com.registrationform.api.controller;

import com.registrationform.api.dto.UserRegistrationRequest;
import com.registrationform.api.dto.UserResponse;
import com.registrationform.api.dto.UserUpdateRequest;
import com.registrationform.api.entity.User;
import com.registrationform.api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
     * @RequestBody UserRegistrationRequest = Data dari DTO, bukan Entity langsung
     * @Valid = Trigger validation annotations (@NotBlank, @Email, dll)
     * @return ResponseEntity<UserResponse> = Return DTO, bukan Entity
     */
    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserRegistrationRequest request) {
        try {
            // Convert DTO request ke Entity
            User user = new User(request.getFullName(), request.getEmail(), request.getPassword());

            // Delegate ke Service untuk business logic
            User savedUser = userService.registerUser(user);

            // Convert Entity ke Response DTO
            UserResponse response = UserResponse.fromEntity(savedUser);

            // Return HTTP 201 Created dengan UserResponse DTO
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

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
     * @return ResponseEntity<UserResponse> = Return DTO, bukan Entity
     */
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);

        if (user.isPresent()) {
            // Convert Entity ke Response DTO
            UserResponse response = UserResponse.fromEntity(user.get());
            // Return HTTP 200 OK dengan UserResponse DTO
            return ResponseEntity.ok(response);
        } else {
            // Return HTTP 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Endpoint: GET /api/users
     * Purpose: Get semua users
     *
     * @return ResponseEntity<List<UserResponse>> = List DTO, bukan Entity
     */
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        // Convert List<User> ke List<UserResponse> menggunakan Stream API
        List<UserResponse> responses = users.stream()
                .map(UserResponse::fromEntity)  // Convert setiap User ke UserResponse
                .collect(Collectors.toList());

        // Return HTTP 200 OK dengan list UserResponse DTOs
        return ResponseEntity.ok(responses);
    }

    /**
     * Endpoint: PUT /api/users/{id}
     * Purpose: Update user data
     *
     * @PathVariable id = ID user yang akan diupdate
     * @RequestBody UserUpdateRequest = DTO untuk update request
     * @return ResponseEntity<UserResponse> = Return DTO response
     */
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        try {
            // Convert DTO ke Entity untuk update
            User updatedUser = new User();
            if (request.hasFullName()) {
                updatedUser.setFullName(request.getFullName());
            }
            if (request.hasEmail()) {
                updatedUser.setEmail(request.getEmail());
            }
            if (request.hasPassword()) {
                updatedUser.setPassword(request.getPassword());
            }

            // Delegate ke Service untuk business logic
            User user = userService.updateUser(id, updatedUser);

            // Convert Entity ke Response DTO
            UserResponse response = UserResponse.fromEntity(user);

            // Return HTTP 200 OK dengan UserResponse DTO
            return ResponseEntity.ok(response);

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
     * @return ResponseEntity<UserResponse> = Return DTO response
     */
    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);

        if (user.isPresent()) {
            // Convert Entity ke Response DTO
            UserResponse response = UserResponse.fromEntity(user.get());
            // Return HTTP 200 OK dengan UserResponse DTO
            return ResponseEntity.ok(response);
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