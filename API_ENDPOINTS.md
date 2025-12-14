# Hackerator API Endpoints Documentation

## Overview

Hackerator is a project management and execution planning platform that uses LLM (Large Language Models) to generate detailed execution plans for projects. The API is built with Express.js and Better Auth for authentication.

**Base URL:** `http://localhost:3000/api`

---

## Authentication

All endpoints (except `/api/ideas/generate`) require user authentication via Better Auth.

### Authentication Flow

- Uses Better Auth library for session management
- Sessions are extracted from request headers
- User ID is validated against project ownership for protected resources
- CORS enabled for `http://localhost:5173` and `http://localhost:8000`

---

## API Routes

### 1. AUTH ROUTES (`/api/auth`)

**Handler:** Better Auth Built-in Handlers
**Location:** `src/index.ts`

#### Endpoints:

- `POST /api/auth/sign-up` - Register new user
- `POST /api/auth/sign-in` - Login user
- `POST /api/auth/sign-out` - Logout user
- `GET /api/auth/session` - Get current user session
- `POST /api/auth/reset-password` - Request password reset

---

### 2. IDEAS ROUTES (`/api/ideas`)

**File:** `src/routes/ideas.ts`
**Description:** Generate project plans from simple ideas using LLM

#### POST `/api/ideas/generate`

Generate a detailed project plan from a single idea.

**Authentication:** ❌ Not Required

**Request Body:**

```json
{
  "idea": "A mobile app for tracking habits"
}
```

**Response:** (200 OK)

```json
{
  "project_title": "Habit Tracker App",
  "short_summary": "A mobile application...",
  "problem_statement": "...",
  "key_features": ["Feature 1", "Feature 2"],
  "target_users": ["Individuals", "Teams"],
  "tech_stack": ["React", "Node.js", "PostgreSQL"],
  "architecture_overview": "...",
  "estimated_timeline": "8-12 weeks",
  "mode": "project"
}
```

**Error Responses:**

- `400 Bad Request` - Missing idea parameter
- `500 Internal Server Error` - LLM generation failed

---

### 3. PROJECTS ROUTES (`/api/projects`)

**File:** `src/routes/projects.ts`
**Description:** Manage user projects with full ownership verification

#### POST `/api/projects/save`

Create and save a new project with user context.

**Authentication:** ✅ Required

**Request Body:**

```json
{
  "project_title": "Habit Tracker",
  "short_summary": "Mobile app for tracking daily habits",
  "problem_statement": "Users struggle to maintain consistent habits without tracking",
  "key_features": [
    "Daily habit logging",
    "Progress visualization",
    "Streak tracking"
  ],
  "target_users": ["Individuals", "Teams"],
  "team_size": 5,
  "tech_stack": ["React Native", "Firebase", "Node.js"],
  "architecture_overview": "Microservices architecture with cloud deployment",
  "estimated_timeline": "12-16 weeks",
  "notes": "Priority: launch MVP in 8 weeks",
  "mode": "project"
}
```

**Response:** (201 Created)

```json
{
  "success": true,
  "project_id": 42,
  "message": "Project \"Habit Tracker\" created for user 12345"
}
```

**Error Responses:**

- `401 Unauthorized` - User session required
- `500 Internal Server Error` - Database insertion failed

---

#### GET `/api/projects`

Retrieve all projects for the authenticated user.

**Authentication:** ✅ Required

**Query Parameters:** None

**Response:** (200 OK)

```json
{
  "success": true,
  "projects": [
    {
      "id": 42,
      "user_id": "12345",
      "project_title": "Habit Tracker",
      "mode": "project",
      "team_size": 5,
      "short_summary": "Mobile app for tracking daily habits",
      "created_at": "2025-12-06T10:30:00Z",
      "updated_at": "2025-12-06T10:30:00Z"
    }
  ],
  "count": 1
}
```

**Error Responses:**

- `401 Unauthorized` - User session required
- `500 Internal Server Error` - Database query failed

---

#### GET `/api/projects/:projectId`

Retrieve a specific project (with ownership verification).

**Authentication:** ✅ Required

**URL Parameters:**

- `projectId` (required) - ID of the project

**Response:** (200 OK)

```json
{
  "success": true,
  "project": {
    "id": 42,
    "user_id": "12345",
    "project_title": "Habit Tracker",
    "short_summary": "Mobile app for tracking daily habits",
    "problem_statement": "...",
    "key_features": [...],
    "target_users": [...],
    "tech_stack": [...],
    "architecture_overview": "...",
    "estimated_timeline": "12-16 weeks",
    "notes": "...",
    "mode": "project",
    "created_at": "2025-12-06T10:30:00Z",
    "updated_at": "2025-12-06T10:30:00Z"
  }
}
```

**Error Responses:**

