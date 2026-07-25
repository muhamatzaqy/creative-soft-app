'use client';

import { useState, useEffect } from 'react';

// PERBAIKAN: Menambahkan `theme?: string` pada antarmuka TypeScript
export default function Countdown({ targetDate, theme = 'minimalist' }: { targetDate: string, theme?: string }) {
    const [timeLeft, setTimeLeft] = useState({ hari: 0, jam: 0, menit: 0, detik: 0 });
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        const timer = setInterval(() => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();
            if (difference > 0) {
                setTimeLeft({
                    hari: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    jam: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    menit: Math.floor((difference / 1000 / 60) % 60),
                    detik: Math.floor((difference / 1000) % 60)
                });
            } else clearInterval(timer);
        }, 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    if (!isMounted) return <div className="h-20"></div>;

    const isElegant = theme === 'elegant';
    const styles = {
        box: isElegant ? "bg-black/60 border-zinc-800" : "bg-white/60 border-rose-100",
        number: isElegant ? "text-amber-500" : "text-rose-600",
        label: isElegant ? "text-amber-700" : "text-rose-400"
    };

    return (
        <div className="flex justify-center gap-3 sm:gap-6 my-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className={`backdrop-blur-sm border shadow-sm w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-1 transition-colors ${styles.box}`}>
                        <span className={`text-2xl sm:text-3xl font-serif ${styles.number}`}>{value}</span>
                    </div>
                    <span className={`text-[10px] sm:text-xs uppercase tracking-widest font-semibold ${styles.label}`}>{unit}</span>
                </div>
            ))}
        </div>
    );
}