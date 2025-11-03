import { PrismaClient } from "@prisma/client";
import logger from "../config/logger.js";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const createClient = () =>
  new PrismaClient({
    log: ["warn", "error"],
  });

const prisma = global.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
  prisma.$use(async (params, next) => {
    const before = performance.now();
    const result = await next(params);
    const after = performance.now();
    logger.debug(
      { model: params.model, action: params.action, durationMs: after - before },
      "Prisma query executed",
    );
    return result;
  });
}

export default prisma;
