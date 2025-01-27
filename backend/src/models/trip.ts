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
  route_type: 'highway' | 'offroad' | 'mixed';
  required_experience: 'beginner' | 'intermediate' | 'advanced';
  motorcycle_types: string[];
  route_highlights: string[];
  route_map_url: string | null;
  required_gear: string[];
  distance_km: number;
  estimated_duration: string;
  terrain_difficulty: 'easy' | 'moderate' | 'challenging';
  rest_stops: string[];
  weather_info: Record<string, unknown> | null;
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
  declare route_type: 'highway' | 'offroad' | 'mixed';
  declare required_experience: 'beginner' | 'intermediate' | 'advanced';
  declare motorcycle_types: string[];
  declare route_highlights: string[];
  declare route_map_url: string | null;
  declare required_gear: string[];
  declare distance_km: number;
  declare estimated_duration: string;
  declare terrain_difficulty: 'easy' | 'moderate' | 'challenging';
  declare rest_stops: string[];
  declare weather_info: Record<string, unknown> | null;
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
  route_type: {
    type: DataTypes.ENUM('highway', 'offroad', 'mixed'),
    allowNull: false,
    defaultValue: 'highway'
  },
  required_experience: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  motorcycle_types: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  route_highlights: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  route_map_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  required_gear: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  distance_km: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  estimated_duration: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '0h'
  },
  terrain_difficulty: {
    type: DataTypes.ENUM('easy', 'moderate', 'challenging'),
    allowNull: false,
    defaultValue: 'easy'
  },
  rest_stops: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  weather_info: {
    type: DataTypes.JSON,
    allowNull: true
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
