"use client";

import React from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface ContactTabProps {
  contactData: any;
  setContactData: (val: any) => void;
  saveContactSettings: (e: React.FormEvent) => void;
  actionLoading: string | null;
}

export default function ContactTab({
  contactData,
  setContactData,
  saveContactSettings,
  actionLoading
}: ContactTabProps) {
  return (
    <form onSubmit={saveContactSettings} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Konfigurasi Hubungi Saya</h2>
        <p className="text-slate-400 text-xs md:text-sm">Sesuaikan data email, lokasi domisili, dan nomor WhatsApp utama.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Email Utama</label>
          <input
            type="email"
            value={contactData.email || ''}
            onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: muhamadikhsan.dev@gmail.com"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Lokasi Lengkap</label>
          <input
            type="text"
            value={contactData.location || ''}
            onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: Depok, Jawa Barat, Indonesia"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Nomor WhatsApp (Angka Saja, diawali 62)</label>
          <input
            type="text"
            value={contactData.whatsapp_number || ''}
            onChange={(e) => setContactData({ ...contactData, whatsapp_number: e.target.value.replace(/\D/g, '') })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: 628123456789"
            required
          />
          <p className="text-[10px] text-slate-500 italic mt-1">Masukkan format kode negara 62 di awal tanpa tanda '+' atau spasi.</p>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-900">
        <button
          type="submit"
          disabled={actionLoading === 'contact'}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {actionLoading === 'contact' ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Simpan Perubahan Kontak
        </button>
      </div>
    </form>
  );
}
