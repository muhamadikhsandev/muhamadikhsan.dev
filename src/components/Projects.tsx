"use client";
import React, { useState, useEffect } from 'react';
import { ExternalLink, Github, Code2, Layers, Globe, Smartphone, BarChart3, ShieldCheck } from 'lucide-react';

// Struktur tipe data Project disesuaikan 100% pas dengan skema tabel public.projects Supabase lo
interface ProjectItem {
  id?: number;
  title: string;
  description: string;   // Sesuai nama kolom SQL: description
  tech_stack: string[];  // Sesuai nama kolom SQL: tech_stack (Array Text)
  icon_type: string;     // Sesuai nama kolom SQL: icon_type
  demo_url?: string | null;   // Sesuai nama kolom SQL: demo_url (Opsional)
  github_url?: string | null; // Sesuai nama kolom SQL: github_url (Opsional)
}

interface ProjectsProps {
  data: ProjectItem[];
}

const Projects = ({ data }: ProjectsProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fungsi pembantu untuk me-render ikon lucide secara dinamis berdasarkan nilai kolom icon_type dari database
  const renderIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'chart':
        return <BarChart3 className="text-blue-500" size={28} />;
      case 'shield':
        return <ShieldCheck className="text-emerald-500" size={28} />;
      case 'globe':
        return <Globe className="text-purple-500" size={28} />;
      case 'smartphone':
        return <Smartphone className="text-orange-500" size={28} />;
      case 'layers':
        return <Layers className="text-pink-500" size={28} />;
      case 'code':
      default:
        return <Code2 className="text-cyan-500" size={28} />;
    }
  };

  if (!mounted) return null;

  // JIKA DATA DARI DATABASE BELUM MASUK / KOSONG
  if (!data || data.length === 0) {
    return (
      <section id="projects" className="py-24 px-6 bg-[#020617] text-center border-t border-slate-900/50">
        <h2 className="text-2xl font-bold text-white mb-2">Proyek Terpilih</h2>
        <p className="text-slate-500 italic text-sm">
          Tidak ada data proyek dinamis yang ditemukan di database.
        </p>
      </section>
    );
  }

  return (
    <section id="projects" className="relative py-24 px-6 bg-[#020617] overflow-hidden">
      {/* Dekorasi Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Proyek <span className="text-blue-500 font-extrabold italic">Terpilih</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Kumpulan karya terbaik yang dimuat langsung dari database public.projects secara real-time.
          </p>
        </div>

        {/* Grid Proyek */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.map((project, i) => (
            <div 
              key={project.id || i} 
              className="group relative bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 flex flex-col"
            >
              {/* Thumbnail Area dengan Efek Hover */}
              <div className="relative h-52 bg-slate-800/50 flex items-center justify-center overflow-hidden border-b border-slate-800">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="transform group-hover:scale-110 transition-transform duration-500">
                  {renderIcon(project.icon_type)}
                </div>
                
                {/* Floating Tech Tags (Membaca kolom tech_stack database) */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  {project.tech_stack && project.tech_stack.map((t, idx) => (
                    <span key={idx} className="px-3 py-1 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] uppercase tracking-widest font-bold rounded-full border border-slate-800">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-8 flex-grow flex flex-col">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>
                
                {/* Tombol Aksi Bersifat Opsional / Kondisional */}
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-800/50 min-h-[52px]">
                  {/* Cek jika demo_url tersedia di database */}
                  {project.demo_url && project.demo_url !== "" && project.demo_url !== "null" && project.demo_url !== "#" ? (
                    <a 
                      href={project.demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-white font-bold text-sm hover:text-blue-400 transition-all cursor-pointer"
                    >
                      Detail <ExternalLink size={16} />
                    </a>
                  ) : (
                    <span className="text-xs text-slate-600 italic">Live demo unavailable</span>
                  )}

                  {/* Cek jika github_url tersedia di database, jika null atau kosong maka icon otomatis tidak di-render */}
                  {project.github_url && project.github_url !== "" && project.github_url !== "null" && project.github_url !== "#" ? (
                    <a 
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white rounded-full transition-all cursor-pointer"
                    >
                      <Github size={18} />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Proyek */}
        <div className="mt-16 text-center">
          <a 
            href="#" 
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 border border-slate-800 text-white font-bold rounded-full hover:bg-blue-600 hover:border-blue-600 transition-all group"
          >
            Lihat Semua Proyek 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Projects;