package main

import (
	"log"

	"github.com/gin-gonic/gin"
	"github.com/isnendyankp/taskly-be/internal/config"
	"github.com/isnendyankp/taskly-be/internal/db"
	"github.com/isnendyankp/taskly-be/internal/handler"
	"github.com/isnendyankp/taskly-be/internal/repository"
	"github.com/isnendyankp/taskly-be/internal/service"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	conn, err := db.Connect(cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("db connect error: %v", err)
	}
	defer conn.Close()

	if err := db.Migrate(conn, "internal/db/migrations"); err != nil {
		log.Fatalf("migrate error: %v", err)
	}

	log.Printf("database connected and migrations applied")

	userRepo := repository.NewUserRepository(conn)
	authService := service.NewAuthService(userRepo)
	authHandler := handler.NewAuthHandler(authService)

	router := gin.Default()

	auth := router.Group("/api/auth")
	auth.POST("/register", authHandler.Register)

	log.Printf("server listening on :%s", cfg.ServerPort)
	if err := router.Run(":" + cfg.ServerPort); err != nil {
		log.Fatalf("server error: %v", err)
	}
}
