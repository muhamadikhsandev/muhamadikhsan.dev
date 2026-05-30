"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface SkillsTabProps {
  skills: any[];
  actionLoading: string | null;
  deleteSkill: (id: number) => Promise<void>;
  saveSkill: (skill: any) => Promise<void>;
}

export default function SkillsTab({
  skills,
  actionLoading,
  deleteSkill,
  saveSkill
}: SkillsTabProps) {
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [currentSkill, setCurrentSkill] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSkill(currentSkill);
    setShowSkillModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1">Manajemen Keahlian</h2>
          <p className="text-slate-400 text-xs md:text-sm">Tambahkan, ubah, atau hapus item teknologi dan logo di bagian keahlian.</p>
        </div>
        <button
          onClick={() => {
            setCurrentSkill({ name: '', logo: '', category: 'Web Framework & Library', desc_text: '' });
            setShowSkillModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start"
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
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800">
                <img src={skill.logo} alt={skill.name} className="w-7 h-7 object-contain" onError={(e) => { (e.target as any).src = 'https://cdn.simpleicons.org/code/white'; }} />
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
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => deleteSkill(skill.id)}
                disabled={actionLoading === `delete_skill_${skill.id}`}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-50"
                title="Hapus"
              >
                {actionLoading === `delete_skill_${skill.id}` ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
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
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg"
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
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Logo SVG URL (SimpleIcons atau HTTP Link)</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={currentSkill.logo || ''}
                    onChange={(e) => setCurrentSkill({ ...currentSkill, logo: e.target.value })}
                    placeholder="Contoh: https://cdn.simpleicons.org/react/61DAFB"
                    className="flex-grow bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                  {currentSkill.logo && (
                    <div className="w-11 h-11 bg-slate-950 rounded-xl flex items-center justify-center border border-slate-800 flex-shrink-0">
                      <img src={currentSkill.logo} alt="Preview" className="w-6 h-6 object-contain" onError={(e) => { (e.target as any).src = 'https://cdn.simpleicons.org/code/white'; }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Kategori Keahlian</label>
                <select
                  value={currentSkill.category || 'Web Framework & Library'}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                >
                  <option value="Web Framework & Library">Web Framework & Library</option>
                  <option value="Programming Language">Programming Language</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Game Development">Game Development</option>
                  <option value="Backend & Database">Backend & Database</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Deskripsi Singkat Keahlian</label>
                <input
                  type="text"
                  required
                  value={currentSkill.desc_text || ''}
                  onChange={(e) => setCurrentSkill({ ...currentSkill, desc_text: e.target.value })}
                  placeholder="Contoh: Frontend Library"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'skill_modal'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {actionLoading === 'skill_modal' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Simpan Keahlian
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
