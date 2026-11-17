import { addTask, deleteTask, updateTask } from "../tasks.js";
import { loadTasks, saveTasks } from "../storage.js";

export function getTasksService() {
  return loadTasks();
}

export async function getTaskByIdService(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Not Valid Id");
    error.statusCode = 400;
    throw error;
  }
  const tasks = await loadTasks();
  return tasks.find((el) => el.id === id);
}

export async function createTaskService(title) {
  if (typeof title !== "string" || !title.trim()) {
    const error = new Error("Not Valid Title");
    error.statusCode = 400;
    throw error;
  }
  const tasks = await loadTasks();
  const addedTask = addTask(tasks, title);
  await saveTasks(tasks);
  return addedTask;
}

export async function removeTaskService(id) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Not Valid Id");
    error.statusCode = 400;
    throw error;
  }

  const tasks = await loadTasks();
  const result = deleteTask(tasks, id);
  if (!result) {
    const error = new Error("Task Not Found");
    error.statusCode = 404;
    throw error;
  }
  await saveTasks(tasks);
}

export async function replaceTaskService(id, body) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Not Valid Id");
    error.statusCode = 400;
    throw error;
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    const error = new Error("body must to be a object");
    error.statusCode = 400;
    throw error;
  }

  if (Object.keys(body).some((el) => el !== "title" && el !== "completed")) {
    const error = new Error("body must to have only title and completed");
    error.statusCode = 400;
    throw error;
  }
  const { title, completed } = body;
  if (title === undefined || completed === undefined) {
    const error = new Error("Title and Completed Required");
    error.statusCode = 400;
    throw error;
  }

  if (typeof title !== "string" || !title.trim()) {
    const error = new Error("Title must be non empty string");
    error.statusCode = 400;
    throw error;
  }

  if (typeof completed !== "boolean") {
    const error = new Error("completed must be a boolean");
    error.statusCode = 400;
    throw error;
  }

  const tasks = await loadTasks();
  const result = updateTask(tasks, id, {
    ...body,
  });
  if (result === "wrong id") {
    const error = new Error("Task Not Found");
    error.statusCode = 404;
    throw error;
  }

  if (result !== true) {
    const error = new Error(result);
    error.statusCode = 400;
    throw error;
  }
  await saveTasks(tasks);

  return tasks.find((el) => el.id === id);
}

export async function editTaskService(id, body) {
  if (!Number.isInteger(id) || id <= 0) {
    const error = new Error("Not Valid Id");
    error.statusCode = 400;
    throw error;
  }

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    const error = new Error("body must to be a object");
    error.statusCode = 400;
    throw error;
  }

  if (Object.keys(body).some((el) => el !== "title" && el !== "completed")) {
    const error = new Error("body must to have only title and completed");
    error.statusCode = 400;
    throw error;
  }

  if (Object.keys(body).length === 0) {
    const error = new Error("At least one field is required");
    error.statusCode = 400;
    throw error;
  }

  if (
    Object.hasOwn(body, "title") &&
    (typeof body.title !== "string" || !body.title.trim())
  ) {
    const error = new Error("Title must be non empty string");
    error.statusCode = 400;
    throw error;
  }

  if (Object.hasOwn(body, "completed") && typeof body.completed !== "boolean") {
    const error = new Error("completed must be a boolean");
    error.statusCode = 400;
    throw error;
  }

  const tasks = await loadTasks();
  const result = updateTask(tasks, id, { ...body });
  if (result === "wrong id") {
    const error = new Error("Task Not Found");
    error.statusCode = 404;
    throw error;
  }

  if (result !== true) {
    const error = new Error(result);
    error.statusCode = 400;
    throw error;
  }
  await saveTasks(tasks);

  return tasks.find((el) => el.id === id);
}
