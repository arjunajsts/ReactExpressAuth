import "dotenv/config";

const getENV = (key: string, defaultValue?: string) => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable ${key}`);
  }

  return value;
};

export const NODE_ENV = getENV("NODE_ENV");
export const PORT = getENV("PORT");
export const DATABASE_URL = getENV("DATABASE_URL");
export const APP_URL = getENV("APP_URL");
export const jWT_ACCESS_SECRET = getENV("jWT_ACCESS_SECRET");
export const JWT_REFRESH_SECRET = getENV("JWT_REFRESH_SECRET");
export const RESEND_API_KEY = getENV("RESEND_API_KEY");
export const EMAIL_SENDER = getENV("EMAIL_SENDER");
