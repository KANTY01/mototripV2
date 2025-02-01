'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('Users', 
      { role: 'premium' },
      { 
        email: {
          [Sequelize.Op.like]: 'premium%@example.com'
        }
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('Users',
      { role: 'user' },
      {
        email: {
          [Sequelize.Op.like]: 'premium%@example.com'
        }
      }
    );
  }
};