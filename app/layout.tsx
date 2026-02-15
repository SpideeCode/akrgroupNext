import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'AKR Group | Courtier en Énergie, Solaire & Télécom',
  description: "AKR Group vous accompagne dans l'optimisation de vos factures d'énergie, l'installation de panneaux solaires et vos contrats télécom en Belgique.",
  openGraph: {
    title: "AKR Group | Solutions d'Économie",
    description: "Optimisez vos dépenses et vivez mieux avec AKR Group.",
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
