import mongoose, { Connection, Mongoose } from 'mongoose';

/**
 * Shape of the cached connection object stored on the Node.js global object.
 * This helps us avoid creating multiple connections in development when Next.js
 * reloads modules on every file change.
 */
interface MongooseGlobalCache {
  conn: Connection | null;
  promise: Promise<Mongoose> | null;
}

/**
 * Extend the Node.js global type definition so we can attach a typed
 * `mongoose` property used for caching the connection across hot reloads.
 */
declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseGlobalCache | undefined;
}

/**
 * Use the existing global cache if it exists, otherwise initialize it.
 *
 * `globalThis` is used instead of `global` so this works in both Node and
 * edge-like runtimes that support the standard global object.
 */
const cached: MongooseGlobalCache = globalThis.mongoose ?? {
  conn: null,
  promise: null,
};

if (!globalThis.mongoose) {
  globalThis.mongoose = cached;
}

/**
 * Get the MongoDB connection string from environment variables.
 *
 * You should define `MONGODB_URI` in your environment (e.g. `.env.local`).
 * Throwing here fails fast during startup if it is missing.
 */
const MONGODB_URI: string = process.env.MONGODB_URI ?? '';

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside your environment (e.g. .env.local)',
  );
}

/**
 * Options passed to `mongoose.connect`. Keep this typed and explicit so it is
 * easy to audit in production.
 */
const mongooseOptions: Parameters<typeof mongoose.connect>[1] = {
  // Add any connection options you rely on explicitly, for example:
  // dbName: 'my-database-name',
};

/**
 * Establishes (or reuses) a MongoDB connection using Mongoose.
 *
 * This function is safe to call in server components, API routes, and route
 * handlers. In development, it takes advantage of the global cache to avoid
 * opening multiple connections as Next.js reloads files.
 *
 * If a connection attempt fails, the cached promise is cleared to allow retries
 * on subsequent calls.
 */
export async function connectToDatabase(): Promise<Connection> {
  // If we already have an active connection, reuse it.
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection attempt is already in progress, await it.
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, mongooseOptions);
  }

  try {
    const mongooseInstance: Mongoose = await cached.promise;

    // Store the resolved connection for future calls.
    cached.conn = mongooseInstance.connection;

    return cached.conn;
  } catch (error) {
    // Clear the failed promise to allow retries on subsequent calls
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Convenience type for the resolved connection returned by `connectToDatabase`.
 */
export type DatabaseConnection = Awaited<ReturnType<typeof connectToDatabase>>;

export default connectToDatabase;
