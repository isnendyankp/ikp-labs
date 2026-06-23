package handler

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/isnendyankp/taskly-be/internal/service"
)

type AuthHandler struct {
	authService service.AuthService
}

func NewAuthHandler(authService service.AuthService) *AuthHandler {
	return &AuthHandler{authService: authService}
}

type registerRequest struct {
	Email    string `json:"email"    binding:"required,email"`
	Password string `json:"password" binding:"required,min=8"`
}

type registerResponse struct {
	ID    int64  `json:"id"`
	Email string `json:"email"`
}

type errorResponse struct {
	Error string `json:"error"`
}

func respondError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrEmailTaken):
		c.JSON(http.StatusConflict, errorResponse{"email already registered"})
	case errors.Is(err, service.ErrInvalidCredentials):
		c.JSON(http.StatusUnauthorized, errorResponse{"invalid credentials"})
	case errors.Is(err, service.ErrUserNotFound):
		c.JSON(http.StatusNotFound, errorResponse{"user not found"})
	default:
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
	}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req registerRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{err.Error()})
		return
	}

	user, err := h.authService.Register(c.Request.Context(), service.RegisterInput{
		Email:    req.Email,
		Password: req.Password,
	})
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusCreated, registerResponse{ID: user.ID, Email: user.Email})
}
