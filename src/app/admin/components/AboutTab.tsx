"use client";

import React, { useState, useEffect } from 'react';
import { Save, Info } from 'lucide-react'; // Tambah icon Info disini
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import ImageUpload from './ImageUpload';
import ConfirmModal from './ConfirmModal';

interface AboutTabProps {
  aboutData: any;
  setAboutData: (val: any) => void;
  saveAboutSettings: (updatedData: any) => Promise<void>;
  actionLoading: string | null;
}

export default function AboutTab({
  aboutData,
  setAboutData,
  saveAboutSettings,
  actionLoading
}: AboutTabProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
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
    if (aboutData && Object.keys(aboutData).length > 0 && originalDataString === '') {
      setOriginalDataString(JSON.stringify(aboutData));
    }
  }, [aboutData, originalDataString]);

  const isDirty = 
    (originalDataString !== '' && JSON.stringify(aboutData) !== originalDataString) ||
    profileFile !== null ||
    cvFile !== null;

  const handleProfileImageChange = (file: File | null, previewUrl: string) => {
    setProfileFile(file);
    setAboutData({ ...aboutData, profile_image_url: previewUrl });
  };

  const handleProfileImageClear = () => {
    setProfileFile(null);
    setAboutData({ ...aboutData, profile_image_url: '' });
  };

  const handleCvChange = (file: File | null, previewUrl: string) => {
    setCvFile(file);
    setAboutData({ ...aboutData, cv_url: previewUrl });
  };

  const handleCvClear = () => {
    setCvFile(null);
    setAboutData({ ...aboutData, cv_url: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: "Simpan Konfigurasi About",
      message: "Apakah Anda yakin ingin menyimpan perubahan biodata diri ini? Foto profil dan file CV baru (jika ada) akan diunggah ke storage.",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(10);
    try {
      let finalProfileUrl = aboutData.profile_image_url;
      let finalCvUrl = aboutData.cv_url;

      // 1. Upload Profile Image
      if (profileFile) {
        setProgress(20);
        const fileExt = profileFile.name.split('.').pop();
        const fileName = `about_profile_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('Hero').upload(fileName, profileFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('Hero').getPublicUrl(fileName);
        finalProfileUrl = publicUrl;
        setProgress(50);
      }

      // 2. Upload CV Document
      if (cvFile) {
        setProgress(60);
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `about_cv_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('Hero').upload(fileName, cvFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('Hero').getPublicUrl(fileName);
        finalCvUrl = publicUrl;
        setProgress(80);
      }

      setProgress(90);

      // 3. Save to database using parent function
      const updatedPayload = {
        ...aboutData,
        profile_image_url: finalProfileUrl,
        cv_url: finalCvUrl
      };

      const { id, created_at, ...payload } = updatedPayload;
      const { error: dbError } = await supabase.from('about_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (dbError) throw dbError;

      setAboutData(updatedPayload);
      setOriginalDataString(JSON.stringify(updatedPayload));
      setProfileFile(null);
      setCvFile(null);

      setProgress(100);
      await new Promise(r => setTimeout(r, 400));

      queryClient.invalidateQueries({ queryKey: ['about_settings'] });
      toast.success("Biodata About berhasil disimpan!");

    } catch (err: any) {
      toast.error("Gagal menyimpan About: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none hover:bg-slate-950/80"
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
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none hover:bg-slate-950/80"
            placeholder="Masukkan paragraf kedua deskripsi diri..."
            required
          />
        </div>

        {/* --- GRID PENGALAMAN & INFO CARD (Fix Layout Kosong Kanan) --- */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Pengalaman (Tahun)</label>
            <input
              type="number"
              value={aboutData.years_experience || 0}
              onChange={(e) => setAboutData({ ...aboutData, years_experience: parseInt(e.target.value) || 0 })}
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
              placeholder="Contoh: 3"
              required
            />
          </div>

          {/* Info Card Pengganti Ruang Kosong (Biar UI lebih padat & premium) */}
          <div className="bg-blue-900/10 border border-blue-500/20 rounded-2xl p-4 flex gap-4 items-center">
            <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400 flex-shrink-0">
              <Info size={22} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-400 mb-0.5">Otomatisasi Sistem</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Statistik <span className="text-white font-medium">Total Proyek</span> kini dihitung otomatis secara *real-time* berdasarkan jumlah data aktif di menu <b>Projects</b>.
              </p>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------- */}

        <div className="grid md:grid-cols-2 gap-6">
          <ImageUpload
            value={aboutData.profile_image_url || ''}
            onChange={handleProfileImageChange}
            onClear={handleProfileImageClear}
            label="Foto Profil Utama"
            accept="image/*"
          />

          <ImageUpload
            value={aboutData.cv_url || ''}
            onChange={handleCvChange}
            onClear={handleCvClear}
            label="File Dokumen CV (Unduhan)"
            accept=".pdf,.doc,.docx"
            isDocument={true}
          />
        </div>

        <div className="pt-4 border-t border-slate-900">
          <button
            type="submit"
            disabled={actionLoading === 'about' || isSaving || !isDirty}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20 disabled:shadow-none cursor-pointer"
          >
            <Save size={18} />
            Simpan Perubahan About
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