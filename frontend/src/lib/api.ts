import {
  LoginReqType,
  LoginResType,
  LogoutResType,
  RegisterReqType,
  RegisterResType,
  UserResType,
  SessionsResType,
  verifyEmailResType,
  PasswordForgotReqType,
  PasswordForgotResType,
  verifyEmailReqType,
  PasswordResetReqType,
  PasswordResetResType,
  SessionDelReqType,
  SessionDelResType,
} from "@/type";

import fetchHttp from "./http";

// --- User API ---
export const getUser = async (): Promise<UserResType> =>
  await fetchHttp.get("/user");

// --- Auth API ---

export const register = async (
  data: RegisterReqType,
): Promise<RegisterResType> => await fetchHttp.post("/auth/register", data);

export const login = async (data: LoginReqType): Promise<LoginResType> =>
  await fetchHttp.post("/auth/login", data);

export const verifyEmail = async (
  code: verifyEmailReqType,
): Promise<verifyEmailResType> =>
  await fetchHttp.get(`/auth/verify/email/${code}`);

export const logout = async (): Promise<LogoutResType> =>
  await fetchHttp.get("/auth/logout");

export const passwordForgot = async (
  data: PasswordForgotReqType,
): Promise<PasswordForgotResType> =>
  await fetchHttp.post("/auth/password/forgot", data);

export const passwordReset = async (
  data: PasswordResetReqType,
): Promise<PasswordResetResType> =>
  await fetchHttp.post("/auth/password/reset", data);

// --- Sessions API ---
export const sessions = async (): Promise<SessionsResType> =>
  await fetchHttp.get("/sessions");

export const sessionDelete = async (
  id: SessionDelReqType,
): Promise<SessionDelResType> => await fetchHttp.delete(`/sessions/${id}`);
