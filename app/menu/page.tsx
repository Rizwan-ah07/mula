import { getMenuItemsCollection, IMenuItem } from '@/models/MenuItem';
import MenuPage from '@/components/MenuPage';

interface Props {
  searchParams: { table?: string };
}

async function getMenuItems(): Promise<IMenuItem[]> {
  const collection = await getMenuItemsCollection();
  return collection.find({ available: true }).toArray();
}

export default async function MenuRoute({ searchParams }: Props) {
  const tableNumber  = searchParams.table ? parseInt(searchParams.table, 10) : null;
  const isValidTable = tableNumber !== null && !isNaN(tableNumber) && tableNumber > 0;

  const items = await getMenuItems();

  return (
    <main className="min-h-screen">
      {/* ── Header — sits under the transparent Navbar (pt-16) ── */}
      <header className="bg-gradient-to-r from-brand-600 to-ocean-500 text-white pt-16">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-1">
            Fresh &amp; Healthy
          </p>
          <h1 className="text-4xl font-bold tracking-tight">Mula Bowls 🌊</h1>
          <p className="mt-1 text-brand-100">Poke &amp; Puree bowls, made your way.</p>

          {isValidTable && (
            <span className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur
                             px-4 py-1.5 rounded-full text-sm font-semibold">
              📍 Table {tableNumber}
            </span>
          )}
        </div>
      </header>

      {/* ── Menu grid + cart (client component — handles TableModal) ── */}
      <MenuPage
        items={JSON.parse(JSON.stringify(items))}
        tableNumber={isValidTable ? tableNumber : null}
      />
    </main>
  );
}
