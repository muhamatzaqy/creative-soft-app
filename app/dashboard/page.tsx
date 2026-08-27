'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer';

// --- DAFTAR TEMA & LIMIT GALERI FOTO ---
const THEME_OPTIONS = [
    { id: 'minimalist', name: 'Romantis Pink', desc: 'Efek kaca embun. Max 4 Foto.', activeStyle: 'border-indigo-500 bg-indigo-50', textStyle: 'text-indigo-700', icon: '🌸', maxGallery: 4 },
    { id: 'elegant', name: 'Gold Eksklusif', desc: 'Desain mewah gelap. Max 3 Foto.', activeStyle: 'border-indigo-500 bg-indigo-50', textStyle: 'text-indigo-700', icon: '✨', maxGallery: 3 },
    { id: 'floral', name: 'Botanical Garden', desc: 'Hiasan daun estetik. Max 2 Foto.', activeStyle: 'border-indigo-500 bg-indigo-50', textStyle: 'text-indigo-700', icon: '🌿', maxGallery: 2 },
    { id: 'rustic', name: 'Rustic Vintage', desc: 'Nuansa tekstur kayu. Max 4 Foto.', activeStyle: 'border-indigo-500 bg-indigo-50', textStyle: 'text-indigo-700', icon: '🍂', maxGallery: 4 },
    { id: 'modern', name: 'Modern Minimalis', desc: 'Bersih, elegan. Max 2 Foto.', activeStyle: 'border-indigo-500 bg-indigo-50', textStyle: 'text-indigo-700', icon: '💎', maxGallery: 2 },
];

