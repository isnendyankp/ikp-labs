package com.registrationform.api.service;

import com.registrationform.api.entity.User;
import com.registrationform.api.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * UserService - Business Logic Layer untuk User operations
 *
 * Service layer bertanggung jawab untuk:
 * 1. Business logic dan validation
 * 2. Koordinasi antara Controller dan Repository
 * 3. Exception handling
 * 4. Data transformation
 *
 * @Service = Menandai class ini sebagai Spring service component
 */
@Service
public class UserService {

    /**
     * Dependency injection UserRepository
     * @Autowired = Spring otomatis inject dependency
     */
    @Autowired
    private UserRepository userRepository;

    /**
     * Register user baru
     * Business logic: Check email sudah ada atau belum
     *
     * @param user User object yang akan disimpan
     * @return User yang sudah disimpan
     * @throws RuntimeException jika email sudah terdaftar
     */
    public User registerUser(User user) {
        // Business logic: Validasi email belum ada
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email sudah terdaftar: " + user.getEmail());
        }

        // Simpan user ke database via Repository
        return userRepository.save(user);
    }

    /**
     * Cari user berdasarkan ID
     *
     * @param id ID user yang dicari
     * @return Optional<User> - bisa empty jika tidak ditemukan
     */
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Cari user berdasarkan email
     *
     * @param email Email user yang dicari
     * @return Optional<User> - bisa empty jika tidak ditemukan
     */
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Ambil semua user
     *
     * @return List<User> semua user di database
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Update user data - Partial Update Support
     * Business logic: Check apakah user dengan ID ada
     * Hanya update field yang tidak null
     *
     * @param id ID user yang akan diupdate
     * @param updatedUser Data user baru (field bisa null untuk tidak diupdate)
     * @return User yang sudah diupdate
     * @throws RuntimeException jika user tidak ditemukan
     */
    public User updateUser(Long id, User updatedUser) {
        // Business logic: Check user exists
        Optional<User> existingUserOpt = userRepository.findById(id);
        if (existingUserOpt.isEmpty()) {
            throw new RuntimeException("User dengan ID " + id + " tidak ditemukan");
        }

        User existingUser = existingUserOpt.get();

        // Business logic: Check email conflict (jika email diubah)
        if (updatedUser.getEmail() != null
            && !existingUser.getEmail().equals(updatedUser.getEmail())
            && userRepository.existsByEmail(updatedUser.getEmail())) {
            throw new RuntimeException("Email sudah digunakan user lain: " + updatedUser.getEmail());
        }

        // Update fields only if they are not null (partial update)
        if (updatedUser.getFullName() != null) {
            existingUser.setFullName(updatedUser.getFullName());
        }
        if (updatedUser.getEmail() != null) {
            existingUser.setEmail(updatedUser.getEmail());
        }
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        // Save updated user
        return userRepository.save(existingUser);
    }

    /**
     * Hapus user berdasarkan ID
     * Business logic: Check apakah user ada sebelum hapus
     *
     * @param id ID user yang akan dihapus
     * @throws RuntimeException jika user tidak ditemukan
     */
    public void deleteUser(Long id) {
        // Business logic: Check user exists
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User dengan ID " + id + " tidak ditemukan");
        }

        userRepository.deleteById(id);
    }

    /**
     * Check apakah email sudah terdaftar
     * Utility method untuk validation
     *
     * @param email Email yang akan dicek
     * @return true jika email sudah ada, false jika belum
     */
    public boolean isEmailExists(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Hitung total user
     *
     * @return Long total user di database
     */
    public long getUserCount() {
        return userRepository.count();
    }
}