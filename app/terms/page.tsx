import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-indigo-200 selection:text-indigo-900">
      
      {/* NAVBAR (Sama dengan Landing Page) */}
      <nav className="w-full bg-white/70 backdrop-blur-xl fixed top-0 z-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md shadow-indigo-200 group-hover:bg-indigo-700 transition-colors">✨</div>
            <span className="font-bold text-xl text-slate-900 tracking-tight">
              Creative Soft
            </span>
          </Link>
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

      {/* HEADER SECTION */}
      <div className="pt-32 pb-12 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Syarat & Ketentuan</h1>
        <p className="text-slate-500 font-medium">Pembaruan Terakhir: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* CONTENT SECTION */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8 text-slate-600 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Ketentuan Penggunaan (Overview)</h2>
            <p>Selamat datang di Creative Soft. Penggunaan Anda atas situs web ini merupakan persetujuan Anda terhadap semua syarat, ketentuan, dan pemberitahuan yang tercantum di sini[cite: 12]. Dengan menggunakan Situs ini, Anda menyetujui Syarat dan Ketentuan ini, serta pedoman atau aturan lain yang berlaku untuk bagian mana pun dari Situs ini[cite: 12]. Jika Anda tidak setuju, Anda harus segera keluar dan menghentikan penggunaan layanan dari Situs ini[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Modifikasi Layanan</h2>
            <p>Creative Soft berhak untuk mengubah, memodifikasi, memperbarui, atau menghentikan syarat dan ketentuan, serta informasi, harga, dan materi lain yang ditawarkan melalui Situs ini kapan saja tanpa pemberitahuan sebelumnya[cite: 12]. Kami juga berhak menyesuaikan harga dari waktu ke waktu; jika terjadi kesalahan harga, kami berhak menolak pesanan tersebut[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Pendaftaran Akun (Sign Up)</h2>
            <p>Anda perlu mendaftar di Situs ini untuk membeli layanan dengan memasukkan nama pengguna dan kata sandi[cite: 12]. Anda bertanggung jawab penuh untuk menjaga kerahasiaan akun dan kata sandi Anda, serta atas setiap aktivitas yang terjadi di bawah akun Anda[cite: 12]. Anda setuju untuk memberikan informasi yang akurat dan tidak menyalahgunakan identitas atau entitas lain[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Hak Cipta & Lisensi (Copyrights & Proprietary Rights)</h2>
            <p>Situs ini dan semua tema undangan digital di dalamnya dimiliki dan dioperasikan oleh Creative Soft[cite: 12]. Semua materi, merek dagang, dan kode sumber dilindungi oleh undang-undang hak cipta Republik Indonesia[cite: 12]. Anda diberikan lisensi non-eksklusif dan tidak dapat dialihkan, semata-mata untuk penggunaan pribadi (acara pernikahan Anda)[cite: 12]. Anda dilarang keras untuk menyalin, mereproduksi, memodifikasi, atau mendistribusikan ulang tema kami dalam bentuk apa pun tanpa izin tertulis[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Harga & Pembayaran (Fees)</h2>
            <p>Sebagai imbalan atas lisensi yang diberikan, Anda harus membayar biaya lisensi/layanan sesuai dengan yang tertera pada halaman Katalog Tema[cite: 12]. Pembayaran diproses secara aman melalui gerbang pembayaran (Payment Gateway) atau transfer bank langsung. Pesanan Anda (tautan undangan) akan aktif setelah pembayaran diverifikasi oleh sistem atau admin kami.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Kebijakan Pengembalian Dana (Refund Policy)</h2>
            <p>Karena sifat produk kami berupa barang digital dan layanan perangkat lunak (*Software as a Service*), <strong>semua pembayaran bersifat final</strong>. Kami tidak menawarkan pengembalian dana (*refund*) setelah Anda melakukan pembayaran dan tautan undangan Anda telah berhasil diaktifkan. Mohon pastikan Anda telah meninjau tema dengan saksama sebelum melakukan pembayaran.</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Kebijakan Privasi (Privacy Policy)</h2>
            <p>Informasi Anda aman bersama kami[cite: 12]. Creative Soft memahami bahwa privasi sangat penting bagi pelanggan kami[cite: 12]. Anda dapat yakin bahwa informasi apa pun yang Anda kirimkan kepada kami (termasuk data acara, foto, dan informasi rekening/QRIS amplop digital) tidak akan disalahgunakan, disebarkan, atau dijual kepada pihak lain[cite: 12]. Kami hanya menggunakan informasi pribadi Anda untuk menyelesaikan pesanan dan menampilkan undangan digital Anda[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Penyangkalan (Disclaimer)</h2>
            <p>Creative Soft tidak bertanggung jawab atas penyediaan konten atau materi dari Situs (tautan undangan) yang telah kedaluwarsa atau masa aktif layanannya telah berakhir sesuai paket yang Anda pilih[cite: 12]. Kami juga tidak menjamin bahwa tampilan warna tema pada layar monitor atau ponsel Anda akan 100% sama persis, karena hal tersebut bergantung pada kualitas layar masing-masing perangkat[cite: 12].</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Hukum yang Berlaku (Applicable Laws)</h2>
            <p>Syarat dan Ketentuan ini diatur oleh dan ditafsirkan berdasarkan hukum yang berlaku di Republik Indonesia[cite: 12].</p>
          </section>

          <hr className="border-slate-100 my-8" />

          <section>
            <p className="text-sm text-slate-500 italic">
              Untuk pertanyaan lebih lanjut mengenai syarat dan ketentuan ini, silakan hubungi kami melalui panel admin atau kontak dukungan yang tersedia di Dasbor Klien[cite: 12].
            </p>
          </section>

        </div>
      </main>

      {/* FOOTER (Sama dengan Landing Page) */}
      <footer className="bg-slate-950 py-12 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center text-white text-xs">✨</div>
            <span className="font-bold text-lg text-white tracking-tight">Creative Soft.</span>
          </div>
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()} Hak Cipta Dilindungi. Dibuat di Yogyakarta.
          </p>
          <div className="flex gap-6 text-sm text-slate-500 font-medium">
            <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 transition-colors">Syarat & Ketentuan</Link>
            <a href="#" className="hover:text-indigo-400 transition-colors">Privasi</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
