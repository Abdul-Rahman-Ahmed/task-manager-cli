import express from "express";
import { loadTasks, saveTasks } from "./storage.js";
import { addTask, deleteTask, updateTask } from "./tasks.js";

const app = express();
app.use(express.json());

app.get("/tasks", async (req, res, next) => {
  try {
    const tasks = await loadTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

app.get("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({
        message: "not vaild ID",
      });
    }
    const tasks = await loadTasks();
    const task = tasks.find((el) => el.id === id);
    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
});

app.post("/tasks", async (req, res, next) => {
  const body = req.body;

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({
      message: "Invalid request body",
    });
  }

  const title = body.title;
  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Not Valid Title",
    });
  }
  try {
    const tasks = await loadTasks();
    const addedTask = addTask(tasks, title);
    await saveTasks(tasks);
    return res.status(201).json({
      data: addedTask,
    });
  } catch (err) {
    return next(err);
  }
});

app.delete("/tasks/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "Not Valid ID",
    });
  }
  try {
    const tasks = await loadTasks();
    const result = deleteTask(tasks, id);
    if (!result) {
      return res.status(404).json({
        message: "Task Not Found",
      });
    }
    await saveTasks(tasks);
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

app.put("/tasks/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "not vaild ID",
    });
  }

  const body = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({
      message: "body must to be a object",
    });
  }

  if (Object.keys(body).some((el) => el !== "title" && el !== "completed")) {
    return res.status(400).json({
      message: "body must to have only title and completed",
    });
  }
  const { title, completed } = body;
  if (title === undefined || completed === undefined) {
    return res.status(400).json({
      message: "Title and Completed Required",
    });
  }

  if (typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Title must be non empty string",
    });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({
      message: "completed must be a boolean",
    });
  }
  try {
    const tasks = await loadTasks();
    const result = updateTask(tasks, id, { title, completed });
    if (result === "wrong id") {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (result !== true) {
      return res.status(400).json({ message: result });
    }
    await saveTasks(tasks);
    return res.json({
      data: tasks.find((el) => el.id === id),
    });
  } catch (err) {
    return next(err);
  }
});

app.patch("/tasks/:id", async (req, res, next) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      message: "not vaild ID",
    });
  }

  const body = req.body;
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return res.status(400).json({
      message: "body must to be a object",
    });
  }

  if (Object.keys(body).some((el) => el !== "title" && el !== "completed")) {
    return res.status(400).json({
      message: "body must to have only title and completed",
    });
  }

  if (Object.keys(body).length === 0) {
    return res.status(400).json({
      message: "At least one field is required",
    });
  }

  if (
    Object.hasOwn(body, "title") &&
    (typeof body.title !== "string" || !body.title.trim())
  ) {
    return res.status(400).json({
      message: "Title must be non empty string",
    });
  }

  if (Object.hasOwn(body, "completed") && typeof body.completed !== "boolean") {
    return res.status(400).json({
      message: "completed must to be a boolean",
    });
  }
  try {
    const tasks = await loadTasks();
    const result = updateTask(tasks, id, { ...body });
    if (result === "wrong id") {
      return res.status(404).json({ message: "Task Not Found" });
    }

    if (result !== true) {
      return res.status(400).json({ message: result });
    }
    await saveTasks(tasks);
    return res.json({
      data: tasks.find((el) => el.id === id),
    });
  } catch (err) {
    return next(err);
  }
});

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  return res.status(500).json({
    status: "fail",
    message: "Internal Server Error",
  });
});

export default app;
