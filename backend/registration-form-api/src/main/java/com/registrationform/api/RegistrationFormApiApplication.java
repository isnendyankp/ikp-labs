package com.registrationform.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main Application Class untuk Registration Form API
 *
 * @SpringBootApplication annotation equivalent dengan:
 * - @Configuration: Menandai class sebagai konfigurasi Spring
 * - @EnableAutoConfiguration: Enable Spring Boot auto-configuration
 * - @ComponentScan: Enable component scanning untuk package ini
 */
@SpringBootApplication
public class RegistrationFormApiApplication {

    /**
     * Main method untuk menjalankan Spring Boot application
     *
     * @param args command line arguments
     */
    public static void main(String[] args) {
        SpringApplication.run(RegistrationFormApiApplication.class, args);
    }
}