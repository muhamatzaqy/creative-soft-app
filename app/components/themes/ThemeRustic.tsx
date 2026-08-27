'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeRustic({ invitation, guestName }: { invitation: any, guestName: string }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    const eventDate = isMounted ? new Date(invitation.event_date).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }) : '';
    const eventTime = isMounted ? new Date(invitation.event_date).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
    }) : '';

    const autoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_address)}`;
    const finalMapsUrl = invitation.google_maps_link ? invitation.google_maps_link : autoMapsUrl;
    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop";

    const hasQris = Boolean(invitation.qris_image_url && invitation.qris_image_url.trim() !== '');
    const hasBank = Boolean(invitation.bank_account_number && invitation.bank_account_number.trim() !== '');

    const handleOpen = () => {
        setIsOpened(true);
        setTimeout(() => { contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor rekening disalin!');
    };

    return (
        <div className="bg-[#2c221e] min-h-screen font-serif text-[#4a3b32] relative selection:bg-amber-200">
            <div className="max-w-md mx-auto bg-[#faf4ef] min-h-screen shadow-2xl relative overflow-hidden border-2 border-amber-900/10">

                {/* SAMPUL DIGITAL */}
                <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f4ece4] p-6 text-center transition-all duration-1000 ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                    <div className="w-44 h-44 rounded-full overflow-hidden mb-6 border-4 border-amber-900/20 shadow-lg">
                        <img src={heroImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-amber-800 mb-2">The Wedding</span>
                    <h1 className="text-3xl font-serif text-amber-950 mb-6">{invitation.groom_name} & {invitation.bride_name}</h1>
                    <div className="bg-[#faf4ef] border border-amber-900/20 p-4 rounded-xl mb-8 shadow-sm w-4/5">
                        <p className="text-[10px] uppercase text-amber-800 font-bold mb-1">Kepada Yth:</p>
                        <h2 className="text-base font-bold text-amber-950">{guestName}</h2>
                    </div>
                    <button onClick={handleOpen} className="px-8 py-3.5 bg-amber-900 hover:bg-amber-950 text-white rounded-xl font-sans font-bold text-sm tracking-wider shadow-lg transition-all">
                        🪵 Buka Undangan
                    </button>
                </div>

                {/* KONTEN UTAMA */}
                <div ref={contentRef} className="relative pb-20">
                    <div className="relative h-[60vh] w-full">
                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#faf4ef] via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-0 w-full text-center px-4">
                            <p className="text-xs tracking-[0.3em] uppercase text-amber-900 font-bold mb-2">The Wedding Of</p>
                            <h2 className="text-3xl font-serif text-amber-950">{invitation.groom_name} & {invitation.bride_name}</h2>
                        </div>
                    </div>

                    <div className="px-6 py-12 text-center">
                        <h3 className="text-2xl font-serif text-amber-950 mb-6">Waktu & Tempat</h3>
                        <div className="bg-amber-900/5 border border-amber-900/10 p-6 rounded-3xl space-y-4">
                            <p className="font-bold text-amber-950 text-lg">{eventDate}</p>
                            <p className="text-amber-900 text-sm">Pukul {eventTime} WIB</p>
                            <div className="w-12 h-0.5 bg-amber-900/30 mx-auto"></div>
                            <p className="text-amber-900/80 text-sm leading-relaxed">{invitation.location_address}</p>
                            <a href={finalMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 bg-amber-900 hover:bg-amber-950 text-white font-sans rounded-xl text-xs font-bold shadow-md">
                                🗺️ Petunjuk Lokasi
                            </a>
                        </div>
                    </div>

                    <Countdown targetDate={invitation.event_date} theme="rustic" />

                    {invitation.gallery_images?.length > 0 && (
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-serif text-amber-950 text-center mb-6">Galeri Kenangan</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {invitation.gallery_images.map((img: string, idx: number) => img && (
                                    <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-amber-900/10 shadow-sm">
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(hasQris || hasBank) && (
                        <div className="px-6 py-12 bg-amber-900/5 border-t border-amber-900/10 text-center font-sans">
                            <h3 className="text-2xl font-serif text-amber-950 mb-2">Amplop Digital</h3>
                            <p className="text-xs text-amber-900/70 mb-8">Kehadiran Anda adalah kado terindah bagi kami.</p>
                            
                            {hasBank && (
                                <div className="bg-gradient-to-br from-amber-900 to-amber-950 text-[#faf4ef] p-6 rounded-2xl shadow-lg mb-6 text-left">
                                    <p className="text-xs uppercase tracking-widest opacity-70 mb-1">{invitation.bank_name}</p>
                                    <p className="text-xl font-mono font-bold tracking-wider mb-4">{invitation.bank_account_number}</p>
                                    <p className="text-xs uppercase tracking-wider">A/N {invitation.bank_account_name}</p>
                                    <button onClick={() => copyToClipboard(invitation.bank_account_number)} className="mt-4 w-full py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all">
                                        📋 Salin No. Rekening
                                    </button>
                                </div>
                            )}

                            {hasQris && (
                                <div className="bg-white p-6 rounded-2xl border border-amber-900/20 inline-block shadow-sm">
                                    <img src={invitation.qris_image_url} alt="QRIS" className="w-44 h-44 object-contain mx-auto mb-3" />
                                    <p className="text-xs font-bold text-amber-950 uppercase tracking-wider">Scan QRIS</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="px-6 py-8 font-sans">
                        <GuestBook invitationId={invitation.id} theme="rustic" />
                    </div>
                </div>
            </div>
        </div>
    );
}
