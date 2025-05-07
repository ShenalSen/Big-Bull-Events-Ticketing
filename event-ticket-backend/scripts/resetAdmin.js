const mongoose = require('mongoose');
const Admin = require('../models/admin');
require('dotenv').config();

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Delete all existing admins
    await Admin.deleteMany({});
    console.log('Deleted existing admin accounts');

    // Create new admin
    const newAdmin = new Admin({
      username: process.env.ADMIN_INITIAL_USERNAME,
      password: process.env.ADMIN_INITIAL_PASSWORD
    });
    await newAdmin.save();
    console.log('Created new admin account');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit();
  }
}

resetAdmin();