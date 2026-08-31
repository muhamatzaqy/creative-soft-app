'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

// --- KOMPONEN ANIMASI SCROLL (INTERSECTION OBSERVER) ---
const FadeIn = ({ children, delay = 0, direction = 'up' }: { children: ReactNode, delay?: number, direction?: 'up' | 'none' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setIsVisible(true);
        }, { threshold: 0.15 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const translateY = direction === 'up' ? 'translate-y-12' : 'translate-y-0';
    
    return (
        <div ref={ref} 
             className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : `opacity-0 ${translateY}`}`} 
             style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

// --- ORNAMEN BOTANI SVG ---
const BotanicalBranch = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M10,90 Q40,50 90,10" stroke="currentColor" strokeWidth="0.5" strokeLinecap="round" />
        <path d="M30,70 Q40,60 50,75 Q40,80 30,70 Z" fill="currentColor" opacity="0.7"/>
        <path d="M50,45 Q65,30 80,45 Q65,55 50,45 Z" fill="currentColor" opacity="0.7"/>
        <path d="M65,25 Q75,15 85,30 Q75,40 65,25 Z" fill="currentColor" opacity="0.7"/>
        <path d="M20,50 Q30,40 40,55 Q30,65 20,50 Z" fill="currentColor" opacity="0.7"/>
    </svg>
);

const ElegantDivider = () => (
    <div className="flex items-center justify-center gap-4 w-full my-8 opacity-70">
        <div className="h-px bg-[#8C8476] w-12 md:w-24"></div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#8C8476]">
            <path d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z" fill="currentColor" opacity="0.5"/>
        </svg>
        <div className="h-px bg-[#8C8476] w-12 md:w-24"></div>
    </div>
);

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
        setTimeout(() => { 
            // Memberikan waktu agar animasi cover selesai sebelum scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor rekening disalin!');
    };

    return (
        <>
            {/* INJEKSI FONT & TEKSTUR PREMIUM */}
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');
                
                .font-cormorant { font-family: 'Cormorant Garamond', serif; }
                .font-vibes { font-family: 'Great Vibes', cursive; }
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                
                /* Handmade Paper Texture */
                .paper-texture {
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
                    opacity: 0.035;
                    mix-blend-multiply: multiply;
                    pointer-events: none;
                    z-index: 9999;
                }
            `}</style>

            <div className="bg-[#FBF9F6] min-h-[100dvh] font-montserrat text-[#36312D] relative overflow-x-hidden selection:bg-[#BCA993] selection:text-white">
                <div className="paper-texture"></div>

                {/* =========================================
                    SAMPUL DIGITAL (COVER ENVELOPE)
                ========================================= */}
                <div className={`fixed inset-0 z-[100] bg-[#F4F1EA] flex flex-col items-center justify-center p-6 sm:p-12 text-center transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpened ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                    {/* Corner Ornaments */}
                    <BotanicalBranch className="absolute top-4 left-4 sm:top-10 sm:left-10 w-24 sm:w-40 text-[#8B9382] opacity-60 transform -scale-x-100" />
                    <BotanicalBranch className="absolute bottom-4 right-4 sm:bottom-10 sm:right-10 w-24 sm:w-40 text-[#8B9382] opacity-60 transform -scale-y-100" />

                    <div className="max-w-2xl w-full border border-[#DCD3C6] p-8 sm:p-16 relative bg-white/40 backdrop-blur-sm shadow-[0_20px_40px_rgba(54,49,45,0.03)]">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#F4F1EA] flex items-center justify-center">
                            <span className="text-[#C5B49C]">✧</span>
                        </div>

                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium text-[#8C8476] mb-6 block">The Wedding Of</span>
                        
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant text-[#2C2825] mb-2 font-medium leading-tight">
                            {invitation.groom_name}
                            <span className="block font-vibes text-[#BCA993] text-5xl sm:text-7xl md:text-8xl -my-4 sm:-my-6 z-10 relative">&</span>
                            {invitation.bride_name}
                        </h1>

                        <div className="mt-12 sm:mt-16 mb-10 text-center">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8C8476] font-medium mb-3">Dear</p>
                            <h2 className="text-lg sm:text-xl font-cormorant italic font-semibold text-[#2C2825] border-b border-[#DCD3C6] inline-block pb-1 px-4">{guestName}</h2>
                        </div>

                        <button 
                            onClick={handleOpen} 
                            className="px-8 sm:px-10 py-3 sm:py-4 bg-[#4A5342] hover:bg-[#3A4233] text-white font-montserrat text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Open Invitation
                        </button>
                    </div>
                </div>

                {/* =========================================
                    KONTEN UTAMA (EDITORIAL LAYOUT)
                ========================================= */}
                <div ref={contentRef} className={`relative pb-32 transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
                    
                    {/* HERO SECTION */}
                    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 w-full max-w-[1920px] mx-auto">
                        <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl gap-12 lg:gap-24">
                            
                            {/* Image Arch (Desktop Left, Mobile Top) */}
                            <FadeIn delay={300} className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
                                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full aspect-[3/4] sm:aspect-[4/5] rounded-t-full overflow-hidden border-[8px] sm:border-[12px] border-white shadow-[0_30px_60px_rgba(54,49,45,0.08)]">
                                    <div className="absolute inset-0 bg-[#2C2825]/10 z-10 mix-blend-overlay pointer-events-none"></div>
                                    <img src={heroImage} alt="Couple" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s]" />
                                </div>
                            </FadeIn>

                            {/* Typography Details (Desktop Right, Mobile Bottom) */}
                            <FadeIn delay={600} className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2 z-20">
                                <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium text-[#8B9382] block mb-6">We Are Getting Married</span>
                                <h2 className="text-5xl sm:text-7xl lg:text-8xl font-cormorant text-[#2C2825] leading-[1.1] mb-6">
                                    {invitation.groom_name}
                                    <br />
                                    <span className="font-vibes text-[#BCA993] italic text-5xl sm:text-7xl lg:text-8xl leading-none">and</span>
                                    <br />
                                    {invitation.bride_name}
                                </h2>
                                <p className="text-sm sm:text-base text-[#8C8476] font-light max-w-md mx-auto lg:mx-0 italic font-cormorant leading-relaxed">
                                    "And I'd choose you; in a hundred lifetimes, in a hundred worlds, in any version of reality, I'd find you and I'd choose you."
                                </p>
                            </FadeIn>
                        </div>
                    </section>

                    <ElegantDivider />

                    {/* EVENT DETAILS SECTION */}
                    <section className="py-16 sm:py-24 px-6 md:px-12 w-full max-w-5xl mx-auto">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B9382] font-medium">When & Where</span>
                                <h3 className="text-3xl sm:text-5xl font-cormorant text-[#2C2825] mt-4">The Celebration</h3>
                            </div>
                        </FadeIn>

                        <div className="bg-white/60 backdrop-blur-sm border border-[#E8E2D9] p-8 sm:p-16 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
                                {/* Date Column */}
                                <FadeIn delay={200} className="text-center md:border-r md:border-[#E8E2D9] md:pr-8">
                                    <div className="text-[#C5B49C] text-2xl mb-4">✧</div>
                                    <p className="font-cormorant text-2xl sm:text-3xl font-medium text-[#2C2825] mb-2">{eventDate}</p>
                                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#8C8476]">Pukul {eventTime} WIB</p>
                                </FadeIn>

                                {/* Venue Column */}
                                <FadeIn delay={400} className="text-center md:pl-8">
                                    <div className="text-[#C5B49C] text-2xl mb-4">✧</div>
                                    <p className="font-cormorant text-xl sm:text-2xl font-medium text-[#2C2825] mb-4 leading-relaxed">
                                        {invitation.location_address}
                                    </p>
                                    <a 
                                        href={finalMapsUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="inline-block mt-2 px-8 py-3 border border-[#4A5342] text-[#4A5342] hover:bg-[#4A5342] hover:text-white font-montserrat text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
                                    >
                                        View Direction
                                    </a>
                                </FadeIn>
                            </div>
                        </div>
                    </section>

                    {/* COUNTDOWN SECTION */}
                    <FadeIn>
                        <section className="py-16 w-full max-w-4xl mx-auto px-6">
                            <div className="border-y border-[#DCD3C6] py-12 relative">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#FBF9F6] px-4">
                                    <BotanicalBranch className="w-12 text-[#8B9382] opacity-50" />
                                </div>
                                <Countdown targetDate={invitation.event_date} theme="rustic" />
                            </div>
                        </section>
                    </FadeIn>

                    {/* GALLERY SECTION */}
                    {invitation.gallery_images?.length > 0 && (
                        <section className="py-20 sm:py-32 px-6 w-full max-w-7xl mx-auto">
                            <FadeIn>
                                <div className="text-center mb-16 sm:mb-24">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8476] font-medium">A Glimpse of Us</span>
                                    <h3 className="text-3xl sm:text-5xl font-cormorant text-[#2C2825] mt-4">Captured Moments</h3>
                                </div>
                            </FadeIn>

                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
                                {invitation.gallery_images.map((img: string, idx: number) => img && (
                                    <FadeIn key={idx} delay={idx * 150} direction="up">
                                        <div className="break-inside-avoid rounded-sm overflow-hidden bg-white p-2 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#E8E2D9] group cursor-pointer">
                                            <div className="overflow-hidden relative">
                                                <div className="absolute inset-0 bg-[#3A352F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                                <img src={img} alt="Gallery" className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </section>
                    )}

                    <ElegantDivider />

                    {/* WEDDING GIFT / AMPLOP DIGITAL SECTION */}
                    {(hasQris || hasBank) && (
                        <section className="py-20 px-6 w-full max-w-3xl mx-auto">
                            <FadeIn>
                                <div className="text-center mb-12 sm:mb-16">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8476] font-medium">Wedding Gift</span>
                                    <h3 className="text-3xl sm:text-4xl font-cormorant text-[#2C2825] mt-4 mb-4">Send Love</h3>
                                    <p className="text-sm text-[#8C8476] font-light italic font-cormorant max-w-md mx-auto">
                                        Your presence is the greatest gift of all. However, should you wish to help us celebrate with a gift, a monetary contribution is deeply appreciated.
                                    </p>
                                </div>
                            </FadeIn>

                            <div className="flex flex-col gap-8">
                                {hasBank && (
                                    <FadeIn delay={200}>
                                        <div className="bg-[#2D3328] text-[#F4F1EA] p-8 sm:p-12 rounded-lg relative overflow-hidden shadow-2xl">
                                            {/* Suble background pattern */}
                                            <div className="absolute -right-20 -top-20 opacity-5 pointer-events-none">
                                                <BotanicalBranch className="w-64" />
                                            </div>
                                            
                                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                                <div>
                                                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#A3AA9B] mb-2">{invitation.bank_name}</p>
                                                    <p className="text-2xl sm:text-3xl font-montserrat font-medium tracking-widest mb-1">{invitation.bank_account_number}</p>
                                                    <p className="text-sm font-cormorant italic text-[#DCD3C6]">a.n {invitation.bank_account_name}</p>
                                                </div>
                                                <button 
                                                    onClick={() => copyToClipboard(invitation.bank_account_number)} 
                                                    className="w-full sm:w-auto px-6 py-3 border border-[#A3AA9B]/40 hover:bg-white/10 text-[10px] uppercase tracking-[0.2em] transition-colors"
                                                >
                                                    Copy Account
                                                </button>
                                            </div>
                                        </div>
                                    </FadeIn>
                                )}

                                {hasQris && (
                                    <FadeIn delay={400}>
                                        <div className="bg-white p-8 sm:p-12 border border-[#E8E2D9] flex flex-col items-center text-center shadow-sm">
                                            <img src={invitation.qris_image_url} alt="QRIS" className="w-48 sm:w-64 h-auto object-contain mb-6" />
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C8476]">Scan to send gift via QRIS</p>
                                        </div>
                                    </FadeIn>
                                )}
                            </div>
                        </section>
                    )}

                    {/* GUESTBOOK & RSVP SECTION */}
                    <section className="py-20 px-6 w-full max-w-4xl mx-auto">
                        <FadeIn>
                            <div className="bg-white/50 backdrop-blur-sm border border-[#E8E2D9] p-6 sm:p-12 shadow-sm relative">
                                <div className="absolute top-0 right-0 p-4 opacity-30">
                                    <BotanicalBranch className="w-16" />
                                </div>
                                <GuestBook invitationId={invitation.id} theme="rustic" />
                            </div>
                        </FadeIn>
                    </section>

                    {/* FOOTER */}
                    <footer className="text-center pb-12 pt-8">
                        <FadeIn>
                            <p className="font-cormorant text-2xl text-[#2C2825] italic mb-2">Thank You</p>
                            <p className="text-[9px] uppercase tracking-[0.3em] text-[#8C8476]">{invitation.groom_name} & {invitation.bride_name}</p>
                        </FadeIn>
                    </footer>

                </div>
            </div>
        </>
    );
}
