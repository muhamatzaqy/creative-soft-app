'use client';

import { useState, useEffect, useRef } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeFloral({ invitation, guestName }: { invitation: any, guestName: string }) {
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
    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop";

    const hasQris = Boolean(invitation.qris_image_url && invitation.qris_image_url.trim() !== '');
    const hasBank = Boolean(invitation.bank_account_number && invitation.bank_account_number.trim() !== '');

    const handleOpen = () => {
        setIsOpened(true);
        setTimeout(() => { contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor rekening berhasil disalin!');
    };

    return (
        <div className="bg-[#f0f4f1] min-h-screen font-sans selection:bg-emerald-200 relative">
            <div className="max-w-md mx-auto bg-white min-h-screen shadow-2xl relative overflow-hidden">

                {/* SAMPUL DIGITAL */}
                <div className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#f4f7f4] p-6 text-center transition-all duration-1000 ${isOpened ? '-translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'}`}>
                    <div className="w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-emerald-800/20 shadow-xl">
                        <img src={heroImage} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xs uppercase tracking-[0.3em] font-bold text-emerald-800 mb-2">The Wedding Of</span>
                    <h1 className="text-3xl font-serif text-emerald-950 mb-6">{invitation.groom_name} & {invitation.bride_name}</h1>
                    <div className="bg-white border border-emerald-200 p-4 rounded-2xl mb-8 shadow-sm w-4/5">
                        <p className="text-[10px] uppercase text-emerald-600 font-bold mb-1">Kepada Yth:</p>
                        <h2 className="text-base font-bold text-emerald-950">{guestName}</h2>
                    </div>
                    <button onClick={handleOpen} className="px-8 py-3.5 bg-emerald-800 text-white rounded-full font-bold text-sm tracking-wider shadow-lg hover:bg-emerald-900 transition-all">
                        🌿 Buka Undangan
                    </button>
                </div>

                {/* KONTEN UTAMA */}
                <div ref={contentRef} className="relative pb-20">
                    <div className="relative h-[60vh] w-full">
                        <img src={heroImage} alt="Hero" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/70 via-transparent to-transparent"></div>
                        <div className="absolute bottom-8 left-0 w-full text-center px-4 text-white">
                            <p className="text-xs tracking-[0.3em] uppercase mb-2 font-medium">The Wedding Of</p>
                            <h2 className="text-3xl font-serif">{invitation.groom_name} & {invitation.bride_name}</h2>
                        </div>
                    </div>

                    {/* DETAIL ACARA */}
                    <div className="px-6 py-12 text-center">
                        <h3 className="text-2xl font-serif text-emerald-950 mb-6">Acara Pernikahan</h3>
                        <div className="bg-emerald-50/60 border border-emerald-100 p-6 rounded-3xl space-y-4 shadow-sm">
                            <p className="font-bold text-emerald-900 text-lg">{eventDate}</p>
                            <p className="text-emerald-700 text-sm">Pukul {eventTime} WIB</p>
                            <div className="w-12 h-0.5 bg-emerald-300 mx-auto"></div>
                            <p className="text-emerald-900 text-sm leading-relaxed">{invitation.location_address}</p>
                            <a href={finalMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-6 py-2.5 bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-900">
                                🗺️ Buka Google Maps
                            </a>
                        </div>
                    </div>

                    <Countdown targetDate={invitation.event_date} theme="floral" />

                    {/* GALERI */}
                    {invitation.gallery_images?.length > 0 && (
                        <div className="px-6 py-8">
                            <h3 className="text-2xl font-serif text-emerald-950 text-center mb-6">Galeri Momen</h3>
                            <div className="grid grid-cols-2 gap-3">
                                {invitation.gallery_images.map((img: string, idx: number) => img && (
                                    <div key={idx} className="rounded-2xl overflow-hidden aspect-square border border-emerald-100 shadow-sm">
                                        <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AMPLOP DIGITAL */}
                    {(hasQris || hasBank) && (
                        <div className="px-6 py-12 bg-emerald-50/30 border-t border-emerald-100 text-center">
                            <h3 className="text-2xl font-serif text-emerald-950 mb-2">Amplop Digital</h3>
                            <p className="text-xs text-emerald-700 mb-8">Doa restu Anda adalah karunia terbesar bagi kami.</p>
                            
                            {hasBank && (
                                <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 text-white p-6 rounded-2xl shadow-lg mb-6 text-left relative overflow-hidden">
                                    <p className="text-xs uppercase tracking-widest opacity-70 mb-1">{invitation.bank_name}</p>
                                    <p className="text-xl font-mono font-bold tracking-wider mb-4">{invitation.bank_account_number}</p>
                                    <p className="text-xs uppercase tracking-wider">A/N {invitation.bank_account_name}</p>
                                    <button onClick={() => copyToClipboard(invitation.bank_account_number)} className="mt-4 w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-all">
                                        📋 Salin No. Rekening
                                    </button>
                                </div>
                            )}

                            {hasQris && (
                                <div className="bg-white p-6 rounded-2xl border border-emerald-100 inline-block shadow-sm">
                                    <img src={invitation.qris_image_url} alt="QRIS" className="w-44 h-44 object-contain mx-auto mb-3" />
                                    <p className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Scan QRIS</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="px-6 py-8">
                        <GuestBook invitationId={invitation.id} theme="floral" />
                    </div>
                </div>
            </div>
        </div>
    );
}
