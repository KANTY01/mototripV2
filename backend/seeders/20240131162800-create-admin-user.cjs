'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const existingAdmin = await queryInterface.sequelize.query(
      'SELECT id FROM Users WHERE email = "admin@motorcycletrip.com"',
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!existingAdmin || existingAdmin.length === 0) {
      await queryInterface.bulkInsert('Users', [{
        email: 'admin@motorcycletrip.com',
        password: hashedPassword,
        username: 'admin',
        role: 'admin',
        created_at: new Date().toISOString()
      }], {});
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@motorcycletrip.com' }, {});
  }
};
