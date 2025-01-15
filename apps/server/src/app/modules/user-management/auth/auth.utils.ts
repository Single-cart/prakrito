import { Google } from "arctic";
import { CookieOptions, Response } from "express";
import config from "src/app/config/config";

// Initialize Google OAuth with your credentials
export const google = new Google(
  config.auth.google.clientID!,
  config.auth.google.clientSecret!,
  `${config.domains.serverUrl}/api/v1/auth/google/callback`
);

const accessTokenExpire = parseInt(
  config.jwtExpires.accessTokenExpire || "1",
  10
);
const refreshTokenExpire = parseInt(
  config.jwtExpires.refreshTokenExpire || "1",
  10
);

//options for cookis
export const accessTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const refreshTokenCookieOptions: CookieOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
};

export const sendToken = (user: any, res: Response) => {
  const accessToken = user.accessToken();
  const refreshToken = user.refreshToken();

  res.cookie("access_token", accessToken, accessTokenCookieOptions);
  res.cookie("refresh_token", refreshToken, refreshTokenCookieOptions);

  res.locals.user = user;
};
