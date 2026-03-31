import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  toast from 'react-hot-toast';
import { favouriteService } from "../services/favourtieService.js"
import { useAuthStore } from "../store/authStore.js"

export const FAVOURITES_KEY = ['favourites'];

export const useFavourites = (page = 1, limit = 10) => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: [...FAVOURITES_KEY, page, limit],
    queryFn: () => favouriteService.getAll(page, limit),
    enabled: isAuthenticated,
  });
};

export const useToggleFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (propertyId: string) => favouriteService.toggle(propertyId),
    onSuccess: (data) => {
      // Invalidate both favourites and properties queries
      queryClient.invalidateQueries({ queryKey: FAVOURITES_KEY });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      
      // Show success message based on response
      if (data.data?.isFavourited) {
        toast.success(' Added to favourites');
      } else {
        toast.success(' Removed from favourites');
      }
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Something went wrong';
      toast.error(message);
    },
  });
};

export const useRemoveFavourite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (favouriteId: string) => favouriteService.remove(favouriteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: FAVOURITES_KEY });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast.success('Removed from favourites');
    },
    onError: (err: any) => {
      const message = err.response?.data?.message || 'Failed to remove';
      toast.error(message);
    },
  });
};