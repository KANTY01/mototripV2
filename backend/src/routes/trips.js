import express from "express";
import { authenticate } from "../middleware/auth.js";
import { checkPremium } from "../middleware/premium.js";
import db from "../models/index.js";
import multer from "multer";
import cache from "../cache.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });
const { Trip, TripImage, User } = db;

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Create a new trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - start_date
 *               - end_date
 *               - difficulty
 *               - distance
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *               difficulty:
 *                 type: string
 *                 enum: [easy, medium, hard]
 *               distance:
 *                 type: number
 *                 format: float
 *               is_premium:
 *                 type: boolean
 *                 default: false
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Trip created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 tripId:
 *                   type: integer
 *       400:
 *         description: Trip creation failed
 *       401:
 *         description: Unauthorized
 */
router.post("/", authenticate, upload.array("images"), async (req, res) => {
  const {
    title,
    description,
    start_date,
    end_date,
    difficulty,
    distance,
    is_premium,
  } = req.body;
  const userId = req.user.id;

  try {
    const trip = await Trip.create({
      title,
      description,
      start_date,
      end_date,
      difficulty,
      distance,
      created_by: userId,
      is_premium: is_premium === "true" ? true : false,
    });

    // Handle image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        trip_id: trip.id,
        image_url: file.path,
      }));
      await TripImage.bulkCreate(images);
    }

    res
      .status(201)
      .json({ message: "Trip created successfully", tripId: trip.id });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Trip creation failed", error: err.message });
  }
});

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: Get all trips
 *     tags: [Trips]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Failed to fetch trips
 */
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.per_page) || 10;
  const userId = req.query.userId;
  const offset = (page - 1) * perPage;

  try {
    const whereClause = {};
    
    // Add userId filter if provided
    if (userId) {
      whereClause.created_by = userId;
    }

    // Get total count with filters
    const total = await Trip.count({
      where: whereClause
    });

    const trips = await Trip.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          attributes: ["username", "avatar"],
        },
        {
          model: TripImage,
          attributes: ["image_url"],
        },
      ],
      limit: perPage,
      offset: offset,
      order: [["created_at", "DESC"]],
    });

    if (!trips) {
      return res.status(404).json({ message: "No trips found" });
    }
    
    res.json({
      trips: trips || [],
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / perPage),
        total_items: total,
        per_page: perPage
      }
    });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch trips", error: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   get:
 *     summary: Get a specific trip by ID
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the trip to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Failed to fetch trip details
 *       403:
 *         description: This is a premium trip. Please subscribe to access.
 *       404:
 *         description: Trip not found
 */
router.get("/:id", authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    const cacheKey = `trip:${id}`;
    const cachedTrip = await cache.get(cacheKey);

    let trip;
    if (cachedTrip) {
      try {
        trip = JSON.parse(cachedTrip);
      } catch (parseError) {
        console.error(`Failed to parse cached trip ${id}:`, parseError);
        // Continue to fetch from database if parse fails
      }
    }

    if (!trip) {
      trip = await Trip.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["username", "avatar"],
          },
          {
            model: TripImage,
            attributes: ["image_url"],
          },
        ],
      });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

if (req.user && req.user.role === 'admin') return res.json(trip);
      if (trip.is_premium) {
        return res
          .status(403)
          .json({
            message: "This is a premium trip. Please subscribe to access.",
          });
      }

      // Cache the trip if found
      await cache.set(cacheKey, JSON.stringify(trip), "EX", 3600); // Cache for 1 hour
    }

    res.json(trip);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch trip details", error: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}/premium:
 *   get:
 *     summary: Get a specific premium trip by ID (requires authentication and premium subscription)
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the premium trip to get
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Failed to fetch trip
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Premium content requires active subscription
 *       404:
 *         description: Trip not found
 */
