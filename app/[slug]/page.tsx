import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

import ThemeMinimalist from '../components/themes/ThemeMinimalist';
import ThemeElegant from '../components/themes/ThemeElegant';
import ThemeFloral from '../components/themes/ThemeFloral';
import ThemeRustic from '../components/themes/ThemeRustic';
import ThemeModern from '../components/themes/ThemeModern';

export default async function InvitationPage({
    params,
    searchParams
}: {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    // --- BACA URL UNTUK MODE PREVIEW ---
    const resolvedSearchParams = await searchParams;
    const isPreview = resolvedSearchParams.preview === 'true';
    // -----------------------------------

    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        notFound();
    }

    // --- PENGUNCIAN UNDANGAN ---
    // Jika belum lunas DAN bukan mode preview, tampilkan gembok
    if (!invitation.is_active && !isPreview) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans text-center">
                <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    <div className="text-5xl mb-6">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-800">Undangan Belum Aktif</h1>
                    <p className="text-gray-500 text-sm leading-relaxed">
                        Mohon maaf, tautan undangan ini sedang ditangguhkan atau pemilik undangan belum menyelesaikan proses administrasi pendaftaran.
                    </p>
                </div>
            </div>
        );
    }

    // --- RENDER TEMA ---
    let ThemeComponent;
    switch (invitation.theme_name) {
        case 'elegant': ThemeComponent = <ThemeElegant invitation={invitation} />; break;
        case 'floral': ThemeComponent = <ThemeFloral invitation={invitation} />; break;
        case 'rustic': ThemeComponent = <ThemeRustic invitation={invitation} />; break;
        case 'modern': ThemeComponent = <ThemeModern invitation={invitation} />; break;
        case 'minimalist':
        default: ThemeComponent = <ThemeMinimalist invitation={invitation} />; break;
    }

    return (
        <>
            {/* SPANDUK ANTI-CURANG: Muncul jika mode preview dipakai di undangan belum lunas */}
            {!invitation.is_active && isPreview && (
                <div className="fixed top-0 left-0 w-full bg-amber-500 text-black text-[10px] sm:text-xs text-center py-2 font-bold z-[100] shadow-md uppercase tracking-wider">
                    ⚠️ Mode Preview: Tautan ini tidak untuk disebarkan ke tamu (Belum Lunas)
                </div>
            )}

            {ThemeComponent}
        </>
    );
}