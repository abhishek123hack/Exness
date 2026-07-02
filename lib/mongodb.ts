import mongoose from "mongoose";

type CachedMongo = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalForMongo = globalThis as typeof globalThis & { mongooseCache?: CachedMongo };

const cached = globalForMongo.mongooseCache || { conn: null, promise: null };
globalForMongo.mongooseCache = cached;

export function hasMongoUri() {
  const uri = process.env.MONGODB_URI?.trim();
  return Boolean(uri && (uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://")));
}

export async function connectMongoDB() {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://"))) return null;

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
