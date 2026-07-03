package handler

import (
	"errors"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/isnendyankp/taskly-be/internal/service"
)

type TaskHandler struct {
	taskService service.TaskService
}

func NewTaskHandler(taskService service.TaskService) *TaskHandler {
	return &TaskHandler{taskService: taskService}
}

type createTaskRequest struct {
	Title string `json:"title" binding:"required"`
}

type updateTaskRequest struct {
	Title  *string `json:"title"`
	Status *string `json:"status"`
}

type taskResponse struct {
	ID        int64     `json:"id"`
	UserID    int64     `json:"user_id"`
	Title     string    `json:"title"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func respondTaskError(c *gin.Context, err error) {
	switch {
	case errors.Is(err, service.ErrTaskNotFound):
		c.JSON(http.StatusNotFound, errorResponse{"task not found"})
	case errors.Is(err, service.ErrForbidden):
		c.JSON(http.StatusForbidden, errorResponse{"forbidden"})
	default:
		log.Printf("unexpected task error: %v", err)
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
	}
}

func getAuthUserID(c *gin.Context) (int64, bool) {
	val, _ := c.Get("userID")
	userID, ok := val.(int64)
	return userID, ok
}

func parseTaskID(c *gin.Context) (int64, bool) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{"invalid task id"})
		return 0, false
	}
	return id, true
}

func (h *TaskHandler) Create(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
		return
	}
	var req createTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{err.Error()})
		return
	}
	task, err := h.taskService.CreateTask(c.Request.Context(), userID, service.CreateTaskInput{Title: req.Title})
	if err != nil {
		respondTaskError(c, err)
		return
	}
	c.JSON(http.StatusCreated, taskResponse{
		ID:        task.ID,
		UserID:    task.UserID,
		Title:     task.Title,
		Status:    task.Status,
		CreatedAt: task.CreatedAt,
		UpdatedAt: task.UpdatedAt,
	})
}

func (h *TaskHandler) List(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
		return
	}
	tasks, err := h.taskService.ListTasks(c.Request.Context(), userID)
	if err != nil {
		respondTaskError(c, err)
		return
	}
	resp := make([]taskResponse, 0, len(tasks))
	for _, t := range tasks {
		resp = append(resp, taskResponse{
			ID:        t.ID,
			UserID:    t.UserID,
			Title:     t.Title,
			Status:    t.Status,
			CreatedAt: t.CreatedAt,
			UpdatedAt: t.UpdatedAt,
		})
	}
	c.JSON(http.StatusOK, resp)
}

func (h *TaskHandler) Get(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
		return
	}
	taskID, ok := parseTaskID(c)
	if !ok {
		return
	}
	task, err := h.taskService.GetTask(c.Request.Context(), userID, taskID)
	if err != nil {
		respondTaskError(c, err)
		return
	}
	c.JSON(http.StatusOK, taskResponse{
		ID:        task.ID,
		UserID:    task.UserID,
		Title:     task.Title,
		Status:    task.Status,
		CreatedAt: task.CreatedAt,
		UpdatedAt: task.UpdatedAt,
	})
}

func (h *TaskHandler) Update(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
		return
	}
	taskID, ok := parseTaskID(c)
	if !ok {
		return
	}
	var req updateTaskRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, errorResponse{err.Error()})
		return
	}
	if req.Title == nil && req.Status == nil {
		c.JSON(http.StatusBadRequest, errorResponse{"at least one of title or status must be provided"})
		return
	}
	task, err := h.taskService.UpdateTask(c.Request.Context(), userID, taskID, service.UpdateTaskInput{
		Title:  req.Title,
		Status: req.Status,
	})
	if err != nil {
		// Status validation error is a plain error with a user-safe message
		if !errors.Is(err, service.ErrTaskNotFound) && !errors.Is(err, service.ErrForbidden) {
			c.JSON(http.StatusBadRequest, errorResponse{err.Error()})
			return
		}
		respondTaskError(c, err)
		return
	}
	c.JSON(http.StatusOK, taskResponse{
		ID:        task.ID,
		UserID:    task.UserID,
		Title:     task.Title,
		Status:    task.Status,
		CreatedAt: task.CreatedAt,
		UpdatedAt: task.UpdatedAt,
	})
}

func (h *TaskHandler) Delete(c *gin.Context) {
	userID, ok := getAuthUserID(c)
	if !ok {
		c.JSON(http.StatusInternalServerError, errorResponse{"internal server error"})
		return
	}
	taskID, ok := parseTaskID(c)
	if !ok {
		return
	}
	err := h.taskService.DeleteTask(c.Request.Context(), userID, taskID)
	if err != nil {
		respondTaskError(c, err)
		return
	}
	c.Status(http.StatusNoContent)
}
