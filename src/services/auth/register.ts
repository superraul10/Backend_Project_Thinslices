import bcrypt from 'bcrypt';
import { returnUserByUsername, insertUser } from '../../repositories/users.js';
import { AppError } from '../../types/AppError.js';

export const registerUser = async (username?: string, password?: string) => {
  if (!username || !password) {
    throw new AppError(400, 'Username and password are required.');
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUser = await returnUserByUsername(normalizedUsername);

  if (existingUser) {
    throw new AppError(409, 'Username already exists.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await insertUser(normalizedUsername, hashedPassword);

  if (!newUser) {
    throw new AppError(500, 'Internal server error.');
  }

  return newUser;
};
