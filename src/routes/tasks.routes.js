import express from "express";
import { validateTask } from "../middleware/validateTask.js";
import {
  createTask,
  editTask,
  getAllTasks,
  getTaskById,
  removeTask,
  replaceTask,
} from "../controllers/tasks.controller.js";

const router = express.Router();
router.get("/", getAllTasks);

router.get("/:id", validateTask("getById"), getTaskById);

router.post("/", validateTask("create"), createTask);

router.delete("/:id", validateTask("delete"), removeTask);

router.put("/:id", validateTask("put"), replaceTask);

router.patch("/:id", validateTask("patch"), editTask);

export default router;
