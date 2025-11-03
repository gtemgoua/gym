import jwt from "jsonwebtoken";
import type { User, UserRole } from "@prisma/client";
import prisma from "../../lib/prisma.js";
import env from "../../config/env.js";
import { AppError } from "../../errors/app-error.js";
import { hashPassword, verifyPassword } from "../../lib/password.js";
import type { AuthUser } from "../../types/auth.js";

const AUTH_TOKEN_TTL = 60 * 60 * 8; // 8 hours

const toAuthUser = (user: User): AuthUser => {
  let scope: AuthUser["scope"];
  switch (user.role) {
    case "OWNER":
      scope = "owner";
      break;
    case "MANAGER":
      scope = "manager";
      break;
    case "STAFF":
      scope = "staff";
      break;
    default:
      scope = "member";
  }
  return {
    id: user.id,
    email: user.email,
    role: user.role,
    scope,
  };
};

export const issueToken = (user: AuthUser) =>
  jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      scope: user.scope,
    },
    env.JWT_SECRET,
    {
      expiresIn: AUTH_TOKEN_TTL,
    },
  );

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { memberProfile: true, staffProfile: true },
  });

  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  if (!(await verifyPassword(user.passwordHash, password))) {
    throw new AppError("Invalid credentials", 401);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account disabled", 403);
  }

  const authUser = toAuthUser(user);
  const token = issueToken(authUser);
  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  });

  return { token, user };
};

export const registerUser = async (params: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
}) => {
  const existing = await prisma.user.findUnique({ where: { email: params.email } });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const passwordHash = await hashPassword(params.password);
  const user = await prisma.user.create({
    data: {
      name: params.name,
      email: params.email,
      phone: params.phone,
      passwordHash,
      role: params.role ?? "OWNER",
    },
  });

  return user;
};

export const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return;
  }

  const token = jwt.sign({ sub: user.id, purpose: "PASSWORD_RESET" }, env.JWT_SECRET, {
    expiresIn: 60 * 15,
  });

  await prisma.userToken.create({
    data: {
      userId: user.id,
      token,
      purpose: "PASSWORD_RESET",
      expiresAt: new Date(Date.now() + 1000 * 60 * 15),
    },
  });

  // TODO: send email via messaging service
};

export const resetPassword = async (token: string, password: string) => {
  const record = await prisma.userToken.findUnique({ where: { token } });
  if (!record || record.expiresAt < new Date()) {
    throw new AppError("Invalid token", 400);
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const passwordHash = await hashPassword(password);
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash },
  });
  await prisma.userToken.delete({ where: { id: record.id } });
};
