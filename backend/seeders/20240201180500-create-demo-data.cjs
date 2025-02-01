'use strict';

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    console.log('Starting demo data seeding...');
    
    try {
      // 1. Create Users
      console.log('Creating users...');
      const users = [];
      const userPasswords = {};

      // Generate a unique timestamp suffix
      const timestamp = Date.now();

      const experienceLevels = ['beginner', 'intermediate', 'expert'];
      for (let i = 1; i <= 10; i++) {
        const password = `user${i}pass`;
        const hashedPassword = await bcrypt.hash(password, 10);
        userPasswords[`user${i}@example.com`] = password;
        
        users.push({
          email: `user${i}@example.com`,
          password: hashedPassword,
          username: `rider${i}_${timestamp}`,
          experience_level: experienceLevels[i % 3],
          role: 'user',
          preferred_routes: JSON.stringify(["Route 66", "Pacific Coast Highway"]),
          motorcycle_details: JSON.stringify({
            make: "Harley-Davidson",
            model: "Street Glide",
            year: 2023
          })
        });
      }

      for (let i = 1; i <= 5; i++) {
        const password = `premium${i}pass`;
        const hashedPassword = await bcrypt.hash(password, 10);
        userPasswords[`premium${i}@example.com`] = password;
        
        users.push({
          email: `premium${i}@example.com`,
          password: hashedPassword,
          username: `premiumrider${i}_${timestamp}`,
          experience_level: 'expert',
          role: 'user',
          preferred_routes: JSON.stringify(["Blue Ridge Parkway", "Skyline Drive"]),
          motorcycle_details: JSON.stringify({
            make: "BMW",
            model: "R 1250 GS",
            year: 2023
          })
        });
      }

      await queryInterface.bulkInsert('Users', users);

      // Get all user IDs for reference
      const dbUsers = await queryInterface.sequelize.query(
        'SELECT id, email FROM Users',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      console.log(`Fetched ${dbUsers.length} users`);

      // Create a map of email to ID for easier reference
      const userMap = {};
      dbUsers.forEach(user => {
        userMap[user.email] = user.id;
      });

      // 2. Create Premium Subscriptions
      console.log('Creating subscriptions...');
      const premiumUsers = dbUsers.filter(u => u.email.startsWith('premium'));
      const subscriptions = premiumUsers.map(user => ({
        user_id: userMap[user.email],
        start_date: new Date(2024, 0, 1).toISOString(),
        end_date: new Date(2024, 11, 31).toISOString(),
        status: 'active',
        plan_type: 'premium',
        auto_renew: true,
        payment_method: JSON.stringify({
          type: 'credit_card',
          last_four: '4242'
        }),
        payment_history: JSON.stringify([])
      }));
      
      await queryInterface.bulkInsert('Subscriptions', subscriptions);
      console.log(`${subscriptions.length} subscriptions created`);

      // Get subscription IDs for billing history
      const dbSubscriptions = await queryInterface.sequelize.query(
        'SELECT id FROM Subscriptions',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      console.log(`Fetched ${dbSubscriptions.length} subscriptions`);

      // 3. Create Trips
      console.log('Creating trips...');
      const tripTypes = [
        { title: 'Mountain Pass Adventure', difficulty: 'hard', distance: 800, terrain: 'mountain' },
        { title: 'Coastal Highway Journey', difficulty: 'medium', distance: 500, terrain: 'coastal' },
        { title: 'Desert Trail Expedition', difficulty: 'hard', distance: 1000, terrain: 'desert' },
        { title: 'Forest Trail Ride', difficulty: 'easy', distance: 300, terrain: 'forest' },
        { title: 'City to City Tour', difficulty: 'medium', distance: 600, terrain: 'urban' }
      ];

      const trips = [];
      let tripDate = new Date(2024, 2, 1);

      for (const user of dbUsers) {
        const numTrips = 2 + Math.floor(Math.random() * 2);
        for (let i = 0; i < numTrips; i++) {
          const tripType = tripTypes[Math.floor(Math.random() * tripTypes.length)];
          const duration = Math.floor(Math.random() * 5) + 1;
          const isPremium = user.email.startsWith('premium');

          trips.push({
            title: `${tripType.title} ${i + 1}`,
            description: `Experience the thrill of ${tripType.title.toLowerCase()} through scenic routes and challenging terrains. Perfect for ${tripType.difficulty} level riders.`,
            start_date: new Date(tripDate).toISOString(),
            end_date: new Date(tripDate.getTime() + (duration * 24 * 60 * 60 * 1000)).toISOString(),
            difficulty: tripType.difficulty,
            distance: tripType.distance,
            created_by: userMap[user.email],
            is_premium: isPremium ? 1 : 0,
            status: 'published',
            terrain: tripType.terrain,
            route_points: JSON.stringify([
              { lat: 50.0619474, lng: 19.9368564 },
              { lat: 50.0519474, lng: 19.9468564 }
            ]),
            start_location: JSON.stringify({
              lat: 50.0619474,
              lng: 19.9368564,
              address: 'Kraków, Poland'
            })
          });

          tripDate.setDate(tripDate.getDate() + 7);
        }
      }

      await queryInterface.bulkInsert('Trips', trips);
      console.log(`${trips.length} trips created`);

      // Get all trip IDs
      const dbTrips = await queryInterface.sequelize.query(
        'SELECT id FROM Trips',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );
      console.log(`Fetched ${dbTrips.length} trips`);

      // 4. Add Trip Images
      console.log('Adding trip images...');
      const galleryDir = path.join(__dirname, '../../../gallery');
      const imageFiles = fs.readdirSync(galleryDir)
        .filter(file => file.endsWith('.webp'))
        .map(file => `/gallery/${file}`);

      const tripImages = [];
      for (const trip of dbTrips) {
        const numImages = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numImages; i++) {
          tripImages.push({
            trip_id: trip.id,
            image_url: imageFiles[Math.floor(Math.random() * imageFiles.length)],
            display_order: i
          });
        }
      }

      await queryInterface.bulkInsert('TripImages', tripImages);
      console.log(`${tripImages.length} trip images added`);

      // 5. Create Reviews
      console.log('Creating reviews...');
      const reviews = [];
      for (const trip of dbTrips) {
        const numReviews = 3 + Math.floor(Math.random() * 3);
        const reviewers = dbUsers
          .filter(u => u.id !== trip.created_by)
          .sort(() => 0.5 - Math.random())
          .slice(0, numReviews);

        for (const reviewer of reviewers) {
          reviews.push({
            trip_id: trip.id,
            user_id: userMap[reviewer.email],
            rating: 3 + Math.floor(Math.random() * 3),
            content: `Great trip! ${['Amazing views.', 'Challenging but rewarding.', 'Well planned route.', 'Perfect weather conditions.', 'Great group experience.'][Math.floor(Math.random() * 5)]}`
          });
        }
      }

      await queryInterface.bulkInsert('Reviews', reviews);
      console.log(`${reviews.length} reviews created`);

      // 6. Create Followers
      console.log('Creating followers...');
      const followers = [];
      for (const user of dbUsers) {
        const numFollowing = 3 + Math.floor(Math.random() * 4);
        const potentialFollowings = dbUsers.filter(u => u.id !== user.id);
        const followings = potentialFollowings
          .sort(() => 0.5 - Math.random())
          .slice(0, numFollowing);

        for (const following of followings) {
          followers.push({
            follower_id: userMap[user.email],
            following_id: userMap[following.email]
          });
        }
      }

      await queryInterface.bulkInsert('Followers', followers);
      console.log(`${followers.length} follower relationships created`);

      // 7. Create Achievements
      console.log('Creating achievements...');
      const achievements = [
        {
          name: 'Road Warrior',
          description: 'Complete 5 trips',
          criteria: '5_trips'
        },
        {
          name: 'Social Butterfly',
          description: 'Get 10 followers',
          criteria: '10_followers'
        },
        {
          name: 'Trip Master',
          description: 'Create a trip with 5+ reviews',
          criteria: '5_reviews'
        },
        {
          name: 'Expert Rider',
          description: 'Complete 3 hard difficulty trips',
          criteria: '3_hard_trips'
        },
        {
          name: 'Community Leader',
          description: 'Write 10 reviews',
          criteria: '10_reviews'
        }
      ];

      await queryInterface.bulkInsert('Achievements', achievements);
      console.log(`${achievements.length} achievements created`);

      // 8. Assign Achievements to Users
      console.log('Assigning achievements to users...');
      const dbAchievements = await queryInterface.sequelize.query(
        'SELECT id, name FROM Achievements',
        { type: queryInterface.sequelize.QueryTypes.SELECT }
      );

      const userAchievements = [];
      for (const user of dbUsers) {
        const numAchievements = 2 + Math.floor(Math.random() * 3);
        const userAchievs = dbAchievements
          .sort(() => 0.5 - Math.random())
          .slice(0, numAchievements);

        for (const achievement of userAchievs) {
          userAchievements.push({
            user_id: userMap[user.email],
            achievement_id: achievement.id
          });
        }
      }

      await queryInterface.bulkInsert('UserAchievements', userAchievements);
      console.log(`${userAchievements.length} user achievements assigned`);

      // Create some billing history
      console.log('Creating billing history...');
      const billingHistory = [];
      for (const subscription of dbSubscriptions) {
        billingHistory.push({
          subscription_id: subscription.id,
          amount: 29.99,
          description: 'Monthly premium subscription',
          status: 'completed',
          transaction_date: new Date().toISOString(),
          payment_method: JSON.stringify({
            type: 'credit_card',
            last_four: '4242'
          })
        });
      }

      await queryInterface.bulkInsert('billing_history', billingHistory);
      console.log(`${billingHistory.length} billing history entries created`);

      // Log credentials for documentation
      console.log('Created users with credentials:');
      Object.entries(userPasswords).forEach(([email, password]) => {
        console.log(`${email}: ${password}`);
      });

      console.log('Demo data seeding completed successfully');
    } catch (error) {
      console.error('Error during seeding:', error.message);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Delete all data in reverse order of creation
    await queryInterface.bulkDelete('billing_history', null, {});
    await queryInterface.bulkDelete('UserAchievements', null, {});
    await queryInterface.bulkDelete('Achievements', null, {});
    await queryInterface.bulkDelete('Followers', null, {});
    await queryInterface.bulkDelete('Reviews', null, {});
    await queryInterface.bulkDelete('TripImages', null, {});
    await queryInterface.bulkDelete('Trips', null, {});
    await queryInterface.bulkDelete('Subscriptions', null, {});
    await queryInterface.bulkDelete('Users', {
      email: {
        [Sequelize.Op.notLike]: 'admin@%'
      }
    }, {});
  }
};