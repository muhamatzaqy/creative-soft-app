'use client';

import { useState, useEffect, useRef, ReactNode } from 'react';
import Countdown from '../Countdown';
import GuestBook from '../GuestBook';
import BackgroundMusic from '../BackgroundMusic';

// --- KOMPONEN ANIMASI SCROLL ---
const FadeIn = ({ children, delay = 0, direction = 'up', className = '' }: { children: ReactNode, delay?: number, direction?: 'up' | 'none', className?: string }) => {
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
             className={`transition-all duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? 'opacity-100 translate-y-0' : `opacity-0 ${translateY}`} ${className}`} 
             style={{ transitionDelay: `${delay}ms` }}>
            {children}
        </div>
    );
};

// --- DIVIDER ELEGAN ---
const ElegantDivider = () => (
    <div className="flex items-center justify-center gap-4 w-full my-12 opacity-70">
        <div className="h-px bg-[#8C8476] w-16 md:w-32"></div>
        <span className="text-[#8C8476] text-lg">✧</span>
        <div className="h-px bg-[#8C8476] w-16 md:w-32"></div>
    </div>
);

export default function ThemeRustic({ invitation, guestName }: { invitation: any, guestName: string }) {
    const [isOpened, setIsOpened] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => { setIsMounted(true); }, []);

    // Helper Fungsi untuk Parse Tanggal (Bahasa Indonesia)
    const parseDate = (dateString: string) => {
        if (!dateString) return { fullDate: '', time: '' };
        const d = new Date(dateString);
        return {
            fullDate: d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
            time: d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.') // Format Indonesia 08.00
        };
    };

    const akad = isMounted ? parseDate(invitation.akad_date) : { fullDate: '', time: '' };
    const resepsi = isMounted ? parseDate(invitation.event_date) : { fullDate: '', time: '' };

    const tz = invitation.timezone || 'WIB';
    const akadEnd = invitation.akad_end_time || 'Selesai';
    const resepsiEnd = invitation.event_end_time || 'Selesai';

    const autoMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location_address)}`;
    const finalMapsUrl = invitation.google_maps_link ? invitation.google_maps_link : autoMapsUrl;
    
    // Tampilan Gambar Fallback & Musik Default
    const heroImage = invitation.hero_image_url || "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800&auto=format&fit=crop";
    const musicSource = invitation.music_url || '/music/The Paper Kites - Bloom.mp3';

    // Ayat Suci Default (Bisa disesuaikan oleh user di Dashboard)
    const quoteText = invitation.quote_text || "Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang.";
    const quoteSource = invitation.quote_source || "QS. Ar-Rum: 21";

    const hasQris = Boolean(invitation.qris_image_url && invitation.qris_image_url.trim() !== '');
    const hasBank = Boolean(invitation.bank_account_number && invitation.bank_account_number.trim() !== '');

    const handleOpen = () => {
        setIsOpened(true);
        setTimeout(() => { 
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Nomor rekening berhasil disalin!');
    };

    return (
        <>
            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400;1,500&family=Great+Vibes&family=Montserrat:wght@300;400;500&display=swap');
                
                .font-cormorant { font-family: 'Cormorant Garamond', serif; }
                .font-vibes { font-family: 'Great Vibes', cursive; }
                .font-montserrat { font-family: 'Montserrat', sans-serif; }
                
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

            <div className="bg-[#FBF9F6] min-h-[100dvh] font-montserrat text-[#36312D] relative overflow-hidden selection:bg-[#BCA993] selection:text-white">
                <div className="paper-texture"></div>
                <BackgroundMusic audioUrl={musicSource} isOpened={isOpened} />

                {/* =========================================
                    SAMPUL DEPAN (COVER)
                ========================================= */}
                <div className={`fixed inset-0 z-[100] bg-[#F4F1EA] flex flex-col items-center justify-center p-6 sm:p-12 text-center transition-all duration-[1500ms] ease-[cubic-bezier(0.25,1,0.5,1)] ${
                    isOpened ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
                }`}>
                    
                    <div className="absolute top-0 left-0 w-32 h-32 opacity-20 bg-[radial-gradient(#4A5342_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
                    <div className="absolute bottom-0 right-0 w-32 h-32 opacity-20 bg-[radial-gradient(#4A5342_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                    <div className="max-w-2xl w-full border border-[#DCD3C6] p-8 sm:p-16 relative bg-white/50 backdrop-blur-sm shadow-[0_20px_40px_rgba(54,49,45,0.03)] z-10 flex flex-col items-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-[#F4F1EA] flex items-center justify-center">
                            <span className="text-[#C5B49C]">✧</span>
                        </div>

                        <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium text-[#8C8476] mb-6 block">Pernikahan Dari</span>
                        
                        <h1 className="text-4xl sm:text-6xl md:text-7xl font-cormorant text-[#2C2825] mb-2 font-medium leading-tight">
                            {invitation.groom_name?.split(' ')[0] || 'Groom'}
                            <span className="block font-vibes text-[#BCA993] text-5xl sm:text-7xl md:text-8xl -my-4 sm:-my-6 z-10 relative">&</span>
                            {invitation.bride_name?.split(' ')[0] || 'Bride'}
                        </h1>

                        <div className="mt-12 sm:mt-16 mb-10 text-center">
                            <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[#8C8476] font-medium mb-3">Kepada Yth.</p>
                            <h2 className="text-lg sm:text-xl font-cormorant italic font-semibold text-[#2C2825] border-b border-[#DCD3C6] inline-block pb-1 px-6">{guestName}</h2>
                        </div>

                        <button 
                            onClick={handleOpen} 
                            className="px-8 sm:px-10 py-3 sm:py-4 bg-[#4A5342] hover:bg-[#3A4233] text-white font-montserrat text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-500 shadow-xl hover:shadow-2xl hover:-translate-y-1"
                        >
                            Buka Undangan
                        </button>
                    </div>
                </div>

                {/* =========================================
                    KONTEN UTAMA UNDANGAN
                ========================================= */}
                <div ref={contentRef} className={`relative transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}`}>
                    
                    {/* BAGIAN HERO & MEMPELAI */}
                    <section className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center p-6 md:p-12 lg:p-24 w-full max-w-[1920px] mx-auto z-10">
                        <div className="flex flex-col lg:flex-row items-center w-full max-w-6xl gap-12 lg:gap-24">
                            
                            {/* Gambar Mempelai */}
                            <FadeIn delay={300} className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
                                <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-full aspect-[3/4] sm:aspect-[4/5] rounded-t-full overflow-hidden border-[8px] sm:border-[12px] border-white shadow-[0_30px_60px_rgba(54,49,45,0.08)]">
                                    <div className="absolute inset-0 bg-[#2C2825]/10 z-10 mix-blend-overlay pointer-events-none"></div>
                                    <img src={heroImage} alt="Mempelai" className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s]" />
                                </div>
                            </FadeIn>

                            {/* Detail Nama Mempelai & Doa */}
                            <FadeIn delay={600} className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-2 z-20">
                                <span className="text-[10px] sm:text-xs uppercase tracking-[0.4em] font-medium text-[#8B9382] block mb-6">Momen Bahagia Kami</span>
                                
                                {/* Mempelai Pria */}
                                <div className="mb-8">
                                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-cormorant text-[#2C2825] leading-[1.1] mb-2 font-medium">
                                        {invitation.groom_name}
                                    </h2>
                                    {invitation.groom_parents && (
                                        <p className="text-xs sm:text-sm font-montserrat text-[#8C8476] uppercase tracking-widest leading-relaxed">
                                            Putra dari <span className="font-semibold text-[#4A5342]">{invitation.groom_parents}</span>
                                        </p>
                                    )}
                                </div>

                                <span className="font-vibes text-[#BCA993] text-5xl sm:text-7xl lg:text-8xl leading-none block my-4 lg:-ml-4">&</span>

                                {/* Mempelai Wanita */}
                                <div className="mt-8 mb-10">
                                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-cormorant text-[#2C2825] leading-[1.1] mb-2 font-medium">
                                        {invitation.bride_name}
                                    </h2>
                                    {invitation.bride_parents && (
                                        <p className="text-xs sm:text-sm font-montserrat text-[#8C8476] uppercase tracking-widest leading-relaxed">
                                            Putri dari <span className="font-semibold text-[#4A5342]">{invitation.bride_parents}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Kutipan / Ayat Suci */}
                                <div className="mt-12 bg-white/40 p-6 sm:p-8 rounded-xl border border-[#DCD3C6] backdrop-blur-sm inline-block w-full">
                                    <p className="text-sm sm:text-base text-[#8C8476] font-light italic font-cormorant leading-relaxed">
                                        "{quoteText}"
                                    </p>
                                    <p className="text-[10px] text-[#4A5342] mt-4 font-bold tracking-widest uppercase">
                                        — {quoteSource} —
                                    </p>
                                </div>
                            </FadeIn>
                        </div>
                    </section>

                    <ElegantDivider />

                    {/* BAGIAN WAKTU & TEMPAT (AKAD & RESEPSI) */}
                    <section className="py-16 sm:py-24 px-6 md:px-12 w-full max-w-6xl mx-auto relative z-10">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[#8B9382] font-medium">Waktu & Tempat</span>
                                <h3 className="text-3xl sm:text-5xl font-cormorant text-[#2C2825] mt-4">Rangkaian Acara</h3>
                            </div>
                        </FadeIn>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
                            
                            {/* KARTU AKAD */}
                            {invitation.akad_date && (
                                <FadeIn delay={200} className="h-full">
                                    <div className="bg-white/70 backdrop-blur-sm border border-[#E8E2D9] p-8 sm:p-12 shadow-sm text-center h-full flex flex-col justify-center relative overflow-hidden group hover:border-[#C5B49C] transition-colors rounded-tr-3xl rounded-bl-3xl">
                                        <div className="text-[#C5B49C] text-3xl mb-4 transition-transform duration-500 group-hover:scale-125">💍</div>
                                        <h4 className="text-xs uppercase tracking-[0.3em] text-[#8B9382] font-bold mb-6">Akad Nikah</h4>
                                        
                                        <p className="font-cormorant text-2xl sm:text-3xl font-medium text-[#2C2825] mb-2">
                                            {akad.fullDate}
                                        </p>
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#4A5342] font-semibold mb-8 border-b border-[#E8E2D9] pb-6 inline-block mx-auto max-w-xs">
                                            Pukul {akad.time} {tz} - {akadEnd}
                                        </p>
                                        
                                        <p className="font-cormorant text-xl font-medium text-[#2C2825] leading-relaxed">
                                            {invitation.akad_location}
                                        </p>
                                    </div>
                                </FadeIn>
                            )}

                            {/* KARTU RESEPSI */}
                            <FadeIn delay={400} className="h-full">
                                <div className="bg-white/70 backdrop-blur-sm border border-[#E8E2D9] p-8 sm:p-12 shadow-sm text-center h-full flex flex-col justify-center relative overflow-hidden group hover:border-[#C5B49C] transition-colors rounded-tl-3xl rounded-br-3xl">
                                    <div className="text-[#C5B49C] text-3xl mb-4 transition-transform duration-500 group-hover:scale-125">🥂</div>
                                    <h4 className="text-xs uppercase tracking-[0.3em] text-[#8B9382] font-bold mb-6">Resepsi Pernikahan</h4>
                                    
                                    <p className="font-cormorant text-2xl sm:text-3xl font-medium text-[#2C2825] mb-2">
                                        {resepsi.fullDate}
                                    </p>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#4A5342] font-semibold mb-8 border-b border-[#E8E2D9] pb-6 inline-block mx-auto max-w-xs">
                                        Pukul {resepsi.time} {tz} - {resepsiEnd}
                                    </p>
                                    
                                    <p className="font-cormorant text-xl font-medium text-[#2C2825] leading-relaxed mb-8">
                                        {invitation.location_address}
                                    </p>
                                    
                                    <div>
                                        <a 
                                            href={finalMapsUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="inline-block px-8 py-3 bg-[#4A5342] text-white hover:bg-[#3A4233] font-montserrat text-[10px] uppercase tracking-[0.2em] transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                                        >
                                            Buka Peta Lokasi
                                        </a>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </section>

                    {/* BAGIAN HITUNG MUNDUR (COUNTDOWN) */}
                    <FadeIn>
                        <section className="py-16 w-full max-w-4xl mx-auto px-6">
                            <div className="border-y border-[#DCD3C6] py-12 relative flex justify-center">
                                {/* Menghitung mundur ke Acara Pertama (Akad, jika tidak ada baru ke Resepsi) */}
                                <Countdown targetDate={invitation.akad_date || invitation.event_date} theme="rustic" />
                            </div>
                        </section>
                    </FadeIn>

                    {/* BAGIAN GALERI */}
                    {invitation.gallery_images?.length > 0 && (
                        <section className="py-20 sm:py-32 px-6 w-full max-w-7xl mx-auto">
                            <FadeIn>
                                <div className="text-center mb-16 sm:mb-24">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8476] font-medium">Rona Kebahagiaan</span>
                                    <h3 className="text-3xl sm:text-5xl font-cormorant text-[#2C2825] mt-4">Galeri Foto</h3>
                                </div>
                            </FadeIn>

                            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 sm:gap-8 space-y-6 sm:space-y-8">
                                {invitation.gallery_images.map((img: string, idx: number) => img && (
                                    <FadeIn key={idx} delay={idx * 150} direction="up">
                                        <div className="break-inside-avoid rounded-xl overflow-hidden bg-white p-2 sm:p-3 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-[#E8E2D9] group cursor-pointer hover:border-[#C5B49C] transition-colors">
                                            <div className="overflow-hidden relative rounded-lg">
                                                <div className="absolute inset-0 bg-[#3A352F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none"></div>
                                                <img src={img} alt={`Galeri ${idx + 1}`} className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
                                            </div>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </section>
                    )}

                    <ElegantDivider />

                    {/* BAGIAN KADO PERNIKAHAN / AMPLOP DIGITAL */}
                    {(hasQris || hasBank) && (
                        <section className="py-20 px-6 w-full max-w-3xl mx-auto">
                            <FadeIn>
                                <div className="text-center mb-12 sm:mb-16">
                                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#8C8476] font-medium">Amplop Digital</span>
                                    <h3 className="text-3xl sm:text-4xl font-cormorant text-[#2C2825] mt-4 mb-4">Kado Pernikahan</h3>
                                    <p className="text-sm sm:text-base text-[#8C8476] font-light italic font-cormorant max-w-lg mx-auto leading-relaxed">
                                        Doa restu Anda merupakan karunia terindah bagi kami. Namun, jika Anda hendak memberikan tanda kasih, Anda dapat mengirimkannya melalui fitur di bawah ini.
                                    </p>
                                </div>
                            </FadeIn>

                            <div className="flex flex-col gap-8">
                                {hasBank && (
                                    <FadeIn delay={200}>
                                        <div className="bg-[#1C1F18] text-[#F4F1EA] p-8 sm:p-14 rounded-2xl relative overflow-hidden shadow-2xl border border-[#3A4233]">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#4A5342]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
                                            
                                            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8">
                                                <div>
                                                    <span className="inline-block px-4 py-1.5 bg-white/10 text-[#C5B49C] text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                                                        {invitation.bank_name}
                                                    </span>
                                                    <p className="text-3xl sm:text-4xl font-montserrat font-medium tracking-widest mb-2 text-white">{invitation.bank_account_number}</p>
                                                    <p className="text-sm sm:text-base font-cormorant italic text-[#DCD3C6]">A.n. {invitation.bank_account_name}</p>
                                                </div>
                                                <button 
                                                    onClick={() => copyToClipboard(invitation.bank_account_number)} 
                                                    className="w-full sm:w-auto px-8 py-4 bg-[#4A5342] hover:bg-[#3A4233] text-white text-[10px] uppercase tracking-[0.2em] font-semibold rounded-xl transition-all shadow-md shrink-0 flex justify-center items-center gap-2"
                                                >
                                                    <span>Salin Rekening</span>
                                                </button>
                                            </div>
                                        </div>
                                    </FadeIn>
                                )}

                                {hasQris && (
                                    <FadeIn delay={400}>
                                        <div className="bg-white p-8 sm:p-12 border border-[#E8E2D9] flex flex-col items-center text-center shadow-sm relative overflow-hidden rounded-2xl">
                                            <div className="p-4 border-2 border-dashed border-[#DCD3C6] rounded-xl mb-6">
                                                <img src={invitation.qris_image_url} alt="QRIS" className="w-48 sm:w-64 h-auto object-contain relative z-10" />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8C8476] relative z-10 font-bold">Pindai QRIS untuk memberikan tanda kasih</p>
                                        </div>
                                    </FadeIn>
                                )}
                            </div>
                        </section>
                    )}

                    {/* BUKU TAMU & RSVP */}
                    <section className="py-20 px-6 w-full max-w-4xl mx-auto">
                        <FadeIn>
                            <div className="bg-white/60 backdrop-blur-sm border border-[#E8E2D9] p-6 sm:p-12 shadow-sm relative overflow-hidden rounded-2xl">
                                <div className="text-center mb-10">
                                    <h3 className="text-3xl font-cormorant text-[#2C2825]">Buku Tamu & Kehadiran</h3>
                                    <p className="text-sm text-[#8C8476] mt-2">Sampaikan doa dan konfirmasi kehadiran Anda.</p>
                                </div>
                                <div className="relative z-10">
                                    <GuestBook invitationId={invitation.id} theme="rustic" />
                                </div>
                            </div>
                        </FadeIn>
                    </section>

                    {/* FOOTER */}
                    <footer className="relative bg-[#161814] text-[#F4F1EA] text-center py-24 px-6 overflow-hidden flex flex-col items-center justify-center mt-12">
                        <div className="absolute inset-0 bg-[radial-gradient(#2C2825_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>
                        
                        <FadeIn className="relative z-10 max-w-xl mx-auto">
                            <span className="text-[#C5B49C] text-xl block mb-4">✧ ✧ ✧</span>
                            <p className="text-xs font-montserrat text-[#A3AA9B] mb-4 uppercase tracking-[0.3em]">Merupakan suatu kehormatan bagi kami atas kehadiran Anda.</p>
                            <p className="font-cormorant text-4xl sm:text-5xl text-[#F4F1EA] italic mb-6 tracking-wide drop-shadow-md">Terima Kasih</p>
                            
                            <p className="text-[10px] sm:text-xs uppercase tracking-[0.4em] text-[#A3AA9B] font-bold">
                                Kami yang berbahagia, <br/><br/>
                                <span className="text-white font-medium text-sm sm:text-base tracking-[0.3em]">
                                    {invitation.groom_name?.split(' ')[0]} & {invitation.bride_name?.split(' ')[0]}
                                </span>
                            </p>
                        </FadeIn>
                    </footer>

                </div>
            </div>
        </>
    );
}
