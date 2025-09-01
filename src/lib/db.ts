// lib/mongoose.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

interface MongooseGlobal extends Global {
  mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  };
}

// Use globalThis for cross-environment compatibility
let cached = (globalThis as unknown as MongooseGlobal).mongoose;

if (!cached) {
  cached = (globalThis as unknown as MongooseGlobal).mongoose = {
    conn: null,
    promise: null,
  };
}

export async function connectToDatabase(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      dbName: "email_tracker"
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
