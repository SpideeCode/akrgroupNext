'use client';

import { I18nProvider } from '@/components/providers/I18nProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>;
}
