// layout.tsx
import "@/styles/globals.css";
import { ReactNode } from 'react';
import Providers from '@/config/providers';
import { Great_Vibes, Jura } from 'next/font/google'

interface IRootLayout {
  children: ReactNode
}

const greatVibes = Great_Vibes({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  variable: '--font-great-vibes',
})

const jura = Jura({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jura',
})

export default function RootLayout({ children }: IRootLayout) {
  return (
    <html lang="ru" className={`${greatVibes.variable} ${jura.variable}`}>
    <body className="font-jura">
    <Providers>
      {children}
    </Providers>
    </body>
    </html>
  );
}