import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

// Import kelima koleksi tema yang sudah kita buat
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

    // Mengarahkan data ke desain yang sesuai pilihan klien di Dasbor
    switch (invitation.theme_name) {
        case 'elegant':
            return <ThemeElegant invitation={invitation} />;
        case 'floral':
            return <ThemeFloral invitation={invitation} />;
        case 'rustic':
            return <ThemeRustic invitation={invitation} />;
        case 'modern':
            return <ThemeModern invitation={invitation} />;
        case 'minimalist':
        default:
            return <ThemeMinimalist invitation={invitation} />;
    }
}