import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection('bowlOptions');
    
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
    const { category, item, action } = body; // action: 'add' or 'remove'
    
    if (!category || !item) {
      return NextResponse.json(
        { error: 'Category and item are required' },
        { status: 400 }
      );
    }
    
    const db = await getDb();
    const collection = db.collection('bowlOptions');
    
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
