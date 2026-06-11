"use client";
import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, ShieldCheck } from 'lucide-react';

interface CertificatesProps {
  data: any[]; // Dilonggarkan ke any[] agar super fleksibel menerima perubahan CRUD database
}

const Certificates = ({ data }: CertificatesProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // MANAGEMENT STATE JIKA DATA SERTIFIKAT HABIS / KOSONG DI DATABASE
  if (!data || data.length === 0) {
    return (
      <section id="certificates" className="py-8 md:py-12 px-6 bg-[#020617] text-center border-t border-slate-900">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-2 tracking-tight">Sertifikasi & Penghargaan</h3>
          <p className="text-slate-400 italic text-sm">Belum ada data sertifikat yang tersedia saat ini.</p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="py-12 md:py-20 px-6 bg-[#020617] border-t border-slate-900/40 relative overflow-hidden">
      {/* Background Ornamen Gradasi Halus Bawaan Asli */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header Section Style Asli */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Sertifikasi & <span className="text-blue-500 font-extrabold italic">Penghargaan</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Bukti kredibilitas akademis, pelatihan teknis, dan pengalaman profesional yang divalidasi secara berkala.
          </p>
        </div>

        {/* Responsive Grid System Layout Grid-3 Asli */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((c, index) => {
            
            // FIX FORMATTING: Mengubah string tanggal SQL menjadi format teks Bulan & Tahun lokal
            let formattedDate = "";
            try {
              if (c.issued_date) {
                const dateObj = new Date(c.issued_date);
                if (!isNaN(dateObj.getTime())) {
                  formattedDate = dateObj.toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long'
                  });
                }
              }
            } catch (e) {
              console.error("Error formatting date:", e);
              formattedDate = c.issued_date || "";
            }

            return (
              <div 
                key={c.id || index}
                className="bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 flex flex-col h-full group"
              >
                {/* RENDER BANNER GAMBAR SERTIFIKAT (FLEXIBEL FALLBACK) */}
                <div className="relative h-48 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                  {c.image_url && c.image_url !== "" && c.image_url !== "null" ? (
                    <img 
                      src={c.image_url} 
                      alt={c.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                  ) : (
                    // Tampilan default minimalis jika banner belum di-upload agar style card tidak pecah
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center gap-2 text-slate-700">
                      <Award size={28} className="text-slate-800 group-hover:text-blue-500/30 transition-colors" />
                      <span className="text-[10px] font-mono tracking-wider">No Certificate Image</span>
                    </div>
                  )}
                  
                  {/* Gradasi hitam transparan bawah banner */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                  
                  {/* Badge Verified */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md text-slate-300 text-[9px] uppercase tracking-widest font-bold rounded border border-slate-800/80">
                      Verified
                    </span>
                  </div>
                </div>

                {/* KONTEN DETAIL CARD - STYLE UTAMA ASLI */}
                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Nama Penerbit / Issuer */}
                    <p className="text-xs text-blue-500 font-mono font-bold tracking-wider mb-2 uppercase">
                      {c.issuer}
                    </p>
                    
                    {/* Judul Sertifikat */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors duration-300 line-clamp-2 leading-snug">
                      {c.title}
                    </h3>
                  </div>
                  
                  {/* BAGIAN BAWAH / FOOTER CARD ASLI */}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 min-h-[52px]">
                    {/* Informasi Tanggal (Hanya Bulan & Tahun) */}
                    <div className="flex items-center gap-1.5 text-slate-400 font-medium text-xs">
                      <Calendar size={14} className="text-blue-500" />
                      <span className="capitalize">{formattedDate}</span>
                    </div>

                    {/* Tombol Verifikasi Link */}
                    <div>
                      {c.verify_url && c.verify_url !== "" && c.verify_url !== "null" && c.verify_url !== "#" ? (
                        <a 
                          href={c.verify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-blue-600 px-3 py-1.5 rounded-full transition-all cursor-pointer active:scale-95"
                        >
                          Verifikasi <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600 italic">No link</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Info Footer Asli */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
            <ShieldCheck className="text-blue-500" size={20} />
            <p className="text-slate-400 text-sm">
              Semua sertifikat dapat diverifikasi keasliannya melalui tautan terkait secara dinamis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;