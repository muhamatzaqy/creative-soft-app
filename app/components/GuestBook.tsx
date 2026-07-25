'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../src/lib/supabase';

type GuestBookEntry = { id: string; guest_name: string; attendance_status: string; message: string; created_at: string; };

export default function GuestBook({ invitationId, theme = 'minimalist' }: { invitationId: string, theme?: string }) {
    const [messages, setMessages] = useState<GuestBookEntry[]>([]);
    const [name, setName] = useState('');
    const [status, setStatus] = useState('Hadir');
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchMessages = async () => {
        const { data, error } = await supabase.from('guest_books').select('*').eq('invitation_id', invitationId).order('created_at', { ascending: false });
        if (!error && data) setMessages(data);
    };

    useEffect(() => { fetchMessages(); }, [invitationId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const { error } = await supabase.from('guest_books').insert([{ invitation_id: invitationId, guest_name: name, attendance_status: status, message: message }]);
        setIsSubmitting(false);
        if (!error) { setName(''); setMessage(''); setStatus('Hadir'); fetchMessages(); }
        else alert('Gagal mengirim ucapan.');
    };

    const getThemeStyles = () => {
        switch (theme) {
            case 'elegant': return { divider: "border-zinc-800", title: "text-amber-500", formBg: "bg-zinc-900/50 border-zinc-800", label: "text-amber-600", input: "border-zinc-800 bg-zinc-950 focus:ring-amber-500 text-amber-100 placeholder-zinc-600", button: "bg-amber-600 hover:bg-amber-700 text-black", cardBg: "bg-zinc-900/80 border-zinc-800", cardName: "text-amber-100", cardText: "text-zinc-400", cardDate: "text-zinc-600" };
            case 'floral': return { divider: "border-emerald-200", title: "text-emerald-800", formBg: "bg-emerald-50/50 border-emerald-100", label: "text-emerald-700", input: "border-emerald-200 bg-white focus:ring-emerald-400 text-emerald-900", button: "bg-emerald-600 hover:bg-emerald-700 text-white", cardBg: "bg-white border-emerald-100", cardName: "text-emerald-900", cardText: "text-emerald-700", cardDate: "text-emerald-500" };
            case 'rustic': return { divider: "border-orange-200", title: "text-orange-900", formBg: "bg-orange-100/50 border-orange-200", label: "text-orange-800", input: "border-orange-200 bg-[#faf4ef] focus:ring-orange-400 text-orange-950", button: "bg-orange-700 hover:bg-orange-800 text-white", cardBg: "bg-[#faf4ef] border-orange-200", cardName: "text-orange-950", cardText: "text-orange-800", cardDate: "text-orange-600" };
            case 'modern': return { divider: "border-slate-200", title: "text-slate-800", formBg: "bg-slate-50 border-slate-200", label: "text-slate-600", input: "border-slate-200 bg-white focus:ring-blue-400 text-slate-800", button: "bg-blue-600 hover:bg-blue-700 text-white", cardBg: "bg-white border-slate-200 shadow-sm", cardName: "text-slate-800", cardText: "text-slate-600", cardDate: "text-slate-400" };
            case 'minimalist':
            default: return { divider: "border-rose-100", title: "text-rose-800", formBg: "bg-rose-50/50 border-rose-100", label: "text-rose-700", input: "border-rose-200 bg-white focus:ring-rose-400 text-gray-800", button: "bg-rose-600 hover:bg-rose-700 text-white", cardBg: "bg-white border-gray-100", cardName: "text-gray-800", cardText: "text-gray-600", cardDate: "text-gray-400" };
        }
    };

    const styles = getThemeStyles();

    return (
        <div className={`mt-12 pt-8 border-t text-left w-full ${styles.divider}`}>
            <h3 className={`font-serif text-2xl text-center mb-6 ${styles.title}`}>RSVP & Ucapan</h3>

            <form onSubmit={handleSubmit} className={`p-6 rounded-2xl border space-y-4 mb-8 ${styles.formBg}`}>
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${styles.label}`}>Nama Anda</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all ${styles.input}`} placeholder="Contoh: Budi & Keluarga" />
                </div>
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${styles.label}`}>Kehadiran</label>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 transition-all ${styles.input}`}>
                        <option value="Hadir">Hadir</option>
                        <option value="Tidak Hadir">Tidak Hadir</option>
                        <option value="Ragu-ragu">Ragu-ragu</option>
                    </select>
                </div>
                <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${styles.label}`}>Pesan & Doa</label>
                    <textarea required value={message} onChange={(e) => setMessage(e.target.value)} rows={3} className={`w-full px-4 py-2 rounded-xl border focus:outline-none focus:ring-2 resize-none transition-all ${styles.input}`} placeholder="Tuliskan doa untuk kedua mempelai..."></textarea>
                </div>
                <button type="submit" disabled={isSubmitting} className={`w-full py-3 rounded-xl font-medium transition-colors shadow-sm disabled:opacity-50 ${styles.button}`}>
                    {isSubmitting ? 'Mengirim...' : 'Kirim Ucapan'}
                </button>
            </form>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {messages.length === 0 ? (
                    <p className={`text-center text-sm italic ${styles.cardText}`}>Jadilah yang pertama memberikan ucapan.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`p-4 rounded-xl border shadow-sm ${styles.cardBg}`}>
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-bold ${styles.cardName}`}>{msg.guest_name}</h4>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider ${msg.attendance_status === 'Hadir' ? 'bg-green-100 text-green-700 border border-green-200' :
                                        msg.attendance_status === 'Tidak Hadir' ? 'bg-red-100 text-red-700 border border-red-200' :
                                            'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                    }`}>
                                    {msg.attendance_status}
                                </span>
                            </div>
                            <p className={`text-sm leading-relaxed ${styles.cardText}`}>{msg.message}</p>
                            <p className={`text-[10px] mt-2 ${styles.cardDate}`}>
                                {new Date(msg.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}