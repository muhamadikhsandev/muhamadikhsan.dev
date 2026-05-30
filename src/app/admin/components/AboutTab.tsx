"use client";

import React from 'react';
import { Save, RefreshCw } from 'lucide-react';

interface AboutTabProps {
  aboutData: any;
  setAboutData: (val: any) => void;
  saveAboutSettings: (e: React.FormEvent) => void;
  actionLoading: string | null;
}

export default function AboutTab({
  aboutData,
  setAboutData,
  saveAboutSettings,
  actionLoading
}: AboutTabProps) {
  return (
    <form onSubmit={saveAboutSettings} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Konfigurasi About Section</h2>
        <p className="text-slate-400 text-xs md:text-sm">Perbarui biodata lengkap, statistik pengalaman, foto profil utama, dan tautan unduhan CV.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Nama Lengkap</label>
          <input
            type="text"
            value={aboutData.name || ''}
            onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: Muhamad Ikhsan"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Lokasi / Domisili</label>
          <input
            type="text"
            value={aboutData.location || ''}
            onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: Bogor, Indonesia"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Paragraf Deskripsi 1</label>
        <textarea
          rows={3}
          value={aboutData.description_1 || ''}
          onChange={(e) => setAboutData({ ...aboutData, description_1: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
          placeholder="Masukkan paragraf pertama deskripsi diri..."
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Paragraf Deskripsi 2</label>
        <textarea
          rows={3}
          value={aboutData.description_2 || ''}
          onChange={(e) => setAboutData({ ...aboutData, description_2: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
          placeholder="Masukkan paragraf kedua deskripsi diri..."
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Pengalaman (Tahun)</label>
          <input
            type="number"
            value={aboutData.years_experience || 0}
            onChange={(e) => setAboutData({ ...aboutData, years_experience: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: 3"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Fallback Total Proyek (Jika data kosong)</label>
          <input
            type="number"
            value={aboutData.total_projects || 0}
            onChange={(e) => setAboutData({ ...aboutData, total_projects: parseInt(e.target.value) || 0 })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: 10"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Foto Profil URL</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={aboutData.profile_image_url || ''}
              onChange={(e) => setAboutData({ ...aboutData, profile_image_url: e.target.value })}
              className="flex-grow bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
              placeholder="https://domain.com/profile.png"
              required
            />
            {aboutData.profile_image_url && (
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                <img src={aboutData.profile_image_url} alt="Profile" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Tautan Unduhan CV</label>
          <input
            type="text"
            value={aboutData.cv_url || ''}
            onChange={(e) => setAboutData({ ...aboutData, cv_url: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: /cv-muhamad-ikhsan.pdf"
            required
          />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-900">
        <button
          type="submit"
          disabled={actionLoading === 'about'}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {actionLoading === 'about' ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Simpan Perubahan About
        </button>
      </div>
    </form>
  );
}
