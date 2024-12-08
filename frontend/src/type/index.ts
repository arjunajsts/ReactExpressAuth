import { z } from "zod";
import { loginSchema, passwordForgotSchema, registerSchema,passwordResetSchema } from "@/schema/index";

export type UserResType = {
  _id: string;
  email: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type LogoutResType = {
  message: string;
};

export type LoginReqType = z.infer<typeof loginSchema>;
export type LoginResType = { message: string };

export type verifyEmailReqType = string|undefined
export type verifyEmailResType = {message:string}

export type RegisterReqType = z.infer<typeof registerSchema>;
export type RegisterResType = {
  success: boolean;
  message: string;
  data: {
    email: string;
    verified: boolean;
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

export type PasswordForgotReqType =  z.infer<typeof passwordForgotSchema>
export type PasswordForgotResType = {message:string}

export type PasswordResetReqType =  z.infer<typeof passwordResetSchema>
export type PasswordResetResType = {message:string}

export type SessionsResType = session[];
export type session = {
  _id: string;
  userAgent: string;
  createdAt: string;
  isCurrent?: boolean;
};
export type SessionDelReqType = string
export type SessionDelResType = {message:string}
