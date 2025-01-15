import { CookieOptions, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import ApiError from "src/app/errorHandlers/ApiError";
import catchAsync from "src/app/middlewares/catchAsync";
import sendResponse from "src/app/utils/sendResponse";
import * as authService from "./auth.service";

const authOriginService = new authService.AuthOriginService();

export const googleAuth = catchAsync(async (req: Request, res: Response) => {
  // Validate origin
  let origin = req.headers.origin;
  if (!origin) {
    try {
      origin = new URL(req.headers.referer || "").origin;
    } catch {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid origin");
    }
  }

  if (!origin || !authOriginService.validateOrigin(origin)) {
    throw new ApiError(httpStatus.FORBIDDEN, "Invalid origin");
  }

  // Get OAuth data
  const { authUrl, codeVerifier, state } = authService.getGoogleOAuthData();

  // Set cookies
  const cookieOptions: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 10 * 60 * 1000,
    sameSite: "lax" as const,
    ...(process.env.NODE_ENV === "production" && {
      domain: origin,
    }),
  };

  res.cookie("google_oauth_state", state, cookieOptions);
  res.cookie("google_code_verifier", codeVerifier, cookieOptions);

  res.redirect(authUrl);
});

export const googleAuthCallback = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { code, state, redirectUrl } = req.query as {
      code: string;
      state: string;
      redirectUrl: string;
    };
    if (!code || !state || !redirectUrl) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid query parameters");
    }

    const { google_oauth_state, google_code_verifier } = req.cookies;

    // Validate state
    if (!state || state !== google_oauth_state) {
      throw new ApiError(httpStatus.FORBIDDEN, "Invalid state");
    }

    const users = await authService.handleGoogleCallback(
      code,
      google_code_verifier,
      res
    );

    // Clear OAuth cookies
    res.clearCookie("google_oauth_state");
    res.clearCookie("google_code_verifier");

    sendResponse(res, {
      statusCode: httpStatus.OK,
      data: {
        user: {
          fullName: users.fullName,
          email: users.email,
          avatar: users.avatar,
          isSocialAuth: users.isSocialAuth,
          role: users.role,
        },
        redirectUrl: redirectUrl,
      },
      message: "Login successfull",
    });
  }
);
