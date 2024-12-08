import bcrypt from "bcrypt";

export const hashValue = async (password: string, saltRounds?: string) =>
  bcrypt.hash(password, saltRounds || 10);

export const compareValue = async (value: string, hashedValue: string) =>
  bcrypt.compare(value, hashedValue).catch(() => false);
