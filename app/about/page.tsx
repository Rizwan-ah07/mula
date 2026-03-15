import { Leaf, MapPin, Users, Heart } from 'lucide-react';
import Link from 'next/link';

const VALUES = [
  {
    icon: <Leaf className="w-6 h-6 text-brand-600" />,
    title: 'Fresh, Local Sourcing',
    body:  'We partner with local farms and fish markets to bring you the best produce and seafood available each day.',
  },
  {
    icon: <Heart className="w-6 h-6 text-coral-500" />,
    title: 'Made With Care',
    body:  'Every bowl is assembled to order by our skilled team — no assembly lines, no shortcuts.',
  },
  {
    icon: <Users className="w-6 h-6 text-gold-600" />,
    title: 'Community First',
    body:  'Mula Bowls was born in this neighbourhood and donates a portion of every sale to local food-access programmes.',
  },
  {
    icon: <MapPin className="w-6 h-6 text-ocean-500" />,
    title: 'Dine In Your Way',
    body:  'Our table-side QR ordering means no queues, no stress — just food at your pace.',
  },
];

export default function AboutPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-ocean-600 text-white py-20 px-4 text-center">
        <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-2">Our Story</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">About Mula Bowls</h1>
        <p className="text-white/75 text-lg max-w-xl mx-auto leading-relaxed">
          We started as a tiny food stall with one mission: bring the freshest poke and
          puree bowls to everyone in the neighbourhood. Now we serve hundreds of
          happy customers daily from our tropical-inspired dining room.
        </p>
      </section>

      {/* Values */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-slate-800 text-center mb-10">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map(({ icon, title, body }) => (
              <div key={title} className="flex gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-white shadow-sm flex-shrink-0 flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-14 px-4 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Taste the difference</h2>
        <p className="text-brand-100 mb-7">Come dine with us or order right from your table.</p>
        <Link
          href="/menu"
          className="inline-flex items-center bg-coral-500 hover:bg-coral-600 active:scale-95
                     text-white font-bold px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-coral-500/30"
        >
          Order Now →
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">Mula Bowls</p>
        <p>© {new Date().getFullYear()} · Fresh Poke &amp; Puree Bowls</p>
      </footer>
    </main>
  );
}
