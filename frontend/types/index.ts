// ─── Auth ─────────────────────────────────────────────────────────────────────

export type UserRole = 'buyer' | 'agent' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}


export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ─── Property ─────────────────────────────────────────────────────────────────

export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: PropertyType;
  status: PropertyStatus;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };H
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    parking: boolean;
    furnished: boolean;
  };
  images: string[];
  isFavourited?: boolean;
  createdAt: string;
}

// ─── Favourite ────────────────────────────────────────────────────────────────

export interface Favourite {
  _id: string;
  user: string;
  property: Property;
  notes?: string;
  createdAt: string;
}

// ─── API ──────────────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  errors?: { field: string; message: string }[];
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
