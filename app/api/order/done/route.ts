import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getOrdersCollection } from '@/models/Order';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const id = body?.id;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'id (string) is required' }, { status: 400 });
    }

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
    }

    const collection = await getOrdersCollection();
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          status: 'waiting_payment',
          updatedAt: new Date(),
          ready_for_payment_at: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Order moved to waiting payment' });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unexpected error' },
      { status: 500 }
    );
  }
}
