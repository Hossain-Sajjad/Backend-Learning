// src/app.js
import express from "express";
import { logger } from "./middleware/logger.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import notesRoutes from "./routes/notes.routes.js";

export const app = express();

// 1. Middleware that runs for every request
app.use(logger);
app.use(express.json());

// 2. Routes
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
app.use("/api/v1/notes", notesRoutes);

// 3. Error handling, always last
app.use(notFound);
app.use(errorHandler);
