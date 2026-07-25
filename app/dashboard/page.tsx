'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer';

// --- DAFTAR KOLEKSI TEMA ---
const THEME_OPTIONS = [
    { id: 'minimalist', name: 'Romantis Pink', desc: 'Efek kaca embun dan nuansa merah muda.', activeStyle: 'border-rose-500 bg-rose-50', textStyle: 'text-rose-700', icon: '🌸' },
    { id: 'elegant', name: 'Gold Eksklusif', desc: 'Desain mewah gelap dengan ornamen emas.', activeStyle: 'border-amber-500 bg-amber-50', textStyle: 'text-amber-700', icon: '✨' },
    { id: 'floral', name: 'Botanical Garden', desc: 'Hiasan daun estetik dan bunga-bunga cantik.', activeStyle: 'border-emerald-500 bg-emerald-50', textStyle: 'text-emerald-700', icon: '🌿' },
    { id: 'rustic', name: 'Rustic Vintage', desc: 'Nuansa hangat tekstur kayu dan warna bumi.', activeStyle: 'border-orange-500 bg-orange-50', textStyle: 'text-orange-700', icon: '🍂' },
    { id: 'modern', name: 'Modern Minimalis', desc: 'Bersih, elegan, dengan tipografi yang tegas.', activeStyle: 'border-blue-500 bg-blue-50', textStyle: 'text-blue-700', icon: '💎' },
];

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [invitationId, setInvitationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const [formData, setFormData] = useState({
        slug: '',
        theme_name: 'minimalist',
        groom_name: '',
        bride_name: '',
        event_date: '',
        location_address: '',
        qris_image_url: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            setUserEmail(user.email ?? '');
            setUserId(user.id);

            const { data: existingData, error } = await supabase
                .from('invitations')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (existingData) {
                setInvitationId(existingData.id);

                let formattedDate = '';
                if (existingData.event_date) {
                    const dateObj = new Date(existingData.event_date);
                    formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16);
                }

                setFormData({
                    slug: existingData.slug || '',
                    theme_name: existingData.theme_name || 'minimalist',
                    groom_name: existingData.groom_name || '',
                    bride_name: existingData.bride_name || '',
                    event_date: formattedDate,
                    location_address: existingData.location_address || '',
                    qris_image_url: existingData.qris_image_url || ''
                });
            }
            setIsLoading(false);
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            user_id: userId,
            slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
            theme_name: formData.theme_name,
            groom_name: formData.groom_name,
            bride_name: formData.bride_name,
            event_date: formData.event_date,
            location_address: formData.location_address,
            qris_image_url: formData.qris_image_url,
            is_active: true
        };

        try {
            if (invitationId) {
                const { error } = await supabase.from('invitations').update(payload).eq('id', invitationId);
                if (error) throw error;
                alert('💖 Data undangan berhasil diperbarui!');
            } else {
                const { data, error } = await supabase.from('invitations').insert([payload]).select().single();
                if (error) throw error;
                if (data) setInvitationId(data.id);
                alert('🎉 Data undangan baru berhasil disimpan!');
            }
        } catch (error: any) {
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleThemeChange = (theme: string) => {
        setFormData({ ...formData, theme_name: theme });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-rose-50 flex items-center justify-center">
                <div className="text-rose-600 animate-pulse font-serif text-xl">Memuat Ruang Kerja Anda... 🕊️</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF5F5] p-4 md:p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100">

                {/* Header Dasbor */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-rose-100 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-rose-900 tracking-wide">Studio Undangan</h1>
                        <p className="text-rose-400 mt-2 text-sm">Masuk sebagai: <span className="font-medium text-rose-600">{userEmail}</span></p>
                    </div>
                    <button onClick={handleLogout} className="px-5 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-all duration-300 shadow-sm border border-rose-100">
                        Keluar
                    </button>
                </div>

                <form onSubmit={handleSaveData} className="space-y-8">

                    {/* --- KOTAK PILIHAN TEMA --- */}
                    <div className="bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                        <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2 mb-4">
                            🎨 Pilihan Tema Desain
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {THEME_OPTIONS.map((theme) => (
                                <div
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${formData.theme_name === theme.id
                                            ? theme.activeStyle
                                            : 'border-gray-200 bg-white hover:border-rose-100'
                                        }`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <div className={`font-bold ${formData.theme_name === theme.id ? theme.textStyle : 'text-gray-700'}`}>
                                            {theme.icon} {theme.name}
                                        </div>
                                        {formData.theme_name === theme.id && <span className={theme.textStyle}>✅</span>}
                                    </div>
                                    <div className="text-xs text-gray-500 leading-relaxed">{theme.desc}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">💍 Data Mempelai</h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Nama Pria</label>
                                <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Nama Wanita</label>
                                <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tautan Cantik (URL)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all bg-white" />
                            </div>
                        </div>

                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">💌 Acara & Hadiah</h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tanggal & Waktu Acara</label>
                                <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all text-gray-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Alamat Lengkap Lokasi</label>
                                <textarea name="location_address" value={formData.location_address} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all resize-none" rows={3} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tautan Gambar QRIS</label>
                                <input type="url" name="qris_image_url" value={formData.qris_image_url} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 outline-none transition-all" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-rose-100 flex justify-end">
                        <button type="submit" disabled={isSaving} className="w-full md:w-auto px-8 py-3.5 text-white bg-rose-600 rounded-full hover:bg-rose-700 focus:ring-4 focus:ring-rose-200 font-medium tracking-wide disabled:bg-rose-300 transition-all duration-300 shadow-md shadow-rose-200">
                            {isSaving ? 'Menyimpan Cinta...' : (invitationId ? 'Perbarui Undangan' : 'Simpan Undangan')}
                        </button>
                    </div>
                </form>

                {invitationId && (
                    <div className="mt-12 pt-8 border-t-2 border-dashed border-rose-200">
                        <RsvpViewer invitationId={invitationId} />
                    </div>
                )}

            </div>
        </div>
    );
}