'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userId, setUserId] = useState<string | null>(null);
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
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
            } else {
                setUserEmail(user.email ?? '');
                setUserId(user.id);
            }
        };
        checkUser();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    // Fungsi untuk menyimpan data ke Supabase
    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            // Menyimpan data ke tabel invitations
            const { error } = await supabase
                .from('invitations')
                .insert([
                    {
                        user_id: userId,
                        slug: formData.slug.toLowerCase().replace(/\s+/g, '-'), // Memastikan URL aman (tanpa spasi)
                        groom_name: formData.groom_name,
                        bride_name: formData.bride_name,
                        event_date: formData.event_date,
                        location_address: formData.location_address,
                        qris_image_url: formData.qris_image_url,
                        is_active: true // Kita aktifkan langsung untuk testing
                    }
                ]);

            if (error) throw error;

            alert('Data undangan berhasil disimpan!');
        } catch (error: any) {
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    // Fungsi untuk menangani perubahan ketikan pada form
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Dashboard Klien</h1>
                        <p className="text-gray-500 mt-1">Selamat datang, {userEmail}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                    >
                        Keluar
                    </button>
                </div>

                {/* Form Input Data */}
                <form onSubmit={handleSaveData} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Bagian Mempelai */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Data Mempelai</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Pria</label>
                                <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" placeholder="Contoh: Romeo" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Nama Wanita</label>
                                <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" placeholder="Contoh: Juliet" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Link Kustom (Slug URL)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" placeholder="Contoh: romeo-juliet" />
                                <p className="text-xs text-gray-500 mt-1">URL Anda nanti: creative-soft.my.id/<b>{formData.slug || '...'}</b></p>
                            </div>
                        </div>

                        {/* Bagian Acara & QRIS */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-lg border-b pb-2">Acara & Pembayaran</h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tanggal Acara</label>
                                <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Alamat Lokasi</label>
                                <textarea name="location_address" value={formData.location_address} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" rows={2} placeholder="Nama gedung dan alamat..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Link Gambar QRIS</label>
                                <input type="url" name="qris_image_url" value={formData.qris_image_url} onChange={handleChange} required className="w-full px-4 py-2 mt-1 border rounded-md" placeholder="https://contoh.com/gambar-qris.jpg" />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full md:w-auto px-6 py-3 text-white bg-gray-900 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
                        >
                            {isSaving ? 'Menyimpan...' : 'Simpan Data Undangan'}
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}