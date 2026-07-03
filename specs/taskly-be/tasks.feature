Feature: Taskly task management
  As an authenticated user of the Taskly API
  I want to create, view, update, and delete my tasks
  So that I can track my work and manage my to-do list

  Background:
    Given the Taskly API is running on http://localhost:8082
    And I am logged in and have a valid JWT token

  # --- Create ---

  Scenario: Create a task with a valid title
    Given I have no existing tasks
    When I POST to /api/tasks with title "Write unit tests"
    Then the response status is 201
    And the response body contains "id", "title", and "status"
    And the status field equals "todo"

  Scenario: Create a task with a missing title is rejected
    When I POST to /api/tasks with an empty body
    Then the response status is 400

  Scenario: Create a task without authentication is rejected
    Given I am not authenticated
    When I POST to /api/tasks with title "Write unit tests"
    Then the response status is 401
    And the response body contains error "authorization header required"

  # --- List ---

  Scenario: List tasks returns empty array when no tasks exist
    Given I have no existing tasks
    When I GET /api/tasks
    Then the response status is 200
    And the response body is an empty JSON array

  Scenario: List tasks returns only the authenticated user's tasks
    Given I have created tasks "Task A" and "Task B"
    When I GET /api/tasks
    Then the response status is 200
    And the response body contains 2 task objects

  Scenario: List tasks without authentication is rejected
    Given I am not authenticated
    When I GET /api/tasks
    Then the response status is 401
    And the response body contains error "authorization header required"

  # --- Get single ---

  Scenario: Get an existing task by id
    Given I have created a task with title "Buy groceries"
    When I GET /api/tasks/:id for that task
    Then the response status is 200
    And the response body contains "id" and "title"

  Scenario: Get a task that does not exist
    When I GET /api/tasks/99999
    Then the response status is 404
    And the response body contains error "task not found"

  Scenario: Get a task that belongs to another user
    Given another user owns task with id 1
    When I GET /api/tasks/1
    Then the response status is 403
    And the response body contains error "forbidden"

  Scenario: Get a task with a non-numeric id
    When I GET /api/tasks/abc
    Then the response status is 400
    And the response body contains error "invalid task id"

  # --- Update ---

  Scenario: Update a task status to done
    Given I have created a task with title "Fix bug"
    When I PUT /api/tasks/:id with body {"status": "done"}
    Then the response status is 200
    And the status field equals "done"

  Scenario: Update a task title
    Given I have created a task with title "Old title"
    When I PUT /api/tasks/:id with body {"title": "New title"}
    Then the response status is 200
    And the title field equals "New title"

  Scenario: Update a task with an invalid status is rejected
    Given I have created a task with title "Do something"
    When I PUT /api/tasks/:id with body {"status": "invalid"}
    Then the response status is 400
    And the response body contains error "status must be one of: todo, in_progress, done"

  Scenario: Update a task with an empty body is rejected
    Given I have created a task with title "Do something"
    When I PUT /api/tasks/:id with an empty JSON body {}
    Then the response status is 400
    And the response body contains error "at least one of title or status must be provided"

  Scenario: Update a task that belongs to another user
    Given another user owns task with id 1
    When I PUT /api/tasks/1 with body {"status": "done"}
    Then the response status is 403
    And the response body contains error "forbidden"

  # --- Delete ---

  Scenario: Delete an existing task
    Given I have created a task with title "To be deleted"
    When I DELETE /api/tasks/:id for that task
    Then the response status is 204
    And the response body is empty

  Scenario: Delete a task that does not exist
    When I DELETE /api/tasks/99999
    Then the response status is 404
    And the response body contains error "task not found"

  Scenario: Delete a task that belongs to another user
    Given another user owns task with id 1
    When I DELETE /api/tasks/1
    Then the response status is 403
    And the response body contains error "forbidden"
