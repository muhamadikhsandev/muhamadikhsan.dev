"use client";

import React, { useState } from 'react';
import { Save } from 'lucide-react';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

interface ContactTabProps {
  contactData: any;
  setContactData: (val: any) => void;
  saveContactSettings: (updatedData: any) => Promise<void>;
  actionLoading: string | null;
}

export default function ContactTab({
  contactData,
  setContactData,
  saveContactSettings,
  actionLoading
}: ContactTabProps) {
  // Modal states
  const [isSaving, setIsSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText: string;
    confirmColor: string;
    onConfirm: () => Promise<void>;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: "Simpan Konfigurasi Kontak",
      message: "Apakah Anda yakin ingin menyimpan perubahan pengaturan kontak ini? Perubahan akan langsung disinkronkan ke database.",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(30);
    try {
      setProgress(70);
      await saveContactSettings(contactData);
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
    } catch (err: any) {
      toast.error("Gagal menyimpan kontak: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
      setModalConfig(null);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
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
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-3.5 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
              placeholder="Contoh: 628123456789"
              required
            />
            <p className="text-[10px] text-slate-500 italic mt-1">Masukkan format kode negara 62 di awal tanpa tanda '+' atau spasi.</p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-900">
          <button
            type="submit"
            disabled={actionLoading === 'contact' || isSaving}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold px-8 py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-900/20 disabled:shadow-none cursor-pointer"
          >
            <Save size={18} />
            Simpan Perubahan Kontak
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
        }}
        isSaving={isSaving}
        progress={progress}
      />
    </>
  );
}
