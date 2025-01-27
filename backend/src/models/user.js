import bcrypt from 'bcryptjs';
import { Model } from 'sequelize';

/** 
 * @typedef {Object} UserAttributes
 * @property {number} id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {string} password
 * @property {string} phoneNumber
 * @property {'driver'|'rider'|'admin'} role
 */

/**
 * @typedef {Model & UserAttributes} UserModel
 */

export default (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: [3, 255]
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_hash: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    token_expiry: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      defaultValue: 'user'
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if (user.password_hash) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password_hash')) {
          const salt = await bcrypt.genSalt(10);
          user.password_hash = await bcrypt.hash(user.password_hash, salt);
        }
      }
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Trip, {
      foreignKey: 'created_by',
      as: 'trips'
    });
    User.hasMany(models.Booking, {
      foreignKey: 'user_id',
      as: 'bookings'
    });
    User.hasMany(models.Review, {
      foreignKey: 'user_id',
      as: 'reviews'
    });
  };

  return User;
};
