import { Router } from "express";
import authRouter from "../modules/user-management/auth/auth.route";
import userRouter from "../modules/user-management/users/user.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/user",
    route: userRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
