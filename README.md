# Task Manager

A task management application built with Node.js. It started as a command-line application and was extended into a RESTful API using Express.js.

The application supports task creation, retrieval, updating, deletion, searching, and filtering, with data persisted locally in a JSON file.

## Features

### CLI

- Add new tasks.
- Display all tasks.
- Update task titles.
- Delete tasks.
- Mark tasks as completed.
- Search tasks by title.
- Filter tasks by completion status.

### REST API

- Retrieve all tasks.
- Retrieve a task by ID.
- Create new tasks.
- Delete tasks.
- Replace an existing task using PUT.
- Partially update a task using PATCH.
- Validate request parameters and bodies.
- Handle errors using centralized error-handling middleware.
- Follow a layered architecture separating routes, controllers, middleware, and services.

### Testing

- Unit tests for task operations and services.
- Controller tests.
- API integration tests using Supertest.
- Error-handling and validation test coverage.

## Technologies

- Node.js
- JavaScript (ES Modules)
- Express.js
- REST API
- Supertest
- Node.js Test Runner (`node:test`)
- Node.js File System (`node:fs/promises`)
- JSON file storage
- npm

## Project Structure

```text
task-manager/
│
├── src/
│   ├── controllers/
│   │   └── tasks.controller.js
│   │
│   ├── middleware/
│   │   └── validateTask.js
│   │
│   ├── routes/
│   │   └── tasks.routes.js
│   │
│   ├── services/
│   │   └── tasks.service.js
│   │
│   ├── app.js
│   ├── index.js
│   ├── server.js
│   ├── storage.js
│   └── tasks.js
│
├── tests/
│   ├── integration/
│   │   └── tasks.api.test.js
│   ├── controllers/
│   │   └── tasks.controller.test.js
│   ├── services/
│   └── tasks.service.test.js
│
├── tasks.json
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Installation

Clone the repository:

```bash
git clone https://github.com/Abdul-Rahman-Ahmed/task-manager-cli.git
```

Navigate to the project directory:

```bash
cd task-manager-cli
```

Install dependencies:

```bash
npm install
```

## Usage

### 1. Command-Line Interface

Run the CLI application:

#### Add a task

```bash
node src/index.js add "Learn JavaScript"
```

#### Display all tasks

```bash
node src/index.js display
```

#### Update a task

```bash
node src/index.js update 1 "Learn Node.js"
```

#### Delete a task

```bash
node src/index.js delete 1
```

#### Complete a task

```bash
node src/index.js complete 1
```

#### Search tasks

```bash
node src/index.js search JavaScript
```

#### Filter completed tasks

```bash
node src/index.js filter completed
```

#### Filter pending tasks

```bash
node src/index.js filter pending
```

### 2. REST API

Start the development server:

```bash
npm run server
```

The server runs at:

```text
http://localhost:3000
```

The port can be configured using the `PORT` environment variable.

### API Endpoints

| Method | Endpoint     | Description             |
| ------ | ------------ | ----------------------- |
| GET    | `/tasks`     | Retrieve all tasks      |
| GET    | `/tasks/:id` | Retrieve a task by ID   |
| POST   | `/tasks`     | Create a new task       |
| DELETE | `/tasks/:id` | Delete a task           |
| PUT    | `/tasks/:id` | Replace a task          |
| PATCH  | `/tasks/:id` | Partially update a task |

### Example Requests

#### Create a task

```http
POST /tasks
Content-Type: application/json
```

```json
{
  "title": "Learn Node.js"
}
```

#### Update a task using PUT

```http
PUT /tasks/1
Content-Type: application/json
```

```json
{
  "title": "Learn Express.js",
  "completed": false
}
```

#### Update a task using PATCH

```http
PATCH /tasks/1
Content-Type: application/json
```

```json
{
  "completed": true
}
```

### HTTP Status Codes

The API uses standard HTTP status codes, including:

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 201         | Created               |
| 204         | No Content            |
| 400         | Bad Request           |
| 404         | Not Found             |
| 500         | Internal Server Error |

## Running Tests

Run the test suite:

```bash
node --experimental-test-module-mocks --test
```

The test suite uses:

- Node.js Test Runner for unit and controller tests.
- Supertest for API integration tests.
- Module mocking to isolate storage operations during testing.

## Data Storage

Tasks are stored locally in `tasks.json`.

Each task contains:

- `id`: Unique task identifier.
- `title`: Task description.
- `completed`: Completion status.
- `createdAt`: Task creation timestamp.
- `updatedAt`: Last update timestamp.

## Project Architecture

The REST API follows a layered architecture:

- **Routes:** Define API endpoints and connect them to controllers.
- **Middleware:** Validate incoming requests and handle request processing.
- **Controllers:** Handle HTTP requests and responses.
- **Services:** Contain the application's business logic.
- **Storage:** Handle reading and writing task data.

This separation improves maintainability, testability, and code organization.

## Learning Objectives

This project was built to practice:

- JavaScript fundamentals.
- Node.js and ES Modules.
- Asynchronous programming.
- Promises and async/await.
- File System operations.
- Express.js and REST API development.
- HTTP methods and status codes.
- Middleware and centralized error handling.
- Layered application architecture.
- Input validation.
- Unit and integration testing.
- Mocking dependencies.

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
