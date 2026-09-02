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

    // State Form Data Undangan lengkap dengan kolom baru
    const [formData, setFormData] = useState({
        groom_name: '',
        groom_parents: '',
        bride_name: '',
        bride_parents: '',
        akad_date: '',
        akad_location: '',
        akad_end_time: '',
        event_date: '',
        location_address: '',
        event_end_time: 'Selesai',
        timezone: 'WIB',
        quote_text: '',
        quote_source: '',
        google_maps_link: '',
        music_url: '',
        hero_image_url: '',
        gallery_images: [] as string[],
        qris_image_url: '',
        bank_name: '',
        bank_account_name: '',
        bank_account_number: ''
    });

    // State Tambahan untuk Pilihan Musik (Preset vs Upload Custom)
    const [musicMode, setMusicMode] = useState<'preset' | 'upload'>('preset');
    const [selectedPresetSong, setSelectedPresetSong] = useState('/music/The Paper Kites - Bloom.mp3');

    // Daftar Katalog Lagu Preset Anda
    const presetMusicList = [
        { name: 'The Paper Kites - Bloom (Default Testing)', url: '/music/The Paper Kites - Bloom.mp3' },
        { name: 'Sweet Piano Instrumental', url: '/music/piano.mp3' },
        { name: 'Warm Ukulele Wedding', url: '/music/ukulele.mp3' },
    ];

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
                
                // Format tanggal untuk input datetime-local (Akad)
                let formattedAkadDate = '';
                if (data.akad_date) {
                    const dateObj = new Date(data.akad_date);
                    formattedAkadDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                }

                // Format tanggal untuk input datetime-local (Resepsi)
                let formattedResepsiDate = '';
                if (data.event_date) {
                    const dateObj = new Date(data.event_date);
                    formattedResepsiDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                }

                setFormData({
                    groom_name: data.groom_name || '',
                    groom_parents: data.groom_parents || '',
                    bride_name: data.bride_name || '',
                    bride_parents: data.bride_parents || '',
                    akad_date: formattedAkadDate,
                    akad_location: data.akad_location || '',
                    akad_end_time: data.akad_end_time || '',
                    event_date: formattedResepsiDate,
                    location_address: data.location_address || '',
                    event_end_time: data.event_end_time || 'Selesai',
                    timezone: data.timezone || 'WIB',
                    quote_text: data.quote_text || '',
                    quote_source: data.quote_source || '',
                    google_maps_link: data.google_maps_link || '',
                    music_url: data.music_url || '/music/The Paper Kites - Bloom.mp3',
                    hero_image_url: data.hero_image_url || '',
                    gallery_images: data.gallery_images || [],
                    qris_image_url: data.qris_image_url || '',
                    bank_name: data.bank_name || '',
                    bank_account_name: data.bank_account_name || '',
                    bank_account_number: data.bank_account_number || ''
                });

                // Cek apakah musik saat ini merupakan salah satu preset atau URL kustom
                const isPreset = presetMusicList.some(song => song.url === data.music_url);
                if (isPreset) {
                    setMusicMode('preset');
                    setSelectedPresetSong(data.music_url);
                } else if (data.music_url) {
                    setMusicMode('upload');
                }

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Fungsi Upload File ke Supabase Storage (Gambar atau Audio MP3 Kustom)
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = fieldName === 'music_url' ? 15 * 1024 * 1024 : 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert(`Ukuran file terlalu besar! Maksimal ${fieldName === 'music_url' ? '15MB' : '5MB'}.`);
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

            if (fieldName === 'music_url') {
                setFormData(prev => ({ ...prev, music_url: publicUrl }));
            } else if (index !== undefined) {
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

    // Fungsi Tambah Slot Foto Galeri Kosong
    const handleAddGallerySlot = () => {
        if (formData.gallery_images.length >= 8) {
            alert('Maksimal 8 foto galeri agar undangan tetap cepat diakses.');
            return;
        }
        setFormData({ ...formData, gallery_images: [...formData.gallery_images, ''] });
    };

    // Fungsi Hapus Foto Galeri Tertentu
    const handleRemoveGalleryImage = (indexToRemove: number) => {
        const updatedGallery = formData.gallery_images.filter((_, idx) => idx !== indexToRemove);
        setFormData({ ...formData, gallery_images: updatedGallery });
    };

    // Simpan Data Undangan ke Database
    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderData) return;

        setIsSaving(true);
        try {
            let finalMusicUrl = formData.music_url;
            if (musicMode === 'preset') {
                finalMusicUrl = selectedPresetSong;
            }

            const payload = {
                groom_name: formData.groom_name,
                groom_parents: formData.groom_parents,
                bride_name: formData.bride_name,
                bride_parents: formData.bride_parents,
                akad_date: formData.akad_date,
                akad_location: formData.akad_location,
                akad_end_time: formData.akad_end_time,
                event_date: formData.event_date,
                location_address: formData.location_address,
                event_end_time: formData.event_end_time,
                timezone: formData.timezone,
                quote_text: formData.quote_text,
                quote_source: formData.quote_source,
                google_maps_link: formData.google_maps_link,
                music_url: finalMusicUrl,
                hero_image_url: formData.hero_image_url,
                gallery_images: formData.gallery_images.filter(img => img.trim() !== ''), // Filter string kosong
                qris_image_url: formData.qris_image_url,
                bank_name: formData.bank_name,
                bank_account_name: formData.bank_account_name,
                bank_account_number: formData.bank_account_number,
                is_active: true
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

    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm text-slate-800";
    const labelClasses = "block text-sm font-bold text-slate-800 mb-1";
    const helperClasses = "text-xs text-slate-500 mb-2 leading-relaxed";
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
                
                {/* BANNER STATUS */}
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
                                Tautan URL Undangan Anda: <strong className="font-mono text-indigo-600">/{orderData.slug}</strong>
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

                {/* TABS KONTEN */}
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
                        {activeTab === 'status' && (
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-slate-900">Informasi Akun & Pesanan</h2>
                                <p className="text-sm text-slate-500">Berikut adalah ringkasan paket undangan digital yang Anda pesan.</p>
                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                                    <div className="flex justify-between"><span className="text-slate-500">Tema Dipilih:</span><span className="font-bold uppercase text-slate-900">{orderData.theme_name}</span></div>
                                    <div className="flex justify-between"><span className="text-slate-500">Total Tagihan:</span><span className="font-bold text-indigo-600">Rp {Number(orderData.amount_billed).toLocaleString('id-ID')}</span></div>
                                </div>
                            </div>
                        )}

                        {/* TAB 2: DATA ACARA & MEMPELAI */}
                        {activeTab === 'data' && (
                            <form onSubmit={handleSaveData} className="space-y-10">
                                
                                {/* 1. INFORMASI MEMPELAI & ORTU */}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Informasi Mempelai</h2>
                                    <p className="text-sm text-slate-500 mb-6">Masukkan nama lengkap serta nama orang tua untuk dicantumkan di bagian sampul depan undangan.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                                        <div className="space-y-4">
                                            <div>
                                                <label className={labelClasses}>Nama Mempelai Pria</label>
                                                <p className={helperClasses}>Contoh: Muhamat Zaqy Munif, S.Kom.</p>
                                                <input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className={inputClasses} placeholder="Nama Pria" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Nama Orang Tua Pria</label>
                                                <p className={helperClasses}>Contoh: Putra dari Bapak H. Ahmad & Ibu Siti</p>
                                                <input type="text" name="groom_parents" value={formData.groom_parents} onChange={handleChange} required className={inputClasses} placeholder="Nama Orang Tua Pria" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className={labelClasses}>Nama Mempelai Wanita</label>
                                                <p className={helperClasses}>Contoh: Intani Fitriya Salasi, A.Md.</p>
                                                <input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className={inputClasses} placeholder="Nama Wanita" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Nama Orang Tua Wanita</label>
                                                <p className={helperClasses}>Contoh: Putri dari Bapak Budi & Ibu Rina</p>
                                                <input type="text" name="bride_parents" value={formData.bride_parents} onChange={handleChange} required className={inputClasses} placeholder="Nama Orang Tua Wanita" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 2. ZONA WAKTU */}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Zona Waktu Acara</h2>
                                    <p className="text-sm text-slate-500 mb-4">Pilih zona waktu yang sesuai dengan lokasi tempat acara diselenggarakan.</p>
                                    <select name="timezone" value={formData.timezone} onChange={handleChange} className={inputClasses}>
                                        <option value="WIB">WIB (Waktu Indonesia Barat)</option>
                                        <option value="WITA">WITA (Waktu Indonesia Tengah)</option>
                                        <option value="WIT">WIT (Waktu Indonesia Timur)</option>
                                    </select>
                                </div>

                                {/* 3. JADWAL AKAD & RESEPSI */}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Jadwal & Lokasi Acara</h2>
                                    <p className="text-sm text-slate-500 mb-6">Jika akad dan resepsi dilangsungkan di hari atau jam berbeda, silakan isi masing-masing kolom dengan akurat.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* AKAD */}
                                        <div className="bg-indigo-50/40 p-6 rounded-2xl border border-indigo-100 space-y-4">
                                            <h3 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2">💍 Akad Nikah / Pemberkatan</h3>
                                            <div>
                                                <label className={labelClasses}>Tanggal & Jam Mulai Akad</label>
                                                <input type="datetime-local" name="akad_date" value={formData.akad_date} onChange={handleChange} required className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Jam Selesai / Keterangan</label>
                                                <input type="text" name="akad_end_time" value={formData.akad_end_time} onChange={handleChange} className={inputClasses} placeholder="Contoh: 10:00 atau Selesai" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Lokasi / Alamat Akad</label>
                                                <textarea name="akad_location" value={formData.akad_location} onChange={handleChange} rows={2} required className={`${inputClasses} resize-none`} placeholder="Contoh: Masjid Agung Al-Azhar, Jakarta..." />
                                            </div>
                                        </div>

                                        {/* RESEPSI */}
                                        <div className="bg-emerald-50/40 p-6 rounded-2xl border border-emerald-100 space-y-4">
                                            <h3 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2">🎉 Resepsi Pernikahan</h3>
                                            <div>
                                                <label className={labelClasses}>Tanggal & Jam Mulai Resepsi</label>
                                                <input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className={inputClasses} />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Jam Selesai Resepsi</label>
                                                <input type="text" name="event_end_time" value={formData.event_end_time} onChange={handleChange} className={inputClasses} placeholder="Contoh: 13:00 atau Selesai" />
                                            </div>
                                            <div>
                                                <label className={labelClasses}>Gedung / Alamat Resepsi</label>
                                                <textarea name="location_address" value={formData.location_address} onChange={handleChange} rows={2} required className={`${inputClasses} resize-none`} placeholder="Contoh: Gedung Serbaguna Sasono Utomo..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className={labelClasses}>Link Google Maps (Peta Lokasi Utama)</label>
                                        <p className={helperClasses}>Salin tautan bagikan (Share Link) dari Google Maps lokasi acara Anda.</p>
                                        <input type="url" name="google_maps_link" value={formData.google_maps_link} onChange={handleChange} className={inputClasses} placeholder="https://maps.app.goo.gl/..." />
                                    </div>
                                </div>

                                {/* 4. KUTIPAN / AYAT SUCI */}
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900 mb-1">Kutipan / Ayat Suci</h2>
                                    <p className="text-sm text-slate-500 mb-6">Pilih kutipan ayat suci atau kata-kata bijak yang akan ditampilkan di halaman utama undangan.</p>
                                    
                                    <div className="bg-amber-50/40 p-6 rounded-2xl border border-amber-100 space-y-4">
                                        <div>
                                            <label className={labelClasses}>Isi Kutipan / Terjemahan Ayat</label>
                                            <textarea name="quote_text" value={formData.quote_text} onChange={handleChange} rows={3} className={`${inputClasses} resize-none`} placeholder="Contoh: Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri..." />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Sumber Kutipan / Kitab Suci</label>
                                            <input type="text" name="quote_source" value={formData.quote_source} onChange={handleChange} className={inputClasses} placeholder="Contoh: QS. Ar-Rum: 21 atau Kejadian 2:24" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                                        {isSaving ? 'Menyimpan...' : 'Simpan Data Acara'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 3: GALERI, MUSIK & AMPLOP DIGITAL */}
                        {activeTab === 'galeri' && (
                            <form onSubmit={handleSaveData} className="space-y-10">
                                
                                {/* FOTO UTAMA */}
                                <div className="space-y-3">
                                    <h2 className="text-2xl font-bold text-slate-900">Foto Sampul (Hero Image)</h2>
                                    <p className="text-sm text-slate-500">Foto utama mempelai yang akan tampil paling menonjol saat undangan pertama kali dibuka.</p>
                                    
                                    {formData.hero_image_url && (
                                        <div className="w-36 h-48 rounded-2xl overflow-hidden border shadow-sm">
                                            <img src={formData.hero_image_url} alt="Hero Sampul" className="w-full h-full object-cover" />
                                        </div>
                                    )}
                                    <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'hero_image_url')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 font-semibold cursor-pointer" />
                                </div>

                                {/* GALERI FOTO TAMBAHAN */}
                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h2 className="text-2xl font-bold text-slate-900">Galeri Foto Momen Bahagia</h2>
                                            <p className="text-sm text-slate-500">Unggah beberapa foto prewedding atau momen kebersamaan Anda (Maksimal 8 foto).</p>
                                        </div>
                                        <button 
                                            type="button" 
                                            onClick={handleAddGallerySlot} 
                                            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors"
                                        >
                                            + Tambah Slot Foto
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                        {formData.gallery_images.map((imgUrl, idx) => (
                                            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 relative">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-600">Foto #{idx + 1}</span>
                                                    <button 
                                                        type="button" 
                                                        onClick={() => handleRemoveGalleryImage(idx)} 
                                                        className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1 bg-rose-50 rounded-lg"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>

                                                {imgUrl ? (
                                                    <div className="w-full h-32 rounded-xl overflow-hidden border bg-white">
                                                        <img src={imgUrl} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full h-32 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400 bg-white">
                                                        Belum ada foto
                                                    </div>
                                                )}

                                                <input 
                                                    type="file" 
                                                    accept="image/*" 
                                                    onChange={(e) => handleFileUpload(e, 'gallery_images', idx)} 
                                                    className="text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 font-semibold cursor-pointer w-full" 
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    {formData.gallery_images.length === 0 && (
                                        <p className="text-xs text-slate-400 italic">Belum ada foto galeri ditambahkan. Klik tombol "Tambah Slot Foto" di atas.</p>
                                    )}
                                </div>

                                {/* PENGATURAN MUSIK */}
                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-900">Backsound Musik Latar</h2>
                                    <p className="text-sm text-slate-500">Pilih lagu romantis bawaan dari katalog kami atau unggah file MP3 kesukaan Anda sendiri.</p>
                                    
                                    <div className="flex gap-6 mb-3">
                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                            <input type="radio" name="musicMode" checked={musicMode === 'preset'} onChange={() => setMusicMode('preset')} />
                                            Pilih dari Katalog Lagu
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700">
                                            <input type="radio" name="musicMode" checked={musicMode === 'upload'} onChange={() => setMusicMode('upload')} />
                                            Upload File MP3 Sendiri
                                        </label>
                                    </div>

                                    {musicMode === 'preset' ? (
                                        <select value={selectedPresetSong} onChange={(e) => setSelectedPresetSong(e.target.value)} className={inputClasses}>
                                            {presetMusicList.map((song, idx) => (
                                                <option key={idx} value={song.url}>{song.name}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="space-y-2">
                                            <input type="file" accept="audio/mp3,audio/mpeg" onChange={(e) => handleFileUpload(e, 'music_url')} className="text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 font-semibold cursor-pointer" />
                                            {formData.music_url && !presetMusicList.some(s => s.url === formData.music_url) && (
                                                <p className="text-xs text-emerald-600 font-medium">✓ File MP3 kustom berhasil diunggah.</p>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* AMPLOP DIGITAL */}
                                <div className="space-y-4 pt-6 border-t border-slate-100">
                                    <h2 className="text-2xl font-bold text-slate-900">Amplop Digital (Rekening & QRIS)</h2>
                                    <p className="text-sm text-slate-500">Nomor rekening atau kode QRIS bagi tamu yang ingin mengirimkan hadiah secara nontunai.</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className={labelClasses}>Nama Bank / Dompet Digital</label>
                                            <input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} placeholder="Contoh: BCA / Mandiri / Dana" className={inputClasses} />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Nomor Rekening</label>
                                            <input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} placeholder="Contoh: 1234567890" className={inputClasses} />
                                        </div>
                                        <div>
                                            <label className={labelClasses}>Atas Nama (A/N)</label>
                                            <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleChange} placeholder="Contoh: Romeo Montague" className={inputClasses} />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-slate-200 flex justify-end">
                                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all">
                                        {isSaving ? 'Menyimpan...' : 'Simpan Media & Galeri'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* TAB 4: SEBAR & RSVP */}
                        {activeTab === 'tamu' && orderData.payment_status === 'paid' && (
                            <div className="space-y-8">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
                                    <h3 className="font-bold text-xl text-indigo-900 mb-2">🔗 Generator Tautan Tamu Khusus</h3>
                                    <p className="text-sm text-indigo-700 mb-4">Masukkan nama tamu untuk membuat tautan undangan personal yang otomatis menyapa nama mereka.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" value={guestInputName} onChange={(e) => setGuestInputName(e.target.value)} placeholder="Contoh: Bapak Budi Santoso" className="flex-1 px-4 py-3 border border-indigo-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                                        <button onClick={handleGenerateGuestLink} type="button" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-colors shadow-sm">Buat Tautan</button>
                                    </div>

                                    {generatedGuestLink && (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                                            <span className="text-xs font-mono text-slate-600 break-all">{generatedGuestLink}</span>
                                            <button onClick={() => { navigator.clipboard.writeText(generatedGuestLink); alert('Tautan disalin!'); }} type="button" className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs transition-colors">📋 Salin Tautan</button>
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
