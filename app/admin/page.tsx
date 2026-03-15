import { unstable_cache } from 'next/cache';
import { getMenuItemsCollection } from '@/models/MenuItem';
import { getOrdersCollection } from '@/models/Order';
import AdminPanel from '@/components/AdminPanel';

// Share the same cache tag as the menu page — busted on every admin mutation
const getAllMenuItems = unstable_cache(
  async () => {
    const col   = await getMenuItemsCollection();
    const items = await col.find({}).toArray();
    return JSON.parse(JSON.stringify(items));
  },
  ['admin-menu-items'],
  { revalidate: 10, tags: ['menu-items'] },
);

export default async function AdminPage() {
  const [items, ordersCol] = await Promise.all([
    getAllMenuItems(),
    getOrdersCollection(),
  ]);

  // Orders stay fresh — they change constantly as customers order
  const orders = JSON.parse(JSON.stringify(
    await ordersCol.find({}).sort({ createdAt: -1 }).toArray()
  ));

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-brand-600 text-white pt-16">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-brand-200 text-xs font-semibold tracking-widest uppercase mb-1">
            Beheer
          </p>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="mt-1 text-brand-100 text-sm">Beheer menu-items en bekijk alle bestellingen.</p>
        </div>
      </header>

      <AdminPanel
        initialItems={items}
        initialOrders={orders}
      />
    </main>
  );
}
