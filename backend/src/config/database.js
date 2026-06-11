import dns from 'node:dns';
import mongoose from 'mongoose';

const maskMongoUri = (uri = '') => uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:<password>@');

const configureSrvDnsFallback = (mongoURI) => {
  if (!mongoURI?.startsWith('mongodb+srv://')) return;

  const dnsServers = (process.env.MONGODB_DNS_SERVERS || '8.8.8.8,1.1.1.1')
    .split(',')
    .map(server => server.trim())
    .filter(Boolean);

  if (dnsServers.length > 0) {
    dns.setServers(dnsServers);
  }
};

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI
      ? process.env.MONGODB_URI
      : process.env.MONGODB_LOCAL;

    if (!mongoURI) {
      throw new Error('MONGODB_URI or MONGODB_LOCAL must be configured');
    }

    configureSrvDnsFallback(mongoURI);

    console.log(`[v0] Connecting to MongoDB: ${maskMongoUri(mongoURI)}`);
    
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 20000 });
    console.log(`[v0] MongoDB connected successfully (${mongoose.connection.name})`);
  } catch (error) {
    console.error('[v0] MongoDB connection failed:', error.message);
    process.exit(1);
  }
};
