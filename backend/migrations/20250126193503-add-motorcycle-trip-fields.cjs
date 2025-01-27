'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('trips', 'route_type', {
      type: Sequelize.ENUM('highway', 'offroad', 'mixed'),
      allowNull: false,
      defaultValue: 'highway'
    });

    await queryInterface.addColumn('trips', 'required_experience', {
      type: Sequelize.ENUM('beginner', 'intermediate', 'advanced'),
      allowNull: false,
      defaultValue: 'beginner'
    });

    await queryInterface.addColumn('trips', 'motorcycle_types', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('trips', 'route_highlights', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('trips', 'route_map_url', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('trips', 'required_gear', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('trips', 'distance_km', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    await queryInterface.addColumn('trips', 'estimated_duration', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '0h'
    });

    await queryInterface.addColumn('trips', 'terrain_difficulty', {
      type: Sequelize.ENUM('easy', 'moderate', 'challenging'),
      allowNull: false,
      defaultValue: 'easy'
    });

    await queryInterface.addColumn('trips', 'rest_stops', {
      type: Sequelize.JSON,
      allowNull: false,
      defaultValue: []
    });

    await queryInterface.addColumn('trips', 'weather_info', {
      type: Sequelize.JSON,
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('trips', 'route_type');
    await queryInterface.removeColumn('trips', 'required_experience');
    await queryInterface.removeColumn('trips', 'motorcycle_types');
    await queryInterface.removeColumn('trips', 'route_highlights');
    await queryInterface.removeColumn('trips', 'route_map_url');
    await queryInterface.removeColumn('trips', 'required_gear');
    await queryInterface.removeColumn('trips', 'distance_km');
    await queryInterface.removeColumn('trips', 'estimated_duration');
    await queryInterface.removeColumn('trips', 'terrain_difficulty');
    await queryInterface.removeColumn('trips', 'rest_stops');
    await queryInterface.removeColumn('trips', 'weather_info');
  }
};
