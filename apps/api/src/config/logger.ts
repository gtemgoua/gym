import pino from "pino";
import env, { isProduction } from "./env.js";

const logger = pino({
  transport: isProduction
    ? undefined
    : {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          singleLine: true,
        },
      },
  level: env.NODE_ENV === "test" ? "silent" : env.APP_ENV === "production" ? "info" : "debug",
});

export default logger;
