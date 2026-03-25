import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface IMenuItemSize {
  label: string;   // 'Medium' | 'Large'
  price: number;
}

export interface IMenuItem {
  _id?:        ObjectId;
  name:        string;
  price:       number;   // base / minimum price
  description: { nl: string; en: string; fr: string };
  category:    'poke' | 'puree' | 'sides' | 'drinks';
  image:       string;
  available:   boolean;
  ingredients: string[];
  sizes?:      IMenuItemSize[];
  createdAt?:  Date;
  updatedAt?:  Date;
}

// ── Collection getter ─────────────────────────────────────────────────────────

export async function getMenuItemsCollection(): Promise<Collection<IMenuItem>> {
  const db = await getDb();
  return db.collection<IMenuItem>('menuitems');
}
