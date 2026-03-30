import {Request, Response, NextFunction} from "express"
import{body} from "express-validator"
import { authService

 } from "@/services/auth.service";

 import { AuthRequest } from "@/types";
 import { sendSuccess,sendCreated , sendError } from "@/utils/response";


export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const result = await authService.register({ name, email, password });
    sendCreated(res, "Account created successfully", result);
  } catch (err) {
    next(err);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    sendSuccess(res, "Login successful", result);
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      sendError(res, "Refresh token is required", 400);
      return;
    }
    const tokens = await authService.refreshTokens(refreshToken);
    sendSuccess(res, "Tokens refreshed", tokens);
  } catch (err) {
    next(err);
  }
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await authService.getProfile(req.user!.userId);
    sendSuccess(res, "Profile fetched", user);
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const user = await authService.updateProfile(req.user!.userId, {
      name,
      avatar,
    });
    sendSuccess(res, "Profile updated", user);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    await authService.changePassword(
      req.user!.userId,
      currentPassword,
      newPassword,
    );
    sendSuccess(res, "Password changed successfully");
  } catch (err) {
    next(err);
  }
};
