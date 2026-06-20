import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { revalidateTag } from 'next/cache';
import { getDrinksCollection } from '@/models/Drink';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const collection = await getDrinksCollection();
  const body = await req.json();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: { ...body, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  revalidateTag('drinks');
  return NextResponse.json(result);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const collection = await getDrinksCollection();
  await collection.deleteOne({ _id: new ObjectId(params.id) });
  revalidateTag('drinks');
  return NextResponse.json({ success: true });
}