router.get("/:id/premium", authenticate, checkPremium, async (req, res) => {
  const { id } = req.params;

  try {
    const cacheKey = `trip:${id}:premium`;
    const cachedTrip = await cache.get(cacheKey);

    let trip;
    if (cachedTrip) {
      try {
        if (req.user && req.user.role === 'admin') return res.json(JSON.parse(cachedTrip));

        trip = JSON.parse(cachedTrip);
      } catch (parseError) {
        console.error(`Failed to parse cached premium trip ${id}:`, parseError);
        // Continue to fetch from database if parse fails
      }
    }

    if (!trip) {
      trip = await Trip.findByPk(id, {
        include: [
          {
            model: User,
            attributes: ["username", "avatar"],
          },
          {
            model: TripImage,
            attributes: ["image_url"],
          },
        ],
      });

      if (!trip) {
        return res.status(404).json({ message: "Trip not found" });
      }

      // Cache the trip if found
      await cache.set(cacheKey, JSON.stringify(trip), "EX", 3600); // Cache for 1 hour
    }

    res.json(trip);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Failed to fetch trip", error: err.message });
  }
});

/**
 * @swagger
 * /api/users/{userId}/trips:
 *   get:
 *     summary: Get all trips for a specific user
 *     tags: [Trips]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user whose trips to get
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *     responses:
 *       200:
 *         description: Successful operation
 *       404:
 *         description: User not found or no trips found
 */
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  try {
    const trips = await Trip.findAll({
      where: { created_by: userId },
      include: [
        { 
          model: User, 
          attributes: ["username", "avatar"] 
        },
        {
          model: TripImage,
          attributes: ["image_url"],
        }
      ],
      limit,
      offset,
      order: [["created_at", "DESC"]]
    });
    
    const total = await Trip.count({ where: { created_by: userId } });
    
    res.json({
      trips: trips || [],
      pagination: {
        current_page: page,
        total_pages: Math.ceil(total / limit),
        total_items: total,
        per_page: limit
      }
    });
  } catch (err) {
    res.status(400).json({ message: "Failed to fetch user trips", error: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   patch:
 *     summary: Update a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/TripUpdate'
 *     responses:
 *       200:
 *         description: Trip updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User does not own this trip
 *       404:
 *         description: Trip not found
 */
router.patch("/:id", authenticate, upload.array("images"), async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const trip = await Trip.findByPk(id);
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if user owns the trip or is admin
    if (trip.created_by !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to update this trip" });
    }

    const updateData = {
    };

    // Only update fields that are provided
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.start_date) updateData.start_date = req.body.start_date;
    if (req.body.end_date) updateData.end_date = req.body.end_date;
    if (req.body.difficulty) updateData.difficulty = req.body.difficulty;
    if (req.body.distance) updateData.distance = req.body.distance;
    if (req.body.is_premium !== undefined) updateData.is_premium = req.body.is_premium === "true";

    // Update trip
    await trip.update(updateData);

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      const images = req.files.map((file) => ({
        trip_id: trip.id,
        image_url: file.path,
      }));
      await TripImage.bulkCreate(images);
    }

    // Clear cache
    await cache.del(`trip:${id}`);
    await cache.del(`trip:${id}:premium`);

    res.json({ message: "Trip updated successfully", tripId: trip.id });
  } catch (err) {
    res.status(400).json({ message: "Failed to update trip", error: err.message });
  }
});

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     tags: [Trips]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trip deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User does not own this trip
 *       404:
 *         description: Trip not found
 */
router.delete("/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const trip = await Trip.findByPk(id);
    
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Check if user owns the trip or is admin
    if (trip.created_by !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: "You don't have permission to delete this trip" });
    }

    // Delete trip
    await trip.destroy();

    // Clear cache
    await cache.del(`trip:${id}`);
    await cache.del(`trip:${id}:premium`);

    res.json({ message: "Trip deleted successfully" });
  } catch (err) {
    res.status(400).json({ message: "Failed to delete trip", error: err.message });
  }
});

export default router;
