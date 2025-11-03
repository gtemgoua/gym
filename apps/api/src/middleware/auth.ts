import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.js";
import { AppError } from "../errors/app-error.js";
import type { AuthScope, AuthUser } from "../types/auth.js";

interface TokenPayload {
  sub: string;
  role: string;
  email: string;
  scope?: AuthScope;
}

export const authenticate =
  (options?: { allowAnonymous?: boolean; scopes?: AuthScope[] }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (options?.allowAnonymous) {
        return next();
      }
      throw new AppError("Missing authorization header", 401);
    }

    const [scheme, token] = header.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header", 401);
    }

    try {
      const payload = jwt.verify(token, env.JWT_SECRET) as TokenPayload;
      const authUser: AuthUser = {
        id: payload.sub,
        role: payload.role as AuthUser["role"],
        email: payload.email,
        scope: payload.scope ?? "member",
      };

      if (options?.scopes && !options.scopes.includes(authUser.scope)) {
        throw new AppError("Insufficient scope", 403);
      }

      req.authUser = authUser;
    } catch (error) {
      throw new AppError("Unauthorized", 401, { details: error });
    }

    next();
  };

export const requireRoles =
  (roles: AuthUser["role"][]) => (req: Request, _res: Response, next: NextFunction) => {
    if (!req.authUser) {
      throw new AppError("Unauthorized", 401);
    }
    console.log('Role check - required:', roles, 'user role:', req.authUser.role);
    if (!roles.includes(req.authUser.role)) {
      console.log('Role check failed');
      throw new AppError("Insufficient permissions", 403);
    }
    console.log('Role check passed');
    next();
  };
