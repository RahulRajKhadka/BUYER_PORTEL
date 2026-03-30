import { Request } from 'express';
import { Document, Types } from 'mongoose';

export type UserRole = 'buyer' | 'agent' | 'admin';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v?:number;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export type PropertyType = 'apartment' | 'house' | 'villa' | 'commercial' | 'land';
export type PropertyStatus = 'available' | 'sold' | 'rented' | 'pending';

export interface IProperty extends Document {
  _id: Types.ObjectId;
  __v?: number;
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
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    parking: boolean;
    furnished: boolean;
  };
  images: string[];
  agent?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFavourite extends Document {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  property: Types.ObjectId;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  __v?:number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}