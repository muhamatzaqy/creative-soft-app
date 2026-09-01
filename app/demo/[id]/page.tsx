import ThemeRustic from '@/app/components/themes/ThemeRustic'; 
// Catatan: Sesuaikan path import di atas dengan lokasi file ThemeRustic.tsx Anda. 
// Jika lokasinya berbeda, ubah path-nya.

export default function DemoPage({ params }: { params: { id: string } }) {
  
  // 1. DATA BOHONGAN (DUMMY DATA) UNTUK PREVIEW
  // Data ini digunakan agar tema tidak kosong saat di-preview oleh klien
  const dummyInvitation = {
    id: 'demo-123',
    groom_name: 'Romeo',
    bride_name: 'Juliet',
    event_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 Hari dari sekarang
    location_address: 'Gedung Serbaguna Jakarta, Jl. Jend. Sudirman No. 1, Jakarta Pusat',
    google_maps_link: 'https://maps.google.com',
    hero_image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=800',
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800',
      'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=800'
    ],
    qris_image_url: 'https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg', // Contoh gambar QR
    bank_name: 'BCA',
    bank_account_number: '1234567890',
    bank_account_name: 'Romeo Montague'
  };

  const dummyGuestName = "Tamu Kehormatan";

  // 2. LOGIKA PEMILIHAN TEMA BERDASARKAN ID
  // Ganti 'rustic' dengan ID tema yang ada di database Supabase Anda
  // (misalnya jika di database ID-nya adalah 'theme-001', maka ubah menjadi params.id === 'theme-001')
  
  if (params.id === 'rustic' || params.id === 'Tema-Rustic-Di-Database-Anda') {
    return <ThemeRustic invitation={dummyInvitation} guestName={dummyGuestName} />;
  }

  // Jika nanti Anda punya tema baru, tinggal tambahkan di sini:
  // if (params.id === 'minimalist') {
  //   return <ThemeMinimalist invitation={dummyInvitation} guestName={dummyGuestName} />;
  // }

  // 3. FALLBACK (Jika ID tema tidak ditemukan / belum ada komponennya)
  return (
    <div className="flex min-h-screen items-center justify-center p-8 text-center bg-slate-50 text-slate-800">
      <div>
        <h1 className="text-3xl font-bold mb-4 text-slate-400">🚧</h1>
        <h2 className="text-2xl font-bold mb-2">Demo Belum Tersedia</h2>
        <p className="text-slate-500">Preview untuk tema dengan ID <strong>{params.id}</strong> sedang dalam tahap pengembangan.</p>
      </div>
    </div>
  );
}
