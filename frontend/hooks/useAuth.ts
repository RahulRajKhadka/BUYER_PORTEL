import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { AxiosError } from 'axios';

import { useAuthStore } from "../store/authStore.js";
import { authService } from '../services/authService.js';
import type { LoginInput, RegisterInput, ApiResponse } from "../types/index.js"

export const useAuth = () => {
  const { user, isAuthenticated, setAuth, setUser, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (data: RegisterInput) => authService.register(data),
    onSuccess: (res) => {
      // Fix: Access nested data property
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success(`Welcome, ${res.data.user.name}! 🎉`);
      navigate('/dashboard');
    },
    onError: (err: AxiosError<ApiResponse>) => {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (res) => {
      // Fix: Access nested data property
      setAuth(res.data.user, res.data.accessToken, res.data.refreshToken);
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/dashboard');
    },
    onError: (err: AxiosError<ApiResponse>) => {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    },
  });

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  return {
    user,
    isAuthenticated,
    setUser,
    register: registerMutation.mutate,
    login: loginMutation.mutate,
    logout: handleLogout,
    isRegistering: registerMutation.isPending,
    isLoggingIn: loginMutation.isPending,
  };
};