import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import Link from 'next/link';

const HOURS = [
  { day: 'Monday – Friday',  hours: '11 am – 9 pm'  },
  { day: 'Saturday',         hours: '10 am – 10 pm' },
  { day: 'Sunday',           hours: '11 am – 8 pm'  },
];

export default function ContactPage() {
  return (
    <main className="pt-16">
      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 to-ocean-600 text-white py-20 px-4 text-center">
        <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-2">Get In Touch</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">Contact Us</h1>
        <p className="text-white/75 text-lg max-w-md mx-auto">
          Questions about your order, catering enquiries, or just want to say hi —
          we'd love to hear from you.
        </p>
      </section>

      {/* Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Info card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-slate-800">Find Us</h2>

            <div className="flex items-start gap-3 text-sm text-slate-600">
              <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Mula Bowls HQ</p>
                <p>42 Tropical Parade</p>
                <p>Coconut Quarter, CB1 4PK</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-5 h-5 text-coral-500 flex-shrink-0" />
              <a href="tel:+441234567890" className="hover:text-brand-700 transition-colors font-medium">
                +44 (0) 1234 567 890
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-5 h-5 text-gold-600 flex-shrink-0" />
              <a href="mailto:hello@mulabowls.com" className="hover:text-brand-700 transition-colors font-medium">
                hello@mulabowls.com
              </a>
            </div>

            {/* Opening hours */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                <Clock className="w-4 h-4 text-ocean-500" /> Opening Hours
              </div>
              <ul className="space-y-1.5">
                {HOURS.map(({ day, hours }) => (
                  <li key={day} className="flex justify-between text-sm">
                    <span className="text-slate-600">{day}</span>
                    <span className="font-medium text-slate-800">{hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">Send a Message</h2>
            <form className="space-y-4" aria-label="Contact form">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-name">
                  Name
                </label>
                <input
                  id="cf-name"
                  type="text"
                  placeholder="Your name"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-email">
                  Email
                </label>
                <input
                  id="cf-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-message">
                  Message
                </label>
                <textarea
                  id="cf-message"
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95
                           text-white font-bold py-3 rounded-xl transition-all"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-black mb-2">Prefer to order at the table?</h2>
        <p className="text-brand-100 mb-6 text-sm">Browse the menu and add items directly from your phone.</p>
        <Link
          href="/menu"
          className="inline-flex items-center bg-coral-500 hover:bg-coral-600 active:scale-95
                     text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
        >
          View Menu →
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
