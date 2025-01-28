import { Router } from 'express';
import tripController from '../controllers/tripController.js';
import { validateAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

// Protected routes
router.use('/create', validateAccessToken);
router.use('/update', validateAccessToken);
router.use('/delete', validateAccessToken);

// Public routes
router.get('/', tripController.searchTrips);
router.get('/:id', tripController.getTrip);

// Protected routes with specific paths
router.post('/create', tripController.createTrip);
router.put('/update/:id', tripController.updateTrip);
router.delete('/delete/:id', tripController.archiveTrip);

export default router;
