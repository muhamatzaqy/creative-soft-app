'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [invitationId, setInvitationId] = useState<string | null>(null); // State untuk menyimpan ID undangan jika sudah ada
    const [isLoading, setIsLoading] = useState(true); // State loading saat mengambil data
    const router = useRouter();

    // State untuk menyimpan isian form
    const [formData, setFormData] = useState({
        slug: '',
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

            // Cek apakah user ini SUDAH punya data undangan sebelumnya
            const { data: existingData, error } = await supabase
                .from('invitations')
                .select('*')
                .eq('user_id', user.id)
                .single(); // Mengambil 1 data spesifik milik user tersebut

            if (existingData) {
                // Jika data ditemukan, simpan ID-nya dan isi form dengan data lama
                setInvitationId(existingData.id);

                // Format tanggal dari database (ISO) agar cocok dengan input datetime-local
                let formattedDate = '';
                if (existingData.event_date) {
                    const dateObj = new Date(existingData.event_date);
                    formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
                        .toISOString()
                        .slice(0, 16);
                }

                setFormData({
                    slug: existingData.slug || '',
                    groom_name: existingData.groom_name || '',
                    bride_name: existingData.bride_name || '',
                    event_date: formattedDate,
                    location_address: existingData.location_address || '',
                    qris_image_url: existingData.qris_image_url || ''
                });
            }
            setIsLoading(false); // Selesai memuat
        };

        fetchUserData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Fungsi untuk menyimpan ATAU memperbarui data ke Supabase
    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const payload = {
            user_id: userId,
            slug: formData.slug.toLowerCase().replace(/\s+/g, '-'),
            groom_name: formData.groom_name,
            bride_name: formData.bride_name,
            event_date: formData.event_date,
            location_address: formData.location_address,
            qris_image_url: formData.qris_image_url,
            is_active: true
        };

        try {
            if (invitationId) {
                // JIKA SUDAH ADA DATA: Lakukan proses UPDATE (Edit)
                const { error } = await supabase
                    .from('invitations')
                    .update(payload)
                    .eq('id', invitationId);

                if (error) throw error;
                alert('💖 Data undangan berhasil diperbarui!');
            } else {
                // JIKA BELUM ADA DATA: Lakukan proses INSERT (Buat Baru)
                const { data, error } = await supabase
                    .from('invitations')
                    .insert([payload])
                    .select()
                    .single();

                if (error) throw error;
                if (data) setInvitationId(data.id); // Simpan ID baru agar edit selanjutnya lancar
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

    // Tampilan saat data sedang dimuat agar terlihat profesional
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

                {/* Header Dashboard */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-rose-100 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-rose-900 tracking-wide">Studio Undangan</h1>
                        <p className="text-rose-400 mt-2 text-sm">Masuk sebagai: <span className="font-medium text-rose-600">{userEmail}</span></p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-5 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-all duration-300 shadow-sm border border-rose-100"
                    >
                        Keluar
                    </button>
                </div>

                {/* Form Input Data */}
                <form onSubmit={handleSaveData} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                        {/* Bagian Mempelai */}
                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">
                                💍 Data Mempelai
                            </h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>

                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Nama Pria</label>
                                <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" placeholder="Contoh: Romeo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Nama Wanita</label>
                                <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" placeholder="Contoh: Juliet" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tautan Cantik (URL)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all bg-white" placeholder="contoh: romeo-juliet" />
                                <p className="text-xs text-rose-500 mt-2">Undangan Anda: <span className="font-medium">creative-soft.my.id/{formData.slug || '...'}</span></p>
                            </div>
                        </div>

                        {/* Bagian Acara & QRIS */}
                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">
                                💌 Acara & Hadiah
                            </h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>

                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tanggal & Waktu Acara</label>
                                <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all text-gray-700" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Alamat Lengkap Lokasi</label>
                                <textarea name="location_address" value={formData.location_address} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all resize-none" rows={3} placeholder="Tuliskan nama gedung dan jalan..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tautan Gambar QRIS</label>
                                <input type="url" name="qris_image_url" value={formData.qris_image_url} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-rose-300 outline-none transition-all" placeholder="https://contoh.com/gambar-qris.jpg" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-rose-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full md:w-auto px-8 py-3.5 text-white bg-rose-600 rounded-full hover:bg-rose-700 focus:ring-4 focus:ring-rose-200 font-medium tracking-wide disabled:bg-rose-300 transition-all duration-300 shadow-md shadow-rose-200"
                        >
                            {isSaving ? 'Menyimpan Cinta...' : (invitationId ? 'Perbarui Undangan' : 'Simpan Undangan')}
                        </button>
                    </div>
                </form>

                {/* --- KODE TAMBAHAN UNTUK MENAMPILKAN TABEL RSVP --- */}
                {invitationId && (
                    <div className="mt-12 pt-8 border-t-2 border-dashed border-rose-200">
                        <RsvpViewer invitationId={invitationId} />
                    </div>
                )}

            </div>
        </div>
    );
}