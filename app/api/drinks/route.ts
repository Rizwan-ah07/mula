import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { getDrinksCollection } from '@/models/Drink';
import { getMenuItemsCollection } from '@/models/MenuItem';

export async function GET() {
  const collection = await getDrinksCollection();
  let drinks = await collection.find({}).toArray();

  if (drinks.length === 0) {
    const defaultDrinks = [
      'Cola',
      'Cola Zero',
      'Ice Tea',
      'Water',
      'Bruisend water',
      'Fanta',
      'Oasis',
      'Ice Tea Peach'
    ];
    const now = new Date();
    await collection.insertMany(
      defaultDrinks.map((name) => ({ name, available: true, createdAt: now, updatedAt: now }))
    );
    drinks = await collection.find({}).toArray();
  }

  // Auto-migration to enable hasDrinkOptions for existing generic drinks
  try {
    const menuCol = await getMenuItemsCollection();
    await menuCol.updateMany(
      { category: 'drinks', name: { $in: ['Frisdrank', 'Water'] }, hasDrinkOptions: { $exists: false } },
      { $set: { hasDrinkOptions: true } }
    );
  } catch (err) {
    console.error('Error migrating existing drinks:', err);
  }

  return NextResponse.json(drinks);
}

export async function POST(req: NextRequest) {
  const collection = await getDrinksCollection();
  const body = await req.json();
  const now = new Date();
  const result = await collection.insertOne({
    name: body.name,
    available: true,
    createdAt: now,
    updatedAt: now
  });
  const drink = await collection.findOne({ _id: result.insertedId });
  revalidateTag('drinks');
  return NextResponse.json(drink, { status: 201 });
}
