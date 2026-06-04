"use client";
import React, { useState, useEffect } from 'react';
import { Download, User, Briefcase, Code2 } from 'lucide-react';

interface AboutData {
  name: string;
  location: string;
  description_1: string;
  description_2: string;
  profile_image_url: string;
  cv_url: string;
  total_projects: number;
  years_experience: number;
}

interface AboutProps {
  data: AboutData | null;
  projectsCount?: number; // Prop dinamis total proyek dari page.tsx
}

const About = ({ data, projectsCount }: AboutProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Fallback data bawaan jika data database null
  const aboutContent = data || {
    name: "Muhamad Ikhsan",
    location: "Bogor, Indonesia",
    description_1: "Halo! Saya Muhamad Ikhsan, seorang Fullstack Developer yang berbasis di Bogor, Indonesia.",
    description_2: "Gairah saya terletak pada persimpangan antara estetika desain yang bersih dan performa kode yang optimal. Saya percaya bahwa teknologi harus memudahkan hidup manusia tanpa mengorbankan keindahan visual.",
    profile_image_url: "https://wknxqscwvlphuwtvbvot.supabase.co/storage/v1/object/public/projects/me-belakang.png",
    cv_url: "/cv-muhamad-ikhsan.pdf",
    total_projects: 0,
    years_experience: 3
  };

  // Dinamis total mengambil data length dari page.tsx
  const displayTotalProjects = projectsCount !== undefined ? projectsCount : (aboutContent.total_projects || 0);

  return (
    <section id="about" className="relative py-12 md:py-16 px-6 bg-[#020617] overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/5 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-cyan-600/5 blur-[80px] md:blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* SISI KIRI: FOTO DENGAN EFEK FRAME MODERN */}
          <div className="relative group active:scale-95 transition-all duration-500 max-w-md mx-auto lg:mx-0">
            {/* Dekorasi Bingkai Luar */}
            <div className="absolute -inset-4 border border-slate-800 rounded-[2.5rem] opacity-50 group-hover:border-blue-500/30 transition-colors duration-500"></div>
            
            {/* Efek Gradient di Belakang Foto */}
            <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-cyan-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-700"></div>
            
            <div className="relative bg-slate-900 aspect-[4/5] md:aspect-square rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
               <img 
                  src={aboutContent.profile_image_url} 
                  alt={`${aboutContent.name} Profile`} 
                  className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 transition-all duration-1000"
               />
               
               {/* Overlay Subtle Gradient */}
               <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Badge Pengalaman Mengambang */}
            <div className="hidden md:flex absolute -bottom-6 -right-6 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl items-center gap-3 animate-bounce-slow">
              <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500">
                <Code2 size={20} />
              </div>
              <div>
                <p className="text-white font-bold leading-none">Fullstack</p>
                <p className="text-slate-500 text-xs mt-1 tracking-wider uppercase">Developer</p>
              </div>
            </div>
          </div>

          {/* SISI KANAN: TEKS DESKRIPSI */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 flex items-center gap-4 tracking-tighter">
                <span className="w-12 h-1.5 bg-blue-600 rounded-full"></span>
                Tentang <span className="text-blue-500">Saya</span>
              </h2>
              
              <div className="space-y-4 text-slate-400 text-lg leading-relaxed">
                <p>{aboutContent.description_1}</p>
                <p>{aboutContent.description_2}</p>
              </div>
            </div>

            {/* Grid Statistik - Glassmorphism Style */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-800 transition-all duration-500 hover:border-blue-500/50 hover:bg-slate-900/60 active:scale-95">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                    <Briefcase size={18} />
                  </div>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Proyek</span>
                </div>
                <div className="text-white font-bold text-3xl flex items-baseline gap-1">
                  {displayTotalProjects}<span className="text-blue-500 text-xl">+</span>
                </div>
              </div>
              
              <div className="group bg-slate-900/40 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-800 transition-all duration-500 hover:border-blue-500/50 hover:bg-slate-900/60 active:scale-95">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">
                    <User size={18} />
                  </div>
                  <span className="text-slate-500 uppercase tracking-widest text-[10px] font-bold">Pengalaman</span>
                </div>
                <div className="text-white font-bold text-3xl flex items-baseline gap-1">
                  {aboutContent.years_experience}<span className="text-blue-500 text-xl">+</span><span className="text-xs text-slate-500 font-normal ml-1">Tahun</span>
                </div>
              </div>
            </div>

            {/* CTA BUTTONS - SEJAJAR KANAN KIRI & PRESISI */}
            <div className="grid grid-cols-1 sm:flex sm:items-center gap-4 pt-4 w-full">
              <a 
                href={aboutContent.cv_url} 
                download="CV_Muhamad_Ikhsan.pdf"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/30 hover:-translate-y-1"
              >
                <Download className="w-5 h-5 group-hover:animate-bounce transition-transform flex-shrink-0" />
                <span>Unduh CV</span>
              </a>
              
              <a 
                href="#contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl border border-slate-800 text-slate-300 font-bold hover:bg-white/5 hover:text-white hover:border-slate-700 transition-all active:scale-95 bg-slate-900/20 backdrop-blur-sm"
              >
                Hubungi Saya
              </a>
            </div>

          </div>
        </div>
      </div>

      {/* Tailwind Custom Animation Style */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default About;