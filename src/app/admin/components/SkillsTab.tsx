"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, X, Save, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import CustomDropdown from './CustomDropdown';
import ConfirmModal from './ConfirmModal';

interface SkillsTabProps {
  skills: any[];
  actionLoading: string | null;
  deleteSkill: (id: number) => Promise<void>;
  saveSkill: (skill: any) => Promise<void>;
}

const SKILL_CATEGORIES = [
  { value: 'Web Framework & Library', label: 'Web Framework & Library' },
  { value: 'Programming Language', label: 'Programming Language' },
  { value: 'Mobile Development', label: 'Mobile Development' },
  { value: 'Game Development', label: 'Game Development' },
  { value: 'Backend & Database', label: 'Backend & Database' }
];

export default function SkillsTab({
  skills,
  actionLoading,
  deleteSkill,
  saveSkill
}: SkillsTabProps) {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);

  // Loading & Progress states
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: currentSkill.id ? "Simpan Perubahan Keahlian" : "Tambah Keahlian Baru",
      message: currentSkill.id 
        ? "Apakah Anda yakin ingin memperbarui data keahlian ini?"
        : "Apakah Anda yakin ingin menambahkan keahlian baru ini?",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(30);
    try {
      let finalLogoUrl = currentSkill.logo.trim();

      // Jika user hanya mengetik nama icon/slug (misal: 'php' atau 'laravel'),
      // otomatis kita konversi formatnya ke URL Simple Icons dengan filter warna putih (/white)
      if (finalLogoUrl && !finalLogoUrl.startsWith('http://') && !finalLogoUrl.startsWith('https://')) {
        finalLogoUrl = `https://cdn.simpleicons.org/${finalLogoUrl.toLowerCase()}/white`;
      }

      setProgress(70);
      
      const payload = {
        ...currentSkill,
        logo: finalLogoUrl
      };

      await saveSkill(payload);
      
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      
      setShowSkillModal(false);
      
    } catch (err: any) {
      toast.error("Gagal menyimpan keahlian: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
      setModalConfig(null);
    }
  };

  const triggerDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Keahlian",
      message: "Apakah Anda yakin ingin menghapus keahlian ini? Tindakan ini permanen.",
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-755 shadow-lg shadow-red-900/30",
      onConfirm: async () => {
        setIsSaving(true);
        setProgress(50);
        try {
          await deleteSkill(id);
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
          <h2 className="text-2xl font-bold mb-1">Manajemen Keahlian</h2>
          <p className="text-slate-400 text-xs md:text-sm">Tambahkan, ubah, atau hapus item teknologi menggunakan Simple Icons CDN.</p>
        </div>
        <button
          onClick={() => {
            setCurrentSkill({ name: '', logo: '', category: 'Web Framework & Library', desc_text: '' });
            setShowSkillModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start cursor-pointer"
        >
          <Plus size={16} /> Tambah Keahlian
        </button>
      </div>

      {/* Skills Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.id}
            className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between gap-3 group hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 flex-shrink-0">
                <img 
                  src={skill.logo} 
                  alt={skill.name} 
                  className="w-7 h-7 object-contain" 
                  onError={(e) => { (e.target as any).src = 'https://cdn.simpleicons.org/code/white'; }} 
                />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">{skill.name}</h4>
                <p className="text-[10px] text-slate-500 tracking-wider uppercase font-semibold">{skill.desc_text || 'Tech Stack'}</p>
                <span className="inline-block text-[9px] bg-slate-900 border border-slate-800/50 text-blue-400 px-2 py-0.5 rounded-full mt-1">
                  {skill.category}
                </span>
              </div>
            </div>

            <div className="flex gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setCurrentSkill({ ...skill });
                  setShowSkillModal(true);
                }}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => triggerDelete(skill.id)}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                title="Hapus"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {skills.length === 0 && (
        <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 italic text-sm">Belum ada keahlian di database.</p>
        </div>
      )}

      {/* Modal Skill */}
      {showSkillModal && currentSkill && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 max-w-lg w-full rounded-[2rem] p-6 md:p-8 space-y-6 relative"
          >
            <button 
              onClick={() => setShowSkillModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentSkill.id ? 'Ubah Keahlian' : 'Tambah Keahlian Baru'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter keahlian.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Nama Teknologi</label>
                <input
                  type="text"
                  required
                  value={currentSkill.name || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                  placeholder="Contoh: React"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              {/* Input URL / Slug Baru Pengganti ImageUpload */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Slug Icon / URL Logo</label>
                  <a 
                    href="https://simpleicons.org" 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Globe size={10} /> Cari di Simple Icons
                  </a>
                </div>
                <input
                  type="text"
                  required
                  value={currentSkill.logo || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, logo: e.target.value })}
                  placeholder="Contoh: php atau typescript atau paste URL full"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
                <p className="text-[10px] text-slate-500 italic mt-0.5">
                  Cukup ketik slug nama aplikasinya saja kecil semua (misal: <code className="text-slate-400">nextdotjs</code>, <code className="text-slate-400">tailwindcss</code>, <code className="text-slate-400">php</code>). Sistem otomatis mengonversinya ke CDN putih.
                </p>
              </div>

              <CustomDropdown
                value={currentSkill.category || 'Web Framework & Library'}
                onChange={(val) => setCurrentSkill({ ...currentSkill, category: val })}
                options={SKILL_CATEGORIES}
                label="Kategori Keahlian"
              />

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Deskripsi Singkat Keahlian</label>
                <input
                  type="text"
                  required
                  value={currentSkill.desc_text || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, desc_text: e.target.value })}
                  placeholder="Contoh: Frontend Library"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'skill_modal' || isSaving}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-850 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Save size={16} />
                Simpan Keahlian
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