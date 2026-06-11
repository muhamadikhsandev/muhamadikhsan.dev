"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';
import { toast } from 'sonner';
import CustomDropdown from './CustomDropdown';
import ImageUpload from './ImageUpload';
import ConfirmModal from './ConfirmModal';

interface CertificatesTabProps {
  certificates: any[];
  actionLoading: string | null;
  deleteCertificate: (id: number) => Promise<void>;
  saveCertificate: (cert: any) => Promise<void>;
}

const CERT_ICONS = [
  { value: 'award', label: 'Award' },
  { value: 'layout', label: 'Layout' },
  { value: 'shield', label: 'Shield' },
  { value: 'database', label: 'Database' }
];

export default function CertificatesTab({
  certificates,
  actionLoading,
  deleteCertificate,
  saveCertificate
}: CertificatesTabProps) {
  const supabase = createClient();
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<any>(null);

  // Upload states
  const [certImageFile, setCertImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modal configuration state
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const handleImageChange = (file: File | null, previewUrl: string) => {
    setCertImageFile(file);
    setCurrentCertificate({ ...currentCertificate, image_url: previewUrl });
  };

  const handleImageClear = () => {
    setCertImageFile(null);
    setCurrentCertificate({ ...currentCertificate, image_url: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: currentCertificate.id ? "Simpan Perubahan Sertifikat" : "Tambah Sertifikat Baru",
      message: currentCertificate.id
        ? "Apakah Anda yakin ingin memperbarui data sertifikat ini? Gambar baru akan diunggah jika diubah."
        : "Apakah Anda yakin ingin menambahkan sertifikat baru ini?",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(20);
    try {
      let finalImageUrl = currentCertificate.image_url;

      // Upload image if it is a file
      if (certImageFile) {
        setProgress(50);
        const fileExt = certImageFile.name.split('.').pop();
        const fileName = `cert_img_${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from('Hero').upload(fileName, certImageFile);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('Hero').getPublicUrl(fileName);
        finalImageUrl = publicUrl;
        setProgress(80);
      }

      setProgress(95);

      const payload = {
        ...currentCertificate,
        image_url: finalImageUrl
      };

      await saveCertificate(payload);
      
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      
      setShowCertificateModal(false);
      setCertImageFile(null);

    } catch (err: any) {
      toast.error("Gagal menyimpan sertifikat: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
      setModalConfig(null);
    }
  };

  const triggerDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Sertifikat",
      message: "Apakah Anda yakin ingin menghapus sertifikat ini? Tindakan ini tidak dapat diurungkan.",
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-755 shadow-lg shadow-red-900/30",
      onConfirm: async () => {
        setIsSaving(true);
        setProgress(50);
        try {
          await deleteCertificate(id);
          setProgress(100);
          await new Promise(r => setTimeout(r, 200));
        } catch (err: any) {
          toast.error("Gagal menghapus: " + err.message);
        } finally {
          setIsSaving(false);
          setProgress(0);
          setModalConfig(null);
        }
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Manajemen Sertifikat</h2>
          <p className="text-slate-400 text-xs md:text-sm">Kelola sertifikasi dan bukti kualifikasi kompetensi profesional.</p>
        </div>
        <button
          onClick={() => {
            setCurrentCertificate({ title: '', issuer: '', issued_date: '', image_url: '', icon_type: 'award', verify_url: '' });
            setCertImageFile(null);
            setShowCertificateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start cursor-pointer"
        >
          <Plus size={16} /> Tambah Sertifikat
        </button>
      </div>

      {/* Certificates Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <div 
            key={cert.id}
            className="bg-slate-950/40 border border-slate-800 rounded-3xl p-5 flex gap-4 hover:border-slate-700 transition-colors"
          >
            <div className="w-20 h-20 bg-slate-900 border border-slate-850 rounded-xl overflow-hidden flex-shrink-0">
              <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} />
            </div>

            <div className="flex-grow flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] text-blue-400 font-mono tracking-wider font-semibold">{cert.issuer}</span>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => {
                        setCurrentCertificate({ ...cert });
                        setCertImageFile(null);
                        setShowCertificateModal(true);
                      }}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => triggerDelete(cert.id)}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-lg transition-all cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white leading-snug mt-1">{cert.title}</h4>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                <span>Tahun: {cert.issued_date ? new Date(cert.issued_date).getFullYear() : '2024'}</span>
                <span className="text-slate-600 italic truncate max-w-[120px]">
                  {cert.verify_url ? 'Link ✓' : 'No link'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 italic text-sm">Belum ada sertifikat di database.</p>
        </div>
      )}

      {/* Modal Certificate */}
      {showCertificateModal && currentCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 max-w-xl w-full rounded-[2rem] p-6 md:p-8 space-y-6 relative my-8"
          >
            <button 
              onClick={() => setShowCertificateModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentCertificate.id ? 'Ubah Sertifikat' : 'Tambah Sertifikat Baru'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter sertifikat.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Judul Sertifikasi</label>
                <input
                  type="text"
                  required
                  value={currentCertificate.title || ''}
                  onChange={(e) => setCurrentCertificate({ ...currentCertificate, title: e.target.value })}
                  placeholder="Contoh: Certified Web Developer"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Penerbit / Institusi</label>
                  <input
                    type="text"
                    required
                    value={currentCertificate.issuer || ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, issuer: e.target.value })}
                    placeholder="Contoh: Dicoding Indonesia"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tanggal Terbit</label>
                  <input
                    type="date"
                    required
                    value={currentCertificate.issued_date ? currentCertificate.issued_date.substring(0, 10) : ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, issued_date: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                  />
                </div>
              </div>

              <ImageUpload
                value={currentCertificate.image_url || ''}
                onChange={handleImageChange}
                onClear={handleImageClear}
                label="Gambar Bukti Sertifikat"
                accept="image/*"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomDropdown
                  value={currentCertificate.icon_type || 'award'}
                  onChange={(val) => setCurrentCertificate({ ...currentCertificate, icon_type: val })}
                  options={CERT_ICONS}
                  label="Tipe Ikon Sertifikat"
                />

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tautan Kredensial URL (Opsional)</label>
                  <input
                    type="text"
                    value={currentCertificate.verify_url || ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, verify_url: e.target.value })}
                    placeholder="https://verify.credential.com/id"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'cert_modal' || isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-850 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Save size={16} />
                Simpan Sertifikat
              </button>
            </form>
          </motion.div>
        </div>
      )}

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
        }}
        isSaving={isSaving}
        progress={progress}
      />
    </div>
  );
}
