'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
    BarChart3,
    Clock,
    Mail,
    Phone,
    RefreshCw,
    Search,
    AlertCircle,
    Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';

interface QuoteRequest {
    id: string;
    service_type: 'energie' | 'solaire' | 'telecom' | 'job' | 'contact';
    form_data: Record<string, unknown>;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    contact_postal_code: string;
    status: 'pending' | 'contacted' | 'completed';
    created_at: string;
}

interface AdminDashboardProps {
    onLogout?: () => void;
}

const Loader2 = ({ className, size }: { className?: string, size?: number }) => (
    <RefreshCw className={`${className} animate-spin`} size={size} />
);

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
    const [requests, setRequests] = useState<QuoteRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'energie' | 'solaire' | 'telecom' | 'job' | 'contact'>('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
    const router = useRouter();

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('quote_requests')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data as QuoteRequest[] || []);
        } catch (err) {
            console.error('Error fetching requests:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        if (onLogout) onLogout();
        else router.push('/admin/login');
    };

    const updateStatus = async (id: string, newStatus: string) => {
        try {
            const { error } = await supabase
                .from('quote_requests')
                .update({ status: newStatus })
                .eq('id', id);

            if (error) throw error;
            setRequests(requests.map(req =>
                req.id === id ? { ...req, status: newStatus as QuoteRequest['status'] } : req
            ));
        } catch (err) {
            console.error('Error updating status:', err);
        }
    };

    const deleteRequest = async (id: string) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette demande ?')) return;

        try {
            const { error } = await supabase
                .from('quote_requests')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRequests(requests.filter(req => req.id !== id));
        } catch (err) {
            console.error('Error deleting request:', err);
            alert('Erreur lors de la suppression');
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesFilter = filter === 'all' || req.service_type === filter;
        const matchesSearch =
            req.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.contact_phone.includes(searchTerm) ||
            (req.contact_email?.toLowerCase().includes(searchTerm.toLowerCase()));

        const matchesTab = activeTab === 'active'
            ? (req.status === 'pending' || req.status === 'contacted')
            : req.status === 'completed';

        return matchesFilter && matchesSearch && matchesTab;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800 border-green-200';
            case 'contacted': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        }
    };

    const getServiceColor = (type: string) => {
        switch (type) {
            case 'energie': return 'bg-[#2563EB]';
            case 'solaire': return 'bg-[#38BDF8]';
            case 'telecom': return 'bg-[#60A5FA]';
            case 'job': return 'bg-purple-400';
            case 'contact': return 'bg-emerald-400';
            default: return 'bg-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-brand-cream font-montserrat">
            {/* Sidebar / Header */}
            <header className="bg-brand-dark text-white p-6 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white flex items-center justify-center">
                            <BarChart3 className="text-brand-dark" size={24} />
                        </div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">AKR Admin</h1>
                    </div>

                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => window.open('/', '_blank')}
                            className="px-4 py-2 border border-white/20 text-white font-black uppercase text-xs tracking-widest hover:bg-white hover:text-brand-dark transition-all"
                        >
                            Voir le site
                        </button>
                        <button
                            onClick={fetchRequests}
                            className="flex items-center gap-2 hover:text-brand-muted transition-colors text-xs font-black uppercase tracking-widest"
                        >
                            <Loader2 className={loading ? 'animate-spin' : ''} size={16} /> Actualiser
                        </button>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 bg-white text-brand-dark font-black uppercase text-xs tracking-widest hover:bg-brand-muted transition-colors"
                        >
                            Déconnexion
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-6 md:p-8">
                {/* Stats Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white border-2 border-brand-dark p-6">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-2">Total</p>
                        <p className="text-4xl font-black text-brand-dark">{requests.length}</p>
                    </div>
                    <div className="bg-white border-2 border-brand-dark p-6">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-2">En attente</p>
                        <p className="text-4xl font-black text-brand-dark">{requests.filter(r => r.status === 'pending').length}</p>
                    </div>
                    <div className="bg-white border-2 border-brand-dark p-6">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-2">Contactés</p>
                        <p className="text-4xl font-black text-brand-dark">{requests.filter(r => r.status === 'contacted').length}</p>
                    </div>
                    <div className="bg-white border-2 border-brand-dark p-6">
                        <p className="text-[10px] font-black text-brand-muted uppercase tracking-[0.2em] mb-2">Terminés</p>
                        <p className="text-4xl font-black text-brand-dark">{requests.filter(r => r.status === 'completed').length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b-2 border-brand-dark mb-8">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`px-8 py-4 font-black uppercase text-sm tracking-widest transition-all ${activeTab === 'active'
                            ? 'bg-brand-dark text-white'
                            : 'text-brand-dark hover:bg-brand-dark/5'
                            }`}
                    >
                        Dossiers en cours ({requests.filter(r => r.status !== 'completed').length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`px-8 py-4 font-black uppercase text-sm tracking-widest transition-all ${activeTab === 'completed'
                            ? 'bg-brand-dark text-white'
                            : 'text-brand-dark hover:bg-brand-dark/5'
                            }`}
                    >
                        Dossiers terminés ({requests.filter(r => r.status === 'completed').length})
                    </button>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un nom, téléphone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 border-2 border-brand-dark focus:bg-white outline-none font-bold uppercase text-sm tracking-wide"
                        />
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {(['all', 'energie', 'solaire', 'telecom', 'job', 'contact'] as const).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilter(type)}
                                className={`px-6 py-4 border-2 border-brand-dark font-black uppercase text-xs tracking-widest whitespace-nowrap transition-all ${filter === type ? 'bg-brand-dark text-white' : 'bg-white text-brand-dark hover:bg-brand-cream'
                                    }`}
                            >
                                {type === 'all' ? 'Tous' : type}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="space-y-4">
                    {loading && requests.length === 0 ? (
                        <div className="text-center py-20 bg-white border-2 border-dashed border-brand-dark">
                            <Loader2 className="mx-auto animate-spin text-brand-dark mb-4" size={40} />
                            <p className="font-black uppercase tracking-widest text-brand-dark">Chargement des données...</p>
                        </div>
                    ) : filteredRequests.length === 0 ? (
                        <div className="text-center py-20 bg-white border-2 border-dashed border-brand-dark">
                            <AlertCircle className="mx-auto text-brand-muted mb-4" size={40} />
                            <p className="font-black uppercase tracking-widest text-brand-muted">Aucune demande trouvée</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <div
                                key={request.id}
                                className="bg-white border-2 border-brand-dark p-6 group hover:border-accent-solar transition-colors"
                            >
                                <div className="flex flex-col lg:flex-row justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className={`w-3 h-3 ${getServiceColor(request.service_type)}`} />
                                            <span className="text-xs font-black uppercase tracking-widest text-brand-dark">
                                                {request.service_type}
                                            </span>
                                            <span className="text-xs font-medium text-brand-muted">
                                                {new Date(request.created_at).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </span>
                                        </div>

                                        <div>
                                            <h3 className="text-xl font-black uppercase tracking-tight text-brand-dark">
                                                {request.contact_name}
                                            </h3>
                                            <div className="flex flex-wrap gap-4 mt-2">
                                                <div className="flex items-center gap-2 text-sm font-medium text-brand-dark">
                                                    <Phone size={14} className="text-brand-muted" /> {request.contact_phone}
                                                </div>
                                                {request.contact_email && (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-brand-dark">
                                                        <Mail size={14} className="text-brand-muted" /> {request.contact_email}
                                                    </div>
                                                )}
                                                {request.contact_postal_code && (
                                                    <div className="flex items-center gap-2 text-sm font-medium text-brand-dark">
                                                        <Clock size={14} className="text-brand-muted" /> CP: {request.contact_postal_code}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-brand-cream p-4 border border-gray-200">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted mb-2">Détails du formulaire</p>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                                                {Object.entries(request.form_data).map(([key, value]) => (
                                                    <div key={key} className="text-xs">
                                                        <span className="font-bold text-gray-500">{key}: </span>
                                                        <span className="text-brand-dark font-medium">{String(value)}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col sm:flex-row lg:flex-col justify-between gap-4 py-2 border-t lg:border-t-0 lg:border-l lg:pl-6 border-gray-100">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-brand-muted">Statut</p>
                                            <select
                                                value={request.status}
                                                onChange={(e) => updateStatus(request.id, e.target.value)}
                                                className={`w-full px-3 py-2 border-2 border-brand-dark font-bold text-xs uppercase tracking-widest outline-none ${getStatusColor(request.status)}`}
                                            >
                                                <option value="pending">En attente</option>
                                                <option value="contacted">Contacté</option>
                                                <option value="completed">Terminé</option>
                                            </select>
                                        </div>

                                        <button
                                            onClick={() => deleteRequest(request.id)}
                                            className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-500 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            <Trash2 size={14} /> Supprimer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </main>
        </div>
    );
}
