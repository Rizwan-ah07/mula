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

export type CheckoutInfo = {
  serviceType: 'dine_in' | 'takeaway';
  tableNumber?: number | null;
  customerName?: string;
  phoneNumber?: string;
  paymentMethod: 'cash';
};

// ── Submit a new order ────────────────────────────────────────────────────────

export async function submitOrder(payload: {
  checkoutInfo: CheckoutInfo;
  items:       CartItem[];
  notes?:      string;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const { checkoutInfo } = payload;

  if (payload.items.length === 0) {
    return { success: false, error: 'Invalid order payload.' };
  }

  if (checkoutInfo.serviceType === 'dine_in' && (!checkoutInfo.tableNumber || checkoutInfo.tableNumber <= 0)) {
    return { success: false, error: 'Table number is required for dine in.' };
  }

  if (checkoutInfo.serviceType === 'takeaway') {
    if (!checkoutInfo.customerName?.trim()) {
      return { success: false, error: 'Name is required for takeaway.' };
    }
    if (!checkoutInfo.phoneNumber?.trim()) {
      return { success: false, error: 'Phone number is required for takeaway.' };
    }
  }

  try {
    const collection = await getOrdersCollection();
    const now        = new Date();
    const total      = payload.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const doc = {
      serviceType: checkoutInfo.serviceType,
      tableNumber: checkoutInfo.serviceType === 'dine_in' ? Number(checkoutInfo.tableNumber) : null,
      customerName: checkoutInfo.customerName?.trim() ?? '',
      phoneNumber: checkoutInfo.phoneNumber?.trim() ?? '',
      paymentMethod: checkoutInfo.paymentMethod,
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
