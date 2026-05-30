import { NextRequest, NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';

function escapeCsv(value: string | number): string {
  const text = String(value ?? '');
  if (text.includes(',') || text.includes('"') || text.includes('\n')) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function parseDateInput(value: string | null): Date | null {
  if (!value) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function toDateInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function GET(req: NextRequest) {
  const fromParam = req.nextUrl.searchParams.get('from');
  const toParam = req.nextUrl.searchParams.get('to');

  const now = new Date();
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const fromDate = parseDateInput(fromParam) ?? defaultFrom;
  const toDateStart = parseDateInput(toParam) ?? fromDate;

  if (fromDate > toDateStart) {
    return NextResponse.json(
      { error: 'Invalid range: from must be before or equal to to' },
      { status: 400 }
    );
  }

  const toDateExclusive = new Date(toDateStart);
  toDateExclusive.setDate(toDateExclusive.getDate() + 1);

  const collection = await getOrdersCollection();
  const orders = await collection
    .find({
      status: { $in: ['completed', 'cancelled'] },
      createdAt: {
        $gte: fromDate,
        $lt: toDateExclusive,
      },
    })
    .sort({ updatedAt: -1, createdAt: -1 })
    .toArray();

  const header = ['Time', 'Order ID', 'Type', 'Name', 'Contact', 'Street', 'Number', 'Postal Code', 'City', 'Status', 'Order Details', 'Total EUR'];
  const rows = orders.map((order) => {
    const orderTime = new Date(order.updatedAt ?? order.createdAt ?? new Date()).toISOString();
    const details = order.items
      .map((item) => `${item.quantity}x ${item.name}`)
      .join(' | ');
    const type = order.serviceType === 'delivery'
      ? 'Levering'
      : order.serviceType === 'takeaway'
      ? 'Afhaal'
      : `T${order.tableNumber}`;
    const name = order.serviceType === 'delivery' || order.serviceType === 'takeaway'
      ? (order.customerName ?? '')
      : '';
    const contact = order.serviceType === 'delivery' || order.serviceType === 'takeaway'
      ? (order.phoneNumber ?? '')
      : '';
    const street = order.serviceType === 'delivery' ? (order.deliveryStreet ?? '') : '';
    const houseNumber = order.serviceType === 'delivery' ? (order.deliveryHouseNumber ?? '') : '';
    const postalCode = order.serviceType === 'delivery' ? (order.deliveryPostalCode ?? '') : '';
    const city = order.serviceType === 'delivery' ? (order.deliveryCity ?? '') : '';
    const legacyAddress = order.serviceType === 'delivery' && !street && !houseNumber && !postalCode && !city
      ? (order.deliveryAddress ?? '')
      : '';

    return [
      orderTime,
      order._id.toString(),
      type,
      name,
      contact,
      street || legacyAddress,
      houseNumber,
      postalCode,
      city,
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
      'Content-Disposition': `attachment; filename="orders-${toDateInput(fromDate)}-to-${toDateInput(toDateStart)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
