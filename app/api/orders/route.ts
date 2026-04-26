import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

// GET /api/orders  — fetch active orders for the KDS
export async function GET() {
  const collection = await getOrdersCollection();
  const orders = await collection
    .find({ status: { $nin: ['completed', 'cancelled'] } })
    .sort({ createdAt: 1 })
    .toArray();

  return NextResponse.json(
    orders.map((order) => ({
      ...order,
      _id: order._id.toString(),
    }))
  );
}
