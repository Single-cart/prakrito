import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import config from "../config/config";
import ApiError from "../errorHandlers/ApiError";
import { verifyJwtToken } from "../helpers/jwtHelper";
import UserModel from "../modules/user-management/users/user.model";
import catchAsync from "./catchAsync";

export const isAuthenticated = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const refresh_token = req.cookies.refresh_token as string;

    if (!refresh_token) {
      throw new ApiError(400, "Please login to access this recourse");
    }
    const decoded = verifyJwtToken(
      refresh_token,
      config.security.refreshTokenSecret
    ) as JwtPayload;

    if (!decoded) {
      throw new ApiError(400, "Invalid access token. please login");
    }

    const user = await UserModel.findById(decoded._id);

    if (!user) {
      throw new ApiError(404, "Please login to access this recourse");
    }

    res.locals.user = user;

    next();
  }
);

export const authorizeUser = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    if (!roles.includes(res.locals.user.role)) {
      throw new ApiError(
        403,
        `${res.locals.user.role} is not allowed to access this recourse`
      );
    }

    next();
  });
};
