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
    const router = useRouter();

    // 💡 CATATAN KEAMANAN DASAR:
    // Ganti email di bawah ini dengan email login Supabase Anda yang sebenarnya agar aman
    const ADMIN_EMAIL = "admin@creative-soft.my.id";

    const fetchAllInvitations = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // Pengecekan admin sederhana
        if (user.email !== ADMIN_EMAIL && !user.email?.includes('admin')) {
            // Jika bukan admin, arahkan kembali ke dasbor klien biasa
            // (Hapus baris di bawah jika Anda ingin bebas masuk selama tahap uji coba)
            // router.push('/dashboard');
        }

        // Ambil seluruh data undangan dari database
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

    // Fungsi untuk mengubah status Aktif/Lunas secara instan
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
            // Perbarui tampilan tabel secara lokal seketika
            setInvitations(invitations.map(inv =>
                inv.id === id ? { ...inv, is_active: newActiveStatus, payment_status: newPaymentStatus } : inv
            ));
            alert('🎉 Status undangan berhasil diperbarui!');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-amber-400 animate-pulse font-serif text-xl">Memuat Panel Super-Admin... ⚡</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 font-sans text-slate-100">
            <div className="max-w-6xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">

                {/* Header Admin */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-slate-800 pb-6 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-amber-500/10 text-amber-400 text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider border border-amber-500/20">Super Admin Panel</span>
                        </div>
                        <h1 className="text-3xl font-serif font-bold text-white tracking-wide">Kelola Klien SaaS</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-5 py-2 text-sm font-medium text-slate-300 bg-slate-800 rounded-full hover:bg-slate-700 transition-all border border-slate-700"
                    >
                        Kembali ke Dasbor Klien
                    </button>
                </div>

                {/* Statistik Singkat */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-800/50 p-5 rounded-2xl border border-slate-800">
                        <div className="text-2xl font-bold text-white mb-1">{invitations.length}</div>
                        <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Total Klien Terdaftar</div>
                    </div>
                    <div className="bg-emerald-950/30 p-5 rounded-2xl border border-emerald-900/40">
                        <div className="text-2xl font-bold text-emerald-400 mb-1">
                            {invitations.filter(i => i.is_active).length}
                        </div>
                        <div className="text-xs text-emerald-500 uppercase tracking-widest font-semibold">Undangan Aktif (Lunas)</div>
                    </div>
                    <div className="bg-amber-950/30 p-5 rounded-2xl border border-amber-900/40">
                        <div className="text-2xl font-bold text-amber-400 mb-1">
                            {invitations.filter(i => !i.is_active).length}
                        </div>
                        <div className="text-xs text-amber-500 uppercase tracking-widest font-semibold">Menunggu Pembayaran (Pending)</div>
                    </div>
                </div>

                {/* Tabel Daftar Klien */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr className="border-b border-slate-800 bg-slate-800/30 text-xs uppercase text-slate-400 tracking-wider">
                                <th className="p-4 font-semibold rounded-tl-xl">Mempelai</th>
                                <th className="p-4 font-semibold">Tautan (Slug)</th>
                                <th className="p-4 font-semibold">Status Bayar</th>
                                <th className="p-4 font-semibold">Status Link</th>
                                <th className="p-4 font-semibold rounded-tr-xl text-center">Aksi Admin</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-300">
                            {invitations.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 italic bg-slate-800/10 rounded-b-xl">
                                        Belum ada klien yang mendaftarkan undangan.
                                    </td>
                                </tr>
                            ) : (
                                invitations.map((inv) => (
                                    <tr key={inv.id} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-colors">
                                        <td className="p-4 font-bold text-white">
                                            {inv.groom_name || 'Tanpa Nama'} & {inv.bride_name || 'Tanpa Nama'}
                                        </td>
                                        <td className="p-4">
                                            <a
                                                href={`/${inv.slug}?preview=true`}
                                                target="_blank"
                                                className="text-amber-400 hover:underline font-mono text-xs bg-slate-800 px-2.5 py-1 rounded border border-slate-700"
                                            >
                                                /{inv.slug}
                                            </a>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${inv.payment_status === 'paid' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                }`}>
                                                {inv.payment_status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${inv.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                                }`}>
                                                {inv.is_active ? 'Aktif' : 'Terkunci'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={() => handleToggleActive(inv.id, inv.is_active)}
                                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${inv.is_active
                                                        ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30'
                                                        : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-900/50'
                                                    }`}
                                            >
                                                {inv.is_active ? '🔒 Nonaktifkan' : '✨ Lunas & Aktifkan'}
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
    );
}