'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AdminLoginProps {
    onLogin?: () => void; // Optional here as page handles redirect, but kept for compatibility
    onBack: () => void;
}

export default function AdminLogin({ onLogin, onBack }: AdminLoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (signInError) throw signInError;
            if (onLogin) onLogin();
            else router.push('/admin/dashboard');
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la connexion';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream flex flex-col items-center justify-center p-4">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 text-brand-dark hover:gap-3 transition-all font-montserrat font-bold uppercase text-sm tracking-widest"
            >
                <ArrowLeft size={20} /> Retour au site
            </button>

            <div className="w-full max-w-md">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-montserrat font-black text-brand-dark uppercase tracking-tighter leading-none mb-2">
                        Administration
                    </h1>
                    <p className="text-brand-muted font-medium">Accès sécurisé AKR Group</p>
                </div>

                <div className="bg-white border-2 border-brand-dark p-8 md:p-12">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="block text-xs font-montserrat font-black uppercase tracking-widest text-brand-dark">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border-2 border-brand-dark focus:bg-brand-cream outline-none transition-colors font-medium"
                                    placeholder="admin@akrgroup.be"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-montserrat font-black uppercase tracking-widest text-brand-dark">
                                Mot de passe
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 border-2 border-brand-dark focus:bg-brand-cream outline-none transition-colors font-medium"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-brand-dark text-white font-montserrat font-black uppercase tracking-widest hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} />
                                    Connexion...
                                </>
                            ) : (
                                'Se connecter'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
