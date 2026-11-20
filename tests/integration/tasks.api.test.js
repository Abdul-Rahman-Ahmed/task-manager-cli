import { test, beforeEach, mock } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";

let mockTasks = [];
let shouldLoadErr = false;
let shouldSaveErr = false;

mock.module(new URL("../../src/storage.js", import.meta.url), {
  exports: {
    loadTasks: async () => {
      if (shouldLoadErr) throw new Error("Load Storage Error");
      return structuredClone(mockTasks);
    },
    saveTasks: async (tasks) => {
      if (shouldSaveErr) throw new Error("Save Storage Error");
      mockTasks = tasks;
    },
  },
});

const { default: app } = await import("../../src/app.js");

beforeEach(() => {
  mockTasks = [];
  shouldLoadErr = false;
  shouldSaveErr = false;
});

// Get /tasks tests
test("Get /tasks successfully", async () => {
  mockTasks = [
    {
      id: 1,
      title: "first",
      completed: false,
    },
    {
      id: 2,
      title: "second",
      completed: false,
    },
  ];
  const result = await request(app).get("/tasks");
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body, mockTasks);
});

test("Get /tasks failed", async () => {
  shouldLoadErr = true;
  const result = await request(app).get("/tasks");
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Load Storage Error",
  });
});

// Get /tasks/:id tests
test("Get /tasks/:id task exist", async () => {
  mockTasks = [
    {
      id: 1,
      title: "first",
      completed: false,
    },
    {
      id: 2,
      title: "second",
      completed: false,
    },
  ];
  const result = await request(app).get("/tasks/2");
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body, mockTasks[1]);
});

test("Get /tasks/:id task not exist", async () => {
  const result = await request(app).get("/tasks/3");
  assert.strictEqual(result.statusCode, 404);
  assert.deepStrictEqual(result.body, {
    message: "task not found",
  });
});

test("Get /tasks/:id with id not valid", async () => {
  const result = await request(app).get("/tasks/abc");
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

// Post /tasks tests
test("Post /tasks with valid title", async () => {
  const result = await request(app).post("/tasks").send({ title: "New Task" });
  assert.strictEqual(result.statusCode, 201);
  assert.deepStrictEqual(result.body.data, mockTasks[0]);
  assert.strictEqual(result.body.data.title, "New Task");
  assert.strictEqual(result.body.data.completed, false);
  assert.strictEqual(result.body.data.id, 1);
  assert.strictEqual(mockTasks.length, 1);
});

test("Post /tasks should return 400 for malformed JSON", async () => {
  const result = await request(app)
    .post("/tasks")
    .set("Content-Type", "application/json")
    .send(`{ "title":`);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Unexpected end of JSON input",
  });
});

test("Post /tasks missing title", async () => {
  const result = await request(app).post("/tasks").send({});
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Not Valid Title",
  });
});

test("Post /tasks with invalid title", async () => {
  const result = await request(app).post("/tasks").send({ title: " " });
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Not Valid Title",
  });
});

test("Post /tasks with title isn't a string", async () => {
  const result = await request(app).post("/tasks").send({ title: 123 });
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Not Valid Title",
  });
});

test("Post /tasks with invalid request body", async () => {
  const result = await request(app).post("/tasks").send("invalid req body");
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Invalid request body",
  });
});

test("Post /tasks with load storage error", async () => {
  shouldLoadErr = true;
  const result = await request(app).post("/tasks").send({ title: "New Task" });
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Load Storage Error",
  });
});

test("Post /tasks with save storage error", async () => {
  shouldSaveErr = true;
  const result = await request(app).post("/tasks").send({ title: "New Task" });
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Save Storage Error",
  });
});

// Delete /tasks/:id tests
test("Delete /tasks/:id  Delete successfully", async () => {
  mockTasks = [{ id: 1 }];
  const result = await request(app).delete("/tasks/1");
  assert.strictEqual(result.statusCode, 204);
  assert.deepStrictEqual(mockTasks, []);
});

