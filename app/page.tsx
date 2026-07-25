import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans selection:bg-rose-200">

      {/* Navigasi (Header) */}
      <nav className="w-full bg-white/80 backdrop-blur-md fixed top-0 z-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="font-serif text-2xl font-bold text-rose-600 tracking-wide">
            Creative Soft.
          </div>
          <Link
            href="/login"
            className="text-sm font-medium text-gray-600 hover:text-rose-600 transition-colors px-4 py-2 rounded-full hover:bg-rose-50"
          >
            Masuk / Daftar Dasbor
          </Link>
        </div>
      </nav>

      {/* Bagian Hero (Sapaan Utama) */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center">
        <div className="space-y-8 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Sebarkan Momen Bahagia Anda dengan <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-600">Lebih Elegan</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed">
            Platform pembuatan undangan pernikahan digital premium. Lengkap dengan fitur hitung mundur otomatis, navigasi lokasi, dan integrasi amplop digital (QRIS).
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-medium transition-all duration-300 shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-1"
            >
              Buat Undangan Sekarang
            </Link>
            <Link
              href="#fitur"
              className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 hover:text-rose-600 border border-gray-200 rounded-full font-medium transition-all duration-300 shadow-sm hover:border-rose-200 hover:bg-rose-50"
            >
              Lihat Fitur Kami
            </Link>
          </div>
        </div>

        {/* Ilustrasi/Mockup Bayangan */}
        <div className="mt-20 relative mx-auto max-w-4xl">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent z-10"></div>
          <div className="bg-white rounded-t-3xl shadow-2xl border border-gray-100 overflow-hidden aspect-video flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-pink-50/30">
            <span className="text-5xl mb-4">💍</span>
            <div className="text-rose-400 font-serif text-2xl md:text-3xl animate-pulse text-center px-4">
              Desain Undangan Premium & Romantis
            </div>
          </div>
        </div>
      </main>

      {/* Bagian Fitur */}
      <section id="fitur" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 font-serif">Mengapa Memilih Creative Soft?</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Fokus saja pada persiapan momen bahagia Anda, biarkan sistem kami yang mengurus penyebaran undangannya.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Fitur 1 */}
            <div className="p-8 bg-rose-50/40 rounded-3xl border border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 mb-6 text-2xl group-hover:scale-110 transition-transform">
                ⏱️
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Sistem Mandiri (SaaS)</h3>
              <p className="text-gray-600 leading-relaxed">Klien Anda mendapatkan dasbor khusus. Mereka bisa mengedit nama, tanggal, dan lokasi kapan saja tanpa merepotkan Anda.</p>
            </div>

            {/* Fitur 2 */}
            <div className="p-8 bg-rose-50/40 rounded-3xl border border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 mb-6 text-2xl group-hover:scale-110 transition-transform">
                ✨
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Desain Memukau</h3>
              <p className="text-gray-600 leading-relaxed">Dilengkapi efek visual modern, hitung mundur interaktif, dan tata letak yang menyesuaikan dengan sempurna di layar HP.</p>
            </div>

            {/* Fitur 3 */}
            <div className="p-8 bg-rose-50/40 rounded-3xl border border-rose-100 hover:shadow-xl hover:shadow-rose-100/50 transition-all duration-300 group">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 mb-6 text-2xl group-hover:scale-110 transition-transform">
                💳
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Amplop Digital & QRIS</h3>
              <p className="text-gray-600 leading-relaxed">Fasilitasi tamu yang berhalangan hadir agar tetap bisa memberikan tanda kasih langsung ke rekening klien dengan mudah.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-10 text-center border-t border-gray-800">
        <p className="text-gray-400 text-sm font-medium tracking-wide">
          © {new Date().getFullYear()} Creative Soft. Dibuat dengan ❤️ di Yogyakarta.
        </p>
      </footer>
    </div>
  );
}