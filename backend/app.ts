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
import logger from "@/utils/logger.js";
import morgan from "morgan";

const app = express();

// Middlewares
app.use(
  morgan("dev", {
    stream: { write: (message: string) => logger.info(message.trim()) },
  }),
);
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
