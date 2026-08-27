'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';

type InvitationAdmin = {
    id: string;
    slug: string;
    groom_name: string;
    bride_name: string;
    payment_status: string;
    is_active: boolean;
    created_at: string;
    user_id: string;
};

export default function AdminDashboardPage() {
    const [invitations, setInvitations] = useState<InvitationAdmin[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // FITUR BARU: Pencarian Data
    const router = useRouter();

    const ADMIN_EMAIL = "admin@creative-soft.my.id";

    const fetchAllInvitations = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        if (user.email !== ADMIN_EMAIL && !user.email?.includes('admin')) {
            // router.push('/dashboard'); // Buka komentar ini saat di-deploy
        }

        const { data, error } = await supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false });

        if (!error && data) {
            setInvitations(data);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchAllInvitations();
    }, [router]);

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        const newActiveStatus = !currentStatus;
        const newPaymentStatus = newActiveStatus ? 'paid' : 'pending';

        const { error } = await supabase
            .from('invitations')
            .update({
                is_active: newActiveStatus,
                payment_status: newPaymentStatus
            })
            .eq('id', id);

        if (error) {
            alert('Gagal memperbarui status: ' + error.message);
        } else {
            setInvitations(invitations.map(inv =>
                inv.id === id ? { ...inv, is_active: newActiveStatus, payment_status: newPaymentStatus } : inv
            ));
            alert('🎉 Status undangan berhasil diperbarui!');
        }
    };

    // Logika Pencarian
    const filteredInvitations = invitations.filter(inv => 
        (inv.groom_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
        (inv.bride_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (inv.slug?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-indigo-600 animate-pulse font-medium text-lg flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Memuat Sistem Admin...
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-10">
            {/* Header Admin */}
            <div className="bg-indigo-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-indigo-700 text-indigo-100 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-widest border border-indigo-600 shadow-sm">Super Admin</span>
                        <h1 className="font-bold text-lg">Panel Kendali</h1>
                    </div>
                    <button onClick={() => router.push('/dashboard')} className="text-sm font-medium text-indigo-200 hover:text-white transition-colors bg-indigo-800 px-4 py-2 rounded-lg border border-indigo-700">
                        Ke Dasbor Klien
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                
                {/* Statistik Cepat */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                        <div className="text-slate-500 text-sm font-semibold mb-2 uppercase tracking-wide">Total Klien Terdaftar</div>
                        <div className="text-4xl font-bold text-slate-900">{invitations.length}</div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-50 rounded-bl-full z-0"></div>
                        <div className="relative z-10">
                            <div className="text-emerald-600 text-sm font-semibold mb-2 uppercase tracking-wide">Aktif (Lunas)</div>
                            <div className="text-4xl font-bold text-slate-900">{invitations.filter(i => i.is_active).length}</div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-amber-100 shadow-sm relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-20 h-20 bg-amber-50 rounded-bl-full z-0"></div>
                        <div className="relative z-10">
                            <div className="text-amber-600 text-sm font-semibold mb-2 uppercase tracking-wide">Menunggu Pembayaran</div>
                            <div className="text-4xl font-bold text-slate-900">{invitations.filter(i => !i.is_active).length}</div>
                        </div>
                    </div>
                </div>

                {/* Tabel Manajemen */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl font-bold text-slate-900">Data Undangan Klien</h2>
                        
                        {/* Search Bar */}
                        <div className="relative w-full sm:w-80">
                            <input 
                                type="text" 
                                placeholder="Cari mempelai atau URL (slug)..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                            />
                            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[700px]">
                            <thead>
                                <tr className="bg-slate-50 text-xs uppercase text-slate-500 tracking-wider">
                                    <th className="p-5 font-semibold border-b border-slate-200">Data Mempelai</th>
                                    <th className="p-5 font-semibold border-b border-slate-200">Tautan (URL)</th>
                                    <th className="p-5 font-semibold border-b border-slate-200">Status Undangan</th>
                                    <th className="p-5 font-semibold border-b border-slate-200 text-right">Aksi Admin</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
                                {filteredInvitations.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="p-8 text-center text-slate-500 italic bg-slate-50/50">
                                            {invitations.length === 0 ? 'Belum ada klien terdaftar.' : 'Pencarian tidak ditemukan.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInvitations.map((inv) => (
                                        <tr key={inv.id} className="hover:bg-indigo-50/30 transition-colors">
                                            <td className="p-5">
                                                <div className="font-bold text-slate-900 text-base">{inv.groom_name || 'Kosong'} & {inv.bride_name || 'Kosong'}</div>
                                                <div className="text-xs text-slate-500 mt-1">Didaftarkan: {new Date(inv.created_at).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="p-5">
                                                <a href={`/${inv.slug}?preview=true`} target="_blank" className="text-indigo-600 hover:underline font-mono text-xs bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 inline-block">
                                                    /{inv.slug}
                                                </a>
                                            </td>
                                            <td className="p-5">
                                                <div className="flex flex-col gap-2 items-start">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${inv.payment_status === 'paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                                        💰 {inv.payment_status}
                                                    </span>
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider border ${inv.is_active ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                        {inv.is_active ? '🌐 Publik Aktif' : '🔒 Terkunci'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button
                                                    onClick={() => handleToggleActive(inv.id, inv.is_active)}
                                                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${inv.is_active
                                                            ? 'bg-white text-rose-600 border border-rose-200 hover:bg-rose-50'
                                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-200'
                                                        }`}
                                                >
                                                    {inv.is_active ? 'Kunci (Nonaktifkan)' : '✨ Verifikasi Lunas'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
