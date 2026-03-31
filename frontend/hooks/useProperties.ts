import { useQuery } from '@tanstack/react-query';
import { propertyService, PropertyFilters } from '../services/propertyService.js';

export const useProperties = (filters: PropertyFilters = {}) => {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getAll(filters),
    placeholderData: (prev) => prev,
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => propertyService.getById(id),
    enabled: !!id,
  });
};
