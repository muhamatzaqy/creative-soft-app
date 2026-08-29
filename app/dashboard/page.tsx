'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer';

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [orderData, setOrderData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'status' | 'data' | 'galeri' | 'tamu'>('status');

    // State Form Data Undangan
    const [formData, setFormData] = useState({
        groom_name: '',
        bride_name: '',
        event_date: '',
        location_address: '',
        google_maps_link: '',
        music_url: '',
        hero_image_url: '',
        gallery_images: [] as string[],
        qris_image_url: '',
        bank_name: '',
        bank_account_name: '',
        bank_account_number: ''
    });

    const [isSaving, setIsSaving] = useState(false);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
    
    // State Generator Tamu
    const [guestInputName, setGuestInputName] = useState('');
    const [generatedGuestLink, setGeneratedGuestLink] = useState('');

    const router = useRouter();

    useEffect(() => {
        const fetchDashboardData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            setUserEmail(user.email ?? '');
            setUserId(user.id);

            // Ambil data pesanan/undangan milik user ini
            const { data, error } = await supabase
                .from('invitations')
                .select('*')
                .eq('user_id', user.id)
                .maybeSingle();

            if (error) {
                console.error(error);
            }

            if (data) {
                setOrderData(data);
                
                // Format tanggal untuk input datetime-local
                let formattedDate = '';
                if (data.event_date) {
                    const dateObj = new Date(data.event_date);
                    formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                }

                setFormData({
                    groom_name: data.groom_name || '',
                    bride_name: data.bride_name || '',
                    event_date: formattedDate,
                    location_address: data.location_address || '',
                    google_maps_link: data.google_maps_link || '',
                    music_url: data.music_url || '',
                    hero_image_url: data.hero_image_url || '',
                    gallery_images: data.gallery_images || [],
                    qris_image_url: data.qris_image_url || '',
                    bank_name: data.bank_name || '',
                    bank_account_name: data.bank_account_name || '',
                    bank_account_number: data.bank_account_number || ''
                });

                // Jika data sudah terbuka, default tab ke 'data'
                if (!data.is_data_locked) {
                    setActiveTab('data');
                }
            }
            setIsLoading(false);
        };

        fetchDashboardData();
    }, [router]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi Upload File ke Supabase Storage
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 5MB.');
            return;
        }

        const stateKey = index !== undefined ? `${fieldName}_${index}` : fieldName;
        setUploadingState(prev => ({ ...prev, [stateKey]: true }));

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const filePath = `${fieldName}/${fileName}`;

            const { error: uploadError } = await supabase.storage.from('invitations').upload(filePath, file);
            if (uploadError) throw uploadError;

            const { data } = supabase.storage.from('invitations').getPublicUrl(filePath);
            const publicUrl = data.publicUrl;

            if (index !== undefined) {
                const newGallery = [...formData.gallery_images];
                newGallery[index] = publicUrl;
                setFormData({ ...formData, gallery_images: newGallery });
            } else {
                setFormData({ ...formData, [fieldName]: publicUrl });
            }
        } catch (error: any) {
            alert('Gagal mengunggah file: ' + error.message);
        } finally {
            setUploadingState(prev => ({ ...prev, [stateKey]: false }));
        }
    };

    // Simpan Data Undangan
    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderData) return;

        setIsSaving(true);
        try {
            const payload = {
                groom_name: formData.groom_name,
                bride_name: formData.bride_name,
                event_date: formData.event_date,
                location_address: formData.location_address,
                google_maps_link: formData.google_maps_link,
                music_url: formData.music_url,
                hero_image_url: formData.hero_image_url,
                gallery_images: formData.gallery_images,
                qris_image_url: formData.qris_image_url,
                bank_name: formData.bank_name,
                bank_account_name: formData.bank_account_name,
                bank_account_number: formData.bank_account_number,
                is_active: true // Otomatis aktifkan link publik jika data disimpan
            };

            const { error } = await supabase
                .from('invitations')
                .update(payload)
                .eq('id', orderData.id);

            if (error) throw error;
            alert('✨ Data undangan berhasil disimpan dan dipublikasikan!');
        } catch (error: any) {
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateGuestLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestInputName.trim()) {
            alert('Masukkan nama tamu terlebih dahulu.');
            return;
        }
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/${orderData.slug}?to=${encodeURIComponent(guestInputName.trim())}`;
        setGeneratedGuestLink(link);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-indigo-600 animate-pulse font-medium text-lg">Memuat Dasbor Klien...</div>
            </div>
        );
    }

    // Jika Klien BELUM memesan tema sama sekali
    if (!orderData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm max-w-md w-full">
                    <div className="text-4xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Belum Ada Tema Dipilih</h2>
                    <p className="text-slate-500 text-sm mb-6">Anda belum memilih desain undangan. Silakan pilih tema di katalog terlebih dahulu.</p>
                    <button onClick={() => router.push('/themes')} className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition-all">
                        Pilih Tema Sekarang
                    </button>
                </div>
            </div>
        );
    }

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all";
    const tabClasses = (tabName: string) => `px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tabName ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">✨</div>
                        <span className="font-bold text-slate-900 tracking-tight">Dasbor Klien</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-500 hidden sm:inline">{userEmail}</span>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all">Keluar</button>
                    </div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                
                {/* BANNER STATUS PEMBAYARAN */}
                <div className="mb-8 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold ${
                            orderData.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                        }`}>
                            {orderData.payment_status === 'paid' ? '✓' : '⏳'}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-slate-900 text-lg">Status Pesanan:</h3>
                                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                    orderData.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                    {orderData.payment_status === 'paid' ? 'Lunas / Aktif' : 'Menunggu Verifikasi Admin'}
                                </span>
                            </div>
                            <p className="text-sm text-slate-500 mt-1">
                                Tautan URL Anda: <strong className="font-mono text-indigo-600">/{orderData.slug}</strong>
                            </p>
                        </div>
                    </div>

                    {orderData.payment_status === 'paid' && (
                        <a 
                            href={`/${orderData.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md transition-all shrink-0"
                        >
                            👁️ Lihat Undangan Publik
                        </a>
                    )}
                </div>

                {/* KONTEN UTAMA DENGAN SISTEM TAB */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                    <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/50">
                        <button onClick={() => setActiveTab('status')} className={tabClasses('status')}>ℹ️ Status & Info</button>
                        <button onClick={() => setActiveTab('data')} className={tabClasses('data')} disabled={orderData.is_data_locked}>
                            💍 Data Acara {orderData.is_data_locked && '🔒'}
                        </button>
                        <button onClick={() => setActiveTab('galeri')} className={tabClasses('galeri')} disabled={orderData.is_data_locked}>
                            📸 Galeri & Musik {orderData.is_data_locked && '🔒'}
                        </button>
                        {orderData.payment_status === 'paid' && (
                            <button onClick={() => setActiveTab('tamu')} className={tabClasses('tamu')}>💌 Sebar & RSVP</button>
                        )}
                    </div>

                    <div className="p-8">
                        {/* TAB 1: STATUS & INFO */}
                        {activeTab === 'status' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">Informasi Akun & Pesanan</h2>
                                <p className="text-slate-500 text-sm leading-relaxed">
                                    {orderData.is_data_locked 
                                        ? 'Form pengisian data saat ini dikunci karena pembayaran Anda sedang diverifikasi oleh Admin. Setelah disetujui, form akan terbuka secara otomatis.'
                                        : 'Pembayaran Anda telah disetujui! Silakan isi data mempelai, waktu, lokasi, dan galeri foto melalui tab di atas.'
                                    }
                                </p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                                    <div className="flex justify-between"><span className="text-slate-500">Tema Dipilih:</span><span className="font-bold uppercase text-slate-900">{orderData.theme_name}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Total Tagihan:</span><span className="font-bold text-indigo-600">Rp {Number(orderData.amount_billed).toLocaleString('id-ID')}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Tanggal Pesan:</span><span className="font-medium text-slate-700">{new Date(orderData.created_at).toLocaleDateString('id-ID')}</span></div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DATA ACARA */}
                        {activeTab === 'data' && (
                            <form onSubmit={handleSaveData} className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Formulir Data Mempelai & Acara</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Nama Pria</label><input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className={inputClasses} placeholder="Contoh: Romeo" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Nama Wanita</label><input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className={inputClasses} placeholder="Contoh: Juliet" /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Tanggal & Waktu Acara</label><input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className={inputClasses} /></div>
                                    <div><label className="block text-sm font-bold text-slate-700 mb-2">Link Google Maps</label><input type="url" name="google_maps_link" value={formData.google_maps_link} onChange={handleChange} className={inputClasses} placeholder="https://maps.app.goo.gl/..." /></div>
                                    <div className="md:col-span-2"><label className="block text-sm font-bold text-slate-700 mb-2">Alamat Lengkap Gedung/Lokasi</label><textarea name="location_address" value={formData.location_address} onChange={handleChange} rows={3} required className={`${inputClasses} resize-none`} placeholder="Nama Gedung, Jalan, Kota..." /></div>
                                </div>
                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                                        {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 3: GALERI & MUSIK */}
                        {activeTab === 'galeri' && (
                            <form onSubmit={handleSaveData} className="space-y-8">
                                <h2 className="text-2xl font-bold text-slate-900">Media, Galeri & Amplop Digital</h2>
                                
                                <div className="space-y-4">
                                    <label className="block text-sm font-bold text-slate-700">Foto Utama (Sampul)</label>
                                    {formData.hero_image_url && <div className="w-32 h-32 rounded-xl overflow-hidden border"><img src={formData.hero_image_url} alt="Hero" className="w-full h-full object-cover" /></div>}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 font-semibold cursor-pointer" />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-bold text-slate-700">Backsound Musik (URL Link MP3)</label>
                                    <input type="url" name="music_url" value={formData.music_url} onChange={handleChange} className={inputClasses} placeholder="https://example.com/music.mp3" />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <label className="block text-sm font-bold text-slate-700">Amplop Digital (Informasi Rekening / QRIS)</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="Nama Bank (BCA/Mandiri)" className={inputClasses} />
                                        <input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} placeholder="Nomor Rekening" className={inputClasses} />
                                        <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleChange} placeholder="Atas Nama (A/N)" className={inputClasses} />
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-100 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                                        {isSaving ? 'Menyimpan...' : 'Simpan Media'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 4: SEBAR & RSVP */}
                        {activeTab === 'tamu' && orderData.payment_status === 'paid' && (
                            <div className="space-y-8">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-bold text-xl text-indigo-900 mb-2">🔗 Generator Tautan Tamu Khusus</h3>
                                    <p className="text-sm text-indigo-700 mb-4">Masukkan nama tamu untuk membuat tautan yang langsung menyapa nama mereka saat dibuka.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" value={guestInputName} onChange={(e) => setGuestInputName(e.target.value)} placeholder="Contoh: Bapak Budi Santoso" className="flex-1 px-4 py-3 border border-indigo-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                        <button onClick={handleGenerateGuestLink} type="button" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">Buat Tautan</button>
                                    </div>

                                    {generatedGuestLink && (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                                            <span className="text-xs font-mono text-slate-600 break-all">{generatedGuestLink}</span>
                                            <button onClick={() => { navigator.clipboard.writeText(generatedGuestLink); alert('Tautan disalin!'); }} type="button" className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors">📋 Salin</button>
                                        </div>
                                    )}
                                </div>

                                <RsvpViewer invitationId={orderData.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
