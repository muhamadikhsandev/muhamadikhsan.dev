"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, Upload, AlertTriangle } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

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
  
  const [pendingFiles, setPendingFiles] = useState<{ [index: number]: File }>({});
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0); // State Progress Bar
  const [isMobile, setIsMobile] = useState(false);
  
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
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    setProgress(15); // Start Progress
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
        await new Promise(r => setTimeout(r, 300)); // Animasi smooth sebelum nutup
        toast.success("Foto berhasil dihapus!");
        return;
      }

      const validFinalUrls = updatedImages.filter(url => url && !url.startsWith('blob:'));
      const dbPayload = { ...heroData, images: validFinalUrls };
      const { id, created_at, ...payload } = dbPayload;

      setProgress(60); // DB Updating

      const { error: dbError } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (dbError) throw dbError;

      setProgress(85); // Storage Deleting

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
      await new Promise(r => setTimeout(r, 300)); // Efek penuh 100%
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
        setProgress(10 + Math.floor((currentUpload / newFilesCount) * 40)); // Progress 10% - 50%
      }

      setProgress(65); // Mulai simpan DB

      const validFinalUrls = uploadedUrls.filter(url => url && !url.startsWith('blob:'));
      const finalHeroData = { ...heroData, images: validFinalUrls };
      const { id, created_at, ...payload } = finalHeroData;

      const { error: dbError } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (dbError) throw dbError;

      setProgress(85); // Bersihkan sisa storage lama

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
      await new Promise(r => setTimeout(r, 400)); // Smooth exit feeling

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

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, y: isMobile ? '100%' : '-50%', x: isMobile ? '0%' : '-50%', scale: isMobile ? 1 : 0.95 },
    visible: { opacity: 1, y: isMobile ? '0%' : '-50%', x: isMobile ? '0%' : '-50%', scale: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } },
    exit: { opacity: 0, y: isMobile ? '100%' : '-50%', x: isMobile ? '0%' : '-50%', scale: isMobile ? 1 : 0.95, transition: { duration: 0.2 } }
  } as const;

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
                  className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex-shrink-0 disabled:opacity-50"
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
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20 disabled:shadow-none"
          >
            <Save size={18} />
            {pendingCount > 0 ? `Simpan Perubahan (${pendingCount} Foto Baru)` : 'Simpan Perubahan Hero'}
          </button>
        </div>
      </form>

      {/* MODAL KONFIRMASI DENGAN PROGRESS BAR */}
      <AnimatePresence>
        {modalConfig && modalConfig.isOpen && (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={() => !isSaving && setModalConfig(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 cursor-pointer"
            />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              className={`fixed z-50 bg-slate-900 border border-slate-800 shadow-2xl p-6 w-full max-h-[85vh] overflow-y-auto flex flex-col justify-between
                ${isMobile ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] pb-8 pt-6' : 'top-1/2 left-1/2 rounded-[2.5rem] max-w-md border-white/5'}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white tracking-tight">
                    {modalConfig.title}
                  </h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-1">
                  {modalConfig.message}
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={() => setModalConfig(null)}
                  className="flex-1 py-3.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95 disabled:opacity-50"
                >
                  Batal
                </button>
                
                {/* TOMBOL KONFIRMASI DENGAN BACKGROUND PROGRESS BAR */}
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    await modalConfig.onConfirm();
                    setModalConfig(null);
                  }}
                  className={`relative overflow-hidden flex-1 py-3.5 px-4 flex justify-center text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95 disabled:opacity-90 ${modalConfig.confirmColor}`}
                >
                  {/* Latar Progress Bar */}
                  {isSaving && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-black/30"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  )}
                  {/* Teks Status */}
                  <span className="relative z-10 flex items-center gap-2">
                    {isSaving ? `Memproses ${progress}%` : modalConfig.confirmText}
                  </span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}