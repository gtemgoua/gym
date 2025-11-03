import { Router } from "express";
import { authenticate } from "../../middleware/auth.js";
import { AppError } from "../../errors/app-error.js";
import prisma from "../../lib/prisma.js";
import { login, registerUser, requestPasswordReset, resetPassword, issueToken } from "./auth.service.js";
import { loginSchema, registerSchema, passwordResetRequestSchema, passwordResetSchema } from "./auth.schema.js";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const result = await login(email, password);
  res.json({
    token: result.token,
    user: {
      id: result.user.id,
      name: result.user.name,
      email: result.user.email,
      role: result.user.role,
    },
  });
});

router.post("/register", async (req, res) => {
  const payload = registerSchema.parse(req.body);
  const user = await registerUser(payload);
  res.status(201).json({
    id: user.id,
    email: user.email,
    role: user.role,
  });
});

router.get("/me", authenticate(), async (req, res) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", 401);
  }
  const user = await prisma.user.findUnique({
    where: { id: req.authUser.id },
    include: {
      memberProfile: true,
      staffProfile: true,
    },
  });
  if (!user) {
    throw new AppError("Unauthorized", 401);
  }
  res.json(user);
});

router.post("/refresh", authenticate(), async (req, res) => {
  if (!req.authUser) {
    throw new AppError("Unauthorized", 401);
  }
  const token = issueToken(req.authUser);
  res.json({ token });
});

router.post("/password/reset-request", async (req, res) => {
  const payload = passwordResetRequestSchema.parse(req.body);
  await requestPasswordReset(payload.email);
  res.json({ ok: true });
});

router.post("/password/reset", async (req, res) => {
  const payload = passwordResetSchema.parse(req.body);
  await resetPassword(payload.token, payload.password);
  res.json({ ok: true });
});

export default router;
