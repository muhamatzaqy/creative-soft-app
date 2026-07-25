import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

// Tipe params sebagai Promise untuk Next.js 15
export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {

    // Membuka isi params dengan await
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Mencari data menggunakan variabel 'slug' yang sudah dibuka
    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        notFound();
    }

    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-rose-100 via-white to-pink-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans selection:bg-rose-200">

            {/* Kartu Utama dengan Efek Kaca (Glassmorphism) */}
            <div className="max-w-lg w-full bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(225,29,72,0.15)] overflow-hidden text-center p-8 sm:p-12 relative border border-white">

                {/* Garis Aksen di Atas Kartu */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-200 via-pink-400 to-rose-200"></div>

                {/* Header Undangan */}
                <div className="space-y-6">
                    <p className="text-xs sm:text-sm text-rose-400 uppercase tracking-[0.3em] font-semibold">
                        Undangan Pernikahan
                    </p>

                    {/* Nama Mempelai */}
                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h1 className="text-5xl sm:text-6xl font-serif text-gray-800 leading-tight">
                            {invitation.groom_name}
                        </h1>
                        <span className="text-4xl font-serif text-rose-300 italic -my-2">&</span>
                        <h1 className="text-5xl sm:text-6xl font-serif text-gray-800 leading-tight">
                            {invitation.bride_name}
                        </h1>
                    </div>
                </div>

                {/* Pembatas Elegan */}
                <div className="flex items-center justify-center gap-4 my-10">
                    <div className="h-[1px] w-16 bg-rose-200"></div>
                    <span className="text-rose-300 text-xl">✧</span>
                    <div className="h-[1px] w-16 bg-rose-200"></div>
                </div>

                {/* Kotak Detail Waktu & Lokasi */}
                <div className="bg-rose-50/50 p-6 sm:p-8 rounded-2xl space-y-6 border border-rose-100 text-center shadow-inner">
                    <div>
                        <h3 className="font-semibold text-rose-800 text-xs uppercase tracking-widest mb-2">Hari & Tanggal</h3>
                        <p className="text-gray-700 font-medium">{eventDate} WIB</p>
                    </div>
                    <div className="w-12 h-[1px] bg-rose-200 mx-auto"></div>
                    <div>
                        <h3 className="font-semibold text-rose-800 text-xs uppercase tracking-widest mb-2">Lokasi Acara</h3>
                        <p className="text-gray-600 leading-relaxed max-w-[250px] mx-auto whitespace-pre-wrap">
                            {invitation.location_address}
                        </p>
                    </div>
                </div>

                {/* Bagian Amplop Digital (QRIS) */}
                {invitation.qris_image_url && (
                    <div className="mt-10 pt-8 border-t border-rose-100">
                        <div className="inline-block bg-rose-50 text-rose-600 px-5 py-2 rounded-full text-xs font-bold tracking-widest uppercase mb-4 shadow-sm border border-rose-100">
                            Amplop Digital
                        </div>
                        <p className="text-sm text-gray-500 mb-6 leading-relaxed px-2">
                            Tanpa mengurangi rasa hormat, bagi tamu yang ingin memberikan tanda kasih dapat memindai QRIS di bawah ini:
                        </p>

                        <div className="flex flex-col items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-lg transition-shadow duration-300">
                            <div className="w-full flex justify-center mb-4">
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                                    <img
                                        src={invitation.qris_image_url}
                                        alt="QRIS Pembayaran"
                                        className="w-48 h-48 object-cover rounded-lg"
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-gray-400 font-medium">Scan QRIS ini menggunakan aplikasi M-Banking atau E-Wallet Anda.</p>
                        </div>
                    </div>
                )}

                {/* Watermark Bisnis Anda */}
                <div className="mt-12 text-xs text-rose-300 font-medium tracking-wide">
                    <p>Dibuat dengan ❤️ oleh Creative Soft</p>
                </div>

            </div>
        </div>
    );
}