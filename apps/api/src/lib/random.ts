import crypto from "node:crypto";

export const randomString = (length = 32) =>
  crypto.randomBytes(Math.ceil(length / 2)).toString("hex").slice(0, length);
