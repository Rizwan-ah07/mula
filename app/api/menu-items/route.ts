import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getMenuItemsCollection } from '@/models/MenuItem';

// GET /api/menu-items  — list all available items
export async function GET() {
  const collection = await getMenuItemsCollection();
  const items = await collection.find({ available: true }).toArray();
  return NextResponse.json(items);
}

// POST /api/menu-items — create a new item (admin)
export async function POST(req: NextRequest) {
  const collection = await getMenuItemsCollection();
  const body = await req.json();
  const now = new Date();
  const result = await collection.insertOne({ ...body, available: true, createdAt: now, updatedAt: now });
  const item = await collection.findOne({ _id: result.insertedId });
  revalidateTag('menu-items');
  return NextResponse.json(item, { status: 201 });
}
