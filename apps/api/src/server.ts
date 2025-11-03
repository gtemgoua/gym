import env from "./config/env.js";
import logger from "./config/logger.js";
import { createApp } from "./app.js";
import prisma from "./lib/prisma.js";

const main = async () => {
  try {
    await prisma.$connect();
    const app = createApp();
    const port = env.PORT;
    app.listen(port, () => {
      logger.info({ port }, "API server listening");
    });
  } catch (error) {
    logger.error({ error }, "Failed to start server");
    process.exit(1);
  }
};

void main();
