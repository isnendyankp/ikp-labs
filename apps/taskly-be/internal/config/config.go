package config

import (
	"errors"
	"os"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort  string
	DatabaseURL string
	JWTSecret   string
}

func Load() (*Config, error) {
	if err := godotenv.Load(); err != nil && !errors.Is(err, os.ErrNotExist) {
		// ignore "no such file" — env vars may come from the shell
		if !strings.Contains(err.Error(), "no such file") {
			return nil, err
		}
	}

	cfg := &Config{
		ServerPort:  os.Getenv("SERVER_PORT"),
		DatabaseURL: os.Getenv("DATABASE_URL"),
		JWTSecret:   os.Getenv("JWT_SECRET"),
	}

	var missing []string
	if cfg.ServerPort == "" {
		missing = append(missing, "SERVER_PORT")
	}
	if cfg.DatabaseURL == "" {
		missing = append(missing, "DATABASE_URL")
	}
	if cfg.JWTSecret == "" {
		missing = append(missing, "JWT_SECRET")
	}
	if len(missing) > 0 {
		return nil, errors.New("missing required env vars: " + strings.Join(missing, ", "))
	}

	return cfg, nil
}
