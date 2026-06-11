"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import CustomDropdown from './CustomDropdown';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';

interface SocialsTabProps {
  socialLinks: any[];
  actionLoading: string | null;
  deleteSocialLink: (id: number) => Promise<void>;
  saveSocialLink: (link: any) => Promise<void>;
}

const SOCIAL_ICONS = [
  { value: 'github', label: 'Github' },
  { value: 'linkedin', label: 'Linkedin' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'globe', label: 'Globe (Umum)' }
];

export default function SocialsTab({
  socialLinks,
  actionLoading,
  deleteSocialLink,
  saveSocialLink
}: SocialsTabProps) {
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<any>(null);

  // Modal confirmation states
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
      title: currentSocialLink.id ? "Simpan Perubahan Tautan" : "Tambah Tautan Baru",
      message: currentSocialLink.id
        ? "Apakah Anda yakin ingin memperbarui tautan sosial media ini?"
        : "Apakah Anda yakin ingin menambahkan tautan sosial media baru?",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(30);
    try {
      await saveSocialLink(currentSocialLink);
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setShowSocialModal(false);
    } catch (err: any) {
      toast.error("Gagal menyimpan tautan: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
      setModalConfig(null);
    }
  };

  const triggerDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Tautan Sosial",
      message: "Apakah Anda yakin ingin menghapus tautan sosial media ini?",
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-755 shadow-lg shadow-red-900/30",
      onConfirm: async () => {
        setIsSaving(true);
        setProgress(50);
        try {
          await deleteSocialLink(id);
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
          <h2 className="text-2xl font-bold mb-1">Tautan Media Sosial</h2>
          <p className="text-slate-400 text-xs md:text-sm">Atur tautan ikon sosial media di bagian footer landing page.</p>
        </div>
        <button
          onClick={() => {
            setCurrentSocialLink({ icon_name: 'github', url: '' });
            setShowSocialModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start cursor-pointer"
        >
          <Plus size={16} /> Tambah Sosial
        </button>
      </div>

      {/* Social Links List */}
      <div className="grid md:grid-cols-2 gap-4">
        {socialLinks.map((link) => (
          <div 
            key={link.id}
            className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <span className="capitalize font-bold text-sm bg-slate-900 border border-slate-850 text-blue-400 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                {link.icon_name}
              </span>
              <span className="text-slate-400 text-xs truncate max-w-[200px] md:max-w-[300px]">
                {link.url}
              </span>
            </div>

            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => {
                  setCurrentSocialLink({ ...link });
                  setShowSocialModal(true);
                }}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => triggerDelete(link.id)}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {socialLinks.length === 0 && (
        <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 italic text-sm">Belum ada tautan media sosial.</p>
        </div>
      )}

      {/* Modal Social Links */}
      {showSocialModal && currentSocialLink && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-[2rem] p-6 md:p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setShowSocialModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentSocialLink.id ? 'Ubah Tautan Media Sosial' : 'Tambah Tautan Media Sosial'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter media sosial.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <CustomDropdown
                value={currentSocialLink.icon_name || 'github'}
                onChange={(val) => setCurrentSocialLink({ ...currentSocialLink, icon_name: val })}
                options={SOCIAL_ICONS}
                label="Nama Ikon Sosial Media"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Alamat Tautan URL Lengkap</label>
                <input
                  type="url"
                  required
                  value={currentSocialLink.url || ''}
                  onChange={(e) => setCurrentSocialLink({ ...currentSocialLink, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'social_modal' || isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-850 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Save size={16} />
                Simpan Tautan Sosial
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
