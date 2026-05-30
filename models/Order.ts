import { Collection, ObjectId } from 'mongodb';
import { getDb } from '@/lib/mongodb';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface IOrderItem {
  menuItemId: string;
  name:       string;   // includes size, e.g. "Crispy Tender Bowl (Large)"
  price:      number;
  quantity:   number;
  itemNotes:  string;   // customization summary for kitchen
}

export interface IOrder {
  _id?:        ObjectId;
  serviceType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber: number | null;
  items:       IOrderItem[];
  notes:       string;
  status:      'pending' | 'preparing' | 'waiting_payment' | 'completed' | 'cancelled';
  customerName?: string;
  phoneNumber?: string;
  deliveryStreet?: string;
  deliveryHouseNumber?: string;
  deliveryPostalCode?: string;
  deliveryCity?: string;
  deliveryAddress?: string;
  deliveryDistanceKm?: number | null;
  paymentMethod?: 'cash';
  total:       number;
  createdAt?:  Date;
  updatedAt?:  Date;
}

// ── Collection getter ─────────────────────────────────────────────────────────

export async function getOrdersCollection(): Promise<Collection<IOrder>> {
  const db = await getDb();
  return db.collection<IOrder>('orders');
}
