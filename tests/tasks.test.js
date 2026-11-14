import test from "node:test";
import assert from "node:assert/strict";
import {
  addTask,
  deleteTask,
  filterTasks,
  searchTasks,
  updateTask,
} from "../src/tasks.js";

// add task tests
test("addTask to empty array", () => {
  const tasks = [];
  addTask(tasks, "Learn Node.js");
  assert.equal(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "Learn Node.js");
  assert.strictEqual(tasks[0].id, 1);
  assert.strictEqual(tasks[0].createdAt, tasks[0].updatedAt);
  assert.ok(!Number.isNaN(Date.parse(tasks[0].createdAt)));
  assert.ok(!Number.isNaN(Date.parse(tasks[0].updatedAt)));
  assert.strictEqual(tasks[0].completed, false);
});

test("add task for array have tasks", () => {
  const tasks = [
    {
      id: 2,
      title: "Practice JavaScript",
      completed: false,
      createdAt: "2026-11-08T02:19:57.688Z",
      updatedAt: "2026-11-08T02:19:57.689Z",
    },
    {
      id: 7,
      title: "Practice JavaScript",
      completed: false,
      createdAt: "2026-11-08T02:19:57.688Z",
      updatedAt: "2026-11-08T02:19:57.689Z",
    },
  ];
  addTask(tasks, "Learn Node.js");
  assert.equal(tasks.length, 3);
  assert.strictEqual(tasks[2].title, "Learn Node.js");
  assert.strictEqual(tasks[2].id, 8);
});

test("add task to arrapy have one task and deleted", () => {
  const tasks = [
    {
      id: 3,
      title: "Practice JavaScript",
      completed: false,
      createdAt: "2026-11-08T02:19:57.688Z",
      updatedAt: "2026-11-08T02:19:57.689Z",
    },
  ];
  deleteTask(tasks, 3);
  addTask(tasks, "learn english");
  assert.equal(tasks.length, 1);
  assert.strictEqual(tasks[0].id, 1);
});

test("add two tasks with the same title", () => {
  const tasks = [];
  addTask(tasks, "same title");
  addTask(tasks, "same title");
  assert.equal(tasks.length, 2);
  assert.strictEqual(tasks[0].title, tasks[1].title);
  assert.notStrictEqual(tasks[0].id, tasks[1].id);
});

test("add task with empty title", () => {
  const tasks = [];
  const task = addTask(tasks, "");
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title required");
});

test("add task with space", () => {
  const tasks = [];
  const task = addTask(tasks, " ");
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title required");
});

test("add task with spaces", () => {
  const tasks = [];
  addTask(tasks, "   Learn Node.js   ");
  assert.equal(tasks.length, 1);
  assert.strictEqual(tasks[0].title, "Learn Node.js");
});

test("add task with number title", () => {
  const tasks = [];
  const task = addTask(tasks, 123);
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title must be a string");
});

test("add task with null", () => {
  const tasks = [];
  const task = addTask(tasks, null);
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title must be a string");
});

test("add task with undefined", () => {
  const tasks = [];
  const task = addTask(tasks, undefined);
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title must be a string");
});

test("add task with true", () => {
  const tasks = [];
  const task = addTask(tasks, true);
  assert.equal(tasks.length, 0);
  assert.strictEqual(task, "title must be a string");
});

// update task tests
test("update title task", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
    },
  ];
  const result = updateTask(tasks, 1, { title: "Learn Node.js" });
  assert.strictEqual(result, true);
  assert.strictEqual(tasks[0].title, "Learn Node.js");
  assert.strictEqual(tasks[0].completed, false);
});

test("complete task", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
    },
  ];
  const result = updateTask(tasks, 1, { completed: true });
  assert.strictEqual(result, true);
  assert.strictEqual(tasks[0].completed, true);
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
});

test("update title and completed task", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
    },
  ];
  const result = updateTask(tasks, 1, {
    title: "Learn Node.js",
    completed: true,
  });
  assert.strictEqual(result, true);
  assert.strictEqual(tasks[0].title, "Learn Node.js");
  assert.strictEqual(tasks[0].completed, true);
});

test("update with wrong id", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
    },
  ];
  const result = updateTask(tasks, 3, {
    title: "Learn Node.js",
    completed: true,
  });
  assert.strictEqual(result, "wrong id");
  assert.equal(tasks.length, 1);
  assert.strictEqual(tasks[0].id, 1);
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
});

test("update with empty object", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {});
  assert.strictEqual(result, "Unknown update field");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with spaces", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    title: "  ",
  });
  assert.strictEqual(result, "title required");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with empty title", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    title: "",
  });
  assert.strictEqual(result, "title required");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with undefined title", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    title: undefined,
  });
  assert.strictEqual(result, "title must be a string");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with invalid title type ", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    title: 123,
  });
  assert.strictEqual(result, "title must be a string");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with invalid Completed type ", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    completed: "gogo",
  });
  assert.strictEqual(result, "completed must be a Boolean");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with invalid undefined Completed type ", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    completed: undefined,
  });
  assert.strictEqual(result, "completed must be a Boolean");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with title contains space in start and end ", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    title: "   learn eng   ",
  });
  assert.strictEqual(result, true);
  assert.strictEqual(tasks[0].title, "learn eng");
  assert.strictEqual(tasks[0].completed, false);
  assert.notStrictEqual(tasks[0].updatedAt, update);
});

test("update with null", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, null);
  assert.strictEqual(result, "Wrong updates type");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with array", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, []);
  assert.strictEqual(result, "Wrong updates type");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with text not object", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, "hello");
  assert.strictEqual(result, "Wrong updates type");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with number not object", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, 123);
  assert.strictEqual(result, "Wrong updates type");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with unknown property", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    priority: "high",
  });
  assert.strictEqual(result, "Unknown Properties");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].priority, undefined);
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update with unknown property and title", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const update = tasks[0].updatedAt;
  const result = updateTask(tasks, 1, {
    priority: "high",
    title: "learn",
  });
  assert.strictEqual(result, "Unknown Properties");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
  assert.strictEqual(tasks[0].priority, undefined);
  assert.strictEqual(tasks[0].completed, false);
  assert.strictEqual(tasks[0].updatedAt, update);
});

test("update title with inherited properties", () => {
  const tasks = [
    {
      id: 1,
      title: "Learn JavaScript",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const parent = { title: "hello" };
  const updates = Object.create(parent);
  const result = updateTask(tasks, 1, updates);
  assert.strictEqual(result, "Unknown update field");
  assert.strictEqual(tasks[0].title, "Learn JavaScript");
});

// delet task tests
test("delet Task successfully", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = deleteTask(tasks, 2);
  assert.strictEqual(result, true);
  assert.strictEqual(tasks.length, 2);
  assert.strictEqual(
    tasks.some((task) => task.id === 2),
    false,
  );
  assert.strictEqual(tasks[1].id, 3);
  assert.strictEqual(tasks[0].title, "first");
  assert.strictEqual(tasks[1].title, "third");
});

test("delet Task by wrong id", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const oldTasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = deleteTask(tasks, 10);
  assert.strictEqual(result, false);
  assert.strictEqual(tasks.length, 3);
  assert.deepStrictEqual(tasks, oldTasks);
});

test("delet Task with empty tasks", () => {
  const tasks = [];
  const result = deleteTask(tasks, 10);
  assert.strictEqual(result, false);
  assert.strictEqual(tasks.length, 0);
});

test("delet Task by invalid id", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];
  const oldTasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = deleteTask(tasks, "2");
  assert.strictEqual(result, false);
  assert.strictEqual(tasks.length, 3);
  assert.deepStrictEqual(tasks, oldTasks);
});

// search task tests
test("search with 1 word exist", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = searchTasks(tasks, "first");
  assert.deepStrictEqual(result, [tasks[0]]);
});

test("search with part of title", () => {
  const tasks = [
    {
      id: 1,
      title: "first task long",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = searchTasks(tasks, "long");
  assert.deepStrictEqual(result, [tasks[0]]);
});

test("search with difference capitaliztion", () => {
  const tasks = [
    {
      id: 1,
      title: "FIRST",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = searchTasks(tasks, "first");
  assert.deepStrictEqual(result, [tasks[0]]);
});

test("search with wrong word not exist", () => {
  const tasks = [
    {
      id: 1,
      title: "FIRST",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 2,
      title: "second",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
    {
      id: 3,
      title: "third",
      completed: false,
      updatedAt: "2026-01-01T00:00:00.000Z",
    },
  ];

  const result = searchTasks(tasks, "fourth");
  assert.deepStrictEqual(result, []);
});

test("search with empty array", () => {
  const tasks = [];

  const result = searchTasks(tasks, "fourth");
  assert.deepStrictEqual(result, []);
});

test("search with multiple matching tasks", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, "learn");
  assert.deepStrictEqual(result, [tasks[0], tasks[1]]);
});

test("search with number", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, 123);
  assert.strictEqual(result, "keyword must be a string");
});

test("search with null", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, null);
  assert.strictEqual(result, "keyword must be a string");
});

test("search with undefined", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, undefined);
  assert.strictEqual(result, "keyword must be a string");
});

test("search with empty", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, "");
  assert.strictEqual(result, "search word required");
});

test("search with spaces", () => {
  const tasks = [
    { id: 1, title: "Learn JavaScript" },
    { id: 2, title: "Learn Node.js" },
    { id: 3, title: "Practice SQL" },
  ];

  const result = searchTasks(tasks, "   ");
  assert.strictEqual(result, "search word required");
});

// filer tasks tests
test("filter completed tasks", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];

  const result = filterTasks(tasks, true);
  assert.deepStrictEqual(result, [tasks[0], tasks[1]]);
});

test("filter pending tasks", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];

  const result = filterTasks(tasks, false);
  assert.deepStrictEqual(result, [tasks[2]]);
});

test("filter completed tasks but all pending", () => {
  const tasks = [
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
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];

  const result = filterTasks(tasks, true);
  assert.deepStrictEqual(result, []);
});

test("filter return all tasks if the same status", () => {
  const tasks = [
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
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];

  const result = filterTasks(tasks, false);
  assert.deepStrictEqual(result, tasks);
});

test("filter with empty tasks", () => {
  const tasks = [];

  const result = filterTasks(tasks, false);
  assert.deepStrictEqual(result, []);
});

test("filter with string", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];
  const result = filterTasks(tasks, "true");
  assert.strictEqual(result, "status must be a Boolean");
});

test("filter with number", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];
  const result = filterTasks(tasks, 1);
  assert.strictEqual(result, "status must be a Boolean");
});

test("filter with null", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];
  const result = filterTasks(tasks, null);
  assert.strictEqual(result, "status must be a Boolean");
});

test("filter with undefined", () => {
  const tasks = [
    {
      id: 1,
      title: "first",
      completed: true,
    },
    {
      id: 2,
      title: "second",
      completed: true,
    },
    {
      id: 3,
      title: "third",
      completed: false,
    },
  ];
  const result = filterTasks(tasks, undefined);
  assert.strictEqual(result, "status must be a Boolean");
});
