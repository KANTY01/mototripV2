import request from 'supertest'
import app from '../index.js'
import db from '../models/index.js'
import redisClient from '../cache.js'

const { Trip, User } = db

describe('Trips API', () => {
  let token
  let userId

  beforeAll(async () => {
    // Create a test user
    const password = await bcrypt.hash('password123', 10)
    const user = await User.create({
      email: 'test@example.com',
      password,
      username: 'testuser'
    })
    userId = user.id

    // Generate a JWT token for the test user
    token = jwt.sign(
      { id: userId, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )
  })

  afterAll(async () => {
    // Clean up the database after tests
    await Trip.destroy({ where: {} })
    await User.destroy({ where: {} })
    await redisClient.flushall()
  })

  describe('POST /api/trips', () => {
    it('should create a new trip', async () => {
      const newTrip = {
        title: 'Test Trip',
        description: 'This is a test trip',
        start_date: '2024-05-01',
        end_date: '2024-05-05',
        difficulty: 'medium',
        distance: 100,
        is_premium: false
      }

      const response = await request(app)
        .post('/api/trips')
        .set('Authorization', `Bearer ${token}`)
        .field('title', newTrip.title)
        .field('description', newTrip.description)
        .field('start_date', newTrip.start_date)
        .field('end_date', newTrip.end_date)
        .field('difficulty', newTrip.difficulty)
        .field('distance', newTrip.distance)
        .field('is_premium', newTrip.is_premium)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('Trip created successfully')
      expect(response.body.tripId).toBeDefined()
    })

    it('should return 401 if not authenticated', async () => {
      const response = await request(app)
        .post('/api/trips')
        .send({})

      expect(response.status).toBe(401)
    })
  })

  describe('GET /api/trips', () => {
    it('should get all trips', async () => {
      const response = await request(app)
        .get('/api/trips')

      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      expect(response.body.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/trips/:id', () => {
    it('should get a specific trip', async () => {
      const trip = await Trip.findOne()

      const response = await request(app)
        .get(`/api/trips/${trip.id}`)

      expect(response.status).toBe(200)
      expect(response.body.id).toBe(trip.id)
      expect(response.body.title).toBe(trip.title)
    })

    it('should return 404 if trip not found', async () => {
      const response = await request(app)
        .get('/api/trips/9999')

      expect(response.status).toBe(404)
    })

    it('should return 403 if trip is premium', async () => {
      const premiumTrip = await Trip.create({
        title: 'Premium Trip',
        description: 'This is a premium trip',
        start_date: '2024-06-01',
        end_date: '2024-06-05',
        difficulty: 'hard',
        distance: 200,
        created_by: userId,
        is_premium: true
      })

      const response = await request(app)
        .get(`/api/trips/${premiumTrip.id}`)

      expect(response.status).toBe(403)
    })
  })
})
