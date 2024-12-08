import { APP_URL } from "@/constants/env.js";
import {
  CONFLICT,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  TOO_MANY_REQUESTS,
  UNAUTHORIZED,
} from "@/constants/http.js";
import verificationCodeType from "@/constants/verificationCodeTypes.js";
import { SessionModel } from "@/models/session.model.js";
import { UserModel } from "@/models/user.model.js";
import VerificationCodeModel from "@/models/verificationCode.model.js";
import { appAssert } from "@/utils/appAssert.js";
import { hashValue } from "@/utils/bycrypt.js";
import {
  fiveMinutesAgo,
  ONE_DAY_MS,
  oneHourFromNow,
  oneYearFromNow,
  thirtyDaysFromNow,
} from "@/utils/date.js";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "@/utils/emailTemplates.js";
import {
  refreshTokenSignOptions,
  signToken,
  verifyToken,
  type RefreshTokenPayload,
} from "@/utils/jwt.js";
import { sendMail } from "@/utils/sendMail.js";

export type CreateAccoutParams = {
  email: string;
  password: string;
  userAgent?: string;
};

export type LoginUserParams = {
  email: string;
  password: string;
  userAgent?: string;
};
export const createAccout = async (data: CreateAccoutParams) => {
  //verify existing user doesn't exist
  const existingUser = await UserModel.exists({
    email: data.email,
  });

  appAssert(!existingUser, CONFLICT, "Email already in use");

  //create user
  const user = await UserModel.create({
    email: data.email,
    password: data.password,
  });

  const userId = user._id;
  //create verification code
  const verificationCode = await VerificationCodeModel.create({
    userId,
    type: verificationCodeType.EmailVerification,
    expiresAt: oneYearFromNow(),
  });

  const url = `${APP_URL}/auth/verify/email/${verificationCode._id}`;
  //send verification email
  const { error } = await sendMail({
    to: user.email,
    ...getVerifyEmailTemplate(url),
  });
  if (error) {
    console.log(error);
  }
  // //create session
  // const session = await SessionModel.create({
  //   userId,
  //   userAgent: data.userAgent,
  // });

  // const sessionInfo = {
  //   sessionId: session._id,
  // };

  // //sign access token and refresh token
  // const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  // const accessToken = signToken({ userId, ...sessionInfo });

  //return user & tokens
  return {
    user: user.ommitPassward(),
    // accessToken,
    // refreshToken,
  };
};

export const loginUser = async ({
  email,
  password,
  userAgent,
}: LoginUserParams) => {
  // get the user by email
  const user = await UserModel.findOne({ email });
  appAssert(user, UNAUTHORIZED, "Invalid email or password");

  //validate password from the request
  const isValid = await user.comparePassword(password);
  appAssert(isValid, UNAUTHORIZED, "Invalid email or password");

  const userId = user._id;
  //create session
  const session = await SessionModel.create({
    userId,
    userAgent,
  });
  const sessionInfo = {
    sessionId: session._id,
  };

  //sign access token and refresh token

  const refreshToken = signToken(sessionInfo, refreshTokenSignOptions);

  const accessToken = signToken({ userId, ...sessionInfo });

  return {
    user: user.ommitPassward(),
    accessToken,
    refreshToken,
  };
};

export const refreshuserAccesstoken = async (refreshToken: string) => {
  const { payload } = verifyToken<RefreshTokenPayload>(refreshToken, {
    secrete: refreshTokenSignOptions.secrete,
  });
  appAssert(payload, UNAUTHORIZED, "Invalid refresh token");

  const session = await SessionModel.findById(payload.sessionId);
  const now = Date.now();
  appAssert(
    session && session.expiresAt.getTime() > now,
    UNAUTHORIZED,
    "Session expired"
  );

  // refrsh the sssion it expires in the next 24 hours
  const sessionNeedsRefresh = session.expiresAt.getTime() - now <= ONE_DAY_MS;
  if (sessionNeedsRefresh) {
    session.expiresAt = thirtyDaysFromNow();
    await session.save();
  }

  const newRefreshToken = sessionNeedsRefresh
    ? signToken({ sessionId: session._id }, refreshTokenSignOptions)
    : undefined;

  const accessToken = signToken({
    userId: session.userId,
    sessionId: session._id,
  });

  return {
    accessToken,
    newRefreshToken,
  };
};

export const emailVerify = async (code: string) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: code,
    type: verificationCodeType.EmailVerification,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expaired verification code");
  //update user to verified true
  const updatedUser = await UserModel.findByIdAndUpdate(
    validCode.userId,
    {
      verified: true,
    },
    {
      new: true,
    }
  );
  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to verify email");
  //delete verifcation code
  await validCode.deleteOne();

  //return user
  return {
    user: updatedUser.ommitPassward(),
  };
};

export const sendPasswordResetEmail = async (email: string) => {
  // get the user by email
  const user = await UserModel.findOne({
    email,
  });
  appAssert(user, NOT_FOUND, "User not found");
  //check email rate limit
  const fiveMinAgo = fiveMinutesAgo();
  const count = await VerificationCodeModel.countDocuments({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    createdAt: { $gt: fiveMinAgo },
  });

  appAssert(count <= 1, TOO_MANY_REQUESTS, "Too many request try again later");
  //create verification code
  const expiresAt = oneHourFromNow();
  const verificationCode = await VerificationCodeModel.create({
    userId: user._id,
    type: verificationCodeType.PasswordReset,
    expiresAt,
  });
  const url = `${APP_URL}/auth/password/reset?code=${
    verificationCode._id
  }&exp=${expiresAt.getTime()}`;
  //send verification email
  const { data, error } = await sendMail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });
  appAssert(
    data?.id,
    INTERNAL_SERVER_ERROR,
    `${error?.name}-${error?.message}`
  );
  // return sucess
  return {
    url,
    emailId: data.id,
  };
};

type PasswordResetParams = {
  password: string;
  verificationCode: string;
};

export const passwordReset = async ({
  password,
  verificationCode,
}: PasswordResetParams) => {
  // get the verification code
  const validCode = await VerificationCodeModel.findOne({
    _id: verificationCode,
    type: verificationCodeType.PasswordReset,
    expiresAt: { $gt: new Date() },
  });
  appAssert(validCode, NOT_FOUND, "Invalid or expaired verification code");

  //update the users password
  const updatedUser = await UserModel.findByIdAndUpdate(validCode.userId, {
    password: await hashValue(password),
  });

  appAssert(updatedUser, INTERNAL_SERVER_ERROR, "Failed to reset password");
  //delete the verification code

  await validCode.deleteOne();

  await SessionModel.deleteMany({
    userId: updatedUser._id,
  });
  return {
    user: updatedUser.ommitPassward(),
  };
};
