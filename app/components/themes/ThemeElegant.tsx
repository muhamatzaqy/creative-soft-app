import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeElegant({ invitation }: { invitation: any }) {
    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
            <div className="max-w-lg w-full bg-zinc-900 rounded-[2rem] overflow-hidden text-center p-8 sm:p-12 relative border border-amber-900">

                {/* --- TANDA PENGENAL TEMA --- */}
                <div className="absolute top-4 right-4 bg-amber-500 text-black text-[10px] px-3 py-1 rounded-full font-bold shadow-md z-10">
                    TEMA: ELEGANT (GOLD)
                </div>
                {/* ------------------------- */}

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700"></div>

                <div className="space-y-6 mt-4">
                    <p className="text-xs sm:text-sm text-amber-500 uppercase font-semibold">Undangan Pernikahan</p>
                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h1 className="text-5xl sm:text-6xl font-serif text-amber-50">{invitation.groom_name}</h1>
                        <span className="text-4xl font-serif text-amber-600">&</span>
                        <h1 className="text-5xl sm:text-6xl font-serif text-amber-50">{invitation.bride_name}</h1>
                    </div>
                </div>

                <Countdown targetDate={invitation.event_date} theme="elegant" />

                <div className="bg-black/50 p-6 rounded-2xl space-y-6 border border-zinc-800 mt-10">
                    <p className="text-zinc-300 font-medium">{eventDate} WIB</p>
                    <p className="text-zinc-400">{invitation.location_address}</p>
                </div>

                <GuestBook invitationId={invitation.id} theme="elegant" />
            </div>
        </div>
    );
}