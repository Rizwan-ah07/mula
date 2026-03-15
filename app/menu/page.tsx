import { cookies } from 'next/headers';
import { unstable_cache } from 'next/cache';
import { getMenuItemsCollection } from '@/models/MenuItem';
import MenuPage from '@/components/MenuPage';
import AdminMenuFAB from '@/components/AdminMenuFAB';
import type { MenuItem } from '@/components/MenuPage';

interface Props {
  searchParams: { table?: string };
}

// Cached for 60 s — busted immediately when an admin mutates a menu item
const getMenuItems = unstable_cache(
  async (): Promise<MenuItem[]> => {
    const collection = await getMenuItemsCollection();
    const items = await collection.find({ available: true }).toArray();
    return JSON.parse(JSON.stringify(items));
  },
  ['menu-items'],
  { revalidate: 60, tags: ['menu-items'] },
);

export default async function MenuRoute({ searchParams }: Props) {
  const tableNumber  = searchParams.table ? parseInt(searchParams.table, 10) : null;
  const isValidTable = tableNumber !== null && !isNaN(tableNumber) && tableNumber > 0;

  const items   = await getMenuItems();
  const isAdmin = cookies().get('admin_auth')?.value === process.env.ADMIN_PASSWORD;

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
        items={items}
        tableNumber={isValidTable ? tableNumber : null}
        isAdmin={isAdmin}
      />

      {/* ── Admin quick-add FAB (only visible when logged in as admin) ── */}
      {isAdmin && <AdminMenuFAB />}
    </main>
  );
}
