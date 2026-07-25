import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

import ThemeMinimalist from '../components/themes/ThemeMinimalist';
import ThemeElegant from '../components/themes/ThemeElegant';
import ThemeFloral from '../components/themes/ThemeFloral';
import ThemeRustic from '../components/themes/ThemeRustic';
import ThemeModern from '../components/themes/ThemeModern';

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !invitation) {
        notFound();
    }

    // --- FITUR PENGUNCIAN UNDANGAN (BARU) ---
    // Jika is_active masih false (belum lunas), tampilkan halaman tergembok
    if (!invitation.is_active) {
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
    // ----------------------------------------

    switch (invitation.theme_name) {
        case 'elegant': return <ThemeElegant invitation={invitation} />;
        case 'floral': return <ThemeFloral invitation={invitation} />;
        case 'rustic': return <ThemeRustic invitation={invitation} />;
        case 'modern': return <ThemeModern invitation={invitation} />;
        case 'minimalist':
        default: return <ThemeMinimalist invitation={invitation} />;
    }
}