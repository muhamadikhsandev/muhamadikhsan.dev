"use client";

import React from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';

interface HeroTabProps {
  heroData: any;
  setHeroData: (val: any) => void;
  saveHeroSettings: (e: React.FormEvent) => void;
  actionLoading: string | null;
}

export default function HeroTab({
  heroData,
  setHeroData,
  saveHeroSettings,
  actionLoading
}: HeroTabProps) {
  const handleHeroImageChange = (index: number, value: string) => {
    const updatedImages = [...(heroData.images || [])];
    updatedImages[index] = value;
    setHeroData({ ...heroData, images: updatedImages });
  };

  const addHeroImageField = () => {
    setHeroData({ ...heroData, images: [...(heroData.images || []), ""] });
  };

  const removeHeroImageField = (index: number) => {
    const updatedImages = (heroData.images || []).filter((_: any, i: number) => i !== index);
    setHeroData({ ...heroData, images: updatedImages });
  };

  return (
    <form onSubmit={saveHeroSettings} className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-2">Konfigurasi Hero Section</h2>
        <p className="text-slate-400 text-xs md:text-sm">Sesuaikan nama, subjudul, deskripsi utama, status ketersediaan, dan slider foto di landing page.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Nama Utama</label>
          <input
            type="text"
            value={heroData.title || ''}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: Muhamad"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Highlight Nama (Biru)</label>
          <input
            type="text"
            value={heroData.highlight_name || ''}
            onChange={(e) => setHeroData({ ...heroData, highlight_name: e.target.value })}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
            placeholder="Contoh: Ikhsan"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Subjudul / Peran</label>
        <input
          type="text"
          value={heroData.subtitle || ''}
          onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
          placeholder="Contoh: Full Stack Developer & Tech Enthusiast"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Deskripsi Ringkas</label>
        <textarea
          rows={4}
          value={heroData.description || ''}
          onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
          className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
          placeholder="Masukkan deskripsi diri singkat..."
          required
        />
      </div>

      <div className="flex items-center gap-3 bg-slate-950/40 p-4 border border-slate-800 rounded-2xl">
        <input
          type="checkbox"
          id="is_available"
          checked={!!heroData.is_available}
          onChange={(e) => setHeroData({ ...heroData, is_available: e.target.checked })}
          className="w-5 h-5 rounded-lg border-slate-800 text-blue-600 bg-slate-900 focus:ring-0 focus:ring-offset-0"
        />
        <label htmlFor="is_available" className="text-xs md:text-sm font-semibold text-slate-300 cursor-pointer select-none">
          Tampilkan Status Badge "Tersedia untuk proyek baru"
        </label>
      </div>

      {/* Hero Images Array List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Gambar Slider Hero</label>
          <button
            type="button"
            onClick={addHeroImageField}
            className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Plus size={14} /> Tambah Foto
          </button>
        </div>

        <div className="space-y-3">
          {heroData.images && heroData.images.map((img: string, idx: number) => (
            <div key={idx} className="flex gap-3 items-center">
              <div className="relative flex-grow group">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="text"
                  value={img}
                  onChange={(e) => handleHeroImageChange(idx, e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white text-xs md:text-sm outline-none focus:border-blue-500/50 transition-all"
                  placeholder="https://domain.com/path-to-image.png"
                  required
                />
              </div>

              {/* Image preview */}
              {img && (
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 relative group">
                  <img src={img} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                    <Eye size={12} className="text-white" />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => removeHeroImageField(idx)}
                className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all"
                title="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-900">
        <button
          type="submit"
          disabled={actionLoading === 'hero'}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          {actionLoading === 'hero' ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Simpan Perubahan Hero
        </button>
      </div>
    </form>
  );
}
