import fetch from "@/lib/http";
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
  SessionDelResType
} from "@/type";

//user
export const getUser = async (): Promise<UserResType> =>
  await fetch.get("/user");

//Auth
export const register = async (
  data: RegisterReqType
): Promise<RegisterResType> => await fetch.post("auth/register", data);

export const login = async (data: LoginReqType): Promise<LoginResType> =>
  await fetch.post("auth/login", data);

export const verifyEmail = async (
  code:verifyEmailReqType
): Promise<verifyEmailResType> => await fetch.get(`/auth/verify/email/${code}`);

export const logout = async (): Promise<LogoutResType> =>
  await fetch.get("/auth/logout");

export const passwordForgot = async (
  data: PasswordForgotReqType
): Promise<PasswordForgotResType> =>
  await fetch.post("/auth/password/forgot", data);

export const passwordReset = async (
  data: PasswordResetReqType
): Promise<PasswordResetResType> =>
  await fetch.post("/auth/password/reset", data);

//sessions
export const sessions = async (): Promise<SessionsResType> =>
  await fetch.get("/sessions");

export const sessionDelete = async (id:SessionDelReqType): Promise<SessionDelResType> =>
  await fetch.delete(`/sessions/${id}`);
