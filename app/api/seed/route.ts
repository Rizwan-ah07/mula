// GET /api/seed  — seeds demo menu items (dev only)
import { NextResponse } from 'next/server';
import { getMenuItemsCollection, IMenuItem } from '@/models/MenuItem';

const SEED_ITEMS: Omit<IMenuItem, '_id' | 'available' | 'createdAt' | 'updatedAt'>[] = [
  // ── Poke Bowls ─────────────────────────────────────────────────────────────
  {
    name: 'Classic Ahi Poke',
    price: 14.5,
    description: 'Fresh ahi tuna, soy sauce, sesame oil, green onion, seaweed.',
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    ingredients: ['Ahi Tuna', 'Soy Sauce', 'Sesame Oil', 'Green Onion', 'Seaweed'],
  },
  {
    name: 'Spicy Salmon Bowl',
    price: 13.5,
    description: 'Atlantic salmon, spicy mayo, cucumber, avocado, tobiko.',
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    ingredients: ['Salmon', 'Spicy Mayo', 'Cucumber', 'Avocado', 'Tobiko'],
  },
  {
    name: 'Tropical Shrimp Bowl',
    price: 12.0,
    description: 'Tempura shrimp, mango salsa, coconut rice, lime dressing.',
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
    ingredients: ['Tempura Shrimp', 'Mango', 'Coconut Rice', 'Lime'],
  },
  // ── Puree Bowls ────────────────────────────────────────────────────────────
  {
    name: 'Crispy Tender Bowl',
    price: 11.0,
    description: 'Zachte aardappelpuree met crispy tenders, peterselie, gebakken uitjes en onze speciale saus.',
    category: 'puree',
    image: '',
    ingredients: ['Aardappelpuree', 'Crispy Tenders', 'Peterselie', 'Gebakken Uitjes', 'Speciale Saus'],
    sizes: [
      { label: 'Medium', price: 11.0 },
      { label: 'Large',  price: 13.5 },
    ],
  },
  {
    name: 'Sweet Tender Bowl',
    price: 11.0,
    description: 'Zachte aardappelpuree met zoete crispy tenders, peterselie, gebakken uitjes en onze speciale saus.',
    category: 'puree',
    image: '',
    ingredients: ['Aardappelpuree', 'Zoete Crispy Tenders', 'Peterselie', 'Gebakken Uitjes', 'Speciale Saus'],
    sizes: [
      { label: 'Medium', price: 11.0 },
      { label: 'Large',  price: 13.5 },
    ],
  },
  {
    name: "Scampi Bowl",
    price: 11.0,
    description: "Zachte aardappelpuree met scampi's, peterselie, gebakken uitjes en onze speciale saus.",
    category: 'puree',
    image: '',
    ingredients: ['Aardappelpuree', "Scampi's", 'Peterselie', 'Gebakken Uitjes', 'Speciale Saus'],
    sizes: [
      { label: 'Medium', price: 11.0 },
      { label: 'Large',  price: 13.5 },
    ],
  },
  // ── Sides ──────────────────────────────────────────────────────────────────
  {
    name: 'Kroepoek',
    price: 2.0,
    description: 'Luchtige rijstkroepoek, knapperig en lichtgezouten.',
    category: 'sides',
    image: '',
    ingredients: ['Garnaalkroepoek'],
  },
  {
    name: 'Nachos',
    price: 2.0,
    description: 'Knapperige tortillachips, geserveerd met een dipsaus.',
    category: 'sides',
    image: '',
    ingredients: ['Tortilla', 'Dipsaus'],
  },
  {
    name: 'Mini Loempia\'s',
    price: 3.0,
    description: 'Knapperige mini loempia\'s met een smakelijke vulling.',
    category: 'sides',
    image: '',
    ingredients: ['Rijstpapier', 'Groenten', 'Vlees'],
  },
  {
    name: 'Mini Loempia\'s Hot',
    price: 3.0,
    description: 'Pittige mini loempia\'s met een vurige chlivulling.',
    category: 'sides',
    image: '',
    ingredients: ['Rijstpapier', 'Chili', 'Groenten'],
  },
  {
    name: 'Crispy Chicken Bites',
    price: 6.0,
    description: 'Sappige kipstukjes met een knapperig krokant korstje.',
    category: 'sides',
    image: '',
    ingredients: ['Kip', 'Paneermeel', 'Kruiden'],
  },
  {
    name: 'Frisdrank',
    price: 2.5,
    description: 'Keuze uit onze koude frisdranken.',
    category: 'drinks',
    image: '',
    ingredients: [],
  },
  {
    name: 'Water',
    price: 2.0,
    description: 'Still of bruisend mineraalwater.',
    category: 'drinks',
    image: '',
    ingredients: [],
  },
  // ── Smoothies ──────────────────────────────────────────────────────────────
  {
    name: 'Hawaiian Smoothie',
    price: 5.0,
    description: 'Een tropische mix van verse fruitingrediënten.',
    category: 'drinks',
    image: '',
    ingredients: ['Ananas', 'Mango', 'Kokosmelk'],
  },
  {
    name: 'Smoothie à la Mula',
    price: 5.0,
    description: 'Onze eigen huissmoothie met verrassende seizoensingrediënten.',
    category: 'drinks',
    image: '',
    ingredients: ['Huisingrediënten'],
  },
  {
    name: 'Tropical Smoothie',
    price: 5.0,
    description: 'Een exotische tropische smoothie boordevol vers fruit.',
    category: 'drinks',
    image: '',
    ingredients: ['Passievrucht', 'Mango', 'Banaan'],
  },
];

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Seed disabled in production' }, { status: 403 });
  }

  const collection = await getMenuItemsCollection();
  await collection.deleteMany({});
  const result = await collection.insertMany(
    SEED_ITEMS.map((item) => ({ ...item, available: true, createdAt: new Date(), updatedAt: new Date() }))
  );
  return NextResponse.json({ seeded: result.insertedCount });
}
