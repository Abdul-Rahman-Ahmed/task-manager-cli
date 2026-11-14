export function addTask(tasks, title) {
  if (typeof title !== "string") {
    return "title must be a string";
  }
  if (!title.trim()) {
    return "title required";
  }
  const maxId = tasks.reduce((max, task) => {
    if (max <= task.id) {
      return task.id;
    } else {
      return max;
    }
  }, 0);
  const now = new Date().toISOString();
  const newTask = {
    id: maxId + 1,
    title: title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  tasks.push(newTask);
  return newTask;
}

export function displayTasks(tasks) {
  if (tasks.length === 0) {
    return console.log("no tasks found");
  }
  for (let task of tasks) {
    console.log(`
  ID: ${task.id}
  Title: ${task.title}
  Status: ${task.completed ? "Completed" : "Pending"}
`);
  }
}

export function deleteTask(tasks, id) {
  const index = tasks.findIndex((task) => task.id === id);
  if (index === -1) return false;
  tasks.splice(index, 1);
  return true;
}

export function updateTask(tasks, id, updates) {
  let task = tasks.find((task) => task.id === id);
  if (!task) return "wrong id";
  if (!updates || typeof updates !== "object" || Array.isArray(updates))
    return "Wrong updates type";

  const updateKeys = Object.keys(updates);
  const updateFields = updateKeys.some(
    (el) => el !== "title" && el !== "completed",
  );
  if (updateFields) return "Unknown Properties";
  if (!updateKeys.includes("title") && !updateKeys.includes("completed"))
    return "Unknown update field";
  if (Object.hasOwn(updates, "title") && typeof updates.title !== "string")
    return "title must be a string";
  if (
    Object.hasOwn(updates, "completed") &&
    typeof updates.completed !== "boolean"
  )
    return "completed must be a Boolean";

  const title = Object.hasOwn(updates, "title")
    ? updates.title.trim()
    : task.title;
  if (!title) {
    return "title required";
  }
  const completed = Object.hasOwn(updates, "completed")
    ? updates.completed
    : task.completed;
  Object.assign(task, {
    title,
    completed,
    updatedAt: new Date().toISOString(),
  });

  return true;
}

export function searchTasks(tasks, keyword) {
  if (typeof keyword !== "string") return "keyword must be a string";
  const searchWord = keyword.trim();
  if (!searchWord) return "search word required";
  return tasks.filter((task) =>
    task.title.toLowerCase().includes(searchWord.toLowerCase()),
  );
}

export function filterTasks(tasks, status) {
  if (typeof status !== "boolean") return "status must be a Boolean";
  return tasks.filter((task) => task.completed === status);
}
