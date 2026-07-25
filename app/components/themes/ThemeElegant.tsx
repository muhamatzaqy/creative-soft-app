import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeFloral({ invitation, guestName }: { invitation: any, guestName: string }) {
    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-emerald-50 flex flex-col items-center justify-center p-4 sm:p-8 font-sans">
            <div className="max-w-lg w-full bg-white rounded-[2rem] overflow-hidden text-center p-8 sm:p-12 relative border border-emerald-200">
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md z-10">
                    TEMA: FLORAL (BOTANICAL)
                </div>

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-300 to-green-500"></div>

                <div className="space-y-6 mt-4">
                    <p className="text-xs sm:text-sm text-emerald-600 uppercase font-semibold">Undangan Pernikahan</p>

                    <div className="bg-emerald-50/80 border border-emerald-200 p-4 rounded-2xl my-6 shadow-sm">
                        <p className="text-xs text-emerald-600 uppercase tracking-widest mb-1 font-medium">Kepada Yth.</p>
                        <h2 className="text-xl font-bold text-emerald-950 font-serif">{guestName}</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h1 className="text-5xl sm:text-6xl font-serif text-emerald-900">{invitation.groom_name}</h1>
                        <span className="text-4xl font-serif text-emerald-400">&</span>
                        <h1 className="text-5xl sm:text-6xl font-serif text-emerald-900">{invitation.bride_name}</h1>
                    </div>
                </div>

                <Countdown targetDate={invitation.event_date} theme="elegant" />

                <div className="bg-emerald-50/50 p-6 rounded-2xl space-y-6 border border-emerald-100 mt-10">
                    <p className="text-emerald-800 font-medium">{eventDate} WIB</p>
                    <p className="text-emerald-700">{invitation.location_address}</p>
                </div>

                <GuestBook invitationId={invitation.id} theme="elegant" />
            </div>
        </div>
    );
}