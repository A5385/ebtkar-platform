import { compare, hash } from "bcryptjs";

export async function hashPassword(password: string, salt = 12) {
  return await hash(password, salt);
}

export async function validatePassword(
  password: string,
  hashedPassword: string,
) {
  return await compare(password, hashedPassword);
}
