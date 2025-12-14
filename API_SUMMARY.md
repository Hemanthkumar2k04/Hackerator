# Hackerator API Endpoints Summary

## Authentication

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/reset-password` - Request password reset

## Ideas

- `POST /api/ideas/generate` - Generate a detailed project plan from a simple idea using LLM

## Projects

- `POST /api/projects/save` - Create and save a new project with user context
- `GET /api/projects` - Retrieve all projects for the authenticated user
- `GET /api/projects/:projectId` - Retrieve a specific project (with ownership verification)
- `POST /api/projects` - Legacy endpoint for creating projects without user context

## Workspace

- `GET /api/workspace/:projectId` - Fetch complete workspace timeline including phases, tasks, nodes, and edges
- `POST /api/workspace/:projectId/generate` - Generate an execution plan using LLM with phases and tasks
- `POST /api/workspace/:projectId/phase-complete` - Mark a phase as completed
- `POST /api/workspace/:projectId/task-complete` - Mark a task as completed
- `GET /api/workspace/:projectId/tasks/:phaseId` - Fetch all tasks for a specific phase

## Admin

- `GET /api/admin/users` - Retrieve all registered users (admin only)
