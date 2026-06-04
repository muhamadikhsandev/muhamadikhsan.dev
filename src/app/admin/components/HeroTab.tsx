"use client";

import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, Image as ImageIcon, RefreshCw, Upload, AlertTriangle } from 'lucide-react';
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
  
  // Local state untuk file upload dan penghapusan tertunda
  const [pendingFiles, setPendingFiles] = useState<{ [index: number]: File }>({});
  const [deletedUrls, setDeletedUrls] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Modal Konfirmasi State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: string;
    onConfirm: () => void;
  } | null>(null);

  // Cek orientasi responsif untuk Bottom Sheet mobile vs Modal desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Menambahkan foto baru secara instan di UI via Blob URL
  const handleAddNewPhoto = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    const currentImages = heroData.images || [];
    const newImages = [...currentImages, previewUrl];
    const newIndex = newImages.length - 1;

    setPendingFiles((prev) => ({ ...prev, [newIndex]: file }));
    setHeroData({ ...heroData, images: newImages });
    toast.success("Foto ditambahkan ke daftar preview!");
  };

  // Mengganti foto terpilih di UI via Blob URL
  const handleReplacePhoto = (file: File, index: number) => {
    const previewUrl = URL.createObjectURL(file);
    const updatedImages = [...(heroData.images || [])];
    const oldUrl = updatedImages[index];

    // Jika gambar lama bukan blob, masukkan ke list hapus permanen
    if (oldUrl && !oldUrl.startsWith('blob:')) {
      setDeletedUrls((prev) => [...prev, oldUrl]);
    }

    updatedImages[index] = previewUrl;

    setPendingFiles((prev) => ({ ...prev, [index]: file }));
    setHeroData({ ...heroData, images: updatedImages });
    toast.success("Foto diganti di daftar preview!");
  };

  // Menghapus foto secara langsung (preview + storage)
  const handleDeleteConfirmed = async (index: number) => {
    const updatedImages = [...(heroData.images || [])];
    const targetUrl = updatedImages[index];

    // Hapus dari preview UI terlebih dahulu
    updatedImages.splice(index, 1);

    // Re-index pendingFiles (file uploads yang belum disave)
    const newPending: { [index: number]: File } = {};
    let newIdx = 0;
    for (let i = 0; i < heroData.images.length; i++) {
      if (i === index) continue;
      if (pendingFiles[i]) {
        newPending[newIdx] = pendingFiles[i];
      }
      newIdx++;
    }
    setPendingFiles(newPending);

    setHeroData({ ...heroData, images: updatedImages });

    // Jika URL bukan blob (artinya sudah ada di storage), hapus langsung dari Supabase
    if (targetUrl && !targetUrl.startsWith('blob:')) {
      try {
        const parts = targetUrl.split('/Hero/');
        if (parts.length > 1) {
          const filePath = parts[1];
          await supabase.storage.from('Hero').remove([filePath]);
        }
        toast.success("Foto berhasil dihapus dari storage dan preview.");
      } catch (err: any) {
        toast.error("Gagal menghapus foto dari storage: " + err.message);
      }
    } else {
      toast.success("Foto dihapus dari preview.");
    }
  };

  // Trigger modal konfirmasi hapus
  const triggerDeleteModal = (index: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Foto",
      message: `Apakah Anda yakin ingin menghapus foto ke-${index + 1}? Foto akan dihapus dari daftar dan akan dihapus permanen dari storage Supabase setelah Anda menyimpan perubahan.`,
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30",
      onConfirm: () => handleDeleteConfirmed(index)
    });
  };

  // Intersepsi formulir sebelum upload & save
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: "Simpan Perubahan",
      message: "Apakah Anda yakin ingin menyimpan perubahan konfigurasi Hero? Semua foto baru di preview akan diunggah dan foto yang telah dihapus akan dibersihkan dari database & storage Supabase.",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: handleSaveConfirmed
    });
  };

  // Proses upload file & simpan database sesungguhnya
  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    try {
      const uploadedUrls = [...(heroData.images || [])];

      // 1. Upload semua file baru yang masih bertipe blob
      for (const indexStr of Object.keys(pendingFiles)) {
        const index = parseInt(indexStr);
        const file = pendingFiles[index];
        const fileExt = file.name.split('.').pop();
        const fileName = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error } = await supabase.storage
          .from('Hero')
          .upload(fileName, file);

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('Hero')
          .getPublicUrl(fileName);

        uploadedUrls[index] = publicUrl;
      }

      // 2. Hapus file-file lama dari Supabase Storage
      for (const url of deletedUrls) {
        const parts = url.split('/Hero/');
        if (parts.length > 1) {
          const filePath = parts[1];
          await supabase.storage.from('Hero').remove([filePath]);
        }
      }

      // 3. Simpan seluruh konfigurasi ter-update ke database
      const finalHeroData = { ...heroData, images: uploadedUrls };
      const { id, created_at, ...payload } = finalHeroData;

      const { error } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (error) throw error;

      // 4. Update Parent State & Bersihkan Local Pending Cache
      setHeroData(finalHeroData);
      setPendingFiles({});
      setDeletedUrls([]);

      toast.success("Pengaturan Hero berhasil disimpan!");
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Varian Animasi Framer Motion untuk Modal & Bottom Sheet
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      y: isMobile ? '100%' : '-50%',
      x: isMobile ? '0%' : '-50%',
      scale: isMobile ? 1 : 0.95 
    },
    visible: { 
      opacity: 1, 
      y: isMobile ? '0%' : '-50%',
      x: isMobile ? '0%' : '-50%',
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 350 }
    },
    exit: { 
      opacity: 0, 
      y: isMobile ? '100%' : '-50%',
      x: isMobile ? '0%' : '-50%',
      scale: isMobile ? 1 : 0.95,
      transition: { duration: 0.2 }
    }
  } as const;

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-8">
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
            className="w-5 h-5 rounded-lg border-slate-800 text-blue-600 bg-slate-900 focus:ring-0 focus:ring-offset-0 cursor-pointer"
          />
          <label htmlFor="is_available" className="text-xs md:text-sm font-semibold text-slate-300 cursor-pointer select-none">
            Tampilkan Status Badge "Tersedia untuk proyek baru"
          </label>
        </div>

        {/* Hero Images Array List */}
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
                {/* Thumbnail Preview */}
                <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 relative group">
                  <img 
                    src={img || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'} 
                    alt={`Preview ${idx + 1}`} 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} 
                  />
                </div>

                {/* Info & Replace Action */}
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

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => triggerDeleteModal(idx)}
                  className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex-shrink-0"
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
            disabled={actionLoading === 'hero' || isSaving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            {actionLoading === 'hero' || isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
            Simpan Perubahan Hero
          </button>
        </div>
      </form>

      {/* Modal / Bottom Sheet Konfirmasi Modern */}
      <AnimatePresence>
        {modalConfig && modalConfig.isOpen && (
          <>
            {/* Backdrop dengan Blur */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={overlayVariants}
              onClick={() => setModalConfig(null)}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 cursor-pointer"
            />

            {/* Container Modal (Adaptive: Desktop di tengah, Mobile jadi Bottom Sheet) */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              className={`fixed z-50 bg-slate-900 border border-slate-800 shadow-2xl p-6 w-full max-h-[85vh] overflow-y-auto flex flex-col justify-between
                ${isMobile 
                  ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] pb-8 pt-6' 
                  : 'top-1/2 left-1/2 rounded-[2.5rem] max-w-md border-white/5'
                }`}
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
                  onClick={() => setModalConfig(null)}
                  className="flex-1 py-3.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    modalConfig.onConfirm();
                    setModalConfig(null);
                  }}
                  className={`flex-1 py-3.5 px-4 text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95 ${modalConfig.confirmColor}`}
                >
                  {modalConfig.confirmText}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
