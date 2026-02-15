import JobPageContent from '@/components/job/JobPageContent';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Carrière | AKR Group',
  description: 'Rejoignez AKR Group et participez à la transition énergétique.',
};

export default function JobPage() {
  return <JobPageContent />;
}
