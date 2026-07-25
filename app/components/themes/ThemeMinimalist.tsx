'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeMinimalist({ invitation, guestName }: { invitation: any, guestName: string }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isAutoScrolling, setIsAutoScrolling] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const eventDate = isMounted ? new Date(invitation.event_date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }) : 'Menyiapkan tanggal...';

    const eventTime = isMounted ? new Date(invitation.event_date).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    }) : '...';

    // Prioritaskan link Maps dari form, jika kosong baru buat pencarian otomatis
    const autoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_address)}`;
    const finalMapsUrl = invitation.google_maps_link ? invitation.google_maps_link : autoMapsUrl;

    // Foto Utama (Gunakan fallback jika klien belum upload)
    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";

    // Fitur Scroll Otomatis
    useEffect(() => {
        let scrollInterval: NodeJS.Timeout;
        if (isAutoScrolling) {
            scrollInterval = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'smooth' });
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
                    setIsAutoScrolling(false);
                }
            }, 30);
        }
        return () => clearInterval(scrollInterval);
    }, [isAutoScrolling]);

    const handleOpen = () => {
        setIsOpened(true);
        setTimeout(() => {
            contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor Rekening berhasil disalin!');
    };

    return (
        <div className="bg-fuchsia-50 min-h-screen font-sans selection:bg-pink-300 relative">

            {/* --- INLINE CSS UNTUK ANIMASI MELAYANG (FLOAT) --- */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-up {
                    0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    100% { transform: translateY(-20vh) scale(1.2) rotate(360deg); opacity: 0; }
                }
                .particle { position: absolute; animation: float-up infinite linear; z-index: 10; pointer-events: none; }
            `}} />

            {/* WADAH UTAMA (Responsif) */}
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">

                {/* --- ANIMASI BACKGROUND CERIA --- */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100 via-white to-fuchsia-100 pointer-events-none"></div>
                <div className="particle text-2xl" style={{ left: '10%', animationDuration: '8s', animationDelay: '0s' }}>🌸</div>
                <div className="particle text-3xl" style={{ left: '70%', animationDuration: '12s', animationDelay: '2s' }}>✨</div>
                <div className="particle text-xl" style={{ left: '40%', animationDuration: '10s', animationDelay: '4s' }}>💖</div>
                <div className="particle text-2xl" style={{ left: '85%', animationDuration: '9s', animationDelay: '1s' }}>🌸</div>

                {/* ================= BAGIAN SAMPUL (COVER) ================= */}
                <div className={`absolute top-0 left-0 w-full h-screen z-50 flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl transition-all duration-1000 ease-in-out ${isOpened ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>

                    {/* Lingkaran Dekoratif di Belakang Foto */}
                    <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse"></div>
                    <div className="absolute w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse delay-1000 ml-20 mt-20"></div>

                    <div className="w-52 h-52 rounded-full overflow-hidden mb-8 border-[6px] border-white shadow-[0_10px_40px_rgba(236,72,153,0.3)] relative z-20 transform transition hover:scale-105 duration-500">
                        <img src={heroImage} alt="Prewedding Cover" className="w-full h-full object-cover" />
                    </div>

                    <p className="text-xs text-pink-500 uppercase tracking-[0.4em] font-bold mb-3 relative z-20">The Wedding Of</p>
                    <h1 className="text-5xl font-serif text-pink-900 text-center mb-8 relative z-20 leading-tight">
                        {invitation.groom_name} <br /> <span className="text-3xl text-pink-400 font-sans">&</span> <br /> {invitation.bride_name}
                    </h1>

                    <div className="bg-white/90 backdrop-blur-md border border-pink-100 p-5 rounded-3xl text-center mb-10 shadow-lg relative z-20 transform -rotate-1">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Special Invitation For:</p>
                        <h2 className="text-xl font-bold text-gray-800">{guestName}</h2>
                    </div>

                    <button
                        type="button"
                        onClick={handleOpen}
                        className="px-10 py-4 bg-gradient-to-r from-pink-500 to-fuchsia-500 hover:from-pink-600 hover:to-fuchsia-600 text-white rounded-full font-bold tracking-wider transition-all transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(217,70,239,0.4)] active:scale-95 flex items-center gap-2 relative z-20"
                    >
                        💌 BUKA UNDANGAN
                    </button>
                </div>

                {/* ================= KONTEN UTAMA UNDANGAN ================= */}
                <div ref={contentRef} className={`relative pb-24 ${!isOpened ? 'h-screen overflow-hidden' : 'h-auto'}`}>

                    {/* Tombol Floating: Auto Scroll */}
                    {isOpened && (
                        <button
                            type="button"
                            onClick={() => setIsAutoScrolling(!isAutoScrolling)}
                            className="fixed bottom-6 right-6 z-40 bg-white/90 backdrop-blur-md p-4 rounded-full shadow-2xl border border-pink-100 text-pink-600 transition-all hover:bg-pink-50 hover:scale-110 active:scale-95 font-bold text-xs"
                        >
                            {isAutoScrolling ? '⏸️ JEDA' : '🔽 SCROLL'}
                        </button>
                    )}

                    {/* 1. Hero Section (Melengkung Estetik) */}
                    <div className="relative h-[65vh] w-full rounded-b-[3rem] overflow-hidden shadow-sm">
                        <img src={heroImage} alt="Hero Wedding" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-900/80 via-pink-900/20 to-transparent"></div>
                        <div className="absolute bottom-12 left-0 w-full text-center px-6">
                            <p className="text-pink-200 text-xs font-bold tracking-[0.3em] uppercase mb-2">We Are Getting Married</p>
                            <h1 className="text-5xl font-serif text-white drop-shadow-lg">
                                {invitation.groom_name} <span className="text-pink-300 font-sans text-4xl">&</span> {invitation.bride_name}
                            </h1>
                        </div>
                    </div>

                    {/* 2. Ayat Suci (Desain Glassmorphism) */}
                    <div className="px-6 py-12 -mt-8 relative z-10">
                        <div className="bg-white/80 backdrop-blur-xl border border-pink-100 p-8 rounded-3xl shadow-[0_10px_40px_rgba(244,114,182,0.1)] text-center">
                            <div className="w-12 h-12 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-4 text-xl">🕊️</div>
                            <p className="text-gray-600 font-medium text-sm leading-relaxed mb-4">
                                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                            </p>
                            <p className="font-bold text-pink-600 text-xs uppercase tracking-widest">(QS. Ar-Rum: 21)</p>
                        </div>
                    </div>

                    {/* 3. Detail Acara & Google Maps */}
                    <div className="px-6 py-8 text-center">
                        <div className="inline-block bg-pink-100 text-pink-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">Save The Date</div>
                        <h2 className="text-3xl font-serif text-gray-800 mb-8">Waktu & Tempat</h2>

                        <div className="bg-gradient-to-br from-white to-pink-50 border border-pink-100 p-8 rounded-3xl shadow-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 text-6xl opacity-10 transform translate-x-4 -translate-y-4">🌸</div>

                            <div className="mb-6 relative z-10">
                                <div className="w-10 h-10 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-3">📅</div>
                                <p className="text-gray-800 font-bold text-lg">{eventDate}</p>
                                <p className="text-gray-500 text-sm mt-1">Pukul {eventTime} WIB - Selesai</p>
                            </div>

                            <div className="w-full h-px bg-pink-200 mx-auto mb-6 relative z-10"></div>

                            <div className="mb-8 relative z-10">
                                <div className="w-10 h-10 mx-auto bg-pink-100 rounded-full flex items-center justify-center text-pink-500 mb-3">📍</div>
                                <p className="text-gray-600 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                                    {invitation.location_address}
                                </p>
                            </div>

                            <a
                                href={finalMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white rounded-full text-sm font-bold tracking-wide hover:bg-pink-600 transition-all shadow-md transform hover:-translate-y-1 active:scale-95 relative z-10"
                            >
                                Buka Google Maps 🧭
                            </a>
                        </div>
                    </div>

                    {/* 4. Hitung Mundur */}
                    <div className="px-6 pb-12">
                        <Countdown targetDate={invitation.event_date} theme="minimalist" />
                    </div>

                    {/* 5. Galeri Foto Dinamis */}
                    {invitation.gallery_images && invitation.gallery_images.length > 0 && (
                        <div className="px-6 py-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif text-gray-800">Our Gallery</h2>
                                <p className="text-pink-500 text-sm mt-1">Momen bahagia kami</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {invitation.gallery_images.map((imgUrl: string, index: number) => {
                                    // Logika agar susunan grid cantik (jika 3 foto, foto pertama memanjang)
                                    const isThreePhotos = invitation.gallery_images.length === 3;
                                    const spanClass = (isThreePhotos && index === 0) ? 'col-span-2 aspect-video' : 'col-span-1 aspect-square';

                                    return (
                                        <div key={index} className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow ${spanClass}`}>
                                            <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* 6. Amplop Digital (Bank & QRIS) */}
                    {(invitation.qris_image_url || invitation.bank_account_number) && (
                        <div className="px-6 py-12 mt-8 bg-pink-100/50 border-y border-pink-100">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-serif text-gray-800">Wedding Gift</h2>
                                <p className="text-gray-500 text-sm mt-2 max-w-[280px] mx-auto">
                                    Doa restu Anda merupakan karunia terindah. Namun jika Anda ingin memberikan tanda kasih, dapat melalui fitur di bawah ini.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Menampilkan Nomor Rekening jika ada */}
                                {invitation.bank_account_number && (
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 text-center transform transition hover:scale-[1.02]">
                                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white mb-3 shadow-md">💳</div>
                                        <p className="font-bold text-gray-800 text-lg uppercase">{invitation.bank_name}</p>
                                        <p className="text-2xl font-mono text-pink-600 tracking-wider my-2">{invitation.bank_account_number}</p>
                                        <p className="text-sm text-gray-500 font-medium mb-4">A.N. {invitation.bank_account_name}</p>
                                        <button
                                            onClick={() => copyToClipboard(invitation.bank_account_number)}
                                            className="px-6 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-pink-100 transition-colors"
                                        >
                                            Salin No. Rekening
                                        </button>
                                    </div>
                                )}

                                {/* Menampilkan QRIS jika ada */}
                                {invitation.qris_image_url && (
                                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-pink-100 text-center transform transition hover:scale-[1.02]">
                                        <div className="w-12 h-12 mx-auto bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-full flex items-center justify-center text-white mb-4 shadow-md">📱</div>
                                        <div className="inline-block p-2 bg-pink-50 rounded-2xl border border-pink-100">
                                            <img src={invitation.qris_image_url} alt="QRIS" className="w-48 h-48 object-cover rounded-xl" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-4">Scan QRIS Di Sini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 7. Buku Tamu (GuestBook) */}
                    <div className="px-6 py-8">
                        <GuestBook invitationId={invitation.id} theme="minimalist" />
                    </div>

                    <div className="text-center pt-8 pb-4">
                        <p className="text-2xl font-serif text-pink-300 mb-2">Thank You</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Made with <span className="text-pink-500 animate-pulse inline-block">💖</span> by Creative Soft
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}