test("Delete /tasks/:id Task doesn't exist", async () => {
  const result = await request(app).delete("/tasks/1");
  assert.strictEqual(result.statusCode, 404);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Task Not Found",
  });
});

test("Delete /tasks/:id Invalid ID", async () => {
  const result = await request(app).delete("/tasks/abc");
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Not Valid ID",
  });
});

test("Delete /tasks/:id Load storage error", async () => {
  shouldLoadErr = true;
  mockTasks = [{ id: 1 }];
  const result = await request(app).delete("/tasks/1");
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Load Storage Error",
  });
});

test("Delete /tasks/:id Save storage error", async () => {
  shouldSaveErr = true;
  mockTasks = [{ id: 1 }];
  const result = await request(app).delete("/tasks/1");
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Save Storage Error",
  });
});

// Put /tasks/:id tests
test("Put /tasks/:id Update task successfully", async () => {
  mockTasks = [
    { id: 1, title: "Old Task", completed: true },
    { id: 2, title: "Second Title", completed: false },
  ];
  const body = { title: "    Replace Task   ", completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body.data, mockTasks[0]);
  assert.strictEqual(result.body.data.title, "Replace Task");
  assert.strictEqual(result.body.data.completed, false);
  assert.strictEqual(result.body.data.id, 1);
  assert.deepStrictEqual(mockTasks[1], {
    id: 2,
    title: "Second Title",
    completed: false,
  });
});

test("Put /tasks/:id Update task that doesn't exist", async () => {
  const body = { title: "Replace Task", completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 404);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Task Not Found",
  });
});

test("Put /tasks/:id Update with invalid ID", async () => {
  const body = { title: "Replace Task", completed: false };
  const result = await request(app).put("/tasks/abc").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

test("Put /tasks/:id Update with ID = 0", async () => {
  const body = { title: "Replace Task", completed: false };
  const result = await request(app).put("/tasks/0").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

test("Put /tasks/:id Update with missing title", async () => {
  mockTasks = [{ id: 1 }];
  const body = { completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title and Completed Required",
  });
});

test("Put /tasks/:id Update with missing completed", async () => {
  mockTasks = [{ id: 1 }];
  const body = { title: "Replace Task" };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title and Completed Required",
  });
});

test("Put /tasks/:id Update with empty title", async () => {
  mockTasks = [{ id: 1 }];
  const body = { title: " ", completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title must be non empty string",
  });
});

test("Put /tasks/:id Update with title that isn't a string", async () => {
  mockTasks = [{ id: 1 }];
  const body = { title: 123, completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title must be non empty string",
  });
});

test("Put /tasks/:id Update with completed that isn't a boolean", async () => {
  mockTasks = [{ id: 1 }];
  const body = { title: "123", completed: "false" };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "completed must be a boolean",
  });
});

test("Put /tasks/:id Update with extra unexpected field", async () => {
  mockTasks = [{ id: 1 }];
  const body = { title: "123", completed: false, name: "Ahmed" };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "body must to have only title and completed",
  });
});

test("Put /tasks/:id Update with empty request body", async () => {
  mockTasks = [{ id: 1 }];
  const body = {};
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title and Completed Required",
  });
});

test("Put /tasks/:id Update with invalid request body", async () => {
  mockTasks = [{ id: 1 }];
  let body = [];
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "body must to be a object",
  });
});

test("Put /tasks/:id Update with load storage error", async () => {
  shouldLoadErr = true;
  mockTasks = [{ id: 1 }];
  const body = { title: "Replace Task", completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Load Storage Error",
  });
});

test("Put /tasks/:id Update with save storage error", async () => {
  shouldSaveErr = true;
  mockTasks = [{ id: 1 }];
  const body = { title: "Replace Task", completed: false };
  const result = await request(app).put("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Save Storage Error",
  });
});

