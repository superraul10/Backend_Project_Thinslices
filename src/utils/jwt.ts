import jwt from 'jsonwebtoken';
import type { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import { AppError } from '../types/AppError.js';

const rawAccessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const rawRefreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

if (!rawAccessTokenSecret || !rawRefreshTokenSecret) {
  throw new Error('ACCESS_TOKEN_SECRET and REFRESH_TOKEN_SECRET must be defined in the environment variables.');
}

export const accessTokenSecret: string = rawAccessTokenSecret;
export const refreshTokenSecret: string = rawRefreshTokenSecret;

export const createJWT = (payload: object, secret: Secret, options?: SignOptions) => {
  return jwt.sign(payload, secret, options);
};

export const verifyJWT = (token: string, secret: Secret): JwtPayload => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError(401, 'Invalid or expired token.');
  }
};
