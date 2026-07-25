'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeMinimalist({ invitation, guestName }: { invitation: any, guestName: string }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    const eventTime = new Date(invitation.event_date).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    });

    // Generate link Google Maps otomatis berdasarkan teks alamat
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_address)}`;

    // Fitur Scroll Otomatis Lambat
    useEffect(() => {
        let scrollInterval: NodeJS.Timeout;
        if (isAutoScrolling) {
            scrollInterval = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'auto' });
                // Hentikan jika sudah mencapai bawah
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                    setIsAutoScrolling(false);
                }
            }, 30); // Semakin besar angkanya, semakin lambat scroll-nya
        }
        return () => clearInterval(scrollInterval);
    }, [isAutoScrolling]);

    // Fungsi membuka undangan
    const handleOpen = () => {
        setIsOpened(true);
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 300);
    };

    return (
        <div className="bg-slate-100 min-h-screen font-sans selection:bg-rose-200">
            {/* WADAH UTAMA (Responsif: HP full, Desktop seperti mockup aplikasi) */}
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-[0_0_40px_rgba(0,0,0,0.05)] relative overflow-hidden">

                {/* ================= BAGIAN SAMPUL (COVER) ================= */}
                <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-white transition-transform duration-1000 ease-in-out ${isOpened ? '-translate-y-full' : 'translate-y-0'}`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/floral-paper.png')] mix-blend-multiply"></div>

                    {/* Foto Cover Placeholder */}
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-8 border-4 border-white shadow-xl animate-pulse">
                        <img
                            src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop"
                            alt="Prewedding Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <p className="text-xs text-rose-400 uppercase tracking-[0.3em] font-semibold mb-4">Pernikahan</p>
                    <h1 className="text-5xl font-serif text-gray-800 text-center mb-8">
                        {invitation.groom_name} <br /> <span className="text-3xl text-rose-300 italic">&</span> <br /> {invitation.bride_name}
                    </h1>

                    <div className="bg-white/60 backdrop-blur-sm border border-rose-100 p-5 rounded-2xl text-center mb-8 shadow-sm">
                        <p className="text-xs text-rose-600 uppercase tracking-widest mb-1 font-medium">Kepada Yth.</p>
                        <h2 className="text-lg font-bold text-gray-800 font-serif">{guestName}</h2>
                    </div>

                    <button
                        onClick={handleOpen}
                        className="px-8 py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-full font-medium tracking-wide transition-all shadow-lg shadow-rose-200 flex items-center gap-2"
                    >
                        💌 Buka Undangan
                    </button>
                </div>

                {/* ================= KONTEN UTAMA UNDANGAN ================= */}
                <div ref={contentRef} className={`relative pb-20 ${!isOpened ? 'h-screen overflow-hidden' : 'h-auto'}`}>

                    {/* Tombol Floating: Auto Scroll */}
                    {isOpened && (
                        <button
                            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                            className="fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-xl border border-rose-100 text-rose-500 transition-all hover:bg-rose-50"
                        >
                            {isAutoScrolling ? '⏸️ Jeda' : '🔽 Auto Scroll'}
                        </button>
                    )}

                    {/* 1. Hero Section (Foto Besar) */}
                    <div className="relative h-[60vh] w-full">
                        <img
                            src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop"
                            alt="Hero Wedding"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
                        <div className="absolute bottom-10 left-0 w-full text-center px-6">
                            <h1 className="text-5xl font-serif text-gray-800 drop-shadow-md">
                                {invitation.groom_name} <span className="text-rose-400">&</span> {invitation.bride_name}
                            </h1>
                            <p className="text-gray-600 mt-2 font-medium tracking-widest uppercase text-xs">{eventDate}</p>
                        </div>
                    </div>

                    {/* 2. Ayat Suci / Kutipan */}
                    <div className="px-8 py-16 text-center bg-[url('https://www.transparenttextures.com/patterns/floral-paper.png')] bg-rose-50/30">
                        <div className="w-8 h-8 mx-auto bg-rose-200 rounded-full flex items-center justify-center text-white mb-6">✧</div>
                        <p className="text-gray-600 italic text-sm leading-relaxed mb-4">
                            "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                        </p>
                        <p className="font-semibold text-rose-800 text-xs uppercase tracking-widest">(QS. Ar-Rum: 21)</p>
                    </div>

                    {/* 3. Detail Acara & Google Maps */}
                    <div className="px-8 py-12 text-center relative">
                        <h2 className="text-3xl font-serif text-gray-800 mb-8">Waktu & Tempat</h2>

                        <div className="bg-white border border-rose-100 p-8 rounded-3xl shadow-[0_10px_30px_rgba(225,29,72,0.05)] relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-200 via-pink-400 to-rose-200"></div>

                            <div className="mb-6">
                                <h3 className="font-semibold text-rose-800 text-xs uppercase tracking-widest mb-1">Hari & Tanggal</h3>
                                <p className="text-gray-800 font-medium text-lg">{eventDate}</p>
                                <p className="text-gray-500 text-sm mt-1">Pukul {eventTime} WIB - Selesai</p>
                            </div>

                            <div className="w-12 h-[1px] bg-rose-100 mx-auto mb-6"></div>

                            <div className="mb-8">
                                <h3 className="font-semibold text-rose-800 text-xs uppercase tracking-widest mb-2">Lokasi Acara</h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                    {invitation.location_address}
                                </p>
                            </div>

                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-6 py-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-full text-sm font-semibold tracking-wide hover:bg-rose-100 transition-colors"
                            >
                                📍 Buka di Google Maps
                            </a>
                        </div>
                    </div>

                    {/* 4. Hitung Mundur */}
                    <div className="px-8 pb-12">
                        <Countdown targetDate={invitation.event_date} theme="minimalist" />
                    </div>

                    {/* 5. Galeri Foto Sederhana (Grid) */}
                    <div className="px-4 py-8">
                        <h2 className="text-2xl font-serif text-gray-800 text-center mb-6">Momen Kami</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <img src="https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=400&auto=format&fit=crop" alt="Gallery 1" className="w-full h-40 object-cover rounded-tl-2xl" />
                            <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop" alt="Gallery 2" className="w-full h-40 object-cover rounded-tr-2xl" />
                            <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop" alt="Gallery 3" className="w-full h-40 object-cover rounded-bl-2xl" />
                            <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=400&auto=format&fit=crop" alt="Gallery 4" className="w-full h-40 object-cover rounded-br-2xl" />
                        </div>
                    </div>

                    {/* 6. Amplop Digital (QRIS) */}
                    {invitation.qris_image_url && (
                        <div className="px-8 py-12 text-center bg-rose-50/50 border-y border-rose-100">
                            <h2 className="text-2xl font-serif text-gray-800 mb-2">Amplop Digital</h2>
                            <p className="text-xs text-gray-500 mb-6">Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun jika Anda ingin memberikan tanda kasih, dapat melalui fitur di bawah ini.</p>

                            <div className="bg-white p-6 rounded-3xl shadow-sm border border-rose-100 inline-block">
                                <img src={invitation.qris_image_url} alt="QRIS" className="w-48 h-48 object-cover rounded-xl" />
                                <p className="text-xs font-bold text-rose-600 tracking-widest uppercase mt-4">Scan QRIS</p>
                            </div>
                        </div>
                    )}

                    {/* 7. Buku Tamu (GuestBook) */}
                    <div className="px-4 py-8 mb-10">
                        <GuestBook invitationId={invitation.id} theme="minimalist" />
                    </div>

                    <p className="text-center text-[10px] text-gray-400 pb-8 uppercase tracking-widest">
                        Created with ❤️ by Creative Soft
                    </p>
                </div>
            </div>
        </div>
    );
}