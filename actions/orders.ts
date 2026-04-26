'use server';

import { ObjectId } from 'mongodb';
import { getOrdersCollection } from '@/models/Order';

export interface CartItem {
  menuItemId: string;
  name:       string;
  price:      number;
  quantity:   number;
  itemNotes?: string;
}

// ── Submit a new order ────────────────────────────────────────────────────────

export async function submitOrder(payload: {
  tableNumber: number;
  items:       CartItem[];
  notes?:      string;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  if (!payload.tableNumber || payload.items.length === 0) {
    return { success: false, error: 'Invalid order payload.' };
  }

  try {
    const collection = await getOrdersCollection();
    const now        = new Date();
    const total      = payload.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const doc = {
      tableNumber: payload.tableNumber,
      items:       payload.items.map((i) => ({
        menuItemId: i.menuItemId,
        name:       i.name,
        price:      i.price,
        quantity:   i.quantity,
        itemNotes:  i.itemNotes ?? '',
      })),
      notes:       payload.notes ?? '',
      status:      'pending' as const,
      total,
      createdAt:   now,
      updatedAt:   now,
    };

    const result  = await collection.insertOne(doc);
    const orderId = result.insertedId.toString();

    return { success: true, orderId };
  } catch (err) {
    console.error('[submitOrder]', err);
    return { success: false, error: 'Failed to place order.' };
  }
}

// ── Update order status ───────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status:  'pending' | 'preparing' | 'waiting_payment' | 'completed' | 'cancelled',
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!ObjectId.isValid(orderId)) {
      return { success: false, error: 'Invalid order id.' };
    }

    const collection = await getOrdersCollection();

    const setValues: Record<string, unknown> = {
      status,
      updatedAt: new Date(),
    };

    if (status === 'waiting_payment') {
      setValues.readyForPaymentAt = new Date();
    }

    if (status === 'completed') {
      setValues.completedAt = new Date();
    }

    if (status === 'cancelled') {
      setValues.cancelledAt = new Date();
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId) },
      { $set: setValues },
    );

    if (result.matchedCount === 0) return { success: false, error: 'Order not found.' };

    return { success: true };
  } catch (err) {
    console.error('[updateOrderStatus]', err);
    return { success: false, error: 'Failed to update order.' };
  }
}
