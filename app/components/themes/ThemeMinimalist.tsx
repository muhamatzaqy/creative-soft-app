'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeMinimalist({ invitation, guestName }: { invitation: any, guestName: string }) {
    const [isOpened, setIsOpened] = useState(false);
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

    const autoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_address)}`;
    const finalMapsUrl = invitation.google_maps_link ? invitation.google_maps_link : autoMapsUrl;

    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";

    // --- LOGIKA VALIDASI QRIS & BANK YANG KETAT ---
    const hasQris = Boolean(invitation.qris_image_url && invitation.qris_image_url.trim() !== '');
    const hasBank = Boolean(invitation.bank_account_number && invitation.bank_account_number.trim() !== '');
    // ----------------------------------------------

    // Fitur Scroll Otomatis
    useEffect(() => {
        let scrollInterval: NodeJS.Timeout;
        if (isOpened) {
            scrollInterval = setInterval(() => {
                window.scrollBy({ top: 1, behavior: 'auto' });
                // Berhenti otomatis jika sudah mentok di paling bawah
                if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 5) {
                    clearInterval(scrollInterval);
                }
            }, 30);
        }
        return () => clearInterval(scrollInterval);
    }, [isOpened]);

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

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes float-up {
                    0% { transform: translateY(100vh) scale(0.5) rotate(0deg); opacity: 0; }
                    20% { opacity: 0.8; }
                    100% { transform: translateY(-20vh) scale(1.2) rotate(360deg); opacity: 0; }
                }
                .particle { position: absolute; animation: float-up infinite linear; z-index: 10; pointer-events: none; }
                
                /* Pola Kertas untuk Background */
                .pattern-bg {
                    background-image: url('https://www.transparenttextures.com/patterns/cream-paper.png');
                }
            `}} />

            {/* WADAH UTAMA */}
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden pattern-bg">

                {/* Background Ceria & Elemen Melayang */}
                <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-transparent to-fuchsia-50 pointer-events-none mix-blend-multiply"></div>
                <div className="particle text-2xl" style={{ left: '10%', animationDuration: '8s', animationDelay: '0s' }}>🌸</div>
                <div className="particle text-3xl" style={{ left: '70%', animationDuration: '12s', animationDelay: '2s' }}>✨</div>
                <div className="particle text-xl" style={{ left: '40%', animationDuration: '10s', animationDelay: '4s' }}>💖</div>
                <div className="particle text-2xl" style={{ left: '85%', animationDuration: '9s', animationDelay: '1s' }}>🌸</div>

                {/* ================= BAGIAN SAMPUL (COVER) ================= */}
                <div className={`absolute top-0 left-0 w-full h-screen z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl transition-all duration-1000 ease-in-out pattern-bg ${isOpened ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>

                    <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse"></div>
                    <div className="absolute w-72 h-72 bg-fuchsia-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse delay-1000 ml-20 mt-20"></div>

                    <div className="w-52 h-52 rounded-full overflow-hidden mb-8 border-[6px] border-white shadow-[0_10px_40px_rgba(236,72,153,0.3)] relative z-20 transform transition hover:scale-105 duration-500">
                        <img src={heroImage} alt="Prewedding Cover" className="w-full h-full object-cover" />
                    </div>

                    <p className="text-xs text-pink-500 uppercase tracking-[0.4em] font-bold mb-3 relative z-20 drop-shadow-sm">The Wedding Of</p>

                    {/* SOLUSI NAMA PANJANG: Menggunakan text-3xl sm:text-4xl dengan px-4 agar rapi */}
                    <h1 className="text-3xl sm:text-4xl font-serif text-pink-900 text-center mb-8 relative z-20 leading-snug px-4">
                        {invitation.groom_name}
                        <span className="text-2xl text-pink-400 font-sans my-2 block">&</span>
                        {invitation.bride_name}
                    </h1>

                    <div className="bg-white/90 backdrop-blur-md border border-pink-100 p-5 rounded-3xl text-center mb-10 shadow-lg relative z-20 transform -rotate-1 max-w-[80%]">
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Special Invitation For:</p>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 break-words">{guestName}</h2>
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

                    {/* 1. Hero Section */}
                    <div className="relative h-[65vh] w-full rounded-b-[3rem] overflow-hidden shadow-sm">
                        <img src={heroImage} alt="Hero Wedding" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-900/20 to-transparent"></div>

                        <div className="absolute bottom-12 left-0 w-full text-center px-4">
                            <p className="text-pink-200 text-xs font-bold tracking-[0.3em] uppercase mb-3">We Are Getting Married</p>
                            <h1 className="text-3xl sm:text-4xl font-serif text-white drop-shadow-lg leading-snug">
                                {invitation.groom_name} <br />
                                <span className="text-pink-300 font-sans text-2xl inline-block my-1">&</span> <br />
                                {invitation.bride_name}
                            </h1>
                        </div>
                    </div>

                    {/* 2. Ayat Suci (Dengan tekstur halus) */}
                    <div className="px-6 py-16 relative z-10 overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-pink-50/30">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] text-pink-200/30 font-serif z-0 leading-none">"</div>
                        <div className="bg-white/90 backdrop-blur-xl border-y-4 border-pink-300 p-8 rounded-3xl shadow-[0_10px_40px_rgba(244,114,182,0.1)] text-center relative z-10 transform hover:scale-[1.01] transition-transform duration-500">
                            <div className="w-14 h-14 mx-auto bg-gradient-to-br from-pink-300 to-pink-500 rounded-full flex items-center justify-center text-white mb-6 text-2xl shadow-lg shadow-pink-200">🕊️</div>
                            <p className="text-gray-700 font-medium text-sm leading-relaxed mb-6 italic">
                                "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."
                            </p>
                            <div className="w-16 h-[3px] bg-gradient-to-r from-transparent via-pink-400 to-transparent mx-auto mb-4"></div>
                            <p className="font-bold text-pink-600 text-xs uppercase tracking-widest">(QS. Ar-Rum: 21)</p>
                        </div>
                    </div>

                    {/* 3. Detail Acara & Google Maps */}
                    <div className="px-6 py-8">
                        <div className="text-center mb-10">
                            <div className="inline-block bg-pink-100 text-pink-600 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-4 shadow-sm border border-pink-200">Save The Date</div>
                            <h2 className="text-3xl sm:text-4xl font-serif text-pink-900">Waktu & Tempat</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white/80 backdrop-blur-sm border border-pink-100 p-6 rounded-3xl shadow-lg shadow-pink-100/50 flex items-center gap-5 transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner">⏰</div>
                                <div className="text-left">
                                    <h3 className="font-bold text-pink-800 text-xs uppercase tracking-wider mb-1 opacity-80">Hari & Tanggal</h3>
                                    <p className="text-gray-800 font-bold text-base sm:text-lg mb-1 leading-tight">{eventDate}</p>
                                    <p className="text-pink-500 text-sm font-medium">Pukul {eventTime} WIB</p>
                                </div>
                            </div>

                            <div className="bg-white/80 backdrop-blur-sm border border-pink-100 p-6 rounded-3xl shadow-lg shadow-pink-100/50 flex flex-col gap-4 transform hover:-translate-y-1 transition-transform duration-300">
                                <div className="flex items-start gap-5">
                                    <div className="w-16 h-16 shrink-0 bg-gradient-to-br from-fuchsia-400 to-pink-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-inner">📍</div>
                                    <div className="text-left pt-1">
                                        <h3 className="font-bold text-pink-800 text-xs uppercase tracking-wider mb-2 opacity-80">Lokasi Acara</h3>
                                        <p className="text-gray-600 text-sm font-medium leading-relaxed">
                                            {invitation.location_address}
                                        </p>
                                    </div>
                                </div>
                                <a
                                    href={finalMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-3 w-full text-center px-6 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold tracking-wide hover:bg-pink-600 transition-all shadow-md active:scale-95"
                                >
                                    🗺️ Petunjuk Arah via Maps
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* 4. Hitung Mundur */}
                    <div className="px-6 py-12">
                        <Countdown targetDate={invitation.event_date} theme="minimalist" />
                    </div>

                    {/* 5. Galeri Foto */}
                    {invitation.gallery_images && invitation.gallery_images.length > 0 && (
                        <div className="px-6 py-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl sm:text-4xl font-serif text-gray-800">Our Gallery</h2>
                                <p className="text-pink-500 text-sm mt-2 font-medium">Momen bahagia kami</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                {invitation.gallery_images.map((imgUrl: string, index: number) => {
                                    if (!imgUrl || imgUrl.trim() === '') return null; // Keamanan tambahan
                                    const isThreePhotos = invitation.gallery_images.length === 3;
                                    const spanClass = (isThreePhotos && index === 0) ? 'col-span-2 aspect-video' : 'col-span-1 aspect-square';

                                    return (
                                        <div key={index} className={`rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border-2 border-white ${spanClass}`}>
                                            <img src={imgUrl} alt={`Gallery ${index}`} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* 6. Amplop Digital (Muncul jika setidaknya SALAH SATU terisi) */}
                    {(hasQris || hasBank) && (
                        <div className="px-6 py-12 mt-8 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] bg-pink-50/50 border-t border-pink-100 relative">
                            <div className="text-center mb-10">
                                <h2 className="text-3xl sm:text-4xl font-serif text-pink-900">Wedding Gift</h2>
                                <p className="text-gray-500 text-sm mt-3 max-w-[280px] mx-auto leading-relaxed">
                                    Doa restu Anda merupakan karunia terindah. Namun jika Anda ingin memberikan tanda kasih, dapat melalui fitur di bawah ini.
                                </p>
                            </div>

                            <div className="space-y-8">
                                {/* CARD ATM - Hanya muncul jika ada data bank */}
                                {hasBank && (
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-full max-w-[340px] h-[200px] rounded-2xl bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-600 text-white shadow-xl shadow-pink-300/50 overflow-hidden p-6 flex flex-col justify-between transform transition-transform hover:-translate-y-2 duration-300 border border-pink-300/30">
                                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-10 -mt-10 pointer-events-none"></div>
                                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-10 -mb-10 pointer-events-none"></div>

                                            <div className="flex justify-between items-start z-10">
                                                <span className="font-extrabold italic text-xl tracking-wider drop-shadow-md">{invitation.bank_name}</span>
                                                <div className="w-11 h-8 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md border border-yellow-500/50 flex flex-col justify-evenly p-1 shadow-sm opacity-90">
                                                    <div className="w-full h-[1px] bg-yellow-600/30"></div>
                                                    <div className="w-full h-[1px] bg-yellow-600/30"></div>
                                                </div>
                                            </div>

                                            <div className="z-10 mt-2">
                                                <p className="font-mono text-[20px] sm:text-[22px] tracking-[0.15em] shadow-sm font-semibold">{invitation.bank_account_number}</p>
                                            </div>

                                            <div className="flex justify-between items-end z-10">
                                                <div className="max-w-[70%]">
                                                    <p className="text-[9px] uppercase tracking-[0.2em] opacity-80 mb-0.5">Cardholder</p>
                                                    <p className="font-bold uppercase tracking-wider text-xs sm:text-sm truncate">{invitation.bank_account_name}</p>
                                                </div>
                                                <div className="flex opacity-80 shrink-0">
                                                    <div className="w-7 h-7 rounded-full bg-white/40"></div>
                                                    <div className="w-7 h-7 rounded-full bg-white/20 -ml-3 backdrop-blur-sm"></div>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => copyToClipboard(invitation.bank_account_number)}
                                            className="mt-5 px-8 py-3 bg-white border border-pink-200 text-pink-600 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-pink-50 transition-colors shadow-sm flex items-center gap-2 active:scale-95"
                                        >
                                            📋 Salin No. Rekening
                                        </button>
                                    </div>
                                )}

                                {/* QRIS - Hanya muncul jika ada url yang valid */}
                                {hasQris && (
                                    <div className="bg-white/90 backdrop-blur-sm p-8 rounded-[2rem] shadow-lg border border-pink-100 text-center transform transition hover:scale-[1.02]">
                                        <div className="w-14 h-14 mx-auto bg-gradient-to-br from-pink-400 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg shadow-pink-200">📱</div>
                                        <div className="inline-block p-3 bg-gray-50 rounded-3xl border border-gray-100 shadow-inner">
                                            <img src={invitation.qris_image_url} alt="QRIS" className="w-48 h-48 object-cover rounded-xl" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-500 tracking-[0.2em] uppercase mt-5">Scan QRIS Di Sini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 7. Buku Tamu (GuestBook) */}
                    <div className="px-6 py-8 relative z-10">
                        <GuestBook invitationId={invitation.id} theme="minimalist" />
                    </div>

                    <div className="text-center pt-8 pb-4 relative z-10">
                        <p className="text-3xl font-serif text-pink-300 mb-2">Thank You</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold mt-2">
                            Made with <span className="text-pink-500 animate-pulse inline-block mx-1">💖</span> by Creative Soft
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}