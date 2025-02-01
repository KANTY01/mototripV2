'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('superadmin123', 10);
    
    await queryInterface.bulkInsert('Users', [{
      email: 'superadmin@motorcycletrip.com',
      password: hashedPassword,
      username: 'superadmin',
      role: 'superadmin',
      experience_level: 'expert',
      created_at: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'superadmin@motorcycletrip.com' });
  }
};