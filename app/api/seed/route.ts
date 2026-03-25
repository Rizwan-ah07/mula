// GET /api/seed  — seeds demo menu items (dev only)
import { NextResponse } from 'next/server';
import { getMenuItemsCollection, IMenuItem } from '@/models/MenuItem';

const SEED_ITEMS: Omit<IMenuItem, '_id' | 'available' | 'createdAt' | 'updatedAt'>[] = [
  // ── Poke Bowls ─────────────────────────────────────────────────────────────
  {
    name: 'Classic Ahi Poke',
    price: 14.5,
    description: {
      nl: 'Verse ahi tonijn, sojasaus, sesamolie, groene ui, zeewier.',
      en: 'Fresh ahi tuna, soy sauce, sesame oil, green onion, seaweed.',
      fr: 'Thon ahi frais, sauce soja, huile de sésame, oignon vert, algues.',
    },
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600',
    ingredients: ['Ahi Tuna', 'Soy Sauce', 'Sesame Oil', 'Green Onion', 'Seaweed'],
  },
  {
    name: 'Spicy Salmon Bowl',
    price: 13.5,
    description: {
      nl: 'Atlantische zalm, pittige mayo, komkommer, avocado, tobiko.',
      en: 'Atlantic salmon, spicy mayo, cucumber, avocado, tobiko.',
      fr: 'Saumon atlantique, mayo épicée, concombre, avocat, tobiko.',
    },
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    ingredients: ['Salmon', 'Spicy Mayo', 'Cucumber', 'Avocado', 'Tobiko'],
  },
  {
    name: 'Tropical Shrimp Bowl',
    price: 12.0,
    description: {
      nl: 'Tempura scampi, mango salsa, kokosrijst, limoen dressing.',
      en: 'Tempura shrimp, mango salsa, coconut rice, lime dressing.',
      fr: 'Crevettes tempura, salsa de mangue, riz à la noix de coco, vinaigrette au citron vert.',
    },
    category: 'poke',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
    ingredients: ['Tempura Shrimp', 'Mango', 'Coconut Rice', 'Lime'],
  },
  // ── Puree Bowls ────────────────────────────────────────────────────────────
  {
    name: 'Crispy Tender Bowl',
    price: 11.0,
    description: {
      nl: 'Zachte aardappelpuree met crispy tenders, peterselie, gebakken uitjes en onze speciale saus.',
      en: 'Smooth mashed potatoes with crispy tenders, parsley, fried onions and our special sauce.',
      fr: 'Purée de pommes de terre onctueuse avec tenders croustillants, persil, oignons frits et notre sauce spéciale.',
    },
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
    description: {
      nl: 'Zachte aardappelpuree met zoete crispy tenders, peterselie, gebakken uitjes en onze speciale saus.',
      en: 'Smooth mashed potatoes with sweet crispy tenders, parsley, fried onions and our special sauce.',
      fr: 'Purée de pommes de terre onctueuse avec tenders sucrés croustillants, persil, oignons frits et notre sauce spéciale.',
    },
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
    description: {
      nl: "Zachte aardappelpuree met scampi's, peterselie, gebakken uitjes en onze speciale saus.",
      en: "Smooth mashed potatoes with scampi, parsley, fried onions and our special sauce.",
      fr: "Purée de pommes de terre onctueuse avec scampis, persil, oignons frits et notre sauce spéciale.",
    },
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
    description: {
      nl: 'Luchtige rijstkroepoek, knapperig en lichtgezouten.',
      en: 'Airy rice crackers, crispy and lightly salted.',
      fr: 'Crackers de riz aériens, croustillants et légèrement salés.',
    },
    category: 'sides',
    image: '',
    ingredients: ['Garnaalkroepoek'],
  },
  {
    name: 'Nachos',
    price: 2.0,
    description: {
      nl: 'Knapperige tortillachips, geserveerd met een dipsaus.',
      en: 'Crispy tortilla chips, served with dipping sauce.',
      fr: 'Chips de tortilla croustillantes, servies avec une sauce.',
    },
    category: 'sides',
    image: '',
    ingredients: ['Tortilla', 'Dipsaus'],
  },
  {
    name: 'Mini Loempia\'s',
    price: 3.0,
    description: {
      nl: 'Knapperige mini loempia\'s met een smakelijke vulling.',
      en: 'Crispy mini spring rolls with a tasty filling.',
      fr: 'Mini rouleaux de printemps croustillants avec une garniture savoureuse.',
    },
    category: 'sides',
    image: '',
    ingredients: ['Rijstpapier', 'Groenten', 'Vlees'],
  },
  {
    name: 'Mini Loempia\'s Hot',
    price: 3.0,
    description: {
      nl: 'Pittige mini loempia\'s met een vurige chilivulling.',
      en: 'Spicy mini spring rolls with a fiery chili filling.',
      fr: 'Mini rouleaux de printemps épicés avec une garniture au piment.',
    },
    category: 'sides',
    image: '',
    ingredients: ['Rijstpapier', 'Chili', 'Groenten'],
  },
  {
    name: 'Crispy Chicken Bites',
    price: 6.0,
    description: {
      nl: 'Sappige kipstukjes met een knapperig krokant korstje.',
      en: 'Juicy chicken pieces with a crispy crunchy coating.',
      fr: 'Morceaux de poulet juteux avec un enrobage croustillant.',
    },
    category: 'sides',
    image: '',
    ingredients: ['Kip', 'Paneermeel', 'Kruiden'],
  },
  {
    name: 'Frisdrank',
    price: 2.5,
    description: {
      nl: 'Keuze uit onze koude frisdranken.',
      en: 'Choice of our cold soft drinks.',
      fr: 'Choix de nos boissons gazeuses froides.',
    },
    category: 'drinks',
    image: '',
    ingredients: [],
  },
  {
    name: 'Water',
    price: 2.0,
    description: {
      nl: 'Still of bruisend mineraalwater.',
      en: 'Still or sparkling mineral water.',
      fr: 'Eau minérale plate ou gazeuse.',
    },
    category: 'drinks',
    image: '',
    ingredients: [],
  },
  // ── Smoothies ──────────────────────────────────────────────────────────────
  {
    name: 'Hawaiian Smoothie',
    price: 5.0,
    description: {
      nl: 'Een tropische mix van verse fruitingrediënten.',
      en: 'A tropical blend of fresh fruit ingredients.',
      fr: 'Un mélange tropical d\'ingrédients frais.',
    },
    category: 'drinks',
    image: '',
    ingredients: ['Ananas', 'Mango', 'Kokosmelk'],
  },
  {
    name: 'Smoothie à la Mula',
    price: 5.0,
    description: {
      nl: 'Onze eigen huissmoothie met verrassende seizoensingrediënten.',
      en: 'Our own house smoothie with surprising seasonal ingredients.',
      fr: 'Notre smoothie maison avec des ingrédients de saison surprenants.',
    },
    category: 'drinks',
    image: '',
    ingredients: ['Huisingrediënten'],
  },
  {
    name: 'Tropical Smoothie',
    price: 5.0,
    description: {
      nl: 'Een exotische tropische smoothie boordevol vers fruit.',
      en: 'An exotic tropical smoothie packed with fresh fruit.',
      fr: 'Un smoothie tropical exotique rempli de fruits frais.',
    },
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
