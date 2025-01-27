'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" 
      ADD VALUE 'support' AFTER 'admin'
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TYPE "enum_users_role" 
      DROP VALUE 'support'
    `);
  }
};
