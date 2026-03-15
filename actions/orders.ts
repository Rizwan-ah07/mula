'use server';

import { ObjectId } from 'mongodb';
import { getOrdersCollection } from '@/models/Order';
import {
  pusherServer,
  KITCHEN_CHANNEL,
  EVT_NEW_ORDER,
  EVT_ORDER_UPDATED,
} from '@/lib/pusher-server';

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

    await pusherServer.trigger(KITCHEN_CHANNEL, EVT_NEW_ORDER, {
      _id:         orderId,
      tableNumber: doc.tableNumber,
      items:       doc.items,
      notes:       doc.notes,
      status:      doc.status,
      total:       doc.total,
      createdAt:   now.toISOString(),
    });

    return { success: true, orderId };
  } catch (err) {
    console.error('[submitOrder]', err);
    return { success: false, error: 'Failed to place order.' };
  }
}

// ── Update order status ───────────────────────────────────────────────────────

export async function updateOrderStatus(
  orderId: string,
  status:  'pending' | 'preparing' | 'completed',
): Promise<{ success: boolean; error?: string }> {
  try {
    const collection = await getOrdersCollection();

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(orderId) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' },
    );

    if (!result) return { success: false, error: 'Order not found.' };

    await pusherServer.trigger(KITCHEN_CHANNEL, EVT_ORDER_UPDATED, {
      _id: orderId,
      status,
    });

    return { success: true };
  } catch (err) {
    console.error('[updateOrderStatus]', err);
    return { success: false, error: 'Failed to update order.' };
  }
}
