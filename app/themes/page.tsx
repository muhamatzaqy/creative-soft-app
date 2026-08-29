'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/lib/supabase'; // Pastikan path ini sesuai

type Theme = {
  id: string;
  name: string;
  description: string;
  price: number;
  max_photos: number;
  thumbnail_url: string | null;
};

export default function ThemesCatalogPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchThemes = async () => {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .eq('is_active', true)
        .order('price', { ascending: true }); // Urutkan dari harga termurah

      if (!error && data) {
        setThemes(data);
      }
      setIsLoading(false);
    };

    fetchThemes();
  }, []);

  // Format angka ke Rupiah (contoh: Rp 99.000)
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Fungsi saat tombol "Pilih Tema" diklik
  const handleSelectTheme = (themeId: string) => {
    // Arahkan ke halaman checkout dengan membawa parameter ID tema
    // Jika belum login, kita bisa atur perlindungannya di halaman checkout nanti
    router.push(`/dashboard/checkout?theme=${themeId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      
      {/* NAVBAR SEDERHANA */}
      <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md group-hover:bg-indigo-700 transition-colors">✨</div>
            <span className="font-bold text-lg text-slate-900 tracking-tight">Creative Soft.</span>
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Masuk Dasbor &rarr;
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        
        {/* HEADER KATALOG */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Pilih Desain <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">Impian Anda</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            Semua tema kami dirancang dengan standar kualitas tinggi, responsif di semua perangkat, dan dilengkapi fitur buku tamu serta amplop digital.
          </p>
        </div>

        {/* LOADING STATE */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm animate-pulse h-96 flex flex-col justify-between">
                <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded-full w-3/4 mb-3"></div>
                <div className="h-4 bg-slate-200 rounded-full w-full mb-6"></div>
                <div className="h-12 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : (
          
          /* GRID TEMA */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {themes.map((theme) => (
              <div 
                key={theme.id} 
                className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all duration-300 flex flex-col group"
              >
                
                {/* Gambar Thumbnail Tema */}
                <div className="w-full h-56 bg-slate-100 relative overflow-hidden border-b border-slate-100">
                  {/* Gunakan gambar asli dari database jika ada, jika tidak pakai placeholder warna */}
                  {theme.thumbnail_url ? (
                    <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                      {theme.id === 'minimalist' ? '🌸' : theme.id === 'elegant' ? '✨' : theme.id === 'rustic' ? '🍂' : theme.id === 'modern' ? '💎' : '🌿'}
                    </div>
                  )}
                  
                  {/* Badge Tema Populer (Hanya contoh logika) */}
                  {theme.price > 100000 && (
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white text-[10px] px-3 py-1.5 rounded-full font-bold tracking-widest uppercase shadow-md">
                      Premium
                    </div>
                  )}
                </div>

                {/* Konten Kartu */}
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-slate-900">{theme.name}</h3>
                  </div>
                  
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {theme.description}
                  </p>

                  <div className="flex items-center gap-2 mb-8">
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                      📸 Max {theme.max_photos} Foto
                    </span>
                    <span className="bg-slate-50 border border-slate-200 text-slate-600 text-xs px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5">
                      📱 Responsif
                    </span>
                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-auto flex items-end justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Investasi</p>
                      <p className="text-2xl font-black text-indigo-600">{formatRupiah(theme.price)}</p>
                    </div>
                  </div>

                  {/* Tombol Aksi */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <button 
                      onClick={() => alert(`Demo untuk tema ${theme.name} sedang disiapkan.`)}
                      className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 text-sm"
                    >
                      👁️ Demo
                    </button>
                    <button 
                      onClick={() => handleSelectTheme(theme.id)}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-200 hover:-translate-y-0.5 text-sm"
                    >
                      Beli Tema
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </main>

    </div>
  );
}
