'use client';

import { useState, useEffect } from 'react';

export default function Countdown({ targetDate, theme = 'minimalist' }: { targetDate: string, theme?: string }) {
    const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);

        // --- PERBAIKAN ZONA WAKTU ---
        // Menghapus atribut UTC (huruf 'Z' atau '+00:00') dari database
        // Agar browser selalu membacanya persis sebagai Waktu Lokal (WIB)
        const normalizedDate = targetDate.replace(/(Z|[+-]\d{2}:\d{2})$/, '');
        const targetTime = new Date(normalizedDate).getTime();

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference > 0) {
                setTimeLeft({
                    hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    menit: Math.floor((difference / 1000 / 60) % 60),
                    detik: Math.floor((difference / 1000) % 60)
                });
            } else {
                setTimeLeft({ hari: 0, jam: 0, menit: 0, detik: 0 });
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) return <div className="h-20"></div>;

    // --- PEMETAAN WARNA UNTUK 5 TEMA ---
    const getThemeStyles = () => {
        switch (theme) {
            case 'elegant':
                return { box: "bg-black/60 border-zinc-800", number: "text-amber-500", label: "text-amber-700" };
            case 'floral':
                return { box: "bg-white/60 border-emerald-100", number: "text-emerald-700", label: "text-emerald-500" };
            case 'rustic':
                return { box: "bg-[#faf4ef]/80 border-orange-200", number: "text-orange-800", label: "text-orange-600" };
            case 'modern':
                return { box: "bg-white/80 border-slate-200 shadow-sm", number: "text-blue-600", label: "text-slate-400" };
            case 'minimalist':
            default:
                return { box: "bg-white/60 border-rose-100", number: "text-rose-600", label: "text-rose-400" };
        }
    };

    const styles = getThemeStyles();

    return (
        <div className="flex justify-center gap-3 sm:gap-6 my-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className={`backdrop-blur-sm border shadow-sm w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-1 transition-colors ${styles.box}`}>
                        <span className={`text-2xl sm:text-3xl font-serif ${styles.number}`}>
                            {value}
                        </span>
                    </div>
                    <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${styles.label}`}>
                        {unit}
                    </span>
                </div>
            ))}
        </div>
    );
}