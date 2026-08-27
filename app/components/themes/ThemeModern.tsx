'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeModern({ invitation, guestName }: { invitation: any, guestName: string }) {
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
    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop";

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
        <div className="bg-slate-950 min-h-screen font-sans text-slate-100 relative">
            <div className="max-w-md mx-auto bg-slate-900 min-h-screen shadow-2xl relative overflow-hidden border border-slate-800">

                {/* SAMPUL DIGITAL */}
                <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900 p-6 text-center transition-all duration-1000 ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                    <div className="w-44 h-44 rounded-2xl overflow-hidden mb-6 border-2 border-cyan-500/30 shadow-2xl">
                        <img src={heroImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.4em] font-bold text-cyan-400 mb-2">The Wedding Experience</span>
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-6">{invitation.groom_name} & {invitation.bride_name}</h1>
                    <div className="bg-slate-800/80 border border-slate-700 p-4 rounded-xl mb-8 shadow-sm w-4/5">
                        <p className="text-[10px] uppercase text-slate-400 font-bold mb-1">Special Invitation To:</p>
                        <h2 className="text-base font-bold text-cyan-300">{guestName}</h2>
                    </div>
                    <button onClick={handleOpen} className="px-8 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-xl font-bold text-sm tracking-wider shadow-lg shadow-cyan-500/20 transition-all">
                        🚀 Buka Undangan
                    </button>
                </div>

                {/* KONTEN UTAMA */}
                <div ref={contentRef} className="relative pb-20">
                    <div className="relative h-[60vh] w-full">
                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                        <div className="absolute bottom-8 left-0 w-full text-center px-4">
                            <p className="text-xs tracking-[0.3em] uppercase text-cyan-400 mb-2 font-bold">The Wedding Of</p>
                            <h2 className="text-3xl font-bold tracking-tight text-white">{invitation.groom_name} & {invitation.bride_name}</h2>
                        </div>
                    </div>

                    <div className="px-6 py-12 text-center">
                        <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400 mb-6">Waktu & Tempat</h3>
                        <div className="bg-slate-800/50 border border-slate-800 p-6 rounded-2xl space-y-4">
                            <p className="font-bold text-white text-lg">{eventDate}</p>
                            <p className="text-cyan-300 text-sm">Pukul {eventTime} WIB</p>
                            <div className="w-12 h-0.5 bg-cyan-500/30 mx-auto"></div>
                            <p className="text-slate-300 text-sm leading-relaxed">{invitation.location_address}</p>
                            <a href={finalMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700">
                                🗺️ Navigasi Lokasi
                            </a>
                        </div>
                    </div>

                    <Countdown targetDate={invitation.event_date} theme="modern" />

                    {invitation.gallery_images?.length > 0 && (
                        <div className="px-6 py-8">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400 text-center mb-6">Galeri Foto</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {invitation.gallery_images.map((img: string, idx: number) => img && (
                                    <div key={idx} className="rounded-xl overflow-hidden aspect-square border border-slate-800">
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {(hasQris || hasBank) && (
                        <div className="px-6 py-12 bg-slate-950 border-t border-slate-800 text-center">
                            <h3 className="text-xl font-bold uppercase tracking-widest text-cyan-400 mb-2">Amplop Digital</h3>
                            <p className="text-xs text-slate-400 mb-8">Kehadiran dan doa restu Anda adalah yang utama.</p>
                            
                            {hasBank && (
                                <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-2xl shadow-xl mb-6 text-left">
                                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">{invitation.bank_name}</p>
                                    <p className="text-xl font-mono font-bold tracking-wider mb-3 text-cyan-300">{invitation.bank_account_number}</p>
                                    <p className="text-xs uppercase tracking-wider text-slate-300">A/N {invitation.bank_account_name}</p>
                                    <button onClick={() => copyToClipboard(invitation.bank_account_number)} className="mt-4 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 rounded-xl text-xs font-bold border border-slate-700 transition-all">
                                        📋 Salin Rekening
                                    </button>
                                </div>
                            )}

                            {hasQris && (
                                <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 inline-block">
                                    <img src={invitation.qris_image_url} alt="QRIS" className="w-44 h-44 object-contain mx-auto mb-3 bg-white p-2 rounded-lg" />
                                    <p className="text-xs font-bold text-slate-300 uppercase tracking-wider">Scan Barcode QRIS</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="px-6 py-8">
                        <GuestBook invitationId={invitation.id} theme="modern" />
                    </div>
                </div>
            </div>
        </div>
    );
}
