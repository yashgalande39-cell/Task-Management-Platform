import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow';
  
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB connection failed: ${error.message}`);
    console.warn('   Running in DEMO mode — data will not persist.');
    console.warn('   To use a real database, set MONGO_URI in backend/.env');
    // Do NOT exit — let the server run; routes will handle disconnected state gracefully
  }
};

export default connectDB;
export const getConnectionStatus = () => isConnected;
