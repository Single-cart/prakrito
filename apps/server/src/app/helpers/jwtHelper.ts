import httpStatus from "http-status";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import ApiError from "../errorHandlers/ApiError";

export const createJwtToken = (
  payload: Record<string, unknown>,
  secret: Secret,
  expiresIn: string
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  } as SignOptions);

  return token;
};

export const verifyJwtToken = <T>(token: string, secret: Secret): T => {
  try {
    const payload = jwt.verify(token, secret) as T;

    return payload;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid signature");
  }
};
