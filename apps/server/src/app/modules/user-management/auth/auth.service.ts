import crypto from "crypto";
import { Response } from "express";
import config from "src/app/config/config";
import UserModel from "../users/user.model";
import { GoogleAuthData, GoogleUserInfo } from "./auth.interface";
import { google, sendToken } from "./auth.utils";

export const getGoogleOAuthData = (): GoogleAuthData => {
  const state = crypto.randomBytes(16).toString("hex");
  const codeVerifier = crypto.randomBytes(32).toString("hex");
  const scopes = ["openid", "profile", "email"];

  return {
    state,
    codeVerifier,
    authUrl: google.createAuthorizationURL(state, codeVerifier, scopes).href,
    scopes: scopes,
  };
};

export const handleGoogleCallback = async (
  code: string,
  codeVerifier: string,
  res: Response
) => {
  // Exchange code for tokens
  const tokens = await google.validateAuthorizationCode(code, codeVerifier);
  console.log("tokens.accessToken", tokens.accessToken());
  // Get user info from Google
  const googleUser: GoogleUserInfo = await fetch(
    "https://www.googleapis.com/oauth2/v2/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokens.accessToken()}`,
      },
    }
  ).then((res) => {
    if (!res.ok) {
      throw new Error(`Google API error: ${res.status}`);
    }
    return res.json() as Promise<GoogleUserInfo>;
  });

  // Find or create user
  let user = await UserModel.findOne({ email: googleUser.email });

  if (!user) {
    user = await UserModel.create({
      email: googleUser.email,
      fullName: googleUser.name,
      avatar: googleUser.picture,
      isSocialAuth: true,
    });
  }

  sendToken(user, res);

  return user;
};

export class AuthOriginService {
  private allowedOrigins: string[];

  constructor() {
    this.allowedOrigins = config.domains.origin;
  }

  validateOrigin(origin: string): boolean {
    return this.allowedOrigins.includes(origin);
  }
}
