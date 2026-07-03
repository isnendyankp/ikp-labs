package repository

import "time"

type User struct {
	ID           int64
	Email        string
	PasswordHash string
	CreatedAt    time.Time
}

type Task struct {
	ID        int64
	UserID    int64
	Title     string
	Status    string
	CreatedAt time.Time
	UpdatedAt time.Time
}
