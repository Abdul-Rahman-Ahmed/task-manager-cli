import {
  addTask,
  deleteTask,
  displayTasks,
  updateTask,
  searchTasks,
  filterTasks,
} from "./tasks.js";
import { saveTasks, loadTasks } from "./storage.js";
let tasks;

async function main() {
  try {
    const command = process.argv[2];
    const args = process.argv.slice(3);
    tasks = await loadTasks();

    switch (command) {
      case "add": {
        const title = args.join(" ").trim();
        if (!title) {
          throw new Error("Title is required");
        }
        addTask(tasks, title);
        await saveTasks(tasks);
        return console.log("task added successfully");
      }
      case "display":
        return displayTasks(tasks);

      case "delete": {
        const id = Number(args[0]);
        if (args[0] === undefined) {
          throw new Error("ID is required");
        }
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("Invalid ID");
        }
        const res = deleteTask(tasks, id);
        if (!res) {
          throw new Error("task not found");
        }
        await saveTasks(tasks);
        return console.log("deleted successfully");
      }

      case "update": {
        const id = Number(args[0]);
        const title = args.slice(1).join(" ").trim();
        if (args[0] === undefined || !title) {
          throw new Error("ID and title required");
        }
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("Invalid ID");
        }
        let updated = updateTask(tasks, id, { title });
        if (updated !== true) {
          throw new Error(updated);
        }
        await saveTasks(tasks);
        console.log("updated succesfully");
        return displayTasks(tasks.filter((task) => task.id === id));
      }

      case "search": {
        const keyword = args.join(" ").trim();
        if (!keyword) {
          throw new Error("search word is required");
        }
        return displayTasks(searchTasks(tasks, keyword));
      }

      case "complete": {
        const id = Number(args[0]);

        if (args[0] === undefined) {
          throw new Error("ID required");
        }
        if (!Number.isInteger(id) || id <= 0) {
          throw new Error("Invalid ID");
        }
        let updated = updateTask(tasks, id, { completed: true });
        if (updated !== true) {
          throw new Error(updated);
        }
        await saveTasks(tasks);
        console.log("task completed succesfully");
        return displayTasks(tasks.filter((task) => task.id === id));
      }

      case "filter": {
        let filter;
        switch (args[0]) {
          case "completed":
            filter = true;
            break;
          case "pending":
            filter = false;
            break;
          default:
            throw new Error("Invalid status. Use completed or pending");
        }
        return displayTasks(filterTasks(tasks, filter));
      }
      default:
        console.log(`
          Available commands:
            add
            display
            delete
            update
            search
            filter
            complete
            `);
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exitCode = 1;
  }
}
main();
