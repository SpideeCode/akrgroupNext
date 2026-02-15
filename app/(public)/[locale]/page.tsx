import LandingPage from '@/components/LandingPage';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LandingPage />;
}
