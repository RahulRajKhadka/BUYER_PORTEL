import api from "../lib/api.js"
import type { AuthResponse, LoginInput, RegisterInput, User } from '../types/index.js';

export const authService = {

  login: async (data: LoginInput): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data.data;
  },

  updateProfile: async (data: { name?: string }): Promise<User> => {
    const res = await api.patch('/auth/me', data);
    return res.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await api.patch('/auth/me/password', data);
  },
};
