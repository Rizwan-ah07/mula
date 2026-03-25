'use client';

import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { t } from '@/locales/translations';

export default function ContactPage() {
  const { language } = useLanguage();

  const HOURS = [
    { dayKey: 'monday',    hours: '16:00 – 01:00', closed: false },
    { dayKey: 'tuesday',   hours: t('contact.days.closed', language), closed: true  },
    { dayKey: 'wednesday', hours: '16:00 – 01:00', closed: false },
    { dayKey: 'thursday',  hours: '16:00 – 01:00', closed: false },
    { dayKey: 'friday',    hours: '16:00 – 01:00', closed: false },
    { dayKey: 'saturday',  hours: '16:00 – 01:00', closed: false },
    { dayKey: 'sunday',    hours: '16:00 – 01:00', closed: false },
  ];
  return (
    // No pt-16 here — the gradient hero covers the navbar area instead
    <main>
      {/* Hero — pt-36 = navbar (4rem) + inner spacing (5rem) */}
      <section className="bg-gradient-to-br from-brand-700 to-ocean-600 text-white pt-36 pb-20 px-4 text-center">
        <p className="text-brand-200 text-sm font-semibold tracking-widest uppercase mb-2">{t('contact.badge', language)}</p>
        <h1 className="text-4xl sm:text-5xl font-black mb-4">{t('contact.title', language)}</h1>
        <p className="text-white/75 text-lg max-w-md mx-auto">
          {t('contact.subtitle', language)}
        </p>
      </section>

      {/* Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Info card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-slate-800">{t('contact.findUs', language)}</h2>

            <div className="flex items-start gap-3 text-sm text-slate-600">
              <MapPin className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">Mula Bowls</p>
                <p>Statielei 25</p>
                <p>2140 Borgerhout</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Phone className="w-5 h-5 text-coral-500 flex-shrink-0" />
              <a href="tel:+32xxxxxxxxx" className="hover:text-brand-700 transition-colors font-medium">
                +32 xxx xx xx
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Mail className="w-5 h-5 text-gold-600 flex-shrink-0" />
              <a href="mailto:Mulabowls@hotmail.com" className="hover:text-brand-700 transition-colors font-medium">
                Mulabowls@hotmail.com
              </a>
            </div>

            {/* Opening hours */}
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-3">
                <Clock className="w-4 h-4 text-ocean-500" /> {t('contact.openingHours', language)}
              </div>
              <ul className="space-y-1.5">
                {HOURS.map(({ dayKey, hours, closed }) => (
                  <li key={dayKey} className="flex justify-between text-sm">
                    <span className={closed ? 'text-slate-400' : 'text-slate-600'}>
                      {t(`contact.days.${dayKey}`, language)}
                    </span>
                    <span className={`font-medium ${closed ? 'text-red-400' : 'text-slate-800'}`}>
                      {hours}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-800 mb-5">{t('contact.formTitle', language)}</h2>
            <form className="space-y-4" aria-label="Contact form">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-name">
                  {t('contact.formName', language)}
                </label>
                <input
                  id="cf-name"
                  type="text"
                  placeholder={t('contact.formNamePlaceholder', language)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-email">
                  {t('contact.formEmail', language)}
                </label>
                <input
                  id="cf-email"
                  type="email"
                  placeholder={t('contact.formEmailPlaceholder', language)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1" htmlFor="cf-message">
                  {t('contact.formMessage', language)}
                </label>
                <textarea
                  id="cf-message"
                  rows={4}
                  placeholder={t('contact.formMessagePlaceholder', language)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none
                             focus:outline-none focus:ring-2 focus:ring-brand-400 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-brand-600 hover:bg-brand-700 active:scale-95
                           text-white font-bold py-3 rounded-xl transition-all"
              >
                {t('contact.formSubmit', language)}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-600 py-12 px-4 text-center text-white">
        <h2 className="text-2xl font-black mb-2">{t('contact.ctaTitle', language)}</h2>
        <p className="text-brand-100 mb-6 text-sm">{t('contact.ctaSubtitle', language)}</p>
        <Link
          href="/menu"
          className="inline-flex items-center bg-coral-500 hover:bg-coral-600 active:scale-95
                     text-white font-bold px-8 py-3.5 rounded-2xl transition-all"
        >
          {t('contact.ctaButton', language)}
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8 px-4 text-center text-sm">
        <p className="font-semibold text-white mb-1">Mula Bowls</p>
        <p>© {new Date().getFullYear()} · {t('contact.footerText', language)}</p>
      </footer>
    </main>
  );
}
