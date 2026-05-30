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
  serviceType: 'dine_in' | 'takeaway' | 'delivery';
  tableNumber?: number | null;
  customerName?: string;
  phoneNumber?: string;
  deliveryAddress?: string;
  paymentMethod: 'cash';
};

const DELIVERY_ORIGIN = { lat: 51.2163, lon: 4.4429 };
const DELIVERY_MAX_KM = 15;
const DELIVERY_MIN_TOTAL = 15;

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

async function geocodeAddress(address: string): Promise<{ lat: number; lon: number } | null> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  url.searchParams.set('format', 'json');
  url.searchParams.set('limit', '1');
  url.searchParams.set('q', address);

  const response = await fetch(url.toString(), {
    headers: {
      'User-Agent': 'mula-app/1.0',
    },
    cache: 'no-store',
  });

  if (!response.ok) return null;

  const data = (await response.json()) as Array<{ lat: string; lon: string }>;
  if (!data[0]) return null;

  const lat = Number(data[0].lat);
  const lon = Number(data[0].lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) return null;

  return { lat, lon };
}

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

  if (checkoutInfo.serviceType === 'takeaway' || checkoutInfo.serviceType === 'delivery') {
    if (!checkoutInfo.customerName?.trim()) {
      return { success: false, error: 'Name is required.' };
    }
    if (!checkoutInfo.phoneNumber?.trim()) {
      return { success: false, error: 'Phone number is required.' };
    }
  }

  if (checkoutInfo.serviceType === 'delivery' && !checkoutInfo.deliveryAddress?.trim()) {
    return { success: false, error: 'Address is required for delivery.' };
  }

  try {
    const collection = await getOrdersCollection();
    const now        = new Date();
    const total      = payload.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    let deliveryDistanceKm: number | null = null;

    if (checkoutInfo.serviceType === 'delivery') {
      if (total < DELIVERY_MIN_TOTAL) {
        return { success: false, error: `Minimum order for delivery is €${DELIVERY_MIN_TOTAL}.` };
      }

      const coords = await geocodeAddress(checkoutInfo.deliveryAddress ?? '');
      if (!coords) {
        return { success: false, error: 'Unable to locate delivery address.' };
      }

      const distance = haversineKm(DELIVERY_ORIGIN, coords);
      if (distance > DELIVERY_MAX_KM) {
        return { success: false, error: 'Delivery is only available within 15 km of Statieslei 25.' };
      }

      deliveryDistanceKm = Math.round(distance * 10) / 10;
    }

    const doc = {
      serviceType: checkoutInfo.serviceType,
      tableNumber: checkoutInfo.serviceType === 'dine_in' ? Number(checkoutInfo.tableNumber) : null,
      customerName: checkoutInfo.customerName?.trim() ?? '',
      phoneNumber: checkoutInfo.phoneNumber?.trim() ?? '',
      deliveryAddress: checkoutInfo.deliveryAddress?.trim() ?? '',
      deliveryDistanceKm,
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
