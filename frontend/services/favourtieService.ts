import api from '../lib/api.js';

export const favouriteService = {
  getAll: async (page = 1, limit = 10) => {
    const res = await api.get(`/favourites?page=${page}&limit=${limit}`);
    return res.data; 
  },
  
  toggle: async (propertyId: string) => {
    const res = await api.post('/favourites/toggle', { propertyId });
    return res.data; 
  },
  
  add: async (propertyId: string, notes?: string) => {
    const res = await api.post('/favourites', { propertyId, notes });
    return res.data;
  },
  
  remove: async (favouriteId: string) => {
    const res = await api.delete(`/favourites/${favouriteId}`);
    return res.data;
  },
  
  updateNotes: async (favouriteId: string, notes: string) => {
    const res = await api.patch(`/favourites/${favouriteId}/notes`, { notes });
    return res.data;
  }
};