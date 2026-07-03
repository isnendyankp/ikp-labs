package repository

import (
	"context"
	"database/sql"
	"errors"
)

var ErrTaskNotFound = errors.New("task not found")

type TaskRepository interface {
	CreateTask(ctx context.Context, userID int64, title string) (*Task, error)
	FindTasksByUserID(ctx context.Context, userID int64) ([]*Task, error)
	FindTaskByID(ctx context.Context, id int64) (*Task, error)
	UpdateTask(ctx context.Context, id int64, title, status *string) (*Task, error)
	DeleteTask(ctx context.Context, id int64) error
}

type pgTaskRepository struct {
	db *sql.DB
}

func NewTaskRepository(db *sql.DB) TaskRepository {
	return &pgTaskRepository{db: db}
}

func (r *pgTaskRepository) CreateTask(ctx context.Context, userID int64, title string) (*Task, error) {
	t := &Task{}
	err := r.db.QueryRowContext(ctx,
		`INSERT INTO tasks (user_id, title) VALUES ($1, $2)
         RETURNING id, user_id, title, status, created_at, updated_at`,
		userID, title,
	).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.CreatedAt, &t.UpdatedAt)
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (r *pgTaskRepository) FindTasksByUserID(ctx context.Context, userID int64) ([]*Task, error) {
	tasks := make([]*Task, 0)
	rows, err := r.db.QueryContext(ctx,
		`SELECT id, user_id, title, status, created_at, updated_at
         FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`,
		userID,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		t := &Task{}
		if err := rows.Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.CreatedAt, &t.UpdatedAt); err != nil {
			return nil, err
		}
		tasks = append(tasks, t)
	}
	return tasks, rows.Err()
}

func (r *pgTaskRepository) FindTaskByID(ctx context.Context, id int64) (*Task, error) {
	t := &Task{}
	err := r.db.QueryRowContext(ctx,
		`SELECT id, user_id, title, status, created_at, updated_at
         FROM tasks WHERE id = $1`,
		id,
	).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.CreatedAt, &t.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrTaskNotFound
	}
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (r *pgTaskRepository) UpdateTask(ctx context.Context, id int64, title, status *string) (*Task, error) {
	t := &Task{}
	err := r.db.QueryRowContext(ctx,
		`UPDATE tasks
         SET title      = COALESCE($1, title),
             status     = COALESCE($2, status),
             updated_at = NOW()
         WHERE id = $3
         RETURNING id, user_id, title, status, created_at, updated_at`,
		title, status, id,
	).Scan(&t.ID, &t.UserID, &t.Title, &t.Status, &t.CreatedAt, &t.UpdatedAt)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, ErrTaskNotFound
	}
	if err != nil {
		return nil, err
	}
	return t, nil
}

func (r *pgTaskRepository) DeleteTask(ctx context.Context, id int64) error {
	result, err := r.db.ExecContext(ctx, `DELETE FROM tasks WHERE id = $1`, id)
	if err != nil {
		return err
	}
	rows, err := result.RowsAffected()
	if err != nil {
		return err
	}
	if rows == 0 {
		return ErrTaskNotFound
	}
	return nil
}
