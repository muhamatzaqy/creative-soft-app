'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../src/lib/supabase';
import Link from 'next/link';

type Theme = {
    id: string;
    name: string;
    price: number;
    thumbnail_url: string | null;
};

// Memisahkan komponen form agar bisa menggunakan useSearchParams di dalam Suspense
function CheckoutForm() {
    const searchParams = useSearchParams();
    const themeId = searchParams.get('theme');
    const router = useRouter();

    const [userId, setUserId] = useState<string | null>(null);
    const [theme, setTheme] = useState<Theme | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // State Form
    const [slug, setSlug] = useState('');
    const [proofFile, setProofFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const initializeCheckout = async () => {
            // 1. Cek Login
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push(`/login?redirect=/dashboard/checkout?theme=${themeId}`);
                return;
            }
            setUserId(user.id);

            // 2. Cek apakah user sudah punya undangan sebelumnya
            const { data: existingOrder } = await supabase
                .from('invitations')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (existingOrder) {
                alert('Anda sudah memiliki undangan aktif atau pesanan yang sedang diproses. Mengalihkan ke Dasbor...');
                router.push('/dashboard');
                return;
            }

            // 3. Ambil data tema berdasarkan URL
            if (themeId) {
                const { data, error } = await supabase
                    .from('themes')
                    .select('*')
                    .eq('id', themeId)
                    .single();

                if (!error && data) {
                    setTheme(data);
                } else {
                    alert('Tema tidak ditemukan!');
                    router.push('/themes');
                }
            }
            setIsLoading(false);
        };

        initializeCheckout();
    }, [themeId, router]);

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        
        // Validasi ukuran max 2MB
        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file terlalu besar! Maksimal 2MB.');
            e.target.value = '';
            return;
        }
        setProofFile(file);
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!slug.trim()) return alert('Tautan undangan wajib diisi!');
        if (!proofFile) return alert('Silakan unggah bukti transfer Anda!');
        if (!userId || !theme) return;

        // Validasi format slug (hanya huruf, angka, dan strip)
        const slugRegex = /^[a-z0-9-]+$/;
        if (!slugRegex.test(slug.toLowerCase())) {
            return alert('Tautan hanya boleh berisi huruf kecil, angka, dan tanda strip (-). Contoh: romeo-juliet');
        }

        setIsSubmitting(true);
        const formattedSlug = slug.toLowerCase().trim();

        try {
            // 1. Cek apakah Slug sudah ada yang pakai
            const { data: slugCheck } = await supabase.from('invitations').select('id').eq('slug', formattedSlug).maybeSingle();
            if (slugCheck) {
                setIsSubmitting(false);
                return alert('Tautan URL tersebut sudah digunakan orang lain. Silakan pilih nama lain!');
            }

            // 2. Upload Bukti Transfer ke Storage 'payment_proofs'
            const fileExt = proofFile.name.split('.').pop();
            const fileName = `${userId}-${Date.now()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage.from('payment_proofs').upload(fileName, proofFile);
            
            if (uploadError) throw new Error('Gagal mengunggah bukti transfer: ' + uploadError.message);

            const { data: publicUrlData } = supabase.storage.from('payment_proofs').getPublicUrl(fileName);
            const paymentProofUrl = publicUrlData.publicUrl;

            // 3. Simpan Pesanan ke Tabel Invitations
            const payload = {
                user_id: userId,
                slug: formattedSlug,
                theme_id: theme.id,
                amount_billed: theme.price,
                payment_status: 'waiting_verification',
                is_data_locked: true,
                payment_proof_url: paymentProofUrl,
            };

            const { error: insertError } = await supabase.from('invitations').insert([payload]);
            if (insertError) throw new Error('Gagal membuat pesanan: ' + insertError.message);

            // 4. Redirect ke Dasbor Utama
            alert('✅ Pesanan berhasil dibuat! Menunggu verifikasi Admin.');
            router.push('/dashboard');

        } catch (error: any) {
            alert(error.message);
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-indigo-600 animate-pulse font-medium text-lg flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Menyiapkan ruang pembayaran...
                </div>
            </div>
        );
    }

    if (!theme) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <Link href="/themes" className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-2">
                        &larr; Kembali ke Katalog
                    </Link>
                    <div className="font-bold text-slate-900 tracking-tight">Checkout Pembayaran</div>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* KOLOM KIRI: Ringkasan Pesanan & QRIS */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Ringkasan Pesanan</h2>
                            
                            <div className="flex gap-4 items-center mb-6">
                                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                                    {theme.thumbnail_url ? (
                                        <img src={theme.thumbnail_url} alt="Thumbnail" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-3xl">✨</div>
                                    )}
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest mb-1">Tema Desain</p>
                                    <h3 className="text-xl font-bold text-slate-900">{theme.name}</h3>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <span className="font-medium text-slate-600">Total Tagihan</span>
                                <span className="text-xl font-black text-indigo-600">{formatRupiah(theme.price)}</span>
                            </div>
                        </div>

                        {/* KOTAK INSTRUKSI QRIS */}
                        <div className="bg-indigo-900 text-white rounded-3xl p-8 shadow-md relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-bl-full -mr-10 -mt-10 z-0"></div>
                            <div className="relative z-10">
                                <h2 className="text-sm font-bold text-indigo-300 uppercase tracking-widest mb-3">Scan QRIS Pembayaran</h2>
                                <p className="text-sm text-indigo-100 mb-6 leading-relaxed">
                                    Gunakan GoPay, OVO, DANA, BCA, atau aplikasi perbankan apa pun untuk memindai QRIS di bawah ini sejumlah <strong className="text-white">{formatRupiah(theme.price)}</strong>.
                                </p>
                                
                                {/* Gambar QRIS */}
                                <div className="bg-white p-4 rounded-2xl shadow-inner flex flex-col items-center mb-4">
                                    <img src="/qris-admin.jpg" alt="QRIS Software Solution" className="w-56 h-auto rounded-xl object-contain" />
                                    <span className="text-[10px] text-slate-500 mt-2 font-mono font-bold tracking-widest">SOFTWARE SOLUTION</span>
                                </div>

                                <div className="bg-indigo-950/50 p-4 rounded-xl border border-indigo-800 backdrop-blur-sm text-xs space-y-1">
                                    <p className="text-indigo-300 font-medium">Informasi:</p>
                                    <p className="text-indigo-100">Pembayaran diproses instan via QRIS Nasional (GPN). Setelah transfer, unggah buktinya di samping.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* KOLOM KANAN: Form Konfirmasi */}
                    <div className="lg:col-span-7">
                        <form onSubmit={handleCheckout} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Konfirmasi Pembayaran</h2>
                            <p className="text-slate-500 text-sm mb-8">Amankan tautan URL Anda dan unggah bukti transfer/screenshot QRIS untuk verifikasi.</p>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Amankan Tautan Undangan Anda</label>
                                    <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
                                        <span className="px-4 py-3.5 bg-slate-100 border-r border-slate-200 text-slate-500 font-mono text-sm hidden sm:block">
                                            creative-soft.my.id/
                                        </span>
                                        <input 
                                            type="text" 
                                            value={slug}
                                            onChange={(e) => setSlug(e.target.value)}
                                            placeholder="romeo-juliet"
                                            required
                                            className="w-full px-4 py-3.5 bg-transparent outline-none font-mono text-sm"
                                        />
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">Hanya gunakan huruf kecil, angka, dan tanda strip (-). Tanpa spasi.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Upload Bukti Transfer / Screenshot QRIS</label>
                                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors bg-slate-50">
                                        <div className="space-y-2 text-center">
                                            <div className="text-4xl mb-3">🧾</div>
                                            <div className="flex text-sm text-slate-600 justify-center">
                                                <label className="relative cursor-pointer bg-white rounded-md font-bold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-1 shadow-sm border border-slate-200">
                                                    <span>Pilih File Gambar</span>
                                                    <input type="file" accept="image/*" required onChange={handleFileChange} className="sr-only" />
                                                </label>
                                            </div>
                                            <p className="text-xs text-slate-500">PNG, JPG, JPEG maksimal 2MB</p>
                                            {proofFile && (
                                                <p className="text-sm font-bold text-emerald-600 mt-2 bg-emerald-50 py-1 px-3 rounded-full inline-block">
                                                    ✓ {proofFile.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-6 border-t border-slate-100">
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full py-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 font-bold tracking-wide disabled:bg-slate-300 transition-all shadow-md shadow-indigo-200 text-lg flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                            Memproses Pesanan...
                                        </>
                                    ) : 'Kirim Bukti Pembayaran'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-50"></div>}>
            <CheckoutForm />
        </Suspense>
    );
}
