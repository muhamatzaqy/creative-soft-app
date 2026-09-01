import Link from 'next/link';
import { Metadata } from 'next';

// 1. METADATA: Mengubah judul tab browser
export const metadata: Metadata = {
  title: 'Creative Soft - Platform Undangan Digital Premium',
  description: 'Buat undangan pernikahan digital elegan dalam hitungan menit dengan fitur lengkap.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900 overflow-hidden">

      {/* BACKGROUND DECORATION (Modern Glow Effect) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-400/30 to-transparent blur-3xl rounded-full mix-blend-multiply"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-400/20 blur-3xl rounded-full mix-blend-multiply animate-pulse"></div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full bg-white/70 backdrop-blur-xl fixed top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md shadow-indigo-200">✨</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Creative Soft
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-6">
            <Link href="/themes" className="hidden sm:block text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">
              Katalog Tema
            </Link>
            <div className="h-4 w-px bg-slate-300 hidden sm:block"></div>
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors px-4 py-2 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200"
            >
              Masuk Dasbor
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center z-10">
        <div className="space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Platform Undangan Digital Premium
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Momen Spesial Anda, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-500">
              Kesan Abadi Selamanya.
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-500 leading-relaxed max-w-2xl mx-auto font-medium">
            Buat undangan pernikahan digital elegan dalam hitungan menit. Kelola tamu, terima amplop digital, dan pantau RSVP secara real-time dari satu dasbor canggih.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link
              href="/themes"
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all duration-300 shadow-[0_8px_30px_rgba(79,70,229,0.3)] hover:shadow-[0_8px_30px_rgba(79,70,229,0.5)] hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              Jelajahi Tema <span>&rarr;</span>
            </Link>
            <Link
              href="#alur"
              className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 hover:text-indigo-600 border border-slate-200 rounded-xl font-bold transition-all duration-300 shadow-sm hover:border-indigo-200 hover:bg-indigo-50"
            >
              Lihat Cara Kerja
            </Link>
          </div>
        </div>

        {/* HERO MOCKUP */}
        <div className="mt-20 relative mx-auto max-w-5xl perspective-1000">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-20"></div>
          <div className="bg-white rounded-t-[2.5rem] shadow-2xl border border-slate-200/60 overflow-hidden aspect-[16/9] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070')] bg-cover bg-center relative transform rotate-x-12 scale-105 hover:rotate-x-0 hover:scale-100 transition-all duration-700 ease-out">
             <div className="absolute inset-0 bg-indigo-950/40 backdrop-blur-sm"></div>
             <div className="relative z-10 text-center space-y-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto border border-white/30 shadow-2xl">
                    <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                </div>
                <h3 className="text-3xl font-serif text-white drop-shadow-md">Romeo & Juliet</h3>
             </div>
          </div>
        </div>
      </main>

      {/* HOW IT WORKS (ALUR BISNIS) */}
      <section id="alur" className="py-24 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Proses Sederhana</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Mulai Sebar Undangan dalam 3 Langkah</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-300 to-indigo-100 z-0"></div>

            {[
              { step: '01', title: 'Pilih Tema Favorit', desc: 'Jelajahi katalog kami dan pilih desain premium yang paling mencerminkan kepribadian Anda berdua.' },
              { step: '02', title: 'Checkout & Isi Data', desc: 'Lakukan pembayaran aman, lalu lengkapi detail acara, foto galeri, dan rekening amplop digital Anda.' },
              { step: '03', title: 'Sebar Undangan', desc: 'Sistem otomatis membuatkan tautan unik. Bagikan ke keluarga & sahabat, pantau RSVP secara real-time.' }
            ].map((item, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center group">
                <div className="w-24 h-24 bg-slate-50 rounded-full border-8 border-white shadow-xl flex items-center justify-center text-2xl font-black text-indigo-600 mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  {item.step}
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                <p className="text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Fitur Enterprise</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Teknologi di Balik Momen Indah Anda</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Responsif Mobile</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Tampil sempurna di semua ukuran layar ponsel cerdas hingga desktop resolusi tinggi.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Buku Tamu & RSVP</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Tamu dapat mengkonfirmasi kehadiran dan memberikan ucapan langsung di undangan Anda.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Amplop Digital QRIS</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Terima tanda kasih tanpa ribet dengan fitur barcode QRIS atau integrasi nomor rekening bank.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Self-Service Dashboard</h4>
              <p className="text-sm text-slate-500 leading-relaxed">Kendalikan semuanya sendiri. Edit nama, lokasi, atau generate link tamu langsung dari Dasbor Klien.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-indigo-900"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Siap Membagikan Kabar Bahagia?</h2>
          <p className="text-indigo-200 text-lg mb-10 max-w-2xl mx-auto">Tidak perlu menunggu lama. Pilih tema Anda hari ini, isi data, dan undangan digital Anda siap disebar luaskan.</p>
          <Link
            href="/themes"
            className="inline-block px-10 py-4 bg-white text-indigo-900 rounded-xl font-bold transition-all duration-300 shadow-xl hover:scale-105 active:scale-95"
          >
            Lihat Katalog Tema Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER BARU (Memenuhi Standar Midtrans) */}
      <footer className="bg-slate-950 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Kolom 1: Merek & Layanan */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white text-sm">✨</div>
                <span className="font-bold text-2xl text-white tracking-tight">Creative Soft.</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
                Layanan pembuatan undangan pernikahan digital premium berbasis Cloud. Praktis, elegan, dan dilengkapi fitur pengiriman amplop digital terintegrasi.
              </p>
              
              {/* Logo Bank/Metode Pembayaran (Wajib Midtrans) */}
              <div className="flex gap-2 items-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-2">Pembayaran Aman:</span>
                <div className="flex gap-2">
                   {/* Contoh placeholder logo bank sederhana (badge) */}
                   <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-blue-900">BCA</span>
                   <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-orange-600">BNI</span>
                   <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-blue-600">MANDIRI</span>
                   <span className="bg-white px-2 py-1 rounded text-[10px] font-black text-red-600">QRIS</span>
                </div>
              </div>
            </div>

            {/* Kolom 2: Tautan Legal */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Legal & Bantuan</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Syarat & Ketentuan</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Kebijakan Privasi</Link></li>
                <li><Link href="/terms" className="hover:text-indigo-400 transition-colors">Kebijakan Pengembalian</Link></li>
                <li><Link href="/themes" className="hover:text-indigo-400 transition-colors">Katalog Tema</Link></li>
              </ul>
            </div>

            {/* Kolom 3: Kontak (Wajib Midtrans) */}
            <div>
              <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Hubungi Kami</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <span className="text-indigo-500">📧</span>
                  <div>
                    <span className="block text-xs text-slate-500 mb-0.5">Email Support:</span>
                    <a href="mailto:softwaresolution.sos25@gmail.com" className="hover:text-white transition-colors">softwaresolution.sos25@gmail.com</a>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-500">💬</span>
                  <div>
                    <span className="block text-xs text-slate-500 mb-0.5">WhatsApp Admin:</span>
                    <a href="https://wa.me/6285600471854" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                      +62 856-0047-1854
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm font-medium">
              © {new Date().getFullYear()} Creative Soft Indonesia. Hak Cipta Dilindungi.
            </p>
            <p className="text-slate-600 text-xs">
              Dibuat dengan ❤️ di Yogyakarta, Indonesia.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
