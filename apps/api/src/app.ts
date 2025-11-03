import "express-async-errors";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import env from "./config/env.js";
import logger from "./config/logger.js";
import { errorHandler } from "./middleware/error-handler.js";
import { registerRoutes } from "./routes/index.js";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow all origins while maintaining credentials support
        callback(null, origin || true);
      },
      credentials: true,
    }),
  );
  app.use(helmet());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    rateLimit({
      windowMs: 60 * 1000,
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  if (env.NODE_ENV !== "test") {
    app.use(
      morgan("combined", {
        stream: {
          write: (message) => logger.info(message.trim()),
        },
      }),
    );
  }

  registerRoutes(app);

  app.use(errorHandler);

  return app;
};
