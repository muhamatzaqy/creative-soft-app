import { supabase } from '../../src/lib/supabase';
import { notFound } from 'next/navigation';

// Hanya import tema yang sudah eksis
import ThemeMinimalist from '../components/themes/ThemeMinimalist';

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

    // Mengarahkan ke desain yang sesuai
    switch (invitation.theme_name) {
        case 'minimalist':
        default:
            return <ThemeMinimalist invitation={invitation} />;
    }
}