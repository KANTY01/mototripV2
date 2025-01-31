import bcrypt from 'bcryptjs'
import db from './models/index.js'
import dotenv from 'dotenv'

dotenv.config()

const { User, Trip, Review, Subscription } = db

async function seedDatabase() {
  try {
    await db.sequelize.sync({ force: true })

    // Create an admin user
    const adminPassword = await bcrypt.hash('adminpassword', 10)
    const adminUser = await User.create({
      email: 'admin@example.com',
      password: adminPassword,
      username: 'admin',
      role: 'admin',
      experience_level: 'advanced',
      preferred_routes: JSON.stringify(['Route 66', 'Pacific Coast Highway']),
      motorcycle_details: JSON.stringify({ make: 'Harley-Davidson', model: 'Street Glide', year: 2023 })
    })

    // Create a non-premium user
    const nonPremiumPassword = await bcrypt.hash('userpassword', 10)
    const nonPremiumUser = await User.create({
      email: 'user@example.com',
      password: nonPremiumPassword,
      username: 'john_doe',
      role: 'user',
      experience_level: 'intermediate',
      preferred_routes: JSON.stringify(['Blue Ridge Parkway', 'Skyline Drive']),
      motorcycle_details: JSON.stringify({ make: 'Honda', model: 'Gold Wing', year: 2022 })
    })

    // Create a premium user
    const premiumPassword = await bcrypt.hash('premiumpassword', 10)
    const premiumUser = await User.create({
      email: 'premium@example.com',
      password: premiumPassword,
      username: 'jane_smith',
      role: 'user',
      experience_level: 'expert',
      preferred_routes: JSON.stringify(['Tail of the Dragon', 'Beartooth Highway']),
      motorcycle_details: JSON.stringify({ make: 'BMW', model: 'R 1250 GS', year: 2023 })
    })

    // Create a subscription for the premium user
    await Subscription.create({
      user_id: premiumUser.id,
      start_date: new Date(),
      end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      status: 'active'
    })

    // Create some trips
    const trip1 = await Trip.create({
      title: 'California Coast Adventure',
      description: 'A scenic ride along the California coast, featuring stunning ocean views and winding roads.',
      start_date: '2024-06-01',
      end_date: '2024-06-07',
      difficulty: 'intermediate',
      distance: 800,
      created_by: nonPremiumUser.id,
      is_premium: false
    })

    const trip2 = await Trip.create({
      title: 'Rocky Mountain High',
      description: 'Explore the majestic Rocky Mountains on this thrilling ride through high-altitude passes and breathtaking landscapes.',
      start_date: '2024-07-15',
      end_date: '2024-07-22',
      difficulty: 'advanced',
      distance: 1200,
      created_by: premiumUser.id,
      is_premium: true
    })

    const trip3 = await Trip.create({
      title: 'Southwest Desert Escape',
      description: 'Discover the beauty of the American Southwest on this ride through deserts, canyons, and historic towns.',
      start_date: '2024-08-10',
      end_date: '2024-08-15',
      difficulty: 'intermediate',
      distance: 900,
      created_by: adminUser.id,
      is_premium: false
    })

    // Create some reviews
    await Review.create({
      trip_id: trip1.id,
      user_id: premiumUser.id,
      rating: 4.5,
      content: 'Amazing trip along the coast! The views were breathtaking, and the roads were perfect for riding.'
    })

    await Review.create({
      trip_id: trip1.id,
      user_id: adminUser.id,
      rating: 5,
      content: 'One of the best trips I\'ve ever been on. Highly recommended!'
    })

    await Review.create({
      trip_id: trip2.id,
      user_id: nonPremiumUser.id,
      rating: 4,
      content: 'Challenging but rewarding ride. The scenery was incredible, but be prepared for some tough sections.'
    })

    console.log('Database seeded successfully!')
  } catch (error) {
    console.error('Error seeding database:', error)
  } finally {
    await db.sequelize.close()
  }
}

seedDatabase()
