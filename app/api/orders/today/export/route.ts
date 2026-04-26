import { NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';

function escapeCsv(value: string | number): string {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

export async function GET() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  const collection = await getOrdersCollection();
  const orders = await collection
    .find({
      status: { $in: ['completed', 'cancelled'] },
      createdAt: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();

  const header = ['Time', 'Order ID', 'Table', 'Status', 'Order Details', 'Total EUR'];
  const rows = orders.map((order) => {
    const orderTime = new Date(order.updatedAt ?? order.createdAt ?? new Date()).toISOString();
    const details = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(' | ');

    return [
      orderTime,
      order._id.toString(),
      order.tableNumber,
      order.status,
      details,
      order.total.toFixed(2),
    ];
  });

  const csv = [header, ...rows]
    .map((line) => line.map((value) => escapeCsv(value)).join(','))
    .join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="orders-${todayStart.toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
