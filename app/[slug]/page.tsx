// app/[slug]/page.tsx (Ilustrasi Struktur Masa Depan)

import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

// Import semua koleksi tema Anda
import ThemeMinimalist from '../components/themes/ThemeMinimalist';
import ThemeElegant from '../components/themes/ThemeElegant';
import ThemeFloral from '../components/themes/ThemeFloral';
// ... import tema lainnya ...

export default async function InvitationPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;

    // 1. Ambil data dari database
    const { data: invitation } = await supabase.from('invitations').select('*').eq('slug', slug).single();
    if (!invitation) notFound();

    // 2. "Petugas Terminal" mengarahkan ke desain yang sesuai
    switch (invitation.theme_name) {
        case 'elegant':
            return <ThemeElegant invitation={invitation} />;
        case 'floral':
            return <ThemeFloral invitation={invitation} />;
        case 'minimalist':
        default:
            return <ThemeMinimalist invitation={invitation} />;
    }
}