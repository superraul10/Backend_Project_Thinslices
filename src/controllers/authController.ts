const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path')
const { returnUserByUsername, insertUser } = require('../repositories/users');
const { storeRefreshToken } = require('../repositories/refreshToken');
import type { Request, Response } from 'express';




const handleLogin = async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as { username?: string; password?: string };
  const { username, password } = body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUser = await returnUserByUsername(normalizedUsername); //am mutat in repositories pentru ca asa: trebuie

  if (!existingUser) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  const accessToken = jwt.sign(
  { username: existingUser.username },
  process.env.ACCESS_TOKEN_SECRET,
  { expiresIn: '1h' }
);

const refreshToken = jwt.sign(
  { username: existingUser.username },
  process.env.REFRESH_TOKEN_SECRET,
  { expiresIn: '1d' }
);

  await storeRefreshToken(existingUser.id, refreshToken);

  return res.status(200).json({ message: 'Login successful.', accessToken }); //accessToken e trimis pe front ca raspuns, de mentionat Lorenei ca trebuie stored ca httponly
};

const handleRegister = async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as { username?: string; password?: string };
  const { username, password } = body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  const normalizedUsername = username.trim().toLowerCase();

  const existingUser = await returnUserByUsername(normalizedUsername);

  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await insertUser(normalizedUsername, hashedPassword);

  if (!newUser) {
    return res.status(500).json({ message: 'Internal server error.' });
  }

  return res.status(201).json({ message: 'User created successfully.' });
};




module.exports = { handleLogin, handleRegister };
