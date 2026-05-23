const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/Admin');

const connectDB = require('./config/db');

const seed = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

   

    // Create admin
    const admin = await Admin.create({
      email: 'binit@gmail.com',
      password: 'binit8570',
      name: 'Admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('Admin email:', admin.email);

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();