'use client';

import { useState, useEffect } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState({
        hari: 0, jam: 0, menit: 0, detik: 0
    });
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
            } else {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    // Mencegah error tampilan saat pertama kali dimuat di server
    if (!isMounted) return <div className="h-20"></div>;

    return (
        <div className="flex justify-center gap-3 sm:gap-6 my-8">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                    <div className="bg-white/60 backdrop-blur-sm border border-rose-100 shadow-sm w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center mb-1">
                        <span className="text-2xl sm:text-3xl font-serif text-rose-600">{value}</span>
                    </div>
                    <span className="text-[10px] sm:text-xs uppercase tracking-widest text-rose-400 font-semibold">{unit}</span>
                </div>
            ))}
        </div>
    );
}