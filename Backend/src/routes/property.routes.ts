import { Router } from 'express';
import { getAllProperties, getPropertyById, createProperty } from '../controllers/property.controller';
import { authenticate, authorize, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', optionalAuth, getAllProperties);
router.get('/:id', optionalAuth, getPropertyById);
router.post('/', authenticate, authorize('agent', 'admin'), createProperty);

export default router;