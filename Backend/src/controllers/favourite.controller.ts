import { Response, NextFunction } from 'express';
import { body, param } from 'express-validator';
import { AuthRequest } from '../types';
import { favouriteService } from '../services/favourtie.service';
import { sendSuccess, sendCreated } from '../utils/response';
import { validate } from '../middleware/validate.middleware';

// ─── Validators ───────────────────────────────────────────────────────────────


export const addFavouriteValidators = validate([
  body('propertyId').notEmpty().withMessage('Property ID is required').isMongoId().withMessage('Invalid property ID'),
  body('notes').optional().isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
]);

export const updateNotesValidators = validate([
  param('id').isMongoId().withMessage('Invalid favourite ID'),
  body('notes').optional({ nullable: true }).isLength({ max: 500 }).withMessage('Notes must not exceed 500 characters'),
]);





// ─── Controllers ──────────────────────────────────────────────────────────────

export const getUserFavourites = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(50, parseInt(req.query.limit as string) || 12);
    const result = await favouriteService.getUserFavourites(req.user!.userId, page, limit);

    sendSuccess(res, 'Favourites fetched', result.data, 200, {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
    });
  } catch (err) {
    next(err);
  }
};

export const addFavourite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propertyId, notes } = req.body;
    const favourite = await favouriteService.addFavourite(req.user!.userId, propertyId, notes);
    sendCreated(res, 'Added to favourites', favourite);
  } catch (err) {
    next(err);
  }
};

export const removeFavourite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await favouriteService.removeFavouriteById(req.user!.userId, req.params.id as string);
    sendSuccess(res, 'Removed from favourites');
  } catch (err) {
    next(err);
  }
};

export const toggleFavourite = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { propertyId } = req.body;
    const isFavourited = await favouriteService.isFavourited(req.user!.userId, propertyId);

    if (isFavourited) {
      await favouriteService.removeFavourite(req.user!.userId, propertyId);
      sendSuccess(res, 'Removed from favourites', { isFavourited: false });
    } else {
      const favourite = await favouriteService.addFavourite(req.user!.userId, propertyId);
      sendCreated(res, 'Added to favourites', { isFavourited: true, favourite });
    }
  } catch (err) {
    next(err);
  }
};

export const updateFavouriteNotes = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { notes } = req.body;
    const favourite = await favouriteService.updateNotes(req.user!.userId, req.params.id as string, notes);
    sendSuccess(res, 'Notes updated', favourite);
  } catch (err) {
    next(err);
  }
};