import JobPageContent from '@/components/job/JobPageContent';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFR = locale === 'fr';

  return {
    title: isFR ? 'Carrière | AKR Group' : 'Carrière | AKR Group (NL)',
    description: isFR 
      ? 'Rejoignez AKR Group et participez à la transition énergétique.' 
      : 'Word lid van AKR Group en neem deel aan de energietransitie.',
    alternates: {
      languages: {
        fr: "/fr/job",
        nl: "/nl/job",
      },
    },
  };
}

export default async function JobPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <JobPageContent />;
}
