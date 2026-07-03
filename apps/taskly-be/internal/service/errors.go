package service

import "errors"

var ErrEmailTaken         = errors.New("email already taken")
var ErrInvalidCredentials = errors.New("invalid credentials")
var ErrUserNotFound       = errors.New("user not found")
var ErrTaskNotFound = errors.New("task not found")
var ErrForbidden    = errors.New("forbidden")
