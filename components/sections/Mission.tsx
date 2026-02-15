'use client';

import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Mission() {
    const { t } = useTranslation();

    return (
        <section className="py-20 bg-white text-center">
            <div className="max-w-4xl mx-auto px-6">
                <AnimatedSection delay={0.1}>
                    <h2 className="text-sm font-black text-accent-energy uppercase tracking-[0.2em] mb-6">
                        {t('mission.title')}
                    </h2>
                </AnimatedSection>

                <AnimatedSection delay={0.2}>
                    <p className="text-3xl md:text-4xl font-montserrat font-bold text-brand-dark leading-snug mb-16">
                        {t('mission.description')}
                    </p>
                </AnimatedSection>

                <AnimatedSection delay={0.3}>
                    <div className="relative inline-block">
                        <h3 className="text-4xl md:text-5xl font-black text-brand-primary uppercase tracking-tight transform -rotate-2">
                            {t('mission.tagline')}
                        </h3>
                        <div className="absolute -bottom-2 left-0 w-full h-3 bg-accent-solar/30 -skew-x-12 -z-10" />
                    </div>
                </AnimatedSection>
            </div>
        </section>
    );
}
