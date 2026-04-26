import { NextRequest, NextResponse } from 'next/server';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';

type IncomingItem = string | {
  name?: string;
  price?: number;
  quantity?: number;
  [key: string]: unknown;
};

function normalizeItems(items: IncomingItem[]) {
  return items.map((item, index) => {
    if (typeof item === 'string') {
      return {
        menuItemId: `manual-${index}`,
        name: item,
        price: 0,
        quantity: 1,
        itemNotes: '',
      };
    }

    return {
      menuItemId: String(item.menuItemId ?? `manual-${index}`),
      name: String(item.name ?? 'Item'),
      price: Number(item.price ?? 0),
      quantity: Number(item.quantity ?? 1),
      itemNotes: String(item.itemNotes ?? ''),
    };
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const tableNumber = Number(body.table_number ?? body.tableNumber);
    const items = Array.isArray(body.items) ? normalizeItems(body.items) : [];

    if (!tableNumber || items.length === 0) {
      return NextResponse.json(
        { error: 'table_number and non-empty items array are required' },
        { status: 400 }
      );
    }

    const collection = await getOrdersCollection();
    const now = new Date();
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = {
      tableNumber,
      items,
      notes: '',
      status: 'pending' as const,
      total,
      createdAt: now,
      updatedAt: now,
      table_number: tableNumber,
      created_at: now,
    };

    const result = await collection.insertOne(order);

    return NextResponse.json(
      {
        message: 'Order created',
        order: {
          ...order,
          _id: result.insertedId.toString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const collection = await getOrdersCollection();
    const orders = await collection
      .find({ status: 'pending' })
      .sort({ createdAt: 1 })
      .toArray();

    return NextResponse.json(
      orders.map((order) => ({
        ...order,
        _id: order._id.toString(),
      }))
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}
