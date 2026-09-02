import type { Request, Response } from 'express';
import { loginUser } from '../../services/auth/login.js';
import { registerUser } from '../../services/auth/register.js';
import { AppError } from '../../types/AppError.js';

const handleLogin = async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as { username?: string; password?: string };
  const { username, password } = body;

  try {
    const { accessToken } = await loginUser(username, password);
    return res.status(200).json({ message: 'Login successful.', accessToken }); //accessToken e trimis pe front ca raspuns, de mentionat Lorenei ca trebuie stored ca httponly
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error during login:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

const handleRegister = async (req: Request, res: Response) => {
  const body = (req.body ?? {}) as { username?: string; password?: string };
  const { username, password } = body;

  try {
    await registerUser(username, password);
    return res.status(201).json({ message: 'User created successfully.' });
  } catch (err) {
    if (err instanceof AppError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error('Unexpected error during registration:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export { handleLogin, handleRegister };
