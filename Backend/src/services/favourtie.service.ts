import { Favourite } from "../models/Favourite"
import { Property } from '../models/Property';
import { IFavourite } from "../types"
import { ConflictError, NotFoundError, AuthorizationError } from '../utils/errors';

interface FavouriteWithProperty extends Omit<IFavourite, 'property'> {
  property: any;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class FavouriteService {
  async addFavourite(userId: string, propertyId: string, notes?: string): Promise<IFavourite> {
    // Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      throw new NotFoundError('Property');
    }

    // Check if already favourited
    const existing = await Favourite.findOne({ user: userId, property: propertyId });
    if (existing) {
      throw new ConflictError('Property is already in your favourites');
    }

    const favourite = await Favourite.create({
      user: userId,
      property: propertyId,
      notes: notes || undefined,
    });

    await favourite.populate('property');
    return favourite ;
  }

  async removeFavourite(userId: string, propertyId: string): Promise<void> {
    const favourite = await Favourite.findOne({ user: userId, property: propertyId });

    if (!favourite) {
      throw new NotFoundError('Favourite');
    }

    // Security: ensure user owns this favourite
    if (favourite.user.toString() !== userId) {
      throw new AuthorizationError();
    }

    await Favourite.deleteOne({ _id: favourite._id });
  }

  async removeFavouriteById(userId: string, favouriteId: string): Promise<void> {
    const favourite = await Favourite.findById(favouriteId);

    if (!favourite) {
      throw new NotFoundError('Favourite');
    }

    // Security: ensure user owns this favourite
    if (favourite.user.toString() !== userId) {
      throw new AuthorizationError();
    }

    await Favourite.deleteOne({ _id: favouriteId });
  }

  async getUserFavourites(
    userId: string,
    page = 1,
    limit = 12
  ): Promise<PaginatedResult<FavouriteWithProperty>> {
    const skip = (page - 1) * limit;

    const [favourites, total] = await Promise.all([
      Favourite.find({ user: userId })
        .populate({
          path: 'property',
          select: '-__v',
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Favourite.countDocuments({ user: userId }),
    ]);

    return {
      data: favourites as unknown as FavouriteWithProperty[],
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async isFavourited(userId: string, propertyId: string): Promise<boolean> {
    const favourite = await Favourite.findOne({ user: userId, property: propertyId });
    return !!favourite;
  }

  async updateNotes(userId: string, favouriteId: string, notes: string): Promise<IFavourite> {
    const favourite = await Favourite.findById(favouriteId);

    if (!favourite) {
      throw new NotFoundError('Favourite');
    }

    if (favourite.user.toString() !== userId) {
      throw new AuthorizationError();
    }

    favourite.notes = notes;
    await favourite.save();

    return favourite.populate('property');
  }

  async getFavouritePropertyIds(userId: string): Promise<string[]> {
    const favourites = await Favourite.find({ user: userId }).select('property').lean();
    return favourites.map((f) => f.property.toString());
  }
}

export const favouriteService = new FavouriteService();