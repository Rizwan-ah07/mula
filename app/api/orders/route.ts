import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

// GET /api/orders  — fetch non-completed orders for the KDS
export async function GET() {
  const collection = await getOrdersCollection();
  const orders = await collection
    .find({ status: { $ne: 'completed' } })
    .sort({ createdAt: 1 })
    .toArray();
  return NextResponse.json(orders);
}
