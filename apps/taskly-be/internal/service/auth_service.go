package service

import (
	"context"
	"errors"
	"strings"

	"github.com/isnendyankp/taskly-be/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Email    string
	Password string
}

type AuthService interface {
	Register(ctx context.Context, input RegisterInput) (*repository.User, error)
}

type authService struct {
	userRepo repository.UserRepository
}

func NewAuthService(userRepo repository.UserRepository) AuthService {
	return &authService{userRepo: userRepo}
}

func (s *authService) Register(ctx context.Context, input RegisterInput) (*repository.User, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), 12)
	if err != nil {
		return nil, err
	}

	user, err := s.userRepo.CreateUser(ctx, email, string(hash))
	if err != nil {
		if errors.Is(err, repository.ErrEmailTaken) {
			return nil, ErrEmailTaken
		}
		return nil, err
	}

	return user, nil
}
