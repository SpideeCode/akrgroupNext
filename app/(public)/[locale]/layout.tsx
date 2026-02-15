
import type { Metadata } from 'next';
import { Inter, Montserrat } from 'next/font/google';
import '../../globals.css';
import { Providers } from '../../providers';
import { redirect } from 'next/navigation';

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

export async function generateStaticParams() {
  return [
    { locale: "fr" },
    { locale: "nl" },
  ];
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFR = locale === "fr";

  return {
    title: isFR
      ? "AKR Group | Courtier en Énergie, Solaire & Télécom"
      : "AKR Group | Energie, Zonne-energie & Telecom Makelaar",
    description: isFR
      ? "AKR Group vous accompagne dans l'optimisation de vos factures d'énergie, l'installation de panneaux solaires et vos contrats télécom en Belgique."
      : "AKR Group begeleidt u bij het optimaliseren van uw energierekeningen, de installatie van zonnepanelen en uw telecomcontracten in België.",
    alternates: {
      languages: {
        fr: "/fr",
        nl: "/nl",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!["fr", "nl"].includes(locale)) {
    redirect("/fr");
  }

  return (
    <html lang={locale} className={`${inter.variable} ${montserrat.variable}`}>
      <body>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
