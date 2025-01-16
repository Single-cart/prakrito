// auth.routes.ts
import express from "express";
import { isAuthenticated } from "src/app/middlewares/authGuards";
import validateRequest from "src/app/middlewares/validateRequest";
import {
  googleAuth,
  googleAuthCallback,
  loginUser,
  logout,
  socialAuth,
  updateAccessToken,
} from "./auth.controller";
import {
  googleAuthCallbackSchema,
  loginSchema,
  socialAuthSchema,
} from "./auth.validation";

const authRouter = express.Router();

// Auth routes

authRouter.get("/google", googleAuth);
authRouter.get(
  "/google/callback",
  validateRequest(googleAuthCallbackSchema),
  googleAuthCallback
);

authRouter.post("/login", validateRequest(loginSchema), loginUser);
authRouter.post("/social-auth", validateRequest(socialAuthSchema), socialAuth);
authRouter.get("/logout", isAuthenticated, logout);
authRouter.get("/refresh", updateAccessToken);

export default authRouter;
