const bcrypt = require('bcrypt');
const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgres://barbatos:barbatos@127.0.0.1:5432/motortrip_dev'
});

async function resetAdminPassword() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Generate new password hash
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash('Admin123!', salt);

    // Update admin password
    const result = await client.query(
      "UPDATE users SET password_hash = $1 WHERE email = 'admin@motortrip.com' RETURNING *",
      [newPasswordHash]
    );

    if (result.rows.length === 0) {
      console.error('Admin user not found');
    } else {
      console.log('Admin password has been reset successfully');
      
      // Verify the password
      const isValid = await bcrypt.compare('Admin123!', result.rows[0].password_hash);
      console.log('Password verification:', isValid ? 'SUCCESS' : 'FAILED');
    }
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await client.end();
  }
}

resetAdminPassword();
