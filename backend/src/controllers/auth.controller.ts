import { CREATED, OK, UNAUTHORIZED } from "@/constants/http.js";
import {
  emailSchema,
  loginSchhema,
  passwordResetSchema,
  registerSchema,
  verificationCodeSchema,
} from "@/controllers/auth.schema.js";
import { SessionModel } from "@/models/session.model.js";
import {
  createAccout,
  emailVerify,
  loginUser,
  passwordReset,
  refreshuserAccesstoken,
  sendPasswordResetEmail,
} from "@/services/auth.service.js";
import { appAssert } from "@/utils/appAssert.js";
import catchErrors from "@/utils/catchError.js";
import {
  clearAuthCookies,
  getAccessTokenCookieOptions,
  getRefreshTokenCookieOptions,
  setAuthCookies,
} from "@/utils/cookies.js";
import { verifyToken } from "@/utils/jwt.js";

export const registerHandler = catchErrors(async (req, res) => {
  // Type assertion for user-agent header
  const userAgent = req.headers["user-agent"] as string | undefined;

  //validate request
  const request = registerSchema.parse({
    ...req.body,
    userAgent: userAgent,
  });

  // call service
  const { user, 
    // accessToken, refreshToken 
  } = await createAccout(request);

  // // response
  // setAuthCookies({ res, accessToken, refreshToken })
    res.status(CREATED)
    .json({ success: true, message: "User created successfully", data: user });
});

export const loginHandler = catchErrors(async (req, res) => {
  // Type assertion for user-agent header
  const userAgent = req.headers["user-agent"] as string | undefined;

  //validate request
  const request = loginSchhema.parse({
    ...req.body,
    userAgent: userAgent,
  });

  //call service
  const { accessToken, refreshToken } = await loginUser(request);

  setAuthCookies({ res, accessToken, refreshToken }).status(OK).json({
    message: "Login successfull",
  });
});

export const logoutHandler = catchErrors(async (req, res) => {
  const accessToken = req.cookies.accessToken as string | undefined;
  const { payload } = verifyToken(accessToken || "");

  appAssert(payload, UNAUTHORIZED, "Missing access token");

  if (payload) {
    await SessionModel.findByIdAndDelete(payload.sessionId);
  }
  clearAuthCookies(res).status(OK).json({
    message: "Logout successfull",
  });
});

export const refreshHandler = catchErrors(async (req, res) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;
  appAssert(refreshToken, UNAUTHORIZED, "Missing refresh token");

  const { accessToken, newRefreshToken } = await refreshuserAccesstoken(
    refreshToken
  );

  if (newRefreshToken) {
    res.cookie("refreshToken", newRefreshToken, getRefreshTokenCookieOptions());
  }

  res
    .status(OK)
    .cookie("accessToken", accessToken, getAccessTokenCookieOptions())
    .json({
      message: "Access token refreshed",
    });
});

export const emailVerifyHandler = catchErrors(async (req, res) => {
  const verificationCode = verificationCodeSchema.parse(req.params.code);
  await emailVerify(verificationCode);
  res.status(OK).json({
    message: "Email was successfully verified",
  });
});

export const sendPasswordResetHandler = catchErrors(async (req, res) => {
  const email = emailSchema.parse(req.body.email);
  await sendPasswordResetEmail(email);
  res.status(OK).json({
    message: "Password reset email sent",
  });
});

export const passwordResetHandler = catchErrors(async (req, res) => {
  const request = passwordResetSchema.parse(req.body);

  // call service
  await passwordReset(request);

  clearAuthCookies(res).status(OK).json({
    message: "Password reset successful",
  });
});
