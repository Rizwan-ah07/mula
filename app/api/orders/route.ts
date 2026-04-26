import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    })),
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      },
    }
  );
}
