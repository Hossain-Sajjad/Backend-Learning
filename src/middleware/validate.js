// src/middleware/validate.js
import { AppError } from "../utils/AppError.js";

// Usage: validate({ params: idSchema, body: createSchema })
export function validate(schemas) {
  return (req, res, next) => {
    req.validated = {};

    for (const part of ["params", "query", "body"]) {
      if (!schemas[part]) continue;

      const result = schemas[part].safeParse(req[part]);

      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        }));
        return next(new AppError(400, "Validation failed", details));
      }

      req.validated[part] = result.data;
    }

    next();
  };
}
