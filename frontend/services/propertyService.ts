import api from  "../lib/api.js"
import type { Property } from  "../types/index.js"

export interface PropertyFilters {
  page?: number;
  limit?: number;
  type?: string;
  status?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface PropertiesResponse {
  data: Property[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export const propertyService = {
  getAll: async (filters: PropertyFilters = {}): Promise<PropertiesResponse> => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v !== undefined && v !== '')
    );
    const res = await api.get('/properties', { params });
    return { data: res.data.data, meta: res.data.meta };
  },

  getById: async (id: string): Promise<Property> => {
    const res = await api.get(`/properties/${id}`);
    return res.data.data;
  },
};
