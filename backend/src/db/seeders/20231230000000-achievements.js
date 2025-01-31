'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Achievements', [
      {
        name: 'First Trip',
        description: 'Complete your first trip.',
        criteria: 'trip_count >= 1'
      },
      {
        name: 'Road Warrior',
        description: 'Complete 10 trips.',
        criteria: 'trip_count >= 10'
      },
      {
        name: 'Explorer',
        description: 'Create a trip with a distance of over 500km.',
        criteria: 'trip_distance > 500'
      },
      {
        name: 'Reviewer',
        description: 'Write 5 reviews.',
        criteria: 'review_count >= 5'
      },
      {
        name: 'Social Butterfly',
        description: 'Follow 10 users.',
        criteria: 'following_count >= 10'
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Achievements', null, {});
  }
};
