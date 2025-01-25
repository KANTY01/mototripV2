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
import type { BookingInstance } from './booking.js';
import User from './user.js';
import Booking from './booking.js';

export interface TripAttributes extends InferAttributes<Trip> {
  id: CreationOptional<number>;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  price: number;
  capacity: number;
  seats_available: number;
  status: 'pending' | 'active' | 'rejected' | 'completed';
  created_by: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
  deletedAt: CreationOptional<Date> | null;
}

interface TripCreationAttributes extends InferCreationAttributes<Trip> {}

class Trip extends Model<TripAttributes, TripCreationAttributes> {
  declare id: CreationOptional<number>;
  declare title: string;
  declare description: string;
  declare start_date: Date;
  declare end_date: Date;
  declare price: number;
  declare capacity: number;
  declare seats_available: number;
  declare status: 'pending' | 'active' | 'rejected' | 'completed';
  declare created_by: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: CreationOptional<Date> | null;

  // Associations
  declare getOrganizer: () => Promise<UserInstance>;
  declare getBookings: () => Promise<BookingInstance[]>;
  declare organizer?: NonAttribute<UserInstance>;
  declare bookings?: NonAttribute<BookingInstance[]>;

  static associate(models: { User: typeof User; Booking: typeof Booking }): void {
    Trip.belongsTo(models.User, {
      foreignKey: 'created_by',
      as: 'organizer'
    });
    Trip.hasMany(models.Booking, {
      foreignKey: 'trip_id',
      as: 'bookings'
    });
  }
}

Trip.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true,
      isAfter: new Date().toISOString().split('T')[0]
    }
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      isDate: true
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  seats_available: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'active', 'rejected', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
  deletedAt: DataTypes.DATE
}, {
  sequelize,
  modelName: 'Trip',
  tableName: 'trips',
  timestamps: true,
  paranoid: true,
  underscored: true
});

export type TripInstance = Trip;
export default Trip;
