import { Sequelize, DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

// Database connection
const sequelize = new Sequelize('postgres://barbatos:barbatos@127.0.0.1:5432/motortrip_dev', {
  logging: false,
  define: {
    timestamps: true,
    underscored: true
  }
});

// User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  created_at: DataTypes.DATE,
  updated_at: DataTypes.DATE,
  deleted_at: DataTypes.DATE
}, {
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true
});

// Hash password function
async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function seedUsers() {
  try {
    await sequelize.sync();

    // Create test users
    const users = [
      {
        username: 'admin',
        email: 'admin@motortrip.com',
        password_hash: await hashPassword('Admin123!'),
        role: 'admin'
      },
      {
        username: 'user',
        email: 'user@motortrip.com',
        password_hash: await hashPassword('User123!'),
        role: 'user'
      }
    ];

    // Force sync to recreate tables
    await sequelize.sync({ force: true });

    // Create new users
    for (const user of users) {
      await User.create(user);
    }

    console.log('Users seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1);
  }
}

seedUsers();
