import { Router } from 'express';
import {
  register, registerValidators,
  login, loginValidators,
  refreshToken,
  getMe,
  updateProfile,
  changePassword, changePasswordValidators,
} from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', registerValidators, register);
router.post('/login', loginValidators, login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.get('/me', authenticate, getMe);
router.patch('/me', authenticate, updateProfile);
router.patch('/me/password', authenticate, changePasswordValidators, changePassword);

export default router;


