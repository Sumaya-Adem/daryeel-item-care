import type { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/app-error";
import { env } from "../utils/env";

// Centralized error handler — never leaks stack traces in production.
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = "Internal server error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof SyntaxError && "body" in err) {
    // Malformed JSON body sent to express.json()
    statusCode = 400;
    message = "Invalid request body";
  } else if (typeof err === "object" && err !== null && (err as { type?: string }).type === "entity.too.large") {
    statusCode = 413;
    message = "Request body too large";
  }

  if (statusCode >= 500) console.error(err);

  res.status(statusCode).json({
    success: false,
    message,
    ...(!env.isProduction && err instanceof Error && statusCode >= 500 ? { stack: err.stack } : {}),
  });
}
