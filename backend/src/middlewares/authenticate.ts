import { AppErrorCode } from "@/constants/appErrorCode.js";
import { OK, UNAUTHORIZED } from "@/constants/http.js";
import { appAssert } from "@/utils/appAssert.js";
import { verifyToken } from "@/utils/jwt.js";
import type { RequestHandler } from "express";
import type { Types } from "mongoose";

export const authenticate: RequestHandler = (req, res, next) => {
  try {
    const accessToken = req.cookies?.accessToken as string | undefined;

    if (!accessToken) {
      return next({
        status: UNAUTHORIZED,
        message: "Not authorized",
        code: AppErrorCode.InvalidAccessToken,
      });
    }

    const { error, payload } = verifyToken(accessToken);

    if (!payload) {
      return next({
        status: UNAUTHORIZED,
        message: error === "jwt expired" ? "Token expired" : "Invalid token",
        code: AppErrorCode.InvalidAccessToken,
      });
    }

    // Add userId & sessionId to the request object
    req.userId = payload.userId as Types.ObjectId;
    req.sessionId = payload.sessionId as Types.ObjectId;

    next();
  } catch (err) {
    next(err);
  }
};
