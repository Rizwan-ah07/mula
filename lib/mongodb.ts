import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? 'mula';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. Define it in your .env file.');
}

const options = {
  maxPoolSize: 1, // Reduced for serverless to prevent connection exhaustion on Atlas Free Tier
  connectTimeoutMS: 10000,
  serverSelectionTimeoutMS: 15000,
  socketTimeoutMS: 45000,
};

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
    console.log('[mongo] Created new global client promise (Dev)');
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  // Each serverless function invocation will use this module-scoped promise.
  const client = new MongoClient(uri, options);
  clientPromise = client.connect();
  console.log('[mongo] Created new client promise (Prod)');
}

export { clientPromise };

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
