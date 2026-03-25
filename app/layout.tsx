import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title:       'Mula Bowls',
  description: 'Fresh Poke & Puree bowls, made to order.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <LanguageProvider>
          <Navbar />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
