import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
//
import { APP_URL } from "@/constants/env.js";
import { OK } from "@/constants/http.js";
//
import errorHandler from "@/middlewares/errorHandler.js";
import authRoutes from "@/routes/auth.route.js";
import { authenticate } from "@/middlewares/authenticate.js";
import userRoutes from "@/routes/user.routes.js";
import sessionRoutes from "@/routes/session.routes.js";

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: APP_URL,
    credentials: true,
  })
);
app.use(cookieParser());

// helthy route
app.get("/", (_, res) => {
  res.status(OK).json({
    status: "healthy",
  });
});

 
// Public route
app.use("/auth", authRoutes);

// Authenticated route
app.use("/user", authenticate,userRoutes)
app.use("/sessions", authenticate,sessionRoutes)


// Error-handling middleware (always the last middleware)
app.use(errorHandler);

export default app;
