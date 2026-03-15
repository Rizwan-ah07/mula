import Link from 'next/link';
import { ChevronDown, Leaf, Clock, Star } from 'lucide-react';

const FEATURES = [
  {
    icon: <Leaf className="w-6 h-6 text-brand-500" />,
    title: 'Always Fresh',
    body:  'Every ingredient is sourced daily and prepped right before your bowl is assembled.',
  },
  {
    icon: <Clock className="w-6 h-6 text-coral-500" />,
    title: 'Table-Side Ordering',
    body:  'Scan the QR code, build your bowl, and it goes straight to the kitchen — no waiting in line.',
  },
  {
    icon: <Star className="w-6 h-6 text-gold-500" />,
    title: 'Customise Everything',
    body:  'Pick your base, protein, toppings, and sauce. Your bowl, your way.',
  },
];

export default function HomePage() {
  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Layered gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-800 via-brand-600 to-ocean-600" />
        {/* Soft accent blobs */}
        <div className="absolute -top-20 right-0 w-96 h-96 rounded-full bg-coral-500/25 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 -left-20 w-96 h-96 rounded-full bg-gold-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto pt-20">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 text-white/90 text-xs font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6">
            🌊 Poke &amp; Puree Bowls
          </span>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            Freshness in
            <br />
            <span className="text-gold-400">Every Bowl</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-white/75 max-w-md mx-auto mb-10 leading-relaxed">
            Handcrafted bowls built from scratch, delivered straight to your table
            while you wait — fresh, fast, and full of flavour.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-coral-500 hover:bg-coral-600
                         active:scale-95 text-white font-bold px-8 py-4 rounded-2xl text-lg
                         shadow-lg shadow-coral-500/40 transition-all duration-150"
            >
              Order Now 🍣
            </Link>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25
                         backdrop-blur border border-white/25 text-white font-semibold
                         px-8 py-4 rounded-2xl text-lg transition-all duration-150"
            >
              View Menu
            </Link>
          </div>
        </div>

        {/* Scroll cue */}
        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white/80
                     transition-colors animate-bounce"
          aria-label="Scroll to features"
        >
          <ChevronDown className="w-6 h-6" />
        </a>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3">
              Why Mula Bowls?
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              We combine tropical ingredients with a frictionless digital ordering
              experience built for modern dining.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, body }) => (
              <div
                key={title}
                className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center">
                  {icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-gradient-to-r from-brand-600 to-ocean-600 py-16 px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Ready to build your bowl?
        </h2>
        <p className="text-white/75 mb-8 text-lg">
          Scan the QR code at your table or browse the menu to start ordering.
        </p>
        <Link
          href="/menu"
          className="inline-flex items-center bg-gold-500 hover:bg-gold-600 active:scale-95
                     text-white font-bold px-10 py-4 rounded-2xl text-lg
                     shadow-lg shadow-gold-500/40 transition-all duration-150"
        >
          Browse the Menu →
        </Link>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">Mula Bowls</p>
        <p>© {new Date().getFullYear()} · Fresh Poke &amp; Puree Bowls</p>
      </footer>
    </main>
  );
}
