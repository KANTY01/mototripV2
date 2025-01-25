import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './user.js';
import Trip from './trip.js';

export interface ReviewAttributes {
  id?: number;
  userId: number;
  tripId: number;
  rating: number;
  comment: string;
  deletedAt?: Date | null;
}

class Review extends Model<ReviewAttributes> implements ReviewAttributes {
  public id!: number;
  public userId!: number;
  public tripId!: number;
  public rating!: number;
  public comment!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public deletedAt!: Date | null;
}

Review.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  tripId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Trip,
      key: 'id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'Review',
  tableName: 'reviews',
  paranoid: true,
  timestamps: true
});

// Associations
Review.belongsTo(User, { foreignKey: 'userId' });
Review.belongsTo(Trip, { foreignKey: 'tripId' });

export default Review;
