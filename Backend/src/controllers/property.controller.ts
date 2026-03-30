import { Request, Response, NextFunction } from "express";
import { Property } from "../models/Property";
import { AuthRequest } from "../types";
import { sendSuccess, sendCreated, sendNotFound } from "../utils/response";
import { favouriteService } from "../services/favourtie.service";




export const getAllProperties = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(req.query.limit as string) || 12),
    );
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (req.query.type) filter.type = req.query.type;
    if (req.query.status) filter.status = req.query.status;
    if (req.query.city)
      filter["address.city"] = { $regex: req.query.city, $options: "i" };
    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {
        ...(req.query.minPrice && { $gte: Number(req.query.minPrice) }),
        ...(req.query.maxPrice && { $lte: Number(req.query.maxPrice) }),
      };
    }
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(filter),
    ]);

    
    let favouriteIds: string[] = [];
    const authReq = req as AuthRequest;
    if (authReq.user) {
      favouriteIds = await favouriteService.getFavouritePropertyIds(
        authReq.user.userId,
      );
    }

    const enriched = properties.map((p) => ({
      ...p,
      isFavourited: favouriteIds.includes(p._id.toString()),
    }));

    sendSuccess(res, "Properties fetched", enriched, 200, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};





export const getPropertyById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id).lean();
    if (!property) {
      sendNotFound(res, "Property");
      return;
    }

    let isFavourited = false;
    const authReq = req as AuthRequest;
    if (authReq.user) {
      isFavourited = await favouriteService.isFavourited(
        authReq.user.userId,
        req.params.id as string,
      );
    }

    sendSuccess(res, "Property fetched", { ...property, isFavourited });
  } catch (err) {
    next(err);
  }
};





export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const property = await Property.create({
      ...req.body,
      agent: req.user!.userId,
    });
    sendCreated(res, "Property created", property);
  } catch (err) {
    next(err);
  }
};
