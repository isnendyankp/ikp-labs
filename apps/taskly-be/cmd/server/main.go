package main

import (
	"log"

	"github.com/isnendyankp/taskly-be/internal/config"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("config error: %v", err)
	}

	log.Printf("server will listen on :%s", cfg.ServerPort)
}
