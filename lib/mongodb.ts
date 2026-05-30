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
  globalForMongo._mongoClientPromise = new MongoClient(uri, {
    maxPoolSize:              10,
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS:          45000,
  }).connect();
}

export const clientPromise = globalForMongo._mongoClientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
