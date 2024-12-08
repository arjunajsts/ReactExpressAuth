import {
  emailVerifyHandler,
  loginHandler,
  logoutHandler,
  passwordResetHandler,
  refreshHandler,
  registerHandler,
  sendPasswordResetHandler
} from "@/controllers/auth.controller.js";
import express from "express";
const authRoutes = express();

// prefix: //auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshHandler);
authRoutes.get("/logout", logoutHandler);
authRoutes.get("/verify/email/:code", emailVerifyHandler);
authRoutes.post("/password/forgot", sendPasswordResetHandler);
authRoutes.post("/password/reset",  passwordResetHandler);

 

export default authRoutes;