- `401 Unauthorized` - User session required
- `403 Forbidden` - You do not have access to this project
- `404 Not Found` - Project not found
- `500 Internal Server Error` - Database query failed

---

#### POST `/api/projects` (Legacy)

Legacy endpoint for creating projects without user context.

**Authentication:** ❌ Not Required

**Request Body:**

```json
{
  "project_title": "Legacy Project",
  "short_summary": "...",
  "problem_statement": "...",
  "key_features": [...],
  "target_users": [...],
  "tech_stack": [...],
  "architecture_overview": "...",
  "estimated_timeline": "...",
  "notes": "..."
}
```

**Response:** (201 Created)

```json
{
  "id": 43,
  "title": "Legacy Project",
  ...
}
```

**Error Responses:**

- `500 Internal Server Error` - Database insertion failed

---

### 4. WORKSPACE ROUTES (`/api/workspace`)

**File:** `src/routes/workspace.ts`
**Description:** Manage execution plans, phases, tasks, and React Flow visualization

#### GET `/api/workspace/:projectId`

Fetch complete workspace timeline including phases, tasks, nodes, and edges.

**Authentication:** ✅ Required (Ownership Verification)

**URL Parameters:**

- `projectId` (required) - ID of the project

**Response:** (200 OK)

```json
{
  "project": {
    "id": 42,
    "project_title": "Habit Tracker",
    "mode": "project",
    "estimated_timeline": "12-16 weeks"
  },
  "phases": [
    {
      "id": 15,
      "title": "Project Setup & Core Infrastructure",
      "description": "Establish the foundational project structure...",
      "order_index": 0,
      "completed": false
    }
  ],
  "nodes": [
    {
      "id": "phase-15",
      "type": "phase",
      "position": { "x": 250, "y": 50 },
      "data": {
        "label": "Project Setup & Core Infrastructure",
        "description": "...",
        "estimated_time": "3-4 days",
        "phaseId": 15,
        "tasks": [
          {
            "id": 1,
            "phase_id": 15,
            "title": "Initialize project repository",
            "description": "...",
            "assigned_to": "Team Lead",
            "completed": false
          }
        ]
      }
    }
  ],
  "edges": [
    {
      "id": "edge-phase-15-phase-16",
      "source": "phase-15",
      "target": "phase-16",
      "type": "default",
      "animated": true
    }
  ]
}
```

**Error Responses:**

- `403 Forbidden` - You do not own this project
- `404 Not Found` - Project not found
- `500 Internal Server Error` - Database query failed

---

#### POST `/api/workspace/:projectId/generate`

Generate an execution plan using LLM (Gemini AI).

**Authentication:** ✅ Required

**URL Parameters:**

- `projectId` (required) - ID of the project

**Request Body:** None

**Response:** (200 OK)

```json
{
  "success": true,
  "message": "Plan generated successfully"
}
```

**Response Details:**

- Creates phases with tasks
- Generates React Flow nodes for visualization
- Creates edges connecting phases sequentially
- All data stored in `phases`, `tasks`, `workspace_nodes`, and `workspace_edges` tables

**Error Responses:**

- `400 Bad Request` - Plan already exists
- `401 Unauthorized` - User session required
- `403 Forbidden` - You do not own this project
- `404 Not Found` - Project not found
- `500 Internal Server Error` - LLM generation or database insertion failed

---

#### POST `/api/workspace/:projectId/phase-complete`

Mark a phase as completed.

**Authentication:** ✅ Required

**URL Parameters:**

- `projectId` (required) - ID of the project

**Request Body:**

```json
{
  "phaseId": 15
}
```

**Response:** (200 OK)

```json
{
  "success": true,
  "phase": {
    "id": 15,
    "title": "Project Setup & Core Infrastructure",
    "completed": true
  }
}
```

**Error Responses:**

- `403 Forbidden` - You do not own this project
- `404 Not Found` - Phase not found
- `500 Internal Server Error` - Database update failed

---

#### POST `/api/workspace/:projectId/task-complete`

Mark a task as completed.

**Authentication:** ✅ Required

**URL Parameters:**

- `projectId` (required) - ID of the project

**Request Body:**

```json
{
  "taskId": 1
}
```

**Response:** (200 OK)

```json
{
  "success": true,
  "task": {
    "id": 1,
    "title": "Initialize project repository",
    "completed": true
  }
}
```

**Error Responses:**

- `403 Forbidden` - You do not own this project
- `404 Not Found` - Task not found
- `500 Internal Server Error` - Database update failed

---

#### GET `/api/workspace/:projectId/tasks/:phaseId`

Fetch all tasks for a specific phase.

**Authentication:** ✅ Required

**URL Parameters:**

- `projectId` (required) - ID of the project
- `phaseId` (required) - ID of the phase

**Response:** (200 OK)

