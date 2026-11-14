# Task Manager CLI

A simple command-line task manager built with Node.js using ES Modules and asynchronous file operations.

The application allows users to manage tasks directly from the terminal, with data stored locally in a JSON file.

## Features

- Add new tasks.
- Display all tasks.
- Update task titles.
- Delete tasks.
- Mark tasks as completed.
- Search tasks by title.
- Filter tasks by completion status.
- Persist tasks using JSON file storage.
- Validate user inputs.
- Handle errors.
- Automated tests using Node.js Test Runner.

## Technologies

- Node.js
- JavaScript (ES Modules)
- File System (`node:fs/promises`)
- Path (`node:path`)
- URL (`node:url`)
- Node.js Test Runner (`node:test`)

## Project Structure

```text
task-manager-cli/
│
├── src/
│   ├── index.js
│   ├── tasks.js
│   └── storage.js
│
├── tests/
│   └── tasks.test.js
│
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

### Add a task

```bash
node src/index.js add "Learn JavaScript"
```

### Display all tasks

```bash
node src/index.js display
```

### Update a task

```bash
node src/index.js update 1 "Learn Node.js"
```

### Delete a task

```bash
node src/index.js delete 1
```

### Complete a task

```bash
node src/index.js complete 1
```

### Search tasks

```bash
node src/index.js search JavaScript
```

### Filter completed tasks

```bash
node src/index.js filter completed
```

### Filter pending tasks

```bash
node src/index.js filter pending
```

## Running Tests

Run the automated test suite:

```bash
npm test
```

## Data Storage

Tasks are stored locally in `tasks.json`.

Each task contains:

- `id`: Unique task identifier.
- `title`: Task description.
- `completed`: Completion status.
- `createdAt`: Task creation timestamp.
- `updatedAt`: Last update timestamp.

## Learning Objectives

This project was built to practice:

- JavaScript fundamentals.
- Node.js modules and ES Modules.
- Asynchronous programming.
- Promises and async/await.
- File System operations.
- JSON parsing and serialization.
- Error handling.
- Input validation.
- Unit testing.

## License

This project is licensed under the MIT License.
See the [LICENSE](LICENSE) file for details.
