import express from 'express';
import tripController from '../controllers/tripController.js';
import { createTripRules } from '../middleware/tripValidation.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Apply security middleware stack to all routes
router.use(
  authController.authenticateToken,
  authController.rateLimiter,
  authController.csrfProtection
);

// Create new trip
router.post('/', 
  createTripRules,
  tripController.createTrip
);

// Get trips (with optional filters)
router.get('/', tripController.getTrips);

// Update trip details
router.put('/:id',
  tripController.validateTripOwnership,
  createTripRules,
  tripController.updateTrip
);

// Archive trip (soft delete)
router.delete('/:id',
  tripController.validateTripOwnership,
  tripController.archiveTrip
);

export default router;
