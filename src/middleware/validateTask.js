export function validateTask(mode) {
  return (req, res, next) => {
    if (mode === "create") {
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
    } else if (mode === "patch") {
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

      if (
        Object.keys(body).some((el) => el !== "title" && el !== "completed")
      ) {
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

      if (
        Object.hasOwn(body, "completed") &&
        typeof body.completed !== "boolean"
      ) {
        return res.status(400).json({
          message: "completed must to be a boolean",
        });
      }
    } else if (mode === "put") {
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

      if (
        Object.keys(body).some((el) => el !== "title" && el !== "completed")
      ) {
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
    } else if (mode === "getById") {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "not vaild ID",
        });
      }
    } else if (mode === "delete") {
      const id = Number(req.params.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
          message: "Not Valid ID",
        });
      }
    }
    next();
  };
}
