'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer';

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

    const [isActive, setIsActive] = useState<boolean>(false);
    const [paymentStatus, setPaymentStatus] = useState<string>('pending');
    const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);

    const [guestInputName, setGuestInputName] = useState('');
    const [generatedGuestLink, setGeneratedGuestLink] = useState('');

    const router = useRouter();

    const [formData, setFormData] = useState({
        slug: '', theme_name: 'minimalist', groom_name: '', bride_name: '', event_date: '', location_address: '', qris_image_url: ''
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
            theme_name: formData.theme_name, // Tema dikunci tidak berubah setelah tersimpan pertama kali
            groom_name: formData.groom_name,
            bride_name: formData.bride_name,
            event_date: formData.event_date,
            location_address: formData.location_address,
            qris_image_url: formData.qris_image_url,
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
                alert('🎉 Data undangan baru berhasil disimpan! Tema Anda kini telah dikunci.');
            }
        } catch (error: any) {
            alert('Gagal menyimpan data: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

    // --- ATURAN PENGUNCIAN TEMA ---
    const handleThemeChange = (themeId: string) => {
        if (invitationId) {
            alert('🔒 Tema terkunci! Undangan Anda sudah memasuki tahap pembayaran atau aktif. Silakan hubungi Admin jika ingin mengganti tema.');
            return;
        }
        setFormData({ ...formData, theme_name: themeId });
    };
    // -----------------------------

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

    const adminWhatsAppUrl = "https://wa.me/6281234567890?text=" + encodeURIComponent("Halo Admin Creative Soft, saya ingin meminta bantuan untuk mengganti tema undangan saya.");
    const whatsappMessage = `Halo Admin Creative Soft, saya sudah transfer untuk aktivasi undangan dengan tautan: creative-soft.my.id/${formData.slug}. Berikut lampiran bukti transfernya.`;
    const whatsappLink = `https://wa.me/6281234567890?text=${encodeURIComponent(whatsappMessage)}`;

    if (isLoading) return <div className="min-h-screen bg-rose-50 flex items-center justify-center"><div className="text-rose-600 animate-pulse font-serif text-xl">Memuat Ruang Kerja Anda... 🕊️</div></div>;

    return (
        <div className="min-h-screen bg-[#FFF5F5] p-4 md:p-8 font-sans relative">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-rose-100">

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-rose-100 pb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-rose-900 tracking-wide">Studio Undangan</h1>
                        <p className="text-rose-400 mt-2 text-sm">Masuk sebagai: <span className="font-medium text-rose-600">{userEmail}</span></p>
                    </div>
                    <button onClick={handleLogout} className="px-5 py-2.5 text-sm font-medium text-rose-600 bg-rose-50 rounded-full hover:bg-rose-100 hover:text-rose-700 transition-all duration-300 shadow-sm border border-rose-100">
                        Keluar
                    </button>
                </div>

                {invitationId && !isActive && (
                    <div className="mb-8 p-6 bg-amber-50 border border-amber-200 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">⚠️</div>
                            <div>
                                <h3 className="font-bold text-amber-800">Undangan Anda Sedang Ditangguhkan</h3>
                                <p className="text-sm text-amber-700 mt-1">Status Pembayaran Anda saat ini: <span className="font-bold uppercase">{paymentStatus}</span>. Tautan undangan publik terkunci.</p>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 shrink-0 w-full sm:w-auto">
                            <a href={`/${formData.slug}?preview=true`} target="_blank" className="px-4 py-2.5 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 font-bold rounded-lg transition-colors text-sm text-center shadow-sm">
                                👁️ Lihat Preview
                            </a>
                            <button
                                onClick={() => setIsPaymentPopupOpen(true)}
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors text-sm text-center shadow-sm"
                            >
                                Konfirmasi Bayar
                            </button>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSaveData} className="space-y-8">

                    {/* --- KOTAK PILIHAN TEMA DENGAN SISTEM KUNCI --- */}
                    <div className="bg-rose-50/30 p-6 rounded-xl border border-rose-50 relative">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">
                                🎨 Pilihan Tema Desain
                            </h3>
                            {invitationId && (
                                <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1 rounded-full font-medium border border-amber-200">
                                    🔒 Tema Terkunci (Hubungi Admin untuk Ganti)
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {THEME_OPTIONS.map((theme) => (
                                <div
                                    key={theme.id}
                                    onClick={() => handleThemeChange(theme.id)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${formData.theme_name === theme.id
                                            ? theme.activeStyle
                                            : 'border-gray-200 bg-white hover:border-rose-100'
                                        } ${invitationId && formData.theme_name !== theme.id ? 'opacity-50 cursor-not-allowed' : ''}`}
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

                        {invitationId && (
                            <div className="mt-4 text-center">
                                <a
                                    href={adminWhatsAppUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-rose-600 hover:underline font-medium inline-flex items-center gap-1"
                                >
                                    💬 Ingin mengubah tema yang sudah dipilih? Klik untuk hubungi Admin
                                </a>
                            </div>
                        )}
                    </div>
                    {/* --------------------------------------------- */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">💍 Data Mempelai</h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>
                            <div><label className="block text-sm font-medium text-rose-900 mb-1">Nama Pria</label><input type="text" name="groom_name" value={formData.groom_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all" /></div>
                            <div><label className="block text-sm font-medium text-rose-900 mb-1">Nama Wanita</label><input type="text" name="bride_name" value={formData.bride_name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all" /></div>

                            <div>
                                <label className="block text-sm font-medium text-rose-900 mb-1">Tautan Cantik (URL)</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all bg-white" />

                                {invitationId && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        <a href={`/${formData.slug}?preview=true`} target="_blank" className="text-xs bg-gray-100 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-200 font-medium border border-gray-200 flex items-center gap-1 shadow-sm">
                                            👁️ Preview
                                        </a>
                                        {isActive ? (
                                            <a href={`/${formData.slug}`} target="_blank" className="text-xs bg-green-50 text-green-700 px-3 py-2 rounded-md hover:bg-green-100 font-medium border border-green-200 flex items-center gap-1 shadow-sm">
                                                ✨ Link Publik Aktif
                                            </a>
                                        ) : (
                                            <span className="text-xs bg-rose-50 text-rose-600 px-3 py-2 rounded-md font-medium border border-rose-100 flex items-center gap-1 shadow-sm">
                                                🔒 Link Publik Terkunci
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-5 bg-rose-50/30 p-6 rounded-xl border border-rose-50">
                            <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2">💌 Acara & Hadiah</h3>
                            <div className="h-px w-full bg-rose-100 mb-4"></div>
                            <div><label className="block text-sm font-medium text-rose-900 mb-1">Tanggal & Waktu Acara</label><input type="datetime-local" name="event_date" value={formData.event_date} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all text-gray-700" /></div>
                            <div><label className="block text-sm font-medium text-rose-900 mb-1">Alamat Lengkap Lokasi</label><textarea name="location_address" value={formData.location_address} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all resize-none" rows={3} /></div>
                            <div><label className="block text-sm font-medium text-rose-900 mb-1">Tautan Gambar QRIS</label><input type="url" name="qris_image_url" value={formData.qris_image_url} onChange={handleChange} required className="w-full px-4 py-2.5 border border-rose-200 rounded-lg outline-none transition-all" placeholder="Ini QRIS untuk tamu Anda" /></div>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-rose-100 flex justify-end">
                        <button type="submit" disabled={isSaving} className="w-full md:w-auto px-8 py-3.5 text-white bg-rose-600 rounded-full hover:bg-rose-700 font-medium tracking-wide disabled:bg-rose-300 transition-all duration-300 shadow-md">
                            {isSaving ? 'Menyimpan Cinta...' : (invitationId ? 'Perbarui Undangan' : 'Simpan Undangan')}
                        </button>
                    </div>
                </form>

                {invitationId && (
                    <div className="mt-10 bg-rose-50/60 p-6 rounded-2xl border border-rose-100">
                        <h3 className="font-serif font-semibold text-xl text-rose-800 flex items-center gap-2 mb-2">
                            🔗 Generator Tautan Tamu Khusus
                        </h3>
                        <p className="text-xs text-rose-500 mb-4">
                            Masukkan nama tamu di bawah untuk membuat tautan undangan personal yang langsung menyapa nama mereka saat dibuka.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={guestInputName}
                                onChange={(e) => setGuestInputName(e.target.value)}
                                placeholder="Contoh: Bapak Budi Santoso"
                                className="flex-1 px-4 py-2.5 border border-rose-200 rounded-xl bg-white outline-none focus:ring-2 focus:ring-rose-300 text-sm"
                            />
                            <button
                                onClick={handleGenerateGuestLink}
                                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
                            >
                                Buat Tautan
                            </button>
                        </div>

                        {generatedGuestLink && (
                            <div className="mt-4 p-4 bg-white rounded-xl border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                <span className="text-xs font-mono text-gray-600 break-all bg-gray-50 p-2.5 rounded-lg w-full sm:w-auto flex-1 border border-gray-100">
                                    {generatedGuestLink}
                                </span>
                                <button
                                    onClick={handleCopyGeneratedLink}
                                    className="shrink-0 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg text-xs transition-colors shadow-sm"
                                >
                                    📋 Salin Tautan
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {invitationId && (
                    <div className="mt-12 pt-8 border-t-2 border-dashed border-rose-200">
                        <RsvpViewer invitationId={invitationId} />
                    </div>
                )}
            </div>

            {isPaymentPopupOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in-up">
                        <div className="bg-amber-500 p-6 text-center text-white">
                            <h2 className="text-xl font-bold mb-1">Aktivasi Undangan</h2>
                            <p className="text-amber-100 text-sm">Pindai QRIS di bawah untuk membayar</p>
                        </div>

                        <div className="p-8 text-center space-y-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 inline-block">
                                <img
                                    src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg"
                                    alt="QRIS Creative Soft"
                                    className="w-48 h-48 mx-auto object-cover opacity-80"
                                />
                            </div>

                            <div>
                                <p className="text-gray-500 text-sm mb-1">Total Tagihan:</p>
                                <p className="text-3xl font-bold text-gray-800">Rp 99.000</p>
                            </div>

                            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm border border-blue-100 text-left leading-relaxed">
                                <strong>Langkah Konfirmasi:</strong><br />
                                1. Simpan gambar ini atau pindai dengan aplikasi bank/e-wallet Anda.<br />
                                2. Selesaikan pembayaran.<br />
                                3. Klik tombol di bawah untuk mengirim bukti transfer.
                            </div>

                            <div className="flex flex-col gap-3 pt-4">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setIsPaymentPopupOpen(false)}
                                    className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-md transition-colors"
                                >
                                    ✅ Saya Sudah Transfer (Kirim Bukti)
                                </a>
                                <button
                                    onClick={() => setIsPaymentPopupOpen(false)}
                                    className="w-full py-3 text-gray-500 hover:bg-gray-100 font-medium rounded-xl transition-colors"
                                >
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