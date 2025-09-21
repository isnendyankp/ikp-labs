package com.registrationform.api.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Hello World Controller untuk testing basic Spring Boot setup
 *
 * @RestController: Kombinasi dari @Controller dan @ResponseBody
 * @RequestMapping: Base path untuk semua endpoints dalam controller ini
 */
@RestController
@RequestMapping("/api")
public class HelloController {

    /**
     * Basic Hello World endpoint
     *
     * @return String greeting
     */
    @GetMapping("/hello")
    public String hello() {
        return "Hello from Registration Form API! 🚀";
    }

    /**
     * Hello dengan nama dari path variable
     *
     * @param name nama dari URL path
     * @return String greeting dengan nama
     */
    @GetMapping("/hello/{name}")
    public String helloWithName(@PathVariable String name) {
        return "Hello " + name + "! Welcome to Registration Form API! 👋";
    }

    /**
     * Greeting dengan query parameters
     *
     * @param name nama dari query parameter
     * @param age umur dari query parameter
     * @return String greeting dengan informasi detail
     */
    @GetMapping("/greet")
    public String greetWithParams(
            @RequestParam(value = "name", defaultValue = "Guest") String name,
            @RequestParam(value = "age", required = false) Integer age) {

        if (age != null) {
            return "Hello " + name + "! You are " + age + " years old. Welcome to our API! 🎉";
        } else {
            return "Hello " + name + "! Welcome to our API! 😊";
        }
    }

    /**
     * API info endpoint - returns JSON response
     *
     * @return ApiInfo object (akan di-convert ke JSON otomatis)
     */
    @GetMapping("/info")
    public ApiInfo getApiInfo() {
        return new ApiInfo(
            "Registration Form API",
            "1.0.0",
            "Backend API for Registration Form using Spring Boot",
            "Running on Spring Boot 3.3.6 with Java 17"
        );
    }

    /**
     * Inner class untuk API Info response
     * Spring Boot akan otomatis convert ini ke JSON
     */
    public static class ApiInfo {
        private String name;
        private String version;
        private String description;
        private String details;

        // Constructor
        public ApiInfo(String name, String version, String description, String details) {
            this.name = name;
            this.version = version;
            this.description = description;
            this.details = details;
        }

        // Getters (required untuk JSON serialization)
        public String getName() { return name; }
        public String getVersion() { return version; }
        public String getDescription() { return description; }
        public String getDetails() { return details; }
    }
}