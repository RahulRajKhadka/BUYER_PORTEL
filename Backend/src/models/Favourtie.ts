import mongoose, { Schema } from 'mongoose';
import { IFavourite } from '../types';

const favouriteSchema = new Schema<IFavourite>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes must not exceed 500 characters'],
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
  }
);


favouriteSchema.index({ user: 1, property: 1 }, { unique: true });
favouriteSchema.index({ user: 1, createdAt: -1 });

export const Favourite = mongoose.model<IFavourite>('Favourite', favouriteSchema);