import mongoose, { Schema } from 'mongoose';
import { IProperty, PropertyType, PropertyStatus } from '../types';

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description must not exceed 2000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'commercial', 'land'] as PropertyType[],
      required: [true, 'Property type is required'],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending'] as PropertyStatus[],
      default: 'available',
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    features: {
      bedrooms: { type: Number, default: 0, min: 0 },
      bathrooms: { type: Number, default: 0, min: 0 },
      area: { type: Number, required: true, min: 0 },
      parking: { type: Boolean, default: false },
      furnished: { type: Boolean, default: false },
    },
    images: [{ type: String }],
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);


propertySchema.index({ type: 1, status: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ 'address.city': 1 });
propertySchema.index({ createdAt: -1 });

// ─── Text Search Index ────────────────────────────────────────────────────────
propertySchema.index(
  { title: 'text', description: 'text', 'address.city': 'text' },
  { weights: { title: 10, 'address.city': 5, description: 1 } }
);

export const Property = mongoose.model<IProperty>('Property', propertySchema);