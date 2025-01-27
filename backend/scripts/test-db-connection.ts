import sequelize from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

console.log('=== Database Connection Test ===');
console.log('Environment:', process.env.NODE_ENV || 'development');
console.log('Database URL:', process.env.DATABASE_URL);
console.log('Database Host:', process.env.DB_HOST);
console.log('Database Port:', process.env.DB_PORT);
console.log('Database Name:', process.env.DB_NAME);

async function testConnection() {
  try {
    console.log('\nAttempting to authenticate with database...');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');
    
    console.log('\nTesting database sync...');
    await sequelize.sync({ force: false });
    console.log('✅ Database sync successful');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Unable to connect to the database:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Stack Trace:', error.stack);
    process.exit(1);
  }
}

testConnection();
