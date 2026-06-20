import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

export interface IDrink {
  _id?:        ObjectId;
  name:        string;
  available:   boolean;
  createdAt?:  Date;
  updatedAt?:  Date;
}

export async function getDrinksCollection(): Promise<Collection<IDrink>> {
  const db = await getDb();
  return db.collection<IDrink>('drinks');
}
