'use client'; // Wajib ditambahkan agar form bisa interaktif di sisi klien

import { useState } from 'react';
import { supabase } from '../../src/lib/supabase'; // Memanggil jembatan Supabase
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // State untuk ubah mode Login/Register
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault(); // Mencegah halaman refresh
    setLoading(true);

    try {
      if (isLogin) {
        // Logika untuk Login
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        
        alert('Login berhasil!');
        router.push('/dashboard'); // Arahkan ke halaman dashboard
      } else {
        // Logika untuk Mendaftar (Register)
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        
        alert('Registrasi berhasil! Akun Anda sudah siap digunakan.');
        setIsLogin(true); // Pindah kembali ke tampilan Login
      }
    } catch (error: any) {
      alert(error.message); // Menampilkan pesan jika ada error (salah password, dll)
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Creative Soft</h2>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin ? 'Masuk ke Dashboard Klien' : 'Daftar Akun Baru'}
          </p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-gray-900 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Memproses...' : (isLogin ? 'Masuk' : 'Daftar')}
          </button>
        </form>

        {/* Tombol untuk menukar antara Login dan Register */}
        <div className="text-center text-sm text-gray-600 mt-4">
          {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)}
            className="font-semibold text-gray-900 underline"
          >
            {isLogin ? 'Daftar di sini' : 'Masuk di sini'}
          </button>
        </div>
      </div>
    </div>
  )
}