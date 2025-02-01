'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const adminUser = await queryInterface.sequelize.query(
      `SELECT id FROM Users WHERE email = 'admin@motorcycletrip.com'`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    if (!adminUser || adminUser.length === 0) {
      throw new Error('Admin user not found');
    }

    const adminId = adminUser[0].id;

    await queryInterface.bulkInsert('Trips', [
      {
        title: 'Mountain Adventure',
        description: 'A thrilling ride through mountain passes',
        start_date: new Date('2024-03-01'),
        end_date: new Date('2024-03-05'),
        difficulty: 'medium',
        distance: 500,
        created_by: adminId,
        is_premium: false,
        created_at: new Date()
      },
      {
        title: 'Coastal Journey',
        description: 'Beautiful coastal roads with ocean views',
        start_date: new Date('2024-04-01'),
        end_date: new Date('2024-04-03'),
        difficulty: 'easy',
        distance: 300,
        created_by: adminId,
        is_premium: false,
        created_at: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Trips', null, {});
  }
};