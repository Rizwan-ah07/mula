import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? 'mula';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. Define it in your .env file.');
}

const options = {
  maxPoolSize: 10, // Increased to allow concurrent operations within the same warm lambda
  connectTimeoutMS: 30000, // Increased for better resilience
  serverSelectionTimeoutMS: 30000, // Increased for better resilience
  socketTimeoutMS: 45000,
  family: 4, // Force IPv4 to prevent connectivity issues in some serverless environments
};

// Use a global variable to preserve the MongoClient promise across module reloads
// caused by HMR in development and across warm lambda invocations in production.
const globalWithMongo = global as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri, options);
  globalWithMongo._mongoClientPromise = client.connect()
    .then((client) => {
      console.log('[mongo] Successfully connected to MongoDB');
      return client;
    })
    .catch((err) => {
      console.error('[mongo] Failed to connect to MongoDB:', err);
      throw err;
    });
}

const clientPromise = globalWithMongo._mongoClientPromise;

export { clientPromise };

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
