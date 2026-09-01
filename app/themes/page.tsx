'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../src/lib/supabase'; // Pastikan path ini sesuai

// Menambahkan opsi demo_url jika suatu saat Anda menambahkannya di database
type Theme = {
  id: string;
  name: string;
  description: string;
  price: number;
  max_photos: number;
  thumbnail_url: string | null;
  demo_url?: string; 
};

export default function ThemesCatalogPage() {
  const [themes, setThemes] = useState<Theme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk fitur Demo
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile');

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

  // Format angka ke Rupiah
  const formatRupiah = (angka: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  // Fungsi saat tombol "Pilih Tema" diklik
  const handleSelectTheme = (themeId: string) => {
    router.push(`/dashboard/checkout?theme=${themeId}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200">
      
      {/* NAVBAR */}
      <nav className="w-full bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200">
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
                  {theme.thumbnail_url ? (
                    <img src={theme.thumbnail_url} alt={theme.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-5xl">
                      {theme.id === 'minimalist' ? '🌸' : theme.id === 'elegant' ? '✨' : theme.id === 'rustic' ? '🍂' : theme.id === 'modern' ? '💎' : '🌿'}
                    </div>
                  )}
                  
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
                      onClick={() => {
                        setPreviewTheme(theme);
                        setViewMode('mobile'); // Default preview ke tampilan HP
                      }}
                      className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-xl transition-colors border border-slate-200 text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      Demo
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

      {/* =========================================
          MODAL DEMO PREVIEW (TAMPILAN MEWAH)
      ========================================= */}
      {previewTheme && (
        <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          
          {/* Top Navbar Modal */}
          <div className="h-16 px-4 sm:px-6 flex items-center justify-between border-b border-white/10 bg-slate-900/50">
            {/* Kiri: Judul Tema */}
            <div className="flex items-center gap-3">
              <span className="text-white font-bold tracking-wide">
                Preview: <span className="text-indigo-400">{previewTheme.name}</span>
              </span>
            </div>

            {/* Tengah: Device Toggle (Hanya Desktop) */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setViewMode('mobile')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${viewMode === 'mobile' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                📱 Mobile
              </button>
              <button 
                onClick={() => setViewMode('desktop')}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors flex items-center gap-2 ${viewMode === 'desktop' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                💻 Desktop
              </button>
            </div>

            {/* Kanan: Aksi */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button 
                onClick={() => handleSelectTheme(previewTheme.id)}
                className="hidden sm:block px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Gunakan Tema Ini
              </button>
              <button 
                onClick={() => setPreviewTheme(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
                title="Tutup Preview"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Iframe Area */}
          <div className="flex-1 overflow-auto flex justify-center items-center p-4 sm:p-8">
            <div 
              className={`transition-all duration-500 ease-in-out relative ${
                viewMode === 'mobile' 
                  ? 'w-full max-w-[375px] h-[812px] max-h-[85vh] rounded-[2.5rem] border-[10px] border-slate-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden bg-white ring-1 ring-white/20' 
                  : 'w-full max-w-7xl h-full max-h-[85vh] rounded-xl border border-slate-700 shadow-2xl overflow-hidden bg-white'
              }`}
            >
              {/* Note: src memanggil route /demo/[id_tema] yang perlu Anda buat, atau bisa diisi URL statis */}
              <iframe 
                src={previewTheme.demo_url || `/demo/${previewTheme.id}`} 
                className="w-full h-full border-0 bg-slate-50"
                title={`Demo ${previewTheme.name}`}
              />
            </div>
          </div>
          
          {/* Tombol Beli Mobile (Muncul di layar kecil) */}
          <div className="sm:hidden p-4 bg-slate-900 border-t border-white/10">
            <button 
                onClick={() => handleSelectTheme(previewTheme.id)}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                Gunakan Tema Ini - {formatRupiah(previewTheme.price)}
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
