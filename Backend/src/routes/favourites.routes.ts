import { Router } from 'express';
import {
  getUserFavourites,
  addFavourite, addFavouriteValidators,
  removeFavourite,
  toggleFavourite,
  updateFavouriteNotes, updateNotesValidators,
} from '../controllers/favourite.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();


router.use(authenticate);

router.get('/', getUserFavourites);
router.post('/', addFavouriteValidators, addFavourite);
router.post('/toggle', addFavouriteValidators, toggleFavourite);
router.delete('/:id', removeFavourite);
router.patch('/:id/notes', updateNotesValidators, updateFavouriteNotes);

export default router;