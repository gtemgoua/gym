import type { UserRole } from "@prisma/client";

export type AuthScope = "owner" | "manager" | "staff" | "member" | "kiosk" | "door";

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
  scope: AuthScope;
}
