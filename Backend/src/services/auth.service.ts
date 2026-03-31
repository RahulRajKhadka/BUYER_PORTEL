import { User } from '../models/User';
import { IUser } from '../types';
import { generateTokenPair, verifyRefreshToken } from '../utils/jwt';

import {
  AuthenticationError,
  ConflictError,
  NotFoundError,
} from '../utils/errors';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface AuthResult {
  user: Omit<IUser, 'password'>;
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existingUser = await User.findOne({ email: input.email.toLowerCase() });
    if (existingUser) {
      throw new ConflictError('An account with this email already exists');
    }


    const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}`;

    
    const user = await User.create({
      name: input.name.trim(),
      email: input.email.toLowerCase().trim(),
      password: input.password,
      role: 'buyer',
    });

    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON() as Omit<IUser, 'password'>,
      ...tokens,
    };
  }

  async login(input: LoginInput): Promise<AuthResult> {
    // Include password field explicitly (it's excluded by default)
    const user = await User.findOne({ email: input.email.toLowerCase() }).select('+password');

    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new AuthenticationError('Invalid email or password');
    }

    const tokens = generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return {
      user: user.toJSON() as Omit<IUser, 'password'>,
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AuthenticationError('User no longer exists');
    }

    return generateTokenPair({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }
    return user;
  }

  async updateProfile(
    userId: string,
    updates: { name?: string; avatar?: string }
  ): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new NotFoundError('User');
    }

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new NotFoundError('User');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AuthenticationError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();
  }
}

export const authService = new AuthService();