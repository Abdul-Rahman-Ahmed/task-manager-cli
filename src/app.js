import express from "express";
import tasksRoutes from "./routes/tasks.routes.js";

const app = express();
app.use(express.json());

app.use("/tasks", tasksRoutes);

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Route Not Found",
  });
});

app.use((err, req, res, next) => {
  return res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message || "Internal Server Error",
  });
});

export default app;
