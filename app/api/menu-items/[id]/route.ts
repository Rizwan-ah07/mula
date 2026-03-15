import { NextRequest, NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { getMenuItemsCollection } from '@/models/MenuItem';

// PATCH /api/menu-items/[id]  — update a menu item
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const collection = await getMenuItemsCollection();
  const body = await req.json();
  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(params.id) },
    { $set: { ...body, updatedAt: new Date() } },
    { returnDocument: 'after' },
  );
  if (!result) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(result);
}

// DELETE /api/menu-items/[id]
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const collection = await getMenuItemsCollection();
  await collection.deleteOne({ _id: new ObjectId(params.id) });
  return NextResponse.json({ success: true });
}
