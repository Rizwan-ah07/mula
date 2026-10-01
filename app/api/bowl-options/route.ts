import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection<any>('bowlOptions');
    
    // Get or create default options
    const defaults = {
      _id: 'default',
      bases: ['Witte Rijst', 'Bruine Rijst', 'Sla', 'Mix (Sla & Rijst)'],
      proteins: ['Crispy Chicken', 'Scampi', 'Zalm'],
      mixIns: [
        'Augurk', 'Ananas', 'Avocado', 'Edamame', 'Fetakaas',
        'Guacamole', 'Kerstomaatjes', 'Komkommer', 'Maïs', 'Mango',
        'Olijven', 'Rode Biet', 'Rode Ui', 'Surimi', 'Wortel', 'Zeewiersalade',
      ],
      dressings: [
        'Pokesaus', 'Sesamdressing', 'Sriracha Mayo',
        'Sushisaus', 'Teriake', 'Wasabi Mayo', 'Zoetzuur',
      ],
      toppings: [
        'Furikake', 'Gebakken Ui', 'Gedroogde Chili',
        'Jalapeños', 'Gember / Lente Ui', "Masago / Nacho's", 'Noten / Sesam-mix',
      ],
      // Surcharge per mix-in (€). Mix-ins not listed here are included in the bowl price.
      mixInPrices: { Mango: 1, Avocado: 1 } as Record<string, number>,
    };

    let options = await collection.findOne({ _id: 'default' });
    if (!options) {
      options = defaults;
      await collection.insertOne(options);
    } else {
      // Ensure missing categories are populated
      const toSet: any = {};
      for (const key of ['bases', 'proteins', 'mixIns', 'dressings', 'toppings']) {
        if (!options[key] || !Array.isArray(options[key]) || options[key].length === 0) {
          toSet[key] = (defaults as any)[key];
        }
      }
      // Only seed prices once; an empty object means the admin cleared them
      if (!options.mixInPrices || typeof options.mixInPrices !== 'object') {
        toSet.mixInPrices = defaults.mixInPrices;
      }
      if (Object.keys(toSet).length > 0) {
        await collection.updateOne({ _id: 'default' }, { $set: toSet });
        options = await collection.findOne({ _id: 'default' });
      }
    }
    
    return NextResponse.json(options);
  } catch (error) {
    console.error('Error fetching bowl options:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bowl options' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { category, item, action, price } = body; // action: 'add' | 'remove' | 'setPrice'

    if (!category || !item) {
      return NextResponse.json(
        { error: 'Category and item are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection<any>('bowlOptions');

    if (action === 'add') {
      await collection.updateOne(
        { _id: 'default' },
        { $addToSet: { [category]: item } }
      );
    } else if (action === 'remove') {
      await collection.updateOne(
        { _id: 'default' },
        { $pull: { [category]: item } }
      );
      if (category === 'mixIns') {
        await setMixInPrice(collection, item, 0);
      }
    } else if (action === 'setPrice') {
      const value = Number(price);
      if (category !== 'mixIns' || !Number.isFinite(value) || value < 0) {
        return NextResponse.json(
          { error: 'A non-negative price for a mix-in is required' },
          { status: 400 }
        );
      }
      await setMixInPrice(collection, item, value);
    }
    
    const updated = await collection.findOne({ _id: 'default' });
    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating bowl options:', error);
    return NextResponse.json(
      { error: 'Failed to update bowl options' },
      { status: 500 }
    );
  }
}

// Rewrites the whole map rather than `$set: { 'mixInPrices.<name>': … }`,
// so mix-in names containing dots or `$` can't turn into nested paths.
async function setMixInPrice(collection: any, item: string, price: number) {
  const doc = await collection.findOne({ _id: 'default' });
  const prices: Record<string, number> = { ...(doc?.mixInPrices ?? {}) };
  if (price > 0) {
    prices[item] = Math.round(price * 100) / 100;
  } else {
    delete prices[item];
  }
  await collection.updateOne({ _id: 'default' }, { $set: { mixInPrices: prices } });
}
