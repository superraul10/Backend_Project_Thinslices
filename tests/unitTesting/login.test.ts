import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppError } from '../../src/types/AppError.js';

const { mockReturnUserByUsername, mockStoreRefreshToken, mockBcryptCompare, mockCreateJWT } = vi.hoisted(() => ({
  mockReturnUserByUsername: vi.fn(),
  mockStoreRefreshToken: vi.fn(),
  mockBcryptCompare: vi.fn(),
  mockCreateJWT: vi.fn(),
}));

vi.mock('../../src/repositories/auth/users.js', () => ({
  returnUserByUsername: mockReturnUserByUsername,
}));

vi.mock('../../src/repositories/auth/refreshToken.js', () => ({
  storeRefreshToken: mockStoreRefreshToken,
}));

vi.mock('bcrypt', () => ({
  default: { compare: mockBcryptCompare },
}));

vi.mock('../../src/utils/jwt.js', () => ({
  createJWT: mockCreateJWT,
  accessTokenSecret: 'test-access-secret',
  refreshTokenSecret: 'test-refresh-secret',
}));

const { loginUser } = await import('../../src/services/auth/login.js');

describe('loginUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws a 400 AppError when username or password is missing', async () => {
    try {
      await loginUser(undefined, 'password');
      expect.unreachable('loginUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(400);
    }

    expect(mockReturnUserByUsername).not.toHaveBeenCalled();
  });

  it('throws a 404 AppError when the user does not exist', async () => {
    mockReturnUserByUsername.mockResolvedValue(null);

    try {
      await loginUser('unknown_user', 'password');
      expect.unreachable('loginUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(404);
    }
  });

  it('throws a 401 AppError when the password is invalid', async () => {
    mockReturnUserByUsername.mockResolvedValue({ id: 1, username: 'test_user', password: 'hashed' });
    mockBcryptCompare.mockResolvedValue(false);

    try {
      await loginUser('test_user', 'wrong-password');
      expect.unreachable('loginUser should have thrown');
    } catch (err) {
      expect(err).toBeInstanceOf(AppError);
      expect((err as AppError).statusCode).toBe(401);
    }

    expect(mockStoreRefreshToken).not.toHaveBeenCalled();
  });

  it('returns an access token and stores the refresh token on success', async () => {
    mockReturnUserByUsername.mockResolvedValue({ id: 1, username: 'test_user', password: 'hashed' });
    mockBcryptCompare.mockResolvedValue(true);
    mockCreateJWT.mockReturnValueOnce('signed-access-token').mockReturnValueOnce('signed-refresh-token');

    const result = await loginUser('test_user', 'correct-password');

    expect(result).toEqual({ accessToken: 'signed-access-token' });
    expect(mockStoreRefreshToken).toHaveBeenCalledWith(1, 'signed-refresh-token');
  });
});
