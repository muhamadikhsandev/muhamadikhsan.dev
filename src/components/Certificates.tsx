"use client";
import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Calendar, ShieldCheck, Database, Layout } from 'lucide-react';

interface CertificatesProps {
  data: any[]; // Dilonggarkan ke any[] agar super fleksibel menerima perubahan CRUD database
}

const Certificates = ({ data }: CertificatesProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fungsi pembantu me-render komponen SVG icon secara dinamis berdasarkan isi string kolom icon_type
  const renderIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'layout':
        return <Layout className="text-blue-500" />;
      case 'shield':
        return <ShieldCheck className="text-orange-500" />;
      case 'database':
        return <Database className="text-emerald-500" />;
      case 'award':
      default:
        return <Award className="text-purple-500" />;
    }
  };

  if (!mounted) return null;

  // MANAGEMENT STATE JIKA DATA SERTIFIKAT HABIS / KOSONG DI DATABASE
  if (!data || data.length === 0) {
    return (
      <section id="certificates" className="py-8 md:py-12 px-6 bg-[#020617] text-center border-t border-slate-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tighter">
            Penghargaan & <span className="text-blue-500">Sertifikasi</span>
          </h2>
          <p className="text-slate-500 italic text-sm bg-slate-900/30 inline-block px-6 py-3 rounded-full border border-slate-800">
            Belum ada sertifikasi dinamis yang terinput di database.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="certificates" className="relative py-8 md:py-12 px-6 bg-[#020617] overflow-hidden">
      {/* Glow Effect Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Penghargaan & <span className="text-blue-500">Sertifikasi</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Bukti kompetensi dan dedikasi saya dalam terus belajar langsung dari manajemen database.
          </p>
        </div>

        {/* Grid Sertifikat Utama */}
        <div className="grid gap-6 md:grid-cols-2">
          {data.map((c: any, i: number) => {
            
            // Mengambil baris tahun secara aman dari format tipe DATE SQL (YYYY-MM-DD)
            let displayYear = "2024";
            if (c.issued_date) {
              const dateObj = new Date(c.issued_date);
              if (!isNaN(dateObj.getTime())) {
                displayYear = dateObj.getFullYear().toString();
              }
            }

            return (
              <div 
                key={c.id || i} 
                className="group flex flex-col sm:flex-row gap-6 p-4 bg-slate-900/40 border border-slate-800 rounded-3xl hover:border-blue-500/30 hover:bg-slate-900/80 transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-800">
                  <img 
                    src={c.image_url || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97"} 
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-hover:rotate-2"
                  />
                  <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Info Section */}
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-slate-800 rounded-lg flex items-center justify-center">
                        {renderIcon(c.icon_type)}
                      </div>
                      <span className="text-xs font-mono text-blue-400 font-medium tracking-wider">
                        {c.issuer}
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-white leading-tight mb-2 group-hover:text-blue-400 transition-colors">
                      {c.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 text-slate-500 text-xs">
                      <Calendar size={14} />
                      <span>{displayYear}</span>
                    </div>
                    
                    {/* Kondisional Tombol Verifikasi Link Opsional */}
                    {c.verify_url && c.verify_url !== "" && c.verify_url !== "null" && c.verify_url !== "#" ? (
                      <a 
                        href={c.verify_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-blue-600 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                      >
                        Verifikasi <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-[10px] text-slate-600 italic">No credential link</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Footer */}
        <div className="mt-10 text-center">
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