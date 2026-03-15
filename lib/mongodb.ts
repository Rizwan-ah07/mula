import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Define MONGODB_URI in .env.local');
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME ?? 'mula';

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

// Always reuse the same connection — critical for Vercel serverless warm instances
if (!global._mongoClientPromise) {
  global._mongoClientPromise = new MongoClient(uri, {
    maxPoolSize:               10,
    serverSelectionTimeoutMS:  5000,
    socketTimeoutMS:           45000,
  }).connect();
}

export async function getDb(): Promise<Db> {
  const client = await global._mongoClientPromise!;
  return client.db(dbName);
}
