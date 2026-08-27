'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../src/lib/supabase';
import { useRouter } from 'next/navigation';
import RsvpViewer from '../components/RsvpViewer'; // Pastikan path import sesuai struktur Anda

// ... (Biarkan THEME_OPTIONS dan state inisialisasi persis seperti kode asli Anda)

export default function DashboardPage() {
    // ... (Semua state bawaan Anda letakkan disini)
    const [activeTab, setActiveTab] = useState('tema'); // STATE BARU UNTUK TAB NAVIGASI
    
    // ... (Semua fungsi bawaan: useEffect, handleSaveData, handleFileUpload, dll letakkan disini)

    // Style yang diseragamkan dengan desain baru
    const inputClasses = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed";
    const tabClasses = (tabName: string) => `px-6 py-3 font-semibold text-sm transition-all border-b-2 ${activeTab === tabName ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`;

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20">
            {/* Header (Sesuai Tema Baru) */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white text-sm shadow-md">✨</div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Studio Undangan</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden md:inline-block text-sm text-slate-500">Halo, {userEmail}</span>
                        <button onClick={handleLogout} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-all">Keluar</button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                {/* Status Bar Jika Belum Lunas */}
                {invitationId && !isActive && (
                    <div className="mb-8 p-5 bg-amber-50 border border-amber-200 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">💳</span>
                            <div>
                                <h3 className="font-bold text-amber-900">Selesaikan Pembayaran</h3>
                                <p className="text-sm text-amber-700">Tautan publik Anda saat ini terkunci. Lakukan pembayaran untuk mengaktifkan.</p>
                            </div>
                        </div>
                        <button onClick={() => setIsPaymentPopupOpen(true)} className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-sm transition-all">
                            Konfirmasi Bayar
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden">
                    {/* Tab Navigation */}
                    <div className="flex overflow-x-auto border-b border-slate-100 hide-scrollbar">
                        <button type="button" onClick={() => setActiveTab('tema')} className={tabClasses('tema')}>🎨 Pilih Tema</button>
                        <button type="button" onClick={() => setActiveTab('data')} className={tabClasses('data')}>💍 Data Acara</button>
                        <button type="button" onClick={() => setActiveTab('galeri')} className={tabClasses('galeri')}>📸 Galeri & Amplop</button>
                        {invitationId && <button type="button" onClick={() => setActiveTab('tamu')} className={tabClasses('tamu')}>💌 Sebar Undangan</button>}
                    </div>

                    <form onSubmit={handleSaveData} className="p-6 md:p-10">
                        {/* TAB 1: TEMA */}
                        {activeTab === 'tema' && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Pilih Desain Undangan</h2>
                                {/* Masukkan grid THEME_OPTIONS Anda di sini */}
                                {/* Ubah styling active theme menjadi border-indigo-500 bg-indigo-50 */}
                            </div>
                        )}

                        {/* TAB 2: DATA ACARA */}
                        {activeTab === 'data' && (
                            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Data Mempelai</h2>
                                    {/* Form groom_name, bride_name, slug */}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Waktu & Lokasi</h2>
                                    {/* Form event_date, location_address, google_maps_link */}
                                </div>
                            </div>
                        )}

                        {/* TAB 3: GALERI & AMPLOP */}
                        {activeTab === 'galeri' && (
                            <div className="animate-fade-in grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Foto</h2>
                                    {/* Form hero_image, gallery_images */}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-4">Amplop Digital</h2>
                                    {/* Form QRIS, Bank Account */}
                                </div>
                            </div>
                        )}

                        {/* TAB 4: BUKU TAMU & SEBAR (Hanya tampil jika sudah ada ID) */}
                        {activeTab === 'tamu' && invitationId && (
                            <div className="animate-fade-in">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Manajemen Tamu</h2>
                                {/* Masukkan form Generate Tautan Khusus Tamu Anda di sini */}
                                <div className="mt-8 border-t border-slate-100 pt-8">
                                    <RsvpViewer invitationId={invitationId} />
                                </div>
                            </div>
                        )}

                        {/* Tombol Aksi Bawah */}
                        {activeTab !== 'tamu' && (
                            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end gap-4">
                                {isEditMode ? (
                                    <>
                                        <button type="button" onClick={() => setIsEditMode(false)} className="px-6 py-3 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">Batal Edit</button>
                                        <button type="submit" disabled={isSaving} className="px-8 py-3 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all">
                                            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                        </button>
                                    </>
                                ) : (
                                    <button type="button" onClick={() => setIsEditMode(true)} className="px-8 py-3 font-semibold text-indigo-600 border-2 border-indigo-100 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-all">
                                        ✏️ Edit Data
                                    </button>
                                )}
                            </div>
                        )}
                    </form>
                </div>
            </div>
            {/* Modal Pembayaran Anda diletakkan di bawah sini dengan styling putih/abu-abu */}
        </div>
    );
}
