'use strict';

const reviewContents = [
  'Absolutely loved this route! The twisties were perfect for my bike.',
  'Great mix of scenic views and technical riding. Will do again!',
  'The road conditions were excellent, perfect for motorcycles.',
  'Some challenging sections but overall a fantastic experience.',
  'Beautiful landscapes and well-maintained roads throughout.',
  'Perfect weekend getaway route. Highly recommended!',
  'Nice balance of straight roads and curves. Very enjoyable.',
  'The route planning was excellent, with good rest stops.',
  'Challenging but rewarding ride. Not for beginners.',
  'Amazing views and great road quality. A must-ride!',
  'The technical sections were thrilling. Great for experienced riders.',
  'Well-documented route with accurate descriptions.',
  'Perfect mix of scenic beauty and riding challenge.',
  'The elevation changes made this route exciting.',
  'Good variety of terrain and road types.'
];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Get all users and trips
      const users = await queryInterface.sequelize.query(
        'SELECT id, username, role FROM Users',
        { type: Sequelize.QueryTypes.SELECT }
      );

      const trips = await queryInterface.sequelize.query(
        'SELECT id, title, created_by FROM Trips',
        { type: Sequelize.QueryTypes.SELECT }
      );

      const reviews = [];
      const statuses = ['approved', 'rejected', null]; // null means pending
      const reportCounts = [0, 0, 0, 1, 2, 3]; // More weight on non-reported reviews

      // Create reviews between users
      for (const user of users) {
        // Get trips not created by current user
        const otherTrips = trips.filter(trip => trip.created_by !== user.id);
        
        // Create more reviews for active users (5-8 reviews per user)
        const numReviews = Math.floor(Math.random() * 4) + 5;
        
        for (let i = 0; i < numReviews && i < otherTrips.length; i++) {
          const trip = otherTrips[i];
          const rating = Math.floor(Math.random() * 3) + 3; // Ratings between 3-5
          const status = user.role === 'admin' ? 'approved' : statuses[Math.floor(Math.random() * statuses.length)];
          const reports = reportCounts[Math.floor(Math.random() * reportCounts.length)];

          reviews.push({
            user_id: user.id,
            trip_id: trip.id,
            rating: rating,
            content: reviewContents[Math.floor(Math.random() * reviewContents.length)],
            created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000), // Random date within last 30 days
            reports: reports,
            status: status
          });
        }
      }

      // Add specific test cases
      const adminUser = users.find(u => u.role === 'admin');
      const premiumUsers = users.filter(u => u.username.includes('premium'));
      const regularUsers = users.filter(u => !u.username.includes('premium') && u.role !== 'admin');
      
      if (adminUser && premiumUsers.length && regularUsers.length) {
        // Admin reviewing premium users' trips
        for (const premiumUser of premiumUsers) {
          const premiumTrip = trips.find(t => t.created_by === premiumUser.id);
          if (premiumTrip) {
            reviews.push({
              user_id: adminUser.id,
              trip_id: premiumTrip.id,
              rating: 5,
              content: 'Excellent premium route with great attention to detail.',
              created_at: new Date(),
              reports: 0,
              status: 'approved'
            });
          }
        }

        // Premium users reviewing regular users' trips
        for (const premiumUser of premiumUsers) {
          const regularTrip = regularUsers
            .map(u => trips.find(t => t.created_by === u.id))
            .filter(Boolean)[0];

          if (regularTrip) {
            reviews.push({
              user_id: premiumUser.id,
              trip_id: regularTrip.id,
              rating: 4,
              content: 'Good route for beginners. Well documented.',
              created_at: new Date(),
              reports: 0,
              status: 'approved'
            });
          }
        }

        // Add some reported reviews that need moderation
        const reportedReviews = regularUsers.slice(0, 3).map(user => ({
          user_id: user.id,
          trip_id: trips[Math.floor(Math.random() * trips.length)].id,
          rating: 2,
          content: 'This review contains inappropriate content and should be moderated.',
          created_at: new Date(),
          reports: Math.floor(Math.random() * 3) + 1,
          status: null
        }));

        reviews.push(...reportedReviews);
      }

      // Insert all reviews
      await queryInterface.bulkInsert('Reviews', reviews);
      console.log(`Created ${reviews.length} reviews`);

      return Promise.resolve();
    } catch (error) {
      console.error('Error seeding reviews:', error);
      return Promise.reject(error);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.bulkDelete('Reviews', null, {});
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing reviews:', error);
      return Promise.reject(error);
    }
  }
};