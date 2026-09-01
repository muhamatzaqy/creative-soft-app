import ThemeElegant from '@/app/components/themes/ThemeElegant';
import ThemeFloral from '@/app/components/themes/ThemeFloral';
import ThemeMinimalist from '@/app/components/themes/ThemeMinimalist';
import ThemeModern from '@/app/components/themes/ThemeModern';
import ThemeRustic from '@/app/components/themes/ThemeRustic';

// 1. TAMBAHKAN 'async' dan ubah tipe params menjadi Promise (Syarat wajib Next.js 15+)
export default async function DemoPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. TUNGGU (await) params selesai di-load oleh server
  const resolvedParams = await params;
  const themeId = resolvedParams.id;

  // 3. DATA BOHONGAN (DUMMY DATA) UNTUK PREVIEW
  const dummyInvitation = {
    id: 'demo-123',
    groom_name: 'Romeo',
    bride_name: 'Juliet',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    location_address: 'Gedung Serbaguna Jakarta, Jl. Jend. Sudirman No. 1, Jakarta Pusat',
    google_maps_link: 'https://maps.google.com',
    hero_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800'
    ],
    qris_image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg',
    bank_name: 'BCA',
    bank_account_number: '1234567890',
    bank_account_name: 'Romeo Montague'
  };

  const dummyGuestName = "Tamu Kehormatan";

  // 4. ROUTER TEMA BERDASARKAN ID
  switch (themeId) {
    case 'elegant':
      return <ThemeElegant invitation={dummyInvitation} guestName={dummyGuestName} />;
    
    case 'floral':
      return <ThemeFloral invitation={dummyInvitation} guestName={dummyGuestName} />;
    
    case 'minimalist':
      return <ThemeMinimalist invitation={dummyInvitation} guestName={dummyGuestName} />;
    
    case 'modern':
      return <ThemeModern invitation={dummyInvitation} guestName={dummyGuestName} />;
    
    case 'rustic':
      return <ThemeRustic invitation={dummyInvitation} guestName={dummyGuestName} />;
      
    default:
      return (
        <div className="flex min-h-screen items-center justify-center p-8 text-center bg-slate-50 text-slate-800">
          <div>
            <h1 className="text-3xl font-bold mb-4 text-slate-400">🚧</h1>
            <h2 className="text-2xl font-bold mb-2">Demo Belum Tersedia</h2>
            <p className="text-slate-500">
              Preview untuk tema dengan ID <strong>{themeId}</strong> sedang dalam tahap pengembangan atau komponen belum didaftarkan.
            </p>
          </div>
        </div>
      );
  }
}
