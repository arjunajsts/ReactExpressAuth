import type { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (request: Request, response: Response, next: NextFunction) => {
    const result = schema.safeParse(request.body);
    if (!result.success) {
    }
    next();
  };
