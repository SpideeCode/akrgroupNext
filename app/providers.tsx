'use client';

import { I18nProvider } from '@/components/providers/I18nProvider';

export function Providers({ children, locale = 'fr' }: { children: React.ReactNode; locale?: string }) {
  return <I18nProvider locale={locale}>{children}</I18nProvider>;
}
