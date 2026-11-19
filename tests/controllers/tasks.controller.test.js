import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";

let tasks = [];

let nextCalled = 0;
let resCalled = 0;

let responseData;
let resStatus;

let shouldErr;
let nextError;

let taskResult;
let receivedId;
let receivedTitle;
let receivedBody;

let res = {
  json(data) {
    resCalled++;
    return (responseData = data);
  },
  status(status) {
    resStatus = status;
    return this;
  },
  send() {
    resCalled++;
    return;
  },
};

let req = {
  params: {},
  body: {},
};

function next(err) {
  nextCalled++;
  return (nextError = err);
}

beforeEach(() => {
  tasks = [];
  responseData = null;
  nextCalled = 0;
  resCalled = 0;
  shouldErr = false;
  resStatus = null;
  nextError = null;
  taskResult = null;
  receivedId = 0;
  receivedTitle = null;
  receivedBody = null;

  req = {
    params: {},
    body: {},
  };
});

mock.module(new URL("../../src/services/tasks.service.js", import.meta.url), {
  exports: {
    getTasksService: async () => {
      if (shouldErr) throw new Error("DataBase Failed");
      return tasks;
    },
    getTaskByIdService: async (id) => {
      if (shouldErr) throw new Error("DataBase Failed");
      receivedId = id;
      return taskResult;
    },
    createTaskService: async (title) => {
      if (shouldErr) throw new Error("DataBase Failed");
      receivedTitle = title;
      return taskResult;
    },
    removeTaskService: async (id) => {
      if (shouldErr) throw new Error("DataBase Failed");
      receivedId = id;
    },
    replaceTaskService: async (id, body) => {
      if (shouldErr) throw new Error("DataBase Failed");
      receivedBody = body;
      receivedId = id;
      return taskResult;
    },
    editTaskService: async (id, body) => {
      if (shouldErr) throw new Error("DataBase Failed");
      receivedBody = body;
      receivedId = id;
      return taskResult;
    },
  },
});

const {
  getAllTasks,
  getTaskById,
  createTask,
  removeTask,
  replaceTask,
  editTask,
} = await import("../../src/controllers/tasks.controller.js");

// get all tasks tests
test("get all tasks test", async () => {
  tasks = [
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
  await getAllTasks(null, res, next);
  assert.deepStrictEqual(responseData, tasks);
  assert.strictEqual(nextCalled, 0);
  assert.strictEqual(resCalled, 1);
});

test("get all tasks test with database error", async () => {
  shouldErr = true;
  tasks = [
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

  await getAllTasks(null, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(nextCalled, 1);
  assert.strictEqual(responseData, null);
});

// get task by id tests
test("get task by id not found", async () => {
  req.params.id = 10;
  await getTaskById(req, res, next);
  assert.strictEqual(resStatus, 404);
  assert.strictEqual(responseData.message, "task not found");
  assert.strictEqual(nextCalled, 0);
});

test("get task by id exist", async () => {
  tasks = [
    {
      id: 1,
      title: "first",
      completed: false,
    },
  ];
  req.params.id = "1";
  taskResult = tasks[0];
  await getTaskById(req, res, next);
  assert.deepEqual(responseData, tasks[0]);
  assert.strictEqual(nextCalled, 0);
  assert.strictEqual(resCalled, 1);
  assert.strictEqual(receivedId, 1);
});

test("get task by id with database error", async () => {
  shouldErr = true;
  tasks = [
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
  req.params.id = "1";
  await getTaskById(req, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(nextCalled, 1);
  assert.strictEqual(responseData, null);
  assert.strictEqual(resStatus, null);
});

// create task tests
test("create task by valid title", async () => {
  req.body.title = "valid title";
  const now = new Date().toISOString();
  taskResult = {
    title: "valid title",
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  await createTask(req, res, next);
  assert.strictEqual(resStatus, 201);
  assert.strictEqual(resCalled, 1);
  assert.strictEqual(receivedTitle, "valid title");
  assert.deepStrictEqual(responseData, {
    data: taskResult,
  });
  assert.strictEqual(nextCalled, 0);
});

test("create task by valid title with err from database", async () => {
  shouldErr = true;
  req.body.title = "valid title";
  const now = new Date().toISOString();
  taskResult = {
    title: "valid title",
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  await createTask(req, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(receivedTitle, null);
  assert.deepStrictEqual(responseData, null);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 1);
});

// delete task tests
test("delete task with valid id", async () => {
  req.params.id = "1";
  tasks = [
    {
      id: 1,
      title: "task title",
      completed: false,
    },
  ];
  await removeTask(req, res, next);
  assert.strictEqual(resCalled, 1);
  assert.strictEqual(resStatus, 204);
  assert.strictEqual(nextCalled, 0);
  assert.strictEqual(nextError, null);
  assert.strictEqual(responseData, null);
  assert.strictEqual(receivedId, 1);
});

test("delete task with valid id with err from database", async () => {
  shouldErr = true;
  req.params.id = "1";
  await removeTask(req, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(receivedId, 0);
  assert.deepStrictEqual(responseData, null);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 1);
});

// replace Task tests
test("replace task with valid id and body", async () => {
  req.params.id = "1";
  req.body = {
    title: "replaced title",
    completed: true,
  };

  taskResult = {
    title: "replaced title",
    completed: true,
  };

  await replaceTask(req, res, next);
  assert.strictEqual(resCalled, 1);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 0);
  assert.strictEqual(nextError, null);
  assert.deepStrictEqual(responseData, { data: taskResult });
  assert.strictEqual(receivedId, 1);
  assert.strictEqual(receivedBody, req.body);
});

test("replace task with valid id with err from database", async () => {
  shouldErr = true;
  req.params.id = "1";
  req.body = {
    title: "replaced title",
    completed: true,
  };

  taskResult = {
    title: "replaced title",
    completed: true,
  };
  await replaceTask(req, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(receivedId, 0);
  assert.strictEqual(receivedBody, null);
  assert.deepStrictEqual(responseData, null);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 1);
});

// edit Task Tests
test("edit task with valid id and body", async () => {
  req.params.id = "1";
  req.body = {
    title: "replaced title",
  };

  taskResult = {
    title: "replaced title",
  };

  await editTask(req, res, next);
  assert.strictEqual(resCalled, 1);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 0);
  assert.strictEqual(nextError, null);
  assert.deepStrictEqual(responseData, { data: taskResult });
  assert.strictEqual(receivedId, 1);
  assert.strictEqual(receivedBody, req.body);
});

test("edit task with valid id with err from database", async () => {
  shouldErr = true;
  req.params.id = "1";
  req.body = {
    title: "replaced title",
  };

  taskResult = {
    title: "replaced title",
  };
  await editTask(req, res, next);
  assert.strictEqual(nextError.message, "DataBase Failed");
  assert.strictEqual(resCalled, 0);
  assert.strictEqual(receivedId, 0);
  assert.strictEqual(receivedBody, null);
  assert.deepStrictEqual(responseData, null);
  assert.strictEqual(resStatus, null);
  assert.strictEqual(nextCalled, 1);
});
