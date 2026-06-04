import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
      ? process.env.MONGODB_URI
      : process.env.MONGODB_LOCAL;

    console.log(`[v0] Connecting to MongoDB: ${mongoURI}`);
    
    await mongoose.connect(mongoURI);
    console.log('[v0] MongoDB connected successfully');
  } catch (error) {
    console.error('[v0] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
