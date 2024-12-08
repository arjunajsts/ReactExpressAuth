import { jWT_ACCESS_SECRET, JWT_REFRESH_SECRET } from "@/constants/env.js";
import type { SessionDocument } from "@/models/session.model.js";
import type { UserDocument } from "@/models/user.model.js";
import jwt, { type SignOptions, type VerifyOptions } from "jsonwebtoken";

export type RefreshTokenPayload = {
  sessionId: SessionDocument["_id"];
};
export type AccessTokenPayload = {
  userId: UserDocument["_id"];
  sessionId: SessionDocument["_id"];
};
export type SignOptionsAndSecret = SignOptions & {
  secrete: string;
};
export const defaults: SignOptions = {
  audience: ["user"],
};
export const accessTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "15m",
  secrete: jWT_ACCESS_SECRET,
};
export const refreshTokenSignOptions: SignOptionsAndSecret = {
  expiresIn: "30d",
  secrete: JWT_REFRESH_SECRET,
};
export const signToken = (
  payload: AccessTokenPayload | RefreshTokenPayload,
  options?: SignOptionsAndSecret
) => {
  const { secrete, ...signOpts } = options || accessTokenSignOptions;
  return jwt.sign(payload, secrete, {
    ...defaults,
    ...signOpts,
  });
};

export const verifyToken = <Tpayload extends object = AccessTokenPayload>(
  token: string,
  options?: VerifyOptions & { secrete: string }
) => {
  const { secrete = jWT_ACCESS_SECRET, ...verifyOpts } = options || {};
  try {
    const payload = jwt.verify(token, secrete, {
      ...defaults,
      ...verifyOpts,
    }) as Tpayload;
    return { payload };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
