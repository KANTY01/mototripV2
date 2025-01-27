import { Request, Response } from 'express';
import TripService from '../services/tripService.js';
import { ApiError } from '../utils/errors.js';

/**
 * @class TripController
 * Handles trip-related operations
 */
class TripController {
  /**
   * Create new trip
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async createTrip(req: Request, res: Response) {
    try {
      const tripData = {
        ...req.body,
        created_by: req.user.id
      };
      
      const trip = await TripService.createTrip(tripData);
      res.status(201).json(trip);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  /**
   * Search trips based on query parameters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async searchTrips(req: Request, res: Response) {
    try {
      const filters = req.query;
      const trips = await TripService.searchTrips(filters);
      res.json(trips);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  /**
   * Update trip details
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  async updateTrip(req: Request, res: Response) {
    try {
      const tripId = parseInt(req.params.id, 10);
      const updates = req.body;
      const userId = req.user.id;
      
      const updatedTrip = await TripService.updateTrip(tripId, updates, userId);
      res.json(updatedTrip);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  /**
   * Get single trip details
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   */
  async getTrip(req: Request, res: Response) {
    try {
      const tripId = parseInt(req.params.id, 10);
      const trip = await TripService.getTripById(tripId);
      res.json(trip);
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }

  async archiveTrip(req: Request, res: Response) {
    try {
      const tripId = parseInt(req.params.id, 10);
      const userId = (req.user as { id: number }).id;
      
      await TripService.archiveTrip(tripId, userId);
      res.json({ 
        success: true,
        message: 'Trip archived successfully'
      });
    } catch (error: unknown) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        res.status(403).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Unknown error occurred' });
      }
    }
  }
}

export default new TripController();
