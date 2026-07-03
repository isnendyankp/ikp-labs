package service

import (
	"context"
	"errors"
	"fmt"

	"github.com/isnendyankp/taskly-be/internal/repository"
)

type CreateTaskInput struct {
	Title string
}

type UpdateTaskInput struct {
	Title  *string
	Status *string
}

type TaskService interface {
	CreateTask(ctx context.Context, userID int64, input CreateTaskInput) (*repository.Task, error)
	ListTasks(ctx context.Context, userID int64) ([]*repository.Task, error)
	GetTask(ctx context.Context, userID, taskID int64) (*repository.Task, error)
	UpdateTask(ctx context.Context, userID, taskID int64, input UpdateTaskInput) (*repository.Task, error)
	DeleteTask(ctx context.Context, userID, taskID int64) error
}

type taskService struct {
	taskRepo repository.TaskRepository
}

func NewTaskService(taskRepo repository.TaskRepository) TaskService {
	return &taskService{taskRepo: taskRepo}
}

func (s *taskService) CreateTask(ctx context.Context, userID int64, input CreateTaskInput) (*repository.Task, error) {
	return s.taskRepo.CreateTask(ctx, userID, input.Title)
}

func (s *taskService) ListTasks(ctx context.Context, userID int64) ([]*repository.Task, error) {
	return s.taskRepo.FindTasksByUserID(ctx, userID)
}

func (s *taskService) GetTask(ctx context.Context, userID, taskID int64) (*repository.Task, error) {
	task, err := s.taskRepo.FindTaskByID(ctx, taskID)
	if errors.Is(err, repository.ErrTaskNotFound) {
		return nil, ErrTaskNotFound
	}
	if err != nil {
		return nil, err
	}
	if task.UserID != userID {
		return nil, ErrForbidden
	}
	return task, nil
}

func (s *taskService) UpdateTask(ctx context.Context, userID, taskID int64, input UpdateTaskInput) (*repository.Task, error) {
	if input.Status != nil {
		valid := map[string]bool{"todo": true, "in_progress": true, "done": true}
		if !valid[*input.Status] {
			return nil, fmt.Errorf("status must be one of: todo, in_progress, done")
		}
	}
	task, err := s.taskRepo.FindTaskByID(ctx, taskID)
	if errors.Is(err, repository.ErrTaskNotFound) {
		return nil, ErrTaskNotFound
	}
	if err != nil {
		return nil, err
	}
	if task.UserID != userID {
		return nil, ErrForbidden
	}
	updated, err := s.taskRepo.UpdateTask(ctx, taskID, input.Title, input.Status)
	if errors.Is(err, repository.ErrTaskNotFound) {
		return nil, ErrTaskNotFound
	}
	return updated, err
}

func (s *taskService) DeleteTask(ctx context.Context, userID, taskID int64) error {
	task, err := s.taskRepo.FindTaskByID(ctx, taskID)
	if errors.Is(err, repository.ErrTaskNotFound) {
		return ErrTaskNotFound
	}
	if err != nil {
		return err
	}
	if task.UserID != userID {
		return ErrForbidden
	}
	return s.taskRepo.DeleteTask(ctx, taskID)
}
