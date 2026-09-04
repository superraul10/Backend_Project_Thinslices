import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../src/types/AppError.js';

const { mockReturnUserByUsername, mockInsertUser, mockBcryptHash } = vi.hoisted(() => ({
  mockReturnUserByUsername: vi.fn(),
  mockInsertUser: vi.fn(),
  mockBcryptHash: vi.fn(),
}));

vi.mock('../../src/repositories/auth/users.js', () => ({
  returnUserByUsername: mockReturnUserByUsername,
  insertUser: mockInsertUser,
}));

vi.mock('bcrypt', () => ({
  default: { hash: mockBcryptHash },
}));

const { registerUser } = await import('../../src/services/auth/register.js');

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a 400 AppError when username or password is missing', async () => {
    try {
      await registerUser('test_user', undefined);
      expect.unreachable('registerUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(400);
    }

    expect(mockReturnUserByUsername).not.toHaveBeenCalled();
  });

  it('throws a 409 AppError when the username already exists', async () => {
    mockReturnUserByUsername.mockResolvedValue({ id: 1, username: 'test_user', password: 'hashed' });

    try {
      await registerUser('test_user', 'password123');
      expect.unreachable('registerUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(409);
    }

    expect(mockBcryptHash).not.toHaveBeenCalled();
  });

  it('throws a 500 AppError when the insert fails to return a user', async () => {
    mockReturnUserByUsername.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password');
    mockInsertUser.mockResolvedValue(null);

    try {
      await registerUser('new_user', 'password123');
      expect.unreachable('registerUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(500);
    }
  });

  it('hashes the password and creates the user on success', async () => {
    mockReturnUserByUsername.mockResolvedValue(null);
    mockBcryptHash.mockResolvedValue('hashed-password');
    mockInsertUser.mockResolvedValue({ id: 1, username: 'new_user' });

    const result = await registerUser('New_User', 'password123');

    expect(mockBcryptHash).toHaveBeenCalledWith('password123', 10);
    expect(mockInsertUser).toHaveBeenCalledWith('new_user', 'hashed-password');
    expect(result).toEqual({ id: 1, username: 'new_user' });
  });
});
