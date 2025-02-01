'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Achievements', [
      {
        name: 'First Trip',
        description: 'Complete your first trip.',
        criteria: JSON.stringify({
          type: 'trips',
          value: 1
        })
      },
      {
        name: 'Road Warrior',
        description: 'Complete 10 trips.',
        criteria: JSON.stringify({
          type: 'trips',
          value: 10
        })
      },
      {
        name: 'Explorer',
        description: 'Create a trip with a distance of over 500km.',
        criteria: JSON.stringify({
          type: 'trips',
          value: 500,
          metric: 'distance'
        })
      },
      {
        name: 'Reviewer',
        description: 'Write 5 reviews.',
        criteria: JSON.stringify({
          type: 'reviews',
          value: 5
        })
      },
      {
        name: 'Social Butterfly',
        description: 'Follow 10 users.',
        criteria: JSON.stringify({
          type: 'social',
          value: 10
        })
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Achievements', null, {});
  }
};
