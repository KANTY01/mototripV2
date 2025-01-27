import User from '../models/user.js';
import sequelize from '../config/database.js';

async function seedUsers() {
  try {
    await sequelize.sync();

    // Create test users
    const users: Array<{
      username: string;
      email: string;
      password_hash: string;
      role: 'user' | 'admin';
    }> = [
      {
        username: 'admin',
        email: 'admin@motortrip.com',
        password_hash: await User.hashPassword('Admin123!'),
        role: 'admin'
      },
      {
        username: 'moderator',
        email: 'moderator@motortrip.com',
        password_hash: await User.hashPassword('Mod123!'),
        role: 'admin'
      },
      {
        username: 'support',
        email: 'support@motortrip.com',
        password_hash: await User.hashPassword('Support123!'),
        role: 'admin'
      },
      {
        username: 'user',
        email: 'user@motortrip.com',
        password_hash: await User.hashPassword('User123!'),
        role: 'user'
      }
    ];

    // Clear existing users
    await User.destroy({ where: {} });

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
