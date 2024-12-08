import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "@/constants/http.js";
import { AppError } from "@/utils/AppError.js";
import { clearAuthCookies, REFRESH_PATH } from "@/utils/cookies.js";
import type { ErrorRequestHandler, Response } from "express";
 import  z, { ZodError }  from "zod";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  res.status(BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const handleAppError = (res: Response, error: AppError) => {
  res.status(error.statusCode).json({
    message: error.message,
    errorCode: error.errorCode,
  });
};
const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(`PATH: ${req.path}`, error);

  if (req.path === REFRESH_PATH) {
    clearAuthCookies(res);
  }

  // Send structured error response
  if (error instanceof ZodError) {
    return handleZodError(res, error);
  }

  console.log({error})
  if (error instanceof AppError) {
    return handleAppError(res, error);
  }

  res.status(INTERNAL_SERVER_ERROR).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
};

export default errorHandler;
