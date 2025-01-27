import { 
  Model,
  DataTypes,
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
  NonAttribute
} from 'sequelize';
import sequelize from '../config/database.js';
import type { UserInstance } from './user.js';
import type { TripInstance } from './trip.js';
import User from './user.js';
import Trip from './trip.js';

interface BookingAttributes extends InferAttributes<Booking> {
  id: CreationOptional<number>;
  status: 'pending' | 'confirmed' | 'cancelled';
  user_id: number;
  trip_id: number;
  seats_requested: number;
  cancellation_reason?: string | null;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt: CreationOptional<Date> | null;
}

interface BookingCreationAttributes extends InferCreationAttributes<Booking> {}

class Booking extends Model<BookingAttributes, BookingCreationAttributes> {
  declare id: CreationOptional<number>;
  declare status: 'pending' | 'confirmed' | 'cancelled';
  declare user_id: number;
  declare trip_id: number;
  declare seats_requested: number;
  declare cancellation_reason?: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;

  // Associations
  declare getUser: () => Promise<UserInstance>;
  declare getTrip: () => Promise<TripInstance>;
  declare user?: NonAttribute<UserInstance>;
  declare trip?: NonAttribute<TripInstance>;

  static associate(models: { User: typeof User; Trip: typeof Trip }): void {
    Booking.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    Booking.belongsTo(models.Trip, {
      foreignKey: 'trip_id',
      as: 'trip'
    });
  }
}

Booking.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending',
    validate: {
      isIn: [['pending', 'confirmed', 'cancelled']]
    }
  },
  seats_requested: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  cancellation_reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Booking',
  tableName: 'bookings',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export type BookingInstance = Booking;
export { Booking };
export default Booking;
