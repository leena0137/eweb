/**
 * Admin User Creator Script
 * Run: node createAdmin.js
 * This will create an admin user or promote an existing user to admin.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const ADMIN_EMAIL = 'admin@indiacart24.com';
const ADMIN_PASSWORD = 'Admin@1234';
const ADMIN_NAME = 'Admin';

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    let user = await User.findOne({ email: ADMIN_EMAIL });

    if (user) {
      // Promote to admin if not already
      user.role = 'admin';
      await user.save();
      console.log(`✅ User "${ADMIN_EMAIL}" has been promoted to ADMIN.`);
    } else {
      // Create new admin user
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

      user = await User.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
      });
      console.log(`✅ New admin user created!`);
    }

    console.log('\n========================================');
    console.log('🔐 Admin Login Credentials:');
    console.log(`   Email   : ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
    console.log('========================================');
    console.log('\n👉 Go to your site → Login with above credentials');
    console.log('👉 Then visit: /admin  (or click "Admin Panel" in the user menu)');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