export default function DashboardPage() {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [invitationId, setInvitationId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isActive, setIsActive] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

    const [guestInputName, setGuestInputName] = useState('');
    const [generatedGuestLink, setGeneratedGuestLink] = useState('');

    const [isEditMode, setIsEditMode] = useState(true);
    const [uploadingState, setUploadingState] = useState<{ [key: string]: boolean }>({});
    
    // STATE BARU UNTUK NAVIGASI TAB
    const [activeTab, setActiveTab] = useState<'tema' | 'data' | 'galeri' | 'tamu'>('tema');

    const router = useRouter();

    const [formData, setFormData] = useState({
        slug: '', theme_name: 'minimalist', groom_name: '', bride_name: '', event_date: '', location_address: '', qris_image_url: '',
        hero_image_url: '', gallery_images: [] as string[], google_maps_link: '', bank_name: '', bank_account_name: '', bank_account_number: ''
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) { router.push('/login'); return; }

            setUserEmail(user.email ?? '');
            setUserId(user.id);

            const { data: existingData } = await supabase.from('invitations').select('*').eq('user_id', user.id).single();

            if (existingData) {
                setInvitationId(existingData.id);
                setIsActive(existingData.is_active);
                setPaymentStatus(existingData.payment_status);
                setIsEditMode(false);

                let formattedDate = '';
                if (existingData.event_date) {
                    const dateObj = new Date(existingData.event_date);
                    formattedDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                }

                setFormData({
                    slug: existingData.slug || '',
                    theme_name: existingData.theme_name || 'minimalist',
                    groom_name: existingData.groom_name || '',
                    bride_name: existingData.bride_name || '',
                    event_date: formattedDate,
                    location_address: existingData.location_address || '',
                    qris_image_url: existingData.qris_image_url || '',
                    hero_image_url: existingData.hero_image_url || '',
                    gallery_images: existingData.gallery_images || [],
                    google_maps_link: existingData.google_maps_link || '',
                    bank_name: existingData.bank_name || '',
                    bank_account_name: existingData.bank_account_name || '',
                    bank_account_number: existingData.bank_account_number || ''
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

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, index?: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('Ukuran foto terlalu besar. Maksimal 5MB.');
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
            alert('Gagal mengunggah foto: ' + error.message);
        } finally {
            setUploadingState(prev => ({ ...prev, [stateKey]: false }));
        }
    };

    const handleSaveData = async (e: React.FormEvent) => {
        e.preventDefault();
        if (invitationId) {
            const isConfirmed = window.confirm("Apakah Anda yakin ingin menyimpan perubahan data ini?");
            if (!isConfirmed) return;
        }

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
            hero_image_url: formData.hero_image_url,
            gallery_images: formData.gallery_images,
            google_maps_link: formData.google_maps_link,
            bank_name: formData.bank_name,
            bank_account_name: formData.bank_account_name,
            bank_account_number: formData.bank_account_number
        };

        try {
            if (invitationId) {
                const { error } = await supabase.from('invitations').update(payload).eq('id', invitationId);
                if (error) throw error;
                alert('💖 Data undangan berhasil diperbarui!');
                setIsEditMode(false);
            } else {
                const { data, error } = await supabase.from('invitations').insert([payload]).select().single();
                if (error) throw error;
                if (data) setInvitationId(data.id);
                alert('🎉 Data undangan baru berhasil disimpan! Tema Anda kini telah dikunci.');
                setIsEditMode(false);
            }
        } catch (error: any) {
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    const handleThemeChange = (themeId: string) => {
        if (invitationId) {
            alert('🔒 Tema terkunci! Undangan Anda sudah tersimpan. Silakan hubungi Admin jika ingin mengganti tema.');
            return;
        }

        const selectedTheme = THEME_OPTIONS.find(t => t.id === themeId);
        const currentGallery = [...formData.gallery_images];
        if (selectedTheme && currentGallery.length > selectedTheme.maxGallery) {
            currentGallery.length = selectedTheme.maxGallery;
        }
        setFormData({ ...formData, theme_name: themeId, gallery_images: currentGallery });
    };

    const handleGenerateGuestLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (!guestInputName.trim()) { alert('Silakan masukkan nama tamu terlebih dahulu.'); return; }
        if (!formData.slug) { alert('Mohon isi dan simpan Tautan Cantik (URL) terlebih dahulu.'); return; }
        const baseUrl = window.location.origin;
        const formattedLink = `${baseUrl}/${formData.slug}?to=${encodeURIComponent(guestInputName.trim())}`;
        setGeneratedGuestLink(formattedLink);
    };

    const handleCopyGeneratedLink = () => {
        navigator.clipboard.writeText(generatedGuestLink);
        alert('📋 Tautan khusus tamu berhasil disalin!');
    };

    // Style Khusus
    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all focus:ring-2 focus:ring-indigo-500 focus:bg-white disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed";
    const fileInputClasses = "w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    const tabClasses = (tabName: string) => `px-6 py-4 font-semibold text-sm transition-all border-b-2 whitespace-nowrap ${activeTab === tabName ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`;

    const adminWhatsAppUrl = "https://wa.me/6281234567890?text=" + encodeURIComponent("Halo Admin Creative Soft, saya ingin meminta bantuan untuk mengganti tema undangan saya.");
    const whatsappMessage = `Halo Admin Creative Soft, saya sudah transfer untuk aktivasi undangan dengan tautan: creative-soft.my.id/${formData.slug}. Berikut lampiran bukti transfernya.`;
    const whatsappLink = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;

    const activeThemeConfig = THEME_OPTIONS.find(t => t.id === formData.theme_name);
    const maxGalleryPhotos = activeThemeConfig ? activeThemeConfig.maxGallery : 0;

    if (isLoading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="text-indigo-600 animate-pulse font-medium text-lg flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Memuat Ruang Kerja...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 relative">
            {/* HEADER STICKY */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">✨</div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Studio Undangan</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block text-sm text-slate-500 font-medium">{userEmail}</span>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-all border border-transparent hover:border-rose-100">
                            Keluar
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                
                {/* ALERT PEMBAYARAN PENDING */}
                {invitationId && !isActive && (
                    <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm text-2xl">💳</div>
                            <div>
                                <h3 className="font-bold text-amber-900 text-lg">Selesaikan Pembayaran</h3>
                                <p className="text-sm text-amber-700 mt-0.5">Tautan publik Anda terkunci. Lakukan konfirmasi pembayaran untuk mengaktifkan.</p>
                            </div>
                        </div>
                        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                            <a href={`/${formData.slug}?preview=true`} target="_blank" className="px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold rounded-xl transition-colors text-sm text-center shadow-sm">
                                👁️ Preview
                            </a>
                            <button onClick={() => setIsPaymentPopupOpen(true)} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all text-sm">
                                Konfirmasi Bayar
                            </button>
                        </div>
                    </div>
                )}

                {/* AREA KERJA UTAMA */}
                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-200 overflow-hidden">
                    
                    {/* TAB NAVIGASI */}
                    <div className="flex overflow-x-auto border-b border-slate-200 hide-scrollbar bg-slate-50/50">
                        <button type="button" onClick={() => setActiveTab('tema')} className={tabClasses('tema')}>🎨 1. Tema</button>
                        <button type="button" onClick={() => setActiveTab('data')} className={tabClasses('data')}>💍 2. Data Acara</button>
                        <button type="button" onClick={() => setActiveTab('galeri')} className={tabClasses('galeri')}>📸 3. Galeri & Amplop</button>
                        {invitationId && <button type="button" onClick={() => setActiveTab('tamu')} className={tabClasses('tamu')}>💌 4. Sebar & Tamu</button>}
                    </div>

                    <form onSubmit={handleSaveData} className="p-6 md:p-10">
                        
                        {/* KONTEN TAB 1: TEMA */}
                        {activeTab === 'tema' && (
                            <div className="animate-fade-in-up">
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-bold text-slate-900">Pilih Desain Undangan</h2>
                                    {invitationId && <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full font-medium border border-slate-200">🔒 Tema Terkunci</span>}
                                </div>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                    {THEME_OPTIONS.map((theme) => (
                                        <div
                                            key={theme.id}
                                            onClick={() => handleThemeChange(theme.id)}
                                            className={`cursor-pointer p-5 rounded-2xl border-2 transition-all duration-300 ${formData.theme_name === theme.id ? theme.activeStyle : 'border-slate-100 bg-white hover:border-indigo-200 shadow-sm'} ${invitationId && formData.theme_name !== theme.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex justify-between items-center mb-3">
                                                <div className={`font-bold text-lg ${formData.theme_name === theme.id ? theme.textStyle : 'text-slate-800'}`}>
                                                    {theme.icon} {theme.name}
                                                </div>
                                                {formData.theme_name === theme.id && <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs">✓</div>}
                                            </div>
                                            <div className="text-sm text-slate-500 leading-relaxed">{theme.desc}</div>
                                        </div>
                                    ))}
                                </div>
                                {invitationId && (
                                    <div className="mt-6 text-center">
                                        <a href={adminWhatsAppUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 hover:underline font-medium">💬 Ingin mengubah tema? Hubungi Admin</a>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* KONTEN TAB 2: DATA ACARA */}
                        {activeTab === 'data' && (
                            <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-5">
                                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Data Mempelai</h2>
                                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pria</label><input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required disabled={!isEditMode} className={inputClasses} /></div>
                                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Wanita</label><input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required disabled={!isEditMode} className={inputClasses} /></div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tautan Cantik (URL)</label>
                                        <input type="text" name="slug" value={formData.slug} onChange={handleChange} required disabled={!isEditMode} placeholder="contoh: romeo-juliet" className={inputClasses} />
                                        {invitationId && (
                                            <div className="flex gap-2 mt-3">
                                                {isActive ? (
                                                    <a href={`/${formData.slug}`} target="_blank" className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg font-medium border border-emerald-200">✨ Link Aktif</a>
                                                ) : (
                                                    <span className="text-xs bg-amber-50 text-amber-700 px-3 py-1.5 rounded-lg font-medium border border-amber-200">🔒 Link Terkunci</span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-5">
                                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Waktu & Lokasi</h2>
                                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Tanggal & Waktu Acara</label><input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required disabled={!isEditMode} className={inputClasses} /></div>
                                    <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label><textarea name="location_address" value={formData.location_address} onChange={handleChange} required disabled={!isEditMode} className={`${inputClasses} resize-none`} rows={3} /></div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Link Google Maps</label>
                                        <input type="url" name="google_maps_link" value={formData.google_maps_link} onChange={handleChange} disabled={!isEditMode} placeholder="https://maps.app.goo.gl/..." className={inputClasses} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* KONTEN TAB 3: GALERI & AMPLOP */}
                        {activeTab === 'galeri' && (
                            <div className="animate-fade-in-up grid grid-cols-1 md:grid-cols-2 gap-10">
                                
                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Foto Utama & Galeri</h2>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                        <label className="block text-sm font-bold text-slate-900 mb-3">Foto Utama (Sampul)</label>
                                        {formData.hero_image_url && (
                                            <div className="mb-4 relative w-full h-40 rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                                                <img src={formData.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" disabled={!isEditMode || uploadingState['hero_image_url']} onChange={(e) => handleFileUpload(e, 'hero_image_url')} className={fileInputClasses} />
                                        {uploadingState['hero_image_url'] && <p className="text-xs text-indigo-600 mt-2 font-medium">Mengunggah foto...</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-slate-900 mb-3">Foto Galeri (Batas Tema: {maxGalleryPhotos})</label>
                                        <div className="space-y-3">
                                            {Array.from({ length: maxGalleryPhotos }).map((_, index) => (
                                                <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                                                    <div className="w-16 h-16 shrink-0 bg-white rounded-lg overflow-hidden border border-slate-200 flex items-center justify-center text-slate-400 text-xs shadow-sm">
                                                        {formData.gallery_images[index] ? <img src={formData.gallery_images[index]} alt={`Gallery ${index}`} className="w-full h-full object-cover" /> : <span>Foto {index + 1}</span>}
                                                    </div>
                                                    <div className="flex-1 w-full">
                                                        <input type="file" accept="image/*" disabled={!isEditMode || uploadingState[`gallery_images_${index}`]} onChange={(e) => handleFileUpload(e, 'gallery_images', index)} className={fileInputClasses} />
                                                        {uploadingState[`gallery_images_${index}`] && <p className="text-xs text-indigo-600 mt-1 font-medium">Mengunggah...</p>}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">Amplop Digital</h2>
                                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                                        <label className="block text-sm font-bold text-slate-900 mb-3">Barcode QRIS (Opsional)</label>
                                        {formData.qris_image_url && (
                                            <div className="mb-4 relative w-32 h-32 mx-auto rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white p-2">
                                                <img src={formData.qris_image_url} alt="QRIS Preview" className="w-full h-full object-contain" />
                                            </div>
                                        )}
                                        <input type="file" accept="image/*" disabled={!isEditMode || uploadingState['qris_image_url']} onChange={(e) => handleFileUpload(e, 'qris_image_url')} className={fileInputClasses} />
                                        {uploadingState['qris_image_url'] && <p className="text-xs text-indigo-600 mt-2 font-medium">Mengunggah barcode...</p>}
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Bank / E-Wallet</label><input type="text" name="bank_name" value={formData.bank_name} onChange={handleChange} disabled={!isEditMode} placeholder="Contoh: BCA / GoPay" className={inputClasses} /></div>
                                        <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">No. Rekening</label><input type="text" name="bank_account_number" value={formData.bank_account_number} onChange={handleChange} disabled={!isEditMode} placeholder="Contoh: 12345678" className={inputClasses} /></div>
                                        <div><label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Pemilik</label><input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleChange} disabled={!isEditMode} placeholder="A/N Pemilik Rekening" className={inputClasses} /></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* TOMBOL SIMPAN / EDIT (Tampil di tab 1,2,3) */}
                        {activeTab !== 'tamu' && (
                            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap justify-end gap-3">
                                {invitationId && !isEditMode ? (
                                    <button type="button" onClick={() => setIsEditMode(true)} className="px-8 py-3 bg-white border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-bold rounded-xl transition-all shadow-sm">
                                        ✏️ Edit Data
                                    </button>
                                ) : (
                                    <>
                                        {invitationId && isEditMode && (
                                            <button type="button" onClick={() => setIsEditMode(false)} className="px-8 py-3 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl transition-all">Batal Edit</button>
                                        )}
                                        <button type="submit" disabled={isSaving || Object.values(uploadingState).some(state => state)} className="px-8 py-3 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-bold tracking-wide disabled:bg-slate-300 transition-all shadow-md">
                                            {isSaving ? 'Menyimpan...' : (invitationId ? 'Simpan Perubahan' : 'Buat Undangan')}
                                        </button>
                                    </>
                                )}
                            </div>
                        )}

                        {/* KONTEN TAB 4: TAMU & SEBAR */}
                        {activeTab === 'tamu' && invitationId && (
                            <div className="animate-fade-in-up">
                                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-10">
                                    <h3 className="font-bold text-xl text-indigo-900 mb-2">🔗 Generator Tautan Tamu Khusus</h3>
                                    <p className="text-sm text-indigo-700 mb-5">Masukkan nama tamu untuk membuat tautan yang langsung menyapa nama mereka.</p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input type="text" value={guestInputName} onChange={(e) => setGuestInputName(e.target.value)} placeholder="Contoh: Bapak Budi Santoso" className="flex-1 px-4 py-3 border border-indigo-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-indigo-500" />
                                        <button onClick={handleGenerateGuestLink} type="button" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors shadow-sm">Buat Tautan</button>
                                    </div>

                                    {generatedGuestLink && (
                                        <div className="mt-5 p-4 bg-white rounded-xl border border-indigo-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
                                            <span className="text-sm font-mono text-slate-600 break-all w-full sm:w-auto flex-1">{generatedGuestLink}</span>
                                            <button onClick={handleCopyGeneratedLink} type="button" className="shrink-0 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors">📋 Salin</button>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-8 border-t border-slate-200">
                                    <RsvpViewer invitationId={invitationId} />
                                </div>
                            </div>
                        )}
                    </form>
                </div>
            </div>

            {/* MODAL PEMBAYARAN */}
            {isPaymentPopupOpen && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-indigo-600 p-6 text-center text-white">
                            <h2 className="text-xl font-bold mb-1">Aktivasi Undangan</h2>
                            <p className="text-indigo-200 text-sm">Pindai QRIS di bawah untuk membayar</p>
                        </div>
                        <div className="p-8 text-center space-y-6">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 inline-block shadow-sm">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS" className="w-48 h-48 mx-auto object-cover opacity-90" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm mb-1 font-medium">Total Tagihan:</p>
                                <p className="text-3xl font-bold text-slate-900">Rp 99.000</p>
                            </div>
                            <div className="bg-indigo-50 text-indigo-800 p-4 rounded-xl text-sm border border-indigo-100 text-left leading-relaxed">
                                <strong>Langkah Konfirmasi:</strong><br />
                                1. Pindai dengan aplikasi bank/e-wallet Anda.<br />
                                2. Selesaikan pembayaran.<br />
                                3. Klik tombol di bawah untuk kirim bukti.
                            </div>
                            <div className="flex flex-col gap-3 pt-2">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" onClick={() => setIsPaymentPopupOpen(false)} className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-colors block text-center">
                                    ✅ Saya Sudah Transfer
                                </a>
                                <button onClick={() => setIsPaymentPopupOpen(false)} className="w-full py-3 text-slate-500 hover:bg-slate-100 font-bold rounded-xl transition-colors">
                                    Nanti Saja
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
