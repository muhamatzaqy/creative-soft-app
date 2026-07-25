import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeModern({ invitation, guestName }: { invitation: any, guestName: string }) {
    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
            <div className="max-w-lg w-full bg-white rounded-3xl overflow-hidden text-center p-8 sm:p-12 relative shadow-2xl border border-slate-200">
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md z-10">
                    TEMA: MODERN (BIRU/BERSIH)
                </div>

                <div className="space-y-6 mt-4">
                    <p className="text-xs sm:text-sm text-blue-500 font-bold uppercase tracking-widest">Undangan Pernikahan</p>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl my-6 shadow-sm">
                        <p className="text-xs text-blue-600 uppercase tracking-widest mb-1 font-medium">Kepada Yth.</p>
                        <h2 className="text-xl font-bold text-slate-800 font-serif">{guestName}</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h1 className="text-5xl sm:text-6xl font-black text-slate-800 uppercase tracking-tighter">{invitation.groom_name}</h1>
                        <span className="text-3xl font-bold text-blue-400">X</span>
                        <h1 className="text-5xl sm:text-6xl font-black text-slate-800 uppercase tracking-tighter">{invitation.bride_name}</h1>
                    </div>
                </div>

                <Countdown targetDate={invitation.event_date} theme="modern" />

                <div className="bg-slate-50 p-6 rounded-2xl space-y-6 mt-10">
                    <p className="text-slate-700 font-bold">{eventDate} WIB</p>
                    <p className="text-slate-500">{invitation.location_address}</p>
                </div>

                <GuestBook invitationId={invitation.id} theme="modern" />
            </div>
        </div>
    );
}