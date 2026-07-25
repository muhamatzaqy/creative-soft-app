'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

// Tipe data untuk buku tamu
type GuestBookEntry = {
    id: string;
    guest_name: string;
    attendance_status: string;
    message: string;
    created_at: string;
};

export default function GuestBook({ invitationId }: { invitationId: string }) {
    const [messages, setMessages] = useState<GuestBookEntry[]>([]);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Hadir');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Mengambil data ucapan dari database
    const fetchMessages = async () => {
        const { data, error } = await supabase
            .from('guest_books')
            .select('*')
            .eq('invitation_id', invitationId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setMessages(data);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [invitationId]);

    // Mengirim ucapan baru ke database
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { error } = await supabase
            .from('guest_books')
            .insert([
                {
                    invitation_id: invitationId,
                    guest_name: name,
                    attendance_status: status,
                    message: message,
                }
            ]);

        setIsSubmitting(false);

        if (!error) {
            // Bersihkan form setelah berhasil
            setName('');
            setMessage('');
            setStatus('Hadir');
            // Refresh daftar ucapan
            fetchMessages();
        } else {
            alert('Gagal mengirim ucapan, silakan coba lagi.');
        }
    };

    return (
        <div className="mt-12 pt-8 border-t border-rose-100 text-left w-full">
            <h3 className="font-serif text-2xl text-rose-800 text-center mb-6">RSVP & Ucapan</h3>

            {/* Formulir RSVP */}
            <form onSubmit={handleSubmit} className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100 space-y-4 mb-8">
                <div>
                    <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Nama Anda</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white"
                        placeholder="Contoh: Budi & Keluarga"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Kehadiran</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white text-gray-700"
                    >
                        <option value="Hadir">Hadir</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                        <option value="Ragu-ragu">Ragu-ragu</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Pesan & Doa</label>
                    <textarea
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 rounded-xl border border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-400 bg-white resize-none"
                        placeholder="Tuliskan doa untuk kedua mempelai..."
                    ></textarea>
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50"
                >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
            </form>

            {/* Daftar Ucapan */}
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                    <p className="text-center text-gray-400 text-sm italic">Jadilah yang pertama memberikan ucapan.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800">{msg.guest_name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${msg.attendance_status === 'Hadir' ? 'bg-green-100 text-green-700' :
                                        msg.attendance_status === 'Tidak Hadir' ? 'bg-red-100 text-red-700' :
                                            'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {msg.attendance_status}
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm leading-relaxed">{msg.message}</p>
                            <p className="text-gray-400 text-[10px] mt-2">
                                {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}