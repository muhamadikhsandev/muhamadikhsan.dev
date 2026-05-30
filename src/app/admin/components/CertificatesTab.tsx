"use client";

import React, { useState } from 'react';
import { Plus, Edit3, Trash2, RefreshCw, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';

interface CertificatesTabProps {
  certificates: any[];
  actionLoading: string | null;
  deleteCertificate: (id: number) => Promise<void>;
  saveCertificate: (cert: any) => Promise<void>;
}

export default function CertificatesTab({
  certificates,
  actionLoading,
  deleteCertificate,
  saveCertificate
}: CertificatesTabProps) {
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const [currentCertificate, setCurrentCertificate] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveCertificate(currentCertificate);
    setShowCertificateModal(false);
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
            setShowCertificateModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-bold px-5 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 self-start"
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
                        setShowCertificateModal(true);
                      }}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-blue-600 hover:border-blue-600 text-slate-400 hover:text-white rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button
                      onClick={() => deleteCertificate(cert.id)}
                      disabled={actionLoading === `delete_cert_${cert.id}`}
                      className="p-1.5 bg-slate-900 border border-slate-800 hover:bg-red-600 hover:border-red-600 text-slate-400 hover:text-white rounded-lg transition-all disabled:opacity-50"
                      title="Hapus"
                    >
                      {actionLoading === `delete_cert_${cert.id}` ? <RefreshCw className="animate-spin" size={12} /> : <Trash2 size={12} />}
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
              className="absolute right-4 top-4 p-2 text-slate-500 hover:text-white rounded-lg"
            >
              <X size={20} />
            </button>

            <div>
              <h3 className="text-xl font-bold">{currentCertificate.id ? 'Ubah Sertifikat' : 'Tambah Sertifikat Baru'}</h3>
              <p className="text-slate-500 text-xs mt-1">Lengkapi parameter sertifikat dan bukti kompetensi.</p>
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
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
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
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tanggal Terbit</label>
                  <input
                    type="date"
                    required
                    value={currentCertificate.issued_date ? currentCertificate.issued_date.substring(0, 10) : ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, issued_date: e.target.value })}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">URL Gambar Sertifikat</label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    required
                    value={currentCertificate.image_url || ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, image_url: e.target.value })}
                    placeholder="https://domain.com/cert-image.jpg"
                    className="flex-grow bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                  {currentCertificate.image_url && (
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0">
                      <img src={currentCertificate.image_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tipe Ikon Sertifikat</label>
                  <select
                    value={currentCertificate.icon_type || 'award'}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, icon_type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="award">Award</option>
                    <option value="layout">Layout</option>
                    <option value="shield">Shield</option>
                    <option value="database">Database</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Tautan Kredensial URL (Opsional)</label>
                  <input
                    type="text"
                    value={currentCertificate.verify_url || ''}
                    onChange={(e) => setCurrentCertificate({ ...currentCertificate, verify_url: e.target.value })}
                    placeholder="https://verify.credential.com/id"
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 px-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={actionLoading === 'cert_modal'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                {actionLoading === 'cert_modal' ? <RefreshCw className="animate-spin" size={16} /> : <Save size={16} />}
                Simpan Sertifikat
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
