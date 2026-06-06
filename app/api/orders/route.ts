import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// GET /api/orders  — fetch active orders for the KDS
export async function GET() {
  const handlerStart = Date.now();
  console.log('[api/orders] handler start');

  const collectionStart = Date.now();
  const collection = await getOrdersCollection();
  console.log(`[api/orders] getOrdersCollection awaited ${Date.now() - collectionStart}ms`);

  const queryStart = Date.now();
  const orders = await collection
    .find({ status: { $nin: ['completed', 'cancelled'] } })
    .sort({ createdAt: 1 })
    .toArray();
  console.log(`[api/orders] query and toArray took ${Date.now() - queryStart}ms`);

  console.log(`[api/orders] handler total ${Date.now() - handlerStart}ms`);

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
