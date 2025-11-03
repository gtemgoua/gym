import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import logger from "../config/logger.js";
import { AppError } from "../errors/app-error.js";

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error({ err }, "Application error");
    }
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: err.details,
    });
  }

  if (err instanceof ZodError) {
    return res.status(422).json({
      error: "Validation failed",
      details: err.flatten(),
    });
  }

  logger.error({ err }, "Unhandled error");

  return res.status(500).json({
    error: "Internal server error",
  });
};
