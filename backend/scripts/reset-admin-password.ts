const { default: User } = require('../src/models/user.js');
const { default: sequelize } = require('../src/config/database.js');

async function resetAdminPassword() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Find admin user
    const admin = await User.findOne({ where: { email: 'admin@motortrip.com' } });
    if (!admin) {
      throw new Error('Admin user not found');
    }

    // Generate new password hash
    const newPasswordHash = await User.hashPassword('Admin123!');

    // Update admin's password
    await admin.update({ password_hash: newPasswordHash });

    console.log('Admin password has been reset successfully.');
    
    // Verify the new password works
    const isValid = await User.comparePassword('Admin123!', admin.password_hash);
    console.log('Password verification:', isValid ? 'SUCCESS' : 'FAILED');

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await sequelize.close();
  }
}

resetAdminPassword();
