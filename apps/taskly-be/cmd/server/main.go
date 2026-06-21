package main

import (
	"log"

	"github.com/isnendyankp/taskly-be/internal/config"
	"github.com/isnendyankp/taskly-be/internal/db"
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
	log.Printf("server will listen on :%s", cfg.ServerPort)
}
