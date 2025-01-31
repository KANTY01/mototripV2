import request from 'supertest'
import app from '../index.js'
import db from '../models/index.js'
import bcrypt from 'bcryptjs'

const { User } = db

describe('Auth API', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await db.sequelize.close()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const newUser = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(newUser)

      expect(response.status).toBe(201)
      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.userId).toBeDefined()

      const user = await User.findOne({ where: { email: newUser.email } })
      expect(user).not.toBeNull()
      expect(user.username).toBe(newUser.username)
      expect(await bcrypt.compare(newUser.password, user.password)).toBe(true)
    })

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          username: 'testuser'
        })

      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors.length).toBeGreaterThan(0)
    })

    it('should return 400 if password is less than 6 characters', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'pass',
          username: 'testuser'
        })

      expect(response.status).toBe(400)
      expect(response.body.errors).toBeDefined()
      expect(response.body.errors.length).toBeGreaterThan(0)
    })
  })

  describe('POST /api/auth/login', () => {
    let user

    beforeAll(async () => {
      const password = await bcrypt.hash('password123', 10)
      user = await User.create({
        email: 'test@example.com',
        password,
        username: 'testuser'
      })
    })

    it('should authenticate a user and return a JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })

      expect(response.status).toBe(200)
      expect(response.body.token).toBeDefined()
      expect(response.body.user).toBeDefined()
      expect(response.body.user.id).toBe(user.id)
      expect(response.body.user.email).toBe(user.email)
      expect(response.body.user.role).toBe(user.role)
    })

    it('should return 400 if email is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid-email',
          password: 'password123'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Invalid credentials')
    })

    it('should return 400 if password is incorrect', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        })

      expect(response.status).toBe(400)
      expect(response.body.message).toBe('Invalid credentials')
    })
  })
})
