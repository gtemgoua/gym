import type { Request, Response } from "express";
import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
