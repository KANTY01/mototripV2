import User from './user.js';
import Trip from './trip.js';
import Booking from './booking.js';
import AuditLog from './auditLog.js';
import sequelize from '../config/database.js';

// Initialize models
const models = {
  User,
  Trip,
  Booking
};

// Run model associations
Object.values(models).forEach((model) => {
  if ('associate' in model && typeof model.associate === 'function') {
    model.associate(models);
  }
});

export { User, Trip, Booking };
export default models;