// Patch /tasks/:id tests
test("Patch /tasks/:id Update title successfully", async () => {
  mockTasks = [
    { id: 1, title: "first title", completed: true },
    { id: 2, title: "second title", completed: false },
  ];

  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body.data, mockTasks[0]);
  assert.strictEqual(result.body.data.title, "Updated Title");
  assert.strictEqual(result.body.data.completed, true);
  assert.strictEqual(mockTasks[1].title, "second title");
  assert.strictEqual(mockTasks[1].completed, false);
});

test("Patch /tasks/:id Update completed successfully", async () => {
  mockTasks = [
    { id: 1, title: "first title", completed: true },
    { id: 2, title: "second title", completed: false },
  ];

  const body = { completed: false };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body.data, mockTasks[0]);
  assert.strictEqual(result.body.data.title, "first title");
  assert.strictEqual(result.body.data.completed, false);
  assert.strictEqual(mockTasks[1].title, "second title");
  assert.strictEqual(mockTasks[1].completed, false);
});

test("Patch /tasks/:id Update title and completed together", async () => {
  mockTasks = [
    { id: 1, title: "first title", completed: true },
    { id: 2, title: "second title", completed: false },
  ];

  const body = { title: "Updated Title", completed: false };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 200);
  assert.deepStrictEqual(result.body.data, mockTasks[0]);
  assert.strictEqual(result.body.data.title, "Updated Title");
  assert.strictEqual(result.body.data.completed, false);
  assert.strictEqual(mockTasks[1].title, "second title");
  assert.strictEqual(mockTasks[1].completed, false);
});

test("Patch /tasks/:id Update task that doesn't exist", async () => {
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 404);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Task Not Found",
  });
});

test("Patch /tasks/:id Update with invalid ID", async () => {
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/abc").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

test("Patch /tasks/:id Update with ID = 0", async () => {
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/0").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

test("Patch /tasks/:id Update with negative ID", async () => {
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/-1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "not vaild ID",
  });
});

test("Patch /tasks/:id Update with empty request body", async () => {
  const body = {};
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "At least one field is required",
  });
});

test("Patch /tasks/:id Update with invalid request body", async () => {
  const body = [];
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "body must to be a object",
  });
});

test("Patch /tasks/:id Update with null request body", async () => {
  const body = null;
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "body must to be a object",
  });
});

test("Patch /tasks/:id Update with empty title", async () => {
  const body = { title: "   " };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title must be non empty string",
  });
});

test("Patch /tasks/:id Update with title that isn't a string", async () => {
  const body = { title: 123 };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title must be non empty string",
  });
});

test("Patch /tasks/:id Update with completed that isn't a boolean", async () => {
  const body = { completed: 123 };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "completed must to be a boolean",
  });
});

test("Patch /tasks/:id Update with extra unexpected field", async () => {
  const body = { completed: 123, name: "ahmed" };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "body must to have only title and completed",
  });
});

test("Patch /tasks/:id Update with both title and completed invalid", async () => {
  const body = { completed: 123, title: "  " };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 400);
  assert.deepStrictEqual(result.body, {
    message: "Title must be non empty string",
  });
});

test("Patch /tasks/:id Update with load storage error", async () => {
  shouldLoadErr = true;
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Load Storage Error",
  });
});

test("Patch /tasks/:id Update with save storage error", async () => {
  shouldSaveErr = true;
  mockTasks = [
    { id: 1, title: "first title", completed: true },
    { id: 2, title: "second title", completed: false },
  ];
  const body = { title: "Updated Title" };
  const result = await request(app).patch("/tasks/1").send(body);
  assert.strictEqual(result.statusCode, 500);
  assert.deepStrictEqual(result.body, {
    status: "fail",
    message: "Save Storage Error",
  });
  assert.deepStrictEqual(mockTasks[0], {
    id: 1,
    title: "first title",
    completed: true,
  });
});
