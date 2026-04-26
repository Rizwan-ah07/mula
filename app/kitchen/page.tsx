import { getOrdersCollection, IOrder } from '@/models/Order';
import ChefBoard from '@/components/ChefBoard';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getActiveOrders(): Promise<IOrder[]> {
  const collection = await getOrdersCollection();
  return collection
    .find({ status: { $nin: ['completed', 'cancelled'] } })
    .sort({ createdAt: 1 })
    .toArray();
}

export default async function KitchenPage() {
  const orders = await getActiveOrders();

  return (
    <main className="min-h-screen bg-slate-900">
      {/* KDS Header */}
      <header className="bg-slate-800 border-b border-slate-700 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">👨‍🍳</span>
          <div>
            <h1 className="text-white font-bold text-xl">Mula Bowls — Kitchen</h1>
            <p className="text-slate-400 text-xs">Live order board · oldest first</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
          <span className="text-slate-300 text-sm">Live</span>
        </div>
      </header>

      <ChefBoard initialOrders={JSON.parse(JSON.stringify(orders))} />
    </main>
  );
}
