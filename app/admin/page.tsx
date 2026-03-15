import { getMenuItemsCollection } from '@/models/MenuItem';
import { getOrdersCollection } from '@/models/Order';
import AdminPanel from '@/components/AdminPanel';

export default async function AdminPage() {
  const [itemsCol, ordersCol] = await Promise.all([
    getMenuItemsCollection(),
    getOrdersCollection(),
  ]);

  const [items, orders] = await Promise.all([
    itemsCol.find({}).toArray(),
    ordersCol.find({}).sort({ createdAt: -1 }).toArray(),
  ]);

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
        initialItems={JSON.parse(JSON.stringify(items))}
        initialOrders={JSON.parse(JSON.stringify(orders))}
      />
    </main>
  );
}
