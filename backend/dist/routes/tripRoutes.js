import { Router } from 'express';
import tripController from '../controllers/tripController.js';
import { validateAccessToken } from '../middleware/authMiddleware.js';
const router = Router();
// Public routes
router.get('/', tripController.searchTrips);
router.get('/:id', tripController.getTrip);
// Protected routes
router.use(validateAccessToken);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.archiveTrip);
export default router;
