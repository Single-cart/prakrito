import express from "express";
import { googleAuth, googleAuthCallback } from "./auth.controller";

const authRouter = express.Router();

authRouter.get("/google", googleAuth);
authRouter.get("/google/callback", googleAuthCallback);

export default authRouter;
