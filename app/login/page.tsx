'use client'; 

import { useState } from 'react';
import { supabase } from '../../src/lib/supabase'; 
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); 
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard'); 
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert('🎉 Registrasi berhasil! Akun Anda sudah siap digunakan.');
        setIsLogin(true); 
      }
    } catch (error: any) {
      alert(error.message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Kiri: Bagian Branding (Sembunyikan di Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-indigo-900 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="relative z-10 text-center px-12">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">Creative Soft Invitations</h1>
          <p className="text-indigo-200 text-lg">Buat undangan digital impian Anda dalam hitungan menit. Elegan, modern, dan mudah digunakan.</p>
        </div>
      </div>

      {/* Kanan: Bagian Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24">
        <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
          <div className="text-center">
            <div className="w-12 h-12 bg-indigo-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-indigo-200">
               <span className="text-white text-2xl">✨</span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {isLogin ? 'Selamat Datang' : 'Mulai Sekarang'}
            </h2>
            <p className="text-slate-500 mt-2">
              {isLogin ? 'Masuk ke dasbor untuk mengelola undangan Anda.' : 'Daftar akun baru dan buat undangan pertama Anda.'}
            </p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 px-4 text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-md shadow-indigo-200 disabled:bg-slate-400 disabled:shadow-none mt-4"
            >
              {loading ? 'Memproses...' : (isLogin ? 'Masuk ke Dasbor' : 'Buat Akun')}
            </button>
          </form>

          <div className="text-center text-sm text-slate-500 pt-4">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)}
              className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline transition-all"
            >
              {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
