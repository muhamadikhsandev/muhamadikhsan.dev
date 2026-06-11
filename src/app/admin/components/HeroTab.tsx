"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Upload } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import ConfirmModal from './ConfirmModal';

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
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  const [pendingFiles, setPendingFiles] = useState<{ [index: number]: File }>({});
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0); 
  
  const [originalDataString, setOriginalDataString] = useState<string>('');

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  useEffect(() => {
    if (heroData && Object.keys(heroData).length > 0 && originalDataString === '') {
      setOriginalDataString(JSON.stringify(heroData));
    }
  }, [heroData, originalDataString]);

  const pendingCount = Object.keys(pendingFiles).length;
  const isDirty = 
    (originalDataString !== '' && JSON.stringify(heroData) !== originalDataString) || 
    pendingCount > 0 || 
    deletedUrls.length > 0;

  const handleAddNewPhoto = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const currentImages = heroData.images || [];
    const newImages = [...currentImages, previewUrl];
    const newIndex = newImages.length - 1;

    setPendingFiles((prev) => ({ ...prev, [newIndex]: file }));
    setHeroData({ ...heroData, images: newImages });
    toast.success("Foto ditambahkan ke daftar preview!");
  };

  const handleReplacePhoto = (file: File, index: number) => {
    const previewUrl = URL.createObjectURL(file);
    const updatedImages = [...(heroData.images || [])];
    const oldUrl = updatedImages[index];

    if (oldUrl && !oldUrl.startsWith('blob:')) {
      setDeletedUrls((prev) => [...prev, oldUrl]);
    }

    updatedImages[index] = previewUrl;

    setPendingFiles((prev) => ({ ...prev, [index]: file }));
    setHeroData({ ...heroData, images: updatedImages });
    toast.success("Foto diganti di daftar preview!");
  };

  const handleDeleteConfirmed = async (index: number) => {
    setIsSaving(true);
    setProgress(15);
    try {
      const updatedImages = [...(heroData.images || [])];
      const targetUrl = updatedImages[index];

      updatedImages.splice(index, 1);

      const newPending: { [index: number]: File } = {};
      let newIdx = 0;
      for (let i = 0; i < (heroData.images || []).length; i++) {
        if (i === index) continue;
        if (pendingFiles[i]) {
          newPending[newIdx] = pendingFiles[i];
        }
        newIdx++;
      }

      setProgress(35);

      if (targetUrl && targetUrl.startsWith('blob:')) {
        setPendingFiles(newPending);
        setHeroData({ ...heroData, images: updatedImages });
        setProgress(100);
        await new Promise(r => setTimeout(r, 300));
        toast.success("Foto berhasil dihapus!");
        return;
      }

      const validFinalUrls = updatedImages.filter(url => url && !url.startsWith('blob:'));
      const dbPayload = { ...heroData, images: validFinalUrls };
      const { id, created_at, ...payload } = dbPayload;

      setProgress(60);

      const { error: dbError } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (dbError) throw dbError;

      setProgress(85);

      if (targetUrl) {
        const parts = targetUrl.split('/Hero/');
        if (parts.length > 1) {
          const filePath = parts[1];
          await supabase.storage.from('Hero').remove([filePath]);
        }
      }

      setPendingFiles(newPending);
      setHeroData({ ...heroData, images: updatedImages });
      setOriginalDataString(JSON.stringify(dbPayload));
      
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      queryClient.invalidateQueries({ queryKey: ['hero_settings'] });
      toast.success("Foto berhasil dihapus!");

    } catch (err: any) {
      toast.error("Gagal menghapus foto: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
    }
  };

  const triggerDeleteModal = (index: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Foto",
      message: `Apakah Anda yakin ingin menghapus foto ke-${index + 1}? Foto akan langsung dihapus permanen dari database dan storage.`,
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30",
      onConfirm: async () => await handleDeleteConfirmed(index)
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: "Simpan Perubahan",
      message: "Simpan konfigurasi Hero? Semua foto baru akan diunggah, perubahan teks akan diupdate, dan foto usang akan dibersihkan.",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(10);
    try {
      const uploadedUrls = [...(heroData.images || [])];
      const newFilesCount = Object.keys(pendingFiles).length;

      let currentUpload = 0;
      for (const indexStr of Object.keys(pendingFiles)) {
        const index = parseInt(indexStr);
        const file = pendingFiles[index];
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage.from('Hero').upload(fileName, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('Hero').getPublicUrl(fileName);
        uploadedUrls[index] = publicUrl;
        
        currentUpload++;
        setProgress(10 + Math.floor((currentUpload / newFilesCount) * 40)); 
      }

      setProgress(65);

      const validFinalUrls = uploadedUrls.filter(url => url && !url.startsWith('blob:'));
      const finalHeroData = { ...heroData, images: validFinalUrls };
      const { id, created_at, ...payload } = finalHeroData;

      const { error: dbError } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (dbError) throw dbError;

      setProgress(85);

      if (deletedUrls.length > 0) {
        for (const url of deletedUrls) {
          const parts = url.split('/Hero/');
          if (parts.length > 1) {
            const filePath = parts[1];
            await supabase.storage.from('Hero').remove([filePath]);
          }
        }
      }

      setHeroData(finalHeroData);
      setOriginalDataString(JSON.stringify(finalHeroData));
      setPendingFiles({});
      setDeletedUrls([]);

      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      queryClient.invalidateQueries({ queryKey: ['hero_settings'] });

      if (newFilesCount > 0) {
        toast.success(`Pengaturan Hero berhasil disimpan beserta ${newFilesCount} foto baru!`);
      } else {
        toast.success("Pengaturan Hero berhasil disimpan!");
      }
      
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
    }
  };

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Konfigurasi Hero Section</h2>
          <p className="text-slate-400 text-xs md:text-sm">Sesuaikan nama, subjudul, deskripsi utama, dan slider foto di landing page.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Nama Utama</label>
            <input
              type="text"
              value={heroData.title || ''}
              onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none hover:bg-slate-950/80"
            placeholder="Masukkan deskripsi diri singkat..."
            required
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Gambar Slider Hero</label>
            <div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="add-new-photo-input"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleAddNewPhoto(file);
                }}
              />
              <label
                htmlFor="add-new-photo-input"
                className="text-xs font-bold text-blue-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
              >
                <Plus size={14} /> Tambah Foto
              </label>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {heroData.images && heroData.images.map((img: string, idx: number) => (
              <div key={idx} className="flex gap-4 items-center bg-slate-950/30 p-4 border border-slate-800 rounded-2xl">
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 relative group">
                  <img 
                    src={img || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} 
                  />
                </div>

                <div className="flex-grow space-y-1 overflow-hidden">
                  <p className="text-xs text-slate-400 font-mono truncate">
                    {img && img.startsWith('blob:') ? 'File baru terpilih' : (img ? img.split('/').pop() : 'Belum ada gambar')}
                  </p>
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      id={`replace-photo-input-${idx}`}
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleReplacePhoto(file, idx);
                      }}
                    />
                    <label
                      htmlFor={`replace-photo-input-${idx}`}
                      className="text-[10px] font-bold text-slate-300 hover:text-blue-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 active:scale-95"
                    >
                      <Upload size={10} /> Ganti Foto
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => triggerDeleteModal(idx)}
                  className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex-shrink-0 disabled:opacity-50 active:scale-95 cursor-pointer"
                  title="Hapus"
                  disabled={isSaving || actionLoading === 'hero'}
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
            disabled={actionLoading === 'hero' || isSaving || !isDirty}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20 disabled:shadow-none cursor-pointer"
          >
            <Save size={18} />
            {pendingCount > 0 ? `Simpan Perubahan (${pendingCount} Foto Baru)` : 'Simpan Perubahan Hero'}
          </button>
        </div>
      </form>

      <ConfirmModal
        isOpen={modalConfig?.isOpen || false}
        onClose={() => setModalConfig(null)}
        title={modalConfig?.title || ''}
        message={modalConfig?.message || ''}
        confirmText={modalConfig?.confirmText || ''}
        confirmColor={modalConfig?.confirmColor || ''}
        onConfirm={async () => {
          if (modalConfig?.onConfirm) {
            await modalConfig.onConfirm();
          }
          setModalConfig(null);
        }}
        isSaving={isSaving}
        progress={progress}
      />
    </>
  );
}