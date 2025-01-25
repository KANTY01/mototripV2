import sequelize from '../src/config/database';

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully');
    process.exit(0);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

testConnection();
