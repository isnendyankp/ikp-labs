package service

import (
	"context"
	"errors"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/isnendyankp/taskly-be/internal/repository"
	"golang.org/x/crypto/bcrypt"
)

type RegisterInput struct {
	Email    string
	Password string
}

type LoginInput struct {
	Email    string
	Password string
}

type AuthService interface {
	Register(ctx context.Context, input RegisterInput) (*repository.User, error)
	Login(ctx context.Context, input LoginInput) (string, error)
}

type authService struct {
	userRepo  repository.UserRepository
	jwtSecret []byte
}

func NewAuthService(userRepo repository.UserRepository, jwtSecret string) AuthService {
	return &authService{userRepo: userRepo, jwtSecret: []byte(jwtSecret)}
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

func (s *authService) Login(ctx context.Context, input LoginInput) (string, error) {
	email := strings.ToLower(strings.TrimSpace(input.Email))

	user, err := s.userRepo.FindByEmail(ctx, email)
	if err != nil {
		// obscure the real error — always return ErrInvalidCredentials
		return "", ErrInvalidCredentials
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return "", ErrInvalidCredentials
	}

	now := time.Now()
	claims := jwt.RegisteredClaims{
		Subject:   strconv.FormatInt(user.ID, 10),
		IssuedAt:  jwt.NewNumericDate(now),
		ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(s.jwtSecret)
	if err != nil {
		return "", err
	}

	return signed, nil
}
