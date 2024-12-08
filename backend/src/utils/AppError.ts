import { AppErrorCode } from "@/constants/appErrorCode.js";
import type { HttpStatusCode } from "@/constants/http.js";

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public override message: string,
    public errorCode?: AppErrorCode
  ) {
    super(message);
  }
}
