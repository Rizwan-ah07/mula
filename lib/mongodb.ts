import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? 'mula';

if (!uri) {
  throw new Error('Missing MONGODB_URI environment variable. Define it in your .env file.');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

if (!globalForMongo._mongoClientPromise) {
  const connectStart = Date.now();
  // create client and connect, with logging for Vercel logs to inspect timings
  globalForMongo._mongoClientPromise = new MongoClient(uri, {
    maxPoolSize:              10,
    // fail faster in serverless environments so timeouts are observed in logs
    connectTimeoutMS:        10000,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS:          45000,
  }).connect()
    .then((client) => {
      console.log(`[mongo] connected in ${Date.now() - connectStart}ms`);
      return client;
    })
    .catch((err) => {
      console.error(`[mongo] connect failed after ${Date.now() - connectStart}ms`, err);
      throw err;
    });
}

export const clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const start = Date.now();
  const client = await clientPromise;
  console.log(`[mongo] getDb awaited ${Date.now() - start}ms`);
  return client.db(dbName);
}
