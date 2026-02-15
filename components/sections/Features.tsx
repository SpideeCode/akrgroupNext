'use client';

import { Search, UserCheck, TrendingDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AnimatedSection from '@/components/ui/AnimatedSection';

export default function Features() {
    const { t } = useTranslation();

    const steps = [
        {
            title: t('features.analysis.title'),
            description: t('features.analysis.description'),
            icon: Search,
            color: 'text-accent-energy',
        },
        {
            title: t('features.support.title'),
            description: t('features.support.description'),
            icon: UserCheck,
            color: 'text-accent-solar',
        },
        {
            title: t('features.reduce.title'),
            description: t('features.reduce.description'),
            icon: TrendingDown,
            color: 'text-accent-telecom',
        },
    ];

    return (
        <section className="py-20 bg-brand-cream border-t border-brand-dark/5">
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
                    {steps.map((step, index) => (
                        <div key={index} className="h-full">
                            <AnimatedSection delay={index * 0.2} width="100%" className="h-full">
                                <div className="flex flex-col items-center md:items-start group h-full">
                                    <div className={`mb-6 p-4 rounded-full bg-white shadow-sm ${step.color} transition-transform group-hover:scale-110 duration-300`}>
                                        <step.icon className="w-10 h-10" />
                                    </div>

                                    <h3 className="text-xl font-black font-montserrat uppercase tracking-tight text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-brand-dark/70 font-medium leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </AnimatedSection>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
