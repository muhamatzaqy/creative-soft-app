import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

// Tipe params sebagai Promise untuk Next.js 15
export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {

    // Membuka isi params dengan await
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // Mencari data menggunakan variabel 'slug' yang sudah dibuka
    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        notFound();
    }

    const eventDate = new Date(invitation.event_date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden text-center p-8 space-y-8">

                <div className="space-y-2">
                    <p className="text-sm text-gray-400 uppercase tracking-widest font-semibold">
                        Undangan Pernikahan
                    </p>
                    <h1 className="text-4xl font-serif text-gray-800">
                        {invitation.groom_name} & {invitation.bride_name}
                    </h1>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-100 text-left">
                    <div>
                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Waktu Acara</h3>
                        <p className="text-gray-600 mt-1">{eventDate} WIB</p>
                    </div>
                    <div className="border-t pt-4">
                        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">Lokasi</h3>
                        <p className="text-gray-600 mt-1 whitespace-pre-wrap">{invitation.location_address}</p>
                    </div>
                </div>

                {invitation.qris_image_url && (
                    <div className="space-y-4 border-t pt-8">
                        <h3 className="font-semibold text-gray-800">Amplop Digital</h3>
                        <p className="text-sm text-gray-500">
                            Tanpa mengurangi rasa hormat, bagi tamu yang ingin memberikan tanda kasih dapat memindai QRIS di bawah ini:
                        </p>
                        <div className="flex justify-center mt-4 p-4 border-2 border-dashed border-gray-200 rounded-xl">
                            <img
                                src={invitation.qris_image_url}
                                alt="QRIS Pembayaran"
                                className="max-w-[200px] h-auto object-contain rounded-lg"
                            />
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}