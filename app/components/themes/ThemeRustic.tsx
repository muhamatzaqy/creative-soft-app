import Countdown from '../Countdown';
import GuestBook from '../GuestBook';

export default function ThemeRustic({ invitation, guestName }: { invitation: any, guestName: string }) {
    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    return (
        <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4 sm:p-8 font-serif">
            <div className="max-w-lg w-full bg-[#faf4ef] rounded-[2rem] overflow-hidden text-center p-8 sm:p-12 relative border-2 border-orange-200">
                <div className="absolute top-4 right-4 bg-orange-700 text-white text-[10px] px-3 py-1 rounded-full font-bold shadow-md z-10">
                    TEMA: RUSTIC (KAYU/BUMI)
                </div>

                <div className="space-y-6 mt-4">
                    <p className="text-xs sm:text-sm text-orange-800 uppercase font-bold tracking-widest">Undangan Pernikahan</p>

                    <div className="bg-orange-100/80 border border-orange-200 p-4 rounded-2xl my-6 shadow-sm">
                        <p className="text-xs text-orange-800 uppercase tracking-widest mb-1 font-medium">Kepada Yth.</p>
                        <h2 className="text-xl font-bold text-orange-950 font-serif">{guestName}</h2>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                        <h1 className="text-5xl sm:text-6xl text-orange-950">{invitation.groom_name}</h1>
                        <span className="text-4xl text-orange-400">&</span>
                        <h1 className="text-5xl sm:text-6xl text-orange-950">{invitation.bride_name}</h1>
                    </div>
                </div>

                <Countdown targetDate={invitation.event_date} theme="minimalist" />

                <div className="bg-orange-100/50 p-6 rounded-2xl space-y-6 border border-orange-200 mt-10">
                    <p className="text-orange-900 font-medium">{eventDate} WIB</p>
                    <p className="text-orange-800">{invitation.location_address}</p>
                </div>

                <GuestBook invitationId={invitation.id} theme="minimalist" />
            </div>
        </div>
    );
}