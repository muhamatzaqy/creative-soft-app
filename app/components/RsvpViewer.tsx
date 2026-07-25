'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

// Tipe data agar TypeScript tidak protes
type Guest = {
    id: string;
    guest_name: string;
    attendance_status: string;
    message: string;
    created_at: string;
};

export default function RsvpViewer({ invitationId }: { invitationId: string }) {
    const [guests, setGuests] = useState<Guest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGuests = async () => {
            if (!invitationId) return;

            const { data, error } = await supabase
                .from('guest_books')
                .select('*')
                .eq('invitation_id', invitationId)
                .order('created_at', { ascending: false });

            if (!error && data) {
                setGuests(data);
            }
            setLoading(false);
        };

        fetchGuests();
    }, [invitationId]);

    if (loading) return <div className="mt-8 text-rose-500 animate-pulse text-center font-medium">Memuat data tamu...</div>;

    // Menghitung rekapitulasi kehadiran
    const totalHadir = guests.filter(g => g.attendance_status === 'Hadir').length;
    const totalTidakHadir = guests.filter(g => g.attendance_status === 'Tidak Hadir').length;
    const totalRagu = guests.filter(g => g.attendance_status === 'Ragu-ragu').length;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-100 mt-8 w-full max-w-4xl mx-auto">
            <h3 className="text-xl font-bold text-gray-800 mb-6 font-serif border-b pb-4">Rekapitulasi Kehadiran Tamu (RSVP)</h3>

            {/* Kotak Ringkasan */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6 mb-8">
                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 text-center shadow-sm">
                    <div className="text-3xl font-bold text-green-600 mb-1">{totalHadir}</div>
                    <div className="text-[10px] sm:text-xs text-green-700 uppercase tracking-widest font-semibold">Hadir</div>
                </div>
                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 text-center shadow-sm">
                    <div className="text-3xl font-bold text-red-600 mb-1">{totalTidakHadir}</div>
                    <div className="text-[10px] sm:text-xs text-red-700 uppercase tracking-widest font-semibold">Tidak Hadir</div>
                </div>
                <div className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100 text-center shadow-sm">
                    <div className="text-3xl font-bold text-yellow-600 mb-1">{totalRagu}</div>
                    <div className="text-[10px] sm:text-xs text-yellow-700 uppercase tracking-widest font-semibold">Ragu-ragu</div>
                </div>
            </div>

            {/* Tabel Daftar Tamu */}
            <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                        <tr className="border-b-2 border-gray-100 bg-gray-50/50 text-xs uppercase text-gray-500 tracking-wider">
                            <th className="p-4 rounded-tl-xl font-semibold">Nama Tamu</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold">Pesan & Doa</th>
                            <th className="p-4 rounded-tr-xl font-semibold">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm text-gray-600">
                        {guests.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400 italic bg-gray-50/30 rounded-b-xl">
                                    Belum ada tamu yang mengisi buku tamu.
                                </td>
                            </tr>
                        ) : (
                            guests.map((guest) => (
                                <tr key={guest.id} className="border-b border-gray-50 hover:bg-rose-50/30 transition-colors">
                                    <td className="p-4 font-medium text-gray-800">{guest.guest_name}</td>
                                    <td className="p-4">
                                        <span className={`text-[10px] font-bold px-2 py-1.5 rounded-md uppercase tracking-wider ${guest.attendance_status === 'Hadir' ? 'bg-green-100 text-green-700' :
                                                guest.attendance_status === 'Tidak Hadir' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {guest.attendance_status}
                                        </span>
                                    </td>
                                    <td className="p-4 max-w-[250px] truncate" title={guest.message}>{guest.message}</td>
                                    <td className="p-4 text-xs text-gray-400 font-medium">
                                        {new Date(guest.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}