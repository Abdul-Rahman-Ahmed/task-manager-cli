import { test, mock, beforeEach } from "node:test";
import assert from "node:assert/strict";
let mockTasks = [];
let saveCalls = 0;
let saveAttempts = 0;
let shouldFailSave = false;

mock.module(new URL("../../src/storage.js", import.meta.url), {
  exports: {
    loadTasks: async () => mockTasks,

    saveTasks: async () => {
      saveAttempts++;
      if (shouldFailSave) {
        throw new Error("fail save");
      }
      saveCalls++;
    },
  },
});

const {
  getTaskByIdService,
  createTaskService,
  removeTaskService,
  replaceTaskService,
  editTaskService,
} = await import("../../src/services/tasks.service.js");

beforeEach(() => {
  mockTasks = [];
  saveCalls = 0;
  saveAttempts = 0;
  shouldFailSave = false;
});
// get task by id tests
test("get task by id = 0", async () => {
  await assert.rejects(getTaskByIdService(0), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "Not Valid Id");
    return true;
  });
});

test("get task by id = undefined", async () => {
  const result = await getTaskByIdService(1);
  assert.strictEqual(result, undefined);
});

test("get task by valid id and data", async () => {
  mockTasks = [
    {
      id: 1,
      title: "Learn JS",
      completed: false,
    },
  ];
  const result = await getTaskByIdService(1);
  assert.deepStrictEqual(result, mockTasks[0]);
});

// create task tests
test("create task by invalid title", async () => {
  await assert.rejects(createTaskService(" "), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "Not Valid Title");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("create task by valid title", async () => {
  const result = await createTaskService("Valid");
  assert.deepStrictEqual(result, mockTasks[0]);
  assert.strictEqual(result.title, "Valid");
  assert.strictEqual(result.completed, false);
  assert.strictEqual(result.id, 1);
  assert.strictEqual(saveAttempts, 1);
});

test("create task by valid title but fail save", async () => {
  shouldFailSave = true;
  try {
    await assert.rejects(createTaskService("Valid"), (err) => {
      assert.strictEqual(saveAttempts, 1);
      assert.strictEqual(saveCalls, 0);
      assert.strictEqual(err.message, "fail save");
      return true;
    });
  } finally {
    shouldFailSave = false;
  }
});

// remove task tests
test("remove task with invalid id", async () => {
  await assert.rejects(removeTaskService("1"), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "Not Valid Id");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("remove task not exist", async () => {
  await assert.rejects(removeTaskService(1), (err) => {
    assert.strictEqual(err.statusCode, 404);
    assert.strictEqual(err.message, "Task Not Found");
    assert.strictEqual(saveAttempts, 0);
    assert.strictEqual(saveCalls, 0);
    return true;
  });
});

test("remove task", async () => {
  mockTasks = [
    {
      id: 1,
      title: "hello",
    },
  ];
  const result = await removeTaskService(1);
  assert.strictEqual(result, undefined);
  assert.strictEqual(saveCalls, 1);
  assert.deepStrictEqual(mockTasks, []);
});

// replace task tests
test("replace task with wrong id", async () => {
  await assert.rejects(replaceTaskService("1"), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "Not Valid Id");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("replace task with wrong body", async () => {
  await assert.rejects(replaceTaskService(1, []), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "body must to be a object");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("replace task with wrong proprety", async () => {
  await assert.rejects(
    replaceTaskService(1, {
      name: "learn",
      completed: false,
      id: 2,
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(
        err.message,
        "body must to have only title and completed",
      );
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("replace task with only title", async () => {
  await assert.rejects(
    replaceTaskService(1, {
      title: "learn",
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Title and Completed Required");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("replace task with empty title", async () => {
  await assert.rejects(
    replaceTaskService(1, {
      title: " ",
      completed: false,
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Title must be non empty string");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("replace task with wrong completed", async () => {
  await assert.rejects(
    replaceTaskService(1, {
      title: "Success",
      completed: "false",
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "completed must be a boolean");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("replace task with task not exists", async () => {
  await assert.rejects(
    replaceTaskService(1, {
      title: "Success",
      completed: false,
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.message, "Task Not Found");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("replace task with correct data", async () => {
  mockTasks = [{ id: 1 }];
  const result = await replaceTaskService(1, {
    title: "Success",
    completed: false,
  });
  assert.strictEqual(result.title, "Success");
  assert.strictEqual(result.completed, false);
  assert.strictEqual(result.id, 1);
  assert.strictEqual(saveCalls, 1);
  assert.strictEqual(mockTasks[0].title, "Success");
  assert.strictEqual(mockTasks[0].completed, false);
  assert.strictEqual(mockTasks[0].id, 1);
});

test("replace task when save fails", async () => {
  mockTasks = [{ id: 1 }];
  shouldFailSave = true;
  try {
    await assert.rejects(
      replaceTaskService(1, {
        title: "Success",
        completed: false,
      }),
      (err) => {
        assert.strictEqual(err.message, "fail save");
        assert.strictEqual(saveCalls, 0);
        assert.strictEqual(saveAttempts, 1);
        return true;
      },
    );
  } finally {
    shouldFailSave = false;
  }
});

// edit task tests
test("edit task with wrong id", async () => {
  await assert.rejects(editTaskService("1"), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "Not Valid Id");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("edit task with wrong body", async () => {
  await assert.rejects(editTaskService(1, []), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "body must to be a object");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("edit task with wrong proprety", async () => {
  await assert.rejects(
    editTaskService(1, {
      name: "learn",
      completed: false,
      id: 2,
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(
        err.message,
        "body must to have only title and completed",
      );
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("edit task without any proprety", async () => {
  await assert.rejects(editTaskService(1, {}), (err) => {
    assert.strictEqual(err.statusCode, 400);
    assert.strictEqual(err.message, "At least one field is required");
    assert.strictEqual(saveAttempts, 0);
    return true;
  });
});

test("edit task with empty title", async () => {
  await assert.rejects(
    editTaskService(1, {
      title: " ",
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "Title must be non empty string");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("edit task with wrong completed", async () => {
  await assert.rejects(
    editTaskService(1, {
      completed: "false",
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 400);
      assert.strictEqual(err.message, "completed must be a boolean");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("edit task with task not exists", async () => {
  await assert.rejects(
    editTaskService(1, {
      completed: false,
    }),
    (err) => {
      assert.strictEqual(err.statusCode, 404);
      assert.strictEqual(err.message, "Task Not Found");
      assert.strictEqual(saveAttempts, 0);
      return true;
    },
  );
});

test("edit task with title", async () => {
  mockTasks = [{ id: 1 }];
  const result = await editTaskService(1, {
    title: "Success",
  });
  assert.strictEqual(result.title, "Success");
  assert.strictEqual(result.id, 1);
  assert.strictEqual(saveCalls, 1);
  assert.strictEqual(mockTasks[0].title, "Success");
  assert.strictEqual(mockTasks[0].id, 1);
});

test("edit task with completed", async () => {
  mockTasks = [{ id: 1, title: "hello world" }];
  const result = await editTaskService(1, {
    completed: true,
  });
  assert.strictEqual(result.completed, true);
  assert.strictEqual(result.title, "hello world");
  assert.strictEqual(result.id, 1);
  assert.strictEqual(saveCalls, 1);
  assert.strictEqual(mockTasks[0].completed, true);
  assert.strictEqual(mockTasks[0].title, "hello world");
  assert.strictEqual(mockTasks[0].id, 1);
});

test("edit task when save fails", async () => {
  mockTasks = [{ id: 1 }];
  shouldFailSave = true;
  try {
    await assert.rejects(
      editTaskService(1, {
        title: "Success",
      }),
      (err) => {
        assert.strictEqual(err.message, "fail save");
        assert.strictEqual(saveCalls, 0);
        assert.strictEqual(saveAttempts, 1);
        return true;
      },
    );
  } finally {
    shouldFailSave = false;
  }
});
