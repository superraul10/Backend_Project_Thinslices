import bcrypt from 'bcrypt';
import { returnUserByUsername } from '../../repositories/auth/users.js';
import { storeRefreshToken } from '../../repositories/auth/refreshToken.js';
import { AppError } from '../../types/AppError.js';
import { createJWT, accessTokenSecret, refreshTokenSecret } from '../../utils/jwt.js';

export const loginUser = async (username?: string, password?: string) => {
  if (!username || !password) {
    throw new AppError(400, 'Username and password are required.');
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUser = await returnUserByUsername(normalizedUsername);

  if (!existingUser) {
    throw new AppError(404, 'User not found.');
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid password.');
  }

  const accessToken = createJWT(
    { id: existingUser.id, username: existingUser.username },
    accessTokenSecret,
    { expiresIn: '1h' }
  );

  const refreshToken = createJWT(
    { id: existingUser.id, username: existingUser.username },
    refreshTokenSecret,
    { expiresIn: '1d' }
  );

  await storeRefreshToken(existingUser.id, refreshToken);

  return { accessToken };
};
