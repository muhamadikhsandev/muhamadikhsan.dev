"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProject(currentProject);
    setShowProjectModal(false);
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
            setCurrentProject({ title: '', description: '', tech_stack: '', icon_type: 'code', demo_url: '', github_url: '' });
            setShowProjectModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start"
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
                <span className="text-[10px] bg-slate-900 border border-slate-800 text-blue-400 px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                  Icon: {proj.icon_type || 'code'}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentProject({ 
                        ...proj, 
                        tech_stack: Array.isArray(proj.tech_stack) ? proj.tech_stack.join(', ') : proj.tech_stack 
                      });
                      setShowProjectModal(true);
                    }}
                    className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all"
                    title="Edit"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => deleteProject(proj.id)}
                    disabled={actionLoading === `delete_project_${proj.id}`}
                    className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-50"
                    title="Hapus"
                  >
                    {actionLoading === `delete_project_${proj.id}` ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>

              <h4 className="font-extrabold text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">{proj.title}</h4>
              <p className="text-slate-400 text-xs md:text-sm line-clamp-3 mb-4 leading-relaxed">{proj.description}</p>
              
              {/* Tech stack tags */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {proj.tech_stack && (Array.isArray(proj.tech_stack) ? proj.tech_stack : proj.tech_stack.split(',')).map((tag: string, idx: number) => (
                  <span key={idx} className="text-[9px] font-bold uppercase tracking-wider bg-slate-900 text-slate-400 border border-slate-800 px-2 py-0.5 rounded">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* URLs links indicators */}
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
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg"
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
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
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
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all resize-none"
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
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tipe Ikon Proyek</label>
                  <select
                    value={currentProject.icon_type || 'code'}
                    onChange={(e) => setCurrentProject({ ...currentProject, icon_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="code">Code</option>
                    <option value="chart">Chart</option>
                    <option value="shield">Shield</option>
                    <option value="globe">Globe</option>
                    <option value="smartphone">Smartphone</option>
                    <option value="layers">Layers</option>
                  </select>
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
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tautan Github URL (Opsional)</label>
                  <input
                    type="text"
                    value={currentProject.github_url || ''}
                    onChange={(e) => setCurrentProject({ ...currentProject, github_url: e.target.value })}
                    placeholder="https://github.com/username/repo"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'project_modal'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {actionLoading === 'project_modal' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Simpan Proyek
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
