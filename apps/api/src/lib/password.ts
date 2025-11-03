import * as argon2 from "argon2";

export const hashPassword = async (password: string) =>
  argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 15360,
    timeCost: 3,
    parallelism: 1,
  });

export const verifyPassword = async (hash: string, password: string) => argon2.verify(hash, password);