```json
[
  {
    "id": 1,
    "title": "Initialize project repository",
    "description": "Set up Git repository and initial project structure",
    "order_index": 0,
    "completed": false
  },
  {
    "id": 2,
    "title": "Setup database schema",
    "description": "Create PostgreSQL schema for the application",
    "order_index": 1,
    "completed": false
  }
]
```

**Error Responses:**

- `403 Forbidden` - You do not own this project
- `500 Internal Server Error` - Database query failed

---

### 5. ADMIN ROUTES (`/api/admin`)

**File:** `src/routes/admin.ts`
**Description:** Administrative operations (restricted to admin users)

**Admin Email:** `hemanthkumar2k04@gmail.com`

#### GET `/api/admin/users`

Retrieve all registered users (admin only).

**Authentication:** ✅ Required (Admin Only)

**Response:** (200 OK)

```json
[
  {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@example.com",
    "createdAt": "2025-12-01T08:00:00Z",
    "updatedAt": "2025-12-06T10:30:00Z"
  }
]
```

**Error Responses:**

- `401 Unauthorized` - User not authenticated
- `403 Forbidden` - Admin access required
- `500 Internal Server Error` - Database query failed

---

## Database Schema Overview

### Tables Used:

1. **projects**

   - `id`, `user_id`, `project_title`, `mode`, `team_size`
   - `short_summary`, `problem_statement`, `key_features`
   - `target_users`, `tech_stack`, `architecture_overview`
   - `estimated_timeline`, `notes`
   - `created_at`, `updated_at`

2. **phases**

   - `id`, `project_id`, `title`, `description`
   - `order_index`, `completed`, `created_at`, `updated_at`

3. **tasks**

   - `id`, `phase_id`, `title`, `description`
   - `order_index`, `assigned_to`, `completed`
   - `created_at`, `updated_at`

4. **workspace_nodes**

   - `id`, `project_id`, `node_key`, `type`
   - `data` (JSONB), `position` (JSONB)
   - `created_at`, `updated_at`

5. **workspace_edges**

   - `id`, `project_id`, `source`, `target`
   - `type`, `metadata` (JSONB)
   - `created_at`, `updated_at`

6. **user** (Better Auth)
   - `id`, `name`, `email`, `createdAt`, `updatedAt`

---

## Response Status Codes

| Code | Meaning      | Common Causes                                 |
| ---- | ------------ | --------------------------------------------- |
| 200  | OK           | Successful GET/POST request                   |
| 201  | Created      | Successful POST request creating resource     |
| 400  | Bad Request  | Invalid parameters or missing required fields |
| 401  | Unauthorized | User session required but not provided        |
| 403  | Forbidden    | User lacks permissions (admin/ownership)      |
| 404  | Not Found    | Resource doesn't exist                        |
| 500  | Server Error | Database or LLM service failure               |

---

## Security Features

1. **Authentication Middleware** - Extracts and validates user session from request headers
2. **Ownership Verification** - All project-specific endpoints verify user ownership
3. **Admin Access Control** - Admin endpoints restricted by email verification
4. **CORS Configuration** - Limited to trusted frontend origins
5. **Session Management** - Better Auth handles secure session storage

---

## Error Handling

All endpoints return errors in the following format:

```json
{
  "error": "Description of what went wrong"
}
```

Or:

```json
{
  "success": false,
  "message": "Human-readable error message"
}
```

---

## LLM Integration (Gemini)

The `/api/workspace/:projectId/generate` endpoint uses Google Gemini AI to:

- Analyze project requirements
- Generate phase-based execution plans
- Create realistic timelines and task assignments
- Output structured phase, task, and node/edge data

---

## Example Usage Flow

```
1. POST /api/ideas/generate
   └─ Generate initial project plan from idea

2. POST /api/projects/save
   └─ Save generated plan as a project

3. POST /api/workspace/:projectId/generate
   └─ Generate execution plan with phases and tasks

4. GET /api/workspace/:projectId
   └─ Retrieve complete workspace visualization

5. POST /api/workspace/:projectId/phase-complete
   └─ Mark phases as complete as work progresses

6. GET /api/workspace/:projectId/tasks/:phaseId
   └─ Fetch specific phase tasks for team coordination
```

---

## Frontend Integration

The frontend consumes these endpoints to:

- Display project lists (GET /projects)
- Render execution plans as React Flow graphs (GET /workspace/:projectId)
- Track progress by marking phases/tasks complete
- Generate new plans on-demand (POST /workspace/:projectId/generate)

---

## Future Enhancements

- [ ] Batch task updates
- [ ] Phase dependencies and conditional logic
- [ ] Team collaboration and role-based access
- [ ] Real-time progress updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Export plans as PDFs or documents
- [ ] Integration with project management tools (Jira, Asana)

---

**Last Updated:** December 7, 2025  
**API Version:** 1.0.0
