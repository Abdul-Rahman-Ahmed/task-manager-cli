import {
  createTaskService,
  editTaskService,
  getTaskByIdService,
  getTasksService,
  removeTaskService,
  replaceTaskService,
} from "../services/tasks.service.js";

export async function getAllTasks(req, res, next) {
  try {
    const tasks = await getTasksService();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await getTaskByIdService(Number(req.params.id));
    if (!task) {
      return res.status(404).json({
        message: "task not found",
      });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req, res, next) {
  try {
    const result = await createTaskService(req.body.title);
    return res.status(201).json({
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

export async function removeTask(req, res, next) {
  try {
    await removeTaskService(Number(req.params.id));
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}

export async function replaceTask(req, res, next) {
  try {
    const task = await replaceTaskService(Number(req.params.id), req.body);
    return res.json({
      data: task,
    });
  } catch (err) {
    return next(err);
  }
}

export async function editTask(req, res, next) {
  try {
    const task = await editTaskService(Number(req.params.id), req.body);
    return res.json({
      data: task,
    });
  } catch (err) {
    return next(err);
  }
}
