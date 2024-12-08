import assert from "node:assert";
import { AppError } from "@/utils/AppError.js";
import type { HttpStatusCode } from "@/constants/http.js";
import type { AppErrorCode } from "@/constants/appErrorCode.js";

type AppAssert = (
  condition: any,
  httpStatusCode: HttpStatusCode,
  message: string,
  appErrorCode?: AppErrorCode
) => asserts condition;

export const appAssert: AppAssert = (
  condition,
  httpStatusCode,
  message,
  appErrorCode
) => assert(condition, new AppError(httpStatusCode, message, appErrorCode));
