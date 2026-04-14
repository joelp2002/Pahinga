import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection to:', uri.replace(/:[^:]+@/, ':***@'));

  try {
    await mongoose.connect(uri);
    console.log('✅ SUCCESS: Connected to MongoDB!');
    await mongoose.connection.close();
    console.log('Connection closed.');
  } catch (error) {
    console.error('❌ FAILED: Could not connect to MongoDB');
    console.error('Error:', error.message);
    process.exit(1);
  }
};

testConnection();