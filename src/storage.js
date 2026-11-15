import { writeFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tasksFile = path.join(__dirname, "..", "tasks.json");

export async function saveTasks(tasks) {
  const stringTasks = JSON.stringify(tasks, null, 2);
  await writeFile(tasksFile, stringTasks);
}

export async function loadTasks() {
  try {
    const tasks = await readFile(tasksFile, { encoding: "utf8" });
    const tasksJson = JSON.parse(tasks);
    if (!Array.isArray(tasksJson)) throw new Error("tasks must to be an array");
    return tasksJson;
  } catch (err) {
    if (err.code === "ENOENT") return [];
    throw err;
  }
}
