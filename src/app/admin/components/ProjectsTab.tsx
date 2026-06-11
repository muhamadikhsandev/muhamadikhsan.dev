"use client";

import React, { useState, useRef } from 'react';
import { Plus, Edit3, Trash2, X, Save, Image, Upload, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ConfirmModal from './ConfirmModal';
import { toast } from 'sonner';
// Impor supabase client bawaan project lo buat handle upload storage
import { createClient } from '@supabase/supabase-js'; 

// Inisialisasi Supabase Client (Sesuaikan dengan env atau helper project lo jika berbeda)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProjectsTabProps {
  projects: any[];
  actionLoading: string | null;
  deleteProject: (id: number) => Promise<void>;
  saveProject: (project: any) => Promise<void>;
}

export default function ProjectsTab({
  projects,
  actionLoading,
  deleteProject,
  saveProject
}: ProjectsTabProps) {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modal configuration state
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

  // Helper untuk mengubah input teks koma menjadi Array murni PostgreSQL text[]
  const sanitizeTechStack = (stackInput: string): string[] => {
    if (!stackInput || typeof stackInput !== 'string') return [];
    return stackInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);
  };

  // FUNGSI UNTUK HANDLE UPLOAD GAMBAR KE FOLDER portfolio-asset/project
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi file harus berupa gambar
    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar (PNG, JPG, WebP)!');
      return;
    }

    setUploading(true);
    try {
      // Buat nama file unik biar gak bentrok di storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      
      // FIX PATH: Masuk ke dalam folder project/
      const filePath = `project/${fileName}`;

      // UPLOAD: Menuju ke bucket 'portfolio-asset'
      const { error: uploadError } = await supabase.storage
        .from('portfolio-asset')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // GET URL: Ambil Public URL dari file yang sukses di-upload
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-asset')
        .getPublicUrl(filePath);

      // Masukkan hasil Public URL ke state project banner_url
      setCurrentProject({ ...currentProject, banner_url: publicUrl });
      toast.success('Gambar banner berhasil di-upload ke portfolio-asset/project!');
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast.error(`Gagal upload gambar: ${error.message || 'Pastikan query SQL bucket Anda sudah di-run.'}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setModalConfig({
      isOpen: true,
      title: currentProject.id ? "Simpan Perubahan Proyek" : "Tambah Proyek Baru",
      message: currentProject.id
        ? "Apakah Anda yakin ingin memperbarui data proyek ini?"
        : "Apakah Anda yakin ingin menambahkan proyek baru ini?",
      confirmText: "Ya, Simpan",
      confirmColor: "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-900/30",
      onConfirm: async () => await handleSaveConfirmed()
    });
  };

  const handleSaveConfirmed = async () => {
    setIsSaving(true);
    setProgress(30);
    try {
      // FIX CRUD TECH_STACK: Konversi string kembali menjadi array asli sebelum disave ke Supabase
      const payload = {
        ...currentProject,
        tech_stack: typeof currentProject.tech_stack === 'string' 
          ? sanitizeTechStack(currentProject.tech_stack) 
          : currentProject.tech_stack
      };

      await saveProject(payload);
      setProgress(100);
      await new Promise(r => setTimeout(r, 300));
      setShowProjectModal(false);
    } catch (err: any) {
      toast.error("Gagal menyimpan proyek: " + err.message);
    } finally {
      setIsSaving(false);
      setProgress(0);
      setModalConfig(null);
    }
  };

  const triggerDelete = (id: number) => {
    setModalConfig({
      isOpen: true,
      title: "Hapus Proyek",
      message: "Apakah Anda yakin ingin menghapus proyek ini? Tindakan ini tidak dapat dibatalkan.",
      confirmText: "Ya, Hapus",
      confirmColor: "bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/30",
      onConfirm: async () => {
        setIsSaving(true);
        setProgress(50);
        try {
          await deleteProject(id);
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
          <h2 className="text-2xl font-bold mb-1">Manajemen Proyek</h2>
          <p className="text-slate-400 text-xs md:text-sm">Kelola semua portofolio proyek dinamis yang diambil secara real-time.</p>
        </div>
        <button
          onClick={() => {
            setCurrentProject({ title: '', description: '', tech_stack: '', banner_url: '', demo_url: '', github_url: '' });
            setShowProjectModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start cursor-pointer"
        >
          <Plus size={16} /> Tambah Proyek
        </button>
      </div>

      {/* Projects Grid List */}
      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((proj) => (
          <div 
            key={proj.id}
            className="bg-slate-950/40 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all group"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2 max-w-[70%]">
                  <Image size={14} className="text-blue-400 flex-shrink-0" />
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-blue-400 px-3 py-1 rounded-full truncate font-mono" title={proj.banner_url}>
                    {proj.banner_url ? 'Banner Uploaded ✓' : 'No Banner'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentProject({ 
                        ...proj, 
                        tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : (proj.tech_stack || '')
                      });
                      setShowProjectModal(true);
                    }}
                    className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => triggerDelete(proj.id)}
                    className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    title="Hapus"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h4 className="font-extrabold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">{proj.title}</h4>
              <p className="text-slate-400 text-xs md:text-sm line-clamp-3 mb-4 leading-relaxed">{proj.description}</p>
              
              {/* Tech stack tags list */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(Array.isArray(proj.tech_stack) ? proj.tech_stack : (proj.tech_stack ? proj.tech_stack.split(',') : [])).map((tag: string, idx: number) => (
                  <span key={idx} className="text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900/60 flex items-center justify-between text-xs text-slate-500">
              <span className="truncate max-w-[150px]" title={proj.demo_url}>
                {proj.demo_url ? 'Demo ✓' : 'Demo -'}
              </span>
              <span className="truncate max-w-[150px]" title={proj.github_url}>
                {proj.github_url ? 'Github ✓' : 'Github -'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 bg-slate-950/20 border border-dashed border-slate-800 rounded-2xl">
          <p className="text-slate-500 italic text-sm">Belum ada proyek di database.</p>
        </div>
      )}

      {/* Modal Project */}
      {showProjectModal && currentProject && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 max-w-xl w-full rounded-[2rem] p-6 md:p-8 space-y-6 relative my-8"
          >
            <button 
              onClick={() => setShowProjectModal(false)}
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentProject.id ? 'Ubah Proyek' : 'Tambah Proyek Baru'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter proyek portofolio Anda.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Judul Proyek</label>
                <input
                  type="text"
                  required
                  value={currentProject.title || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                  placeholder="Contoh: E-Commerce Dashboard"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Deskripsi Lengkap</label>
                <textarea
                  rows={4}
                  required
                  value={currentProject.description || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                  placeholder="Ceritakan tentang proyek ini..."
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none hover:bg-slate-950/80"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tech Stack (Pisahkan dengan Koma)</label>
                <input
                  type="text"
                  required
                  value={currentProject.tech_stack || ''}
                  onChange={(e) => setCurrentProject({ ...currentProject, tech_stack: e.target.value })}
                  placeholder="Contoh: React, Supabase, Tailwind, TypeScript"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                />
              </div>

              {/* COMPONENT INPUT FILE UPLOAD UNTUK portfolio-asset/project */}
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">Project Banner Image</label>
                
                {/* Hidden Native Input */}
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950/40 border border-slate-800 rounded-xl p-4">
                  {/* Preview Box */}
                  <div className="w-full sm:w-32 h-20 bg-slate-900 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center flex-shrink-0 relative">
                    {currentProject.banner_url ? (
                      <img 
                        src={currentProject.banner_url} 
                        alt="Preview banner" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="text-slate-600" size={24} />
                    )}
                  </div>

                  {/* Upload Action Button */}
                  <div className="flex-grow w-full text-center sm:text-left space-y-1">
                    <button
                      type="button"
                      disabled={uploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    >
                      {uploading ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-blue-500" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload size={14} className="text-blue-500" />
                          Pilih & Upload Gambar
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-500">Mendukung format PNG, JPG, JPEG, atau WebP.</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tautan Demo URL (Opsional)</label>
                  <input
                    type="text"
                    value={currentProject.demo_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, demo_url: e.target.value })}
                    placeholder="https://live-demo.com"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tautan Github URL (Opsional)</label>
                  <input
                    type="text"
                    value={currentProject.github_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all hover:bg-slate-950/80"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'project_modal' || isSaving || uploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer mt-2"
              >
                <Save size={16} />
                Simpan Proyek
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