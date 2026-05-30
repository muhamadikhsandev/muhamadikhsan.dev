"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface SocialsTabProps {
  socialLinks: any[];
  actionLoading: string | null;
  deleteSocialLink: (id: number) => Promise<void>;
  saveSocialLink: (link: any) => Promise<void>;
}

export default function SocialsTab({
  socialLinks,
  actionLoading,
  deleteSocialLink,
  saveSocialLink
}: SocialsTabProps) {
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [currentSocialLink, setCurrentSocialLink] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveSocialLink(currentSocialLink);
    setShowSocialModal(false);
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
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start"
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
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-xl transition-all"
                title="Edit"
              >
                <Edit3 size={14} />
              </button>
              <button
                onClick={() => deleteSocialLink(link.id)}
                disabled={actionLoading === `delete_social_${link.id}`}
                className="p-2 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-xl transition-all disabled:opacity-50"
                title="Hapus"
              >
                {actionLoading === `delete_social_${link.id}` ? <RefreshCw className="animate-spin" size={14} /> : <Trash2 size={14} />}
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
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentSocialLink.id ? 'Ubah Tautan Media Sosial' : 'Tambah Tautan Media Sosial'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter media sosial.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Nama Ikon Sosial Media</label>
                <select
                  value={currentSocialLink.icon_name || 'github'}
                  onChange={(e) => setCurrentSocialLink({ ...currentSocialLink, icon_name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                >
                  <option value="github">Github</option>
                  <option value="linkedin">Linkedin</option>
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="globe">Globe (Umum)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Alamat Tautan URL Lengkap</label>
                <input
                  type="url"
                  required
                  value={currentSocialLink.url || ''}
                  onChange={(e) => setCurrentSocialLink({ ...currentSocialLink, url: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'social_modal'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {actionLoading === 'social_modal' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Simpan Tautan Sosial
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
