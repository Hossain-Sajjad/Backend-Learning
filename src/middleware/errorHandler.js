// src/middleware/errorHandler.js
import { AppError } from "../utils/AppError.js";

export function notFound(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  // express.json() sets err.status to 400 for broken JSON
  const statusCode = err.statusCode ?? err.status ?? 500;

  if (statusCode >= 500) {
    console.error(err);
    return res.status(500).json({ error: { message: "Something went wrong" } });
  }

  res.status(statusCode).json({
    error: { message: err.message, details: err.details },
  });
}
