"use client";
import React, { useState, useEffect, useRef } from 'react';

// Struktur tipe data Skill dari Supabase
interface SkillItem {
  id?: number;
  name: string;
  logo: string;
  category: string;
  desc_text: string;
}

interface SkillsProps {
  data: SkillItem[];
}

const Skills = ({ data }: SkillsProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Semua Teknologi");
  
  // Ref container scroll area chips bar
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // State untuk mengontrol persentase isi progress bar (0% - 100%)
  const [scrollPercent, setScrollPercent] = useState(0);

  // State pendukung fitur Drag-to-Scroll menggunakan Mouse (Efek Tangan)
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    // Load category dari localStorage
    const savedCategory = localStorage.getItem('portfolio_skills_category');
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }
    
    // Restore scroll position
    setTimeout(() => {
      if (scrollContainerRef.current) {
        const savedScrollLeft = localStorage.getItem('portfolio_skills_scrollLeft');
        if (savedScrollLeft) {
          scrollContainerRef.current.scrollLeft = parseFloat(savedScrollLeft);
        }
        const savedScrollPercent = localStorage.getItem('portfolio_skills_scrollPercent');
        if (savedScrollPercent) {
          setScrollPercent(parseFloat(savedScrollPercent));
        }
      }
    }, 100);
  }, []);

  // 1. Fungsi Kalkulasi Pergerakan Isi Progress Bar saat di-scroll/diseret
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setScrollPercent(0);
      return;
    }

    // Ubah posisi koordinat pixel menjadi persentase 0 - 100%
    const percentage = (scrollLeft / maxScroll) * 100;
    setScrollPercent(percentage);

    // Simpan posisi scroll ke localStorage
    localStorage.setItem('portfolio_skills_scrollLeft', scrollLeft.toString());
    localStorage.setItem('portfolio_skills_scrollPercent', percentage.toString());
  };

  // 2. Logika Mouse Drag-to-Scroll (Fitur Geser Tangan ala Mobile)
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeftState(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeaveOrUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDown || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Angka 1.5 mengontrol sensitivitas kecepatan seret mouse lo
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

  // Reset otomatis ditiadakan agar tab filter & progress bar tidak ter-reset saat berpindah kategori

  // Fallback data lokal jika database kosong / gagal fetch
  const defaultSkills: SkillItem[] = [
    { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB", category: "Web Framework & Library", desc_text: "Frontend Library" },
    { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/white", category: "Web Framework & Library", desc_text: "React Framework" },
    { name: "Laravel", logo: "https://cdn.simpleicons.org/laravel/FF2D20", category: "Web Framework & Library", desc_text: "PHP Framework" },
    { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4", category: "Web Framework & Library", desc_text: "CSS Framework" },
    { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6", category: "Programming Language", desc_text: "Typed JavaScript" },
    { name: "Flutter", logo: "https://cdn.simpleicons.org/flutter/02569B", category: "Mobile Development", desc_text: "Cross-Platform Mobile" },
    { name: "Godot Engine", logo: "https://cdn.simpleicons.org/godotengine/478CBF", category: "Game Development", desc_text: "2D/3D Game Engine" },
    { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/339933", category: "Backend & Database", desc_text: "JavaScript Runtime" },
    { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql/4169E1", category: "Backend & Database", desc_text: "Relational Database" },
    { name: "MySQL", logo: "https://cdn.simpleicons.org/mysql/4479A1", category: "Backend & Database", desc_text: "Relational Database" }
  ];

  const skillsList = data && data.length > 0 ? data : defaultSkills;

  if (!mounted) return null;

  // Ekstrak daftar kategori unik secara otomatis
  const uniqueCategories = [
    "Semua Teknologi",
    ...Array.from(new Set(skillsList.map((skill) => skill.category)))
  ];

  // Filter data berdasarkan kategori aktif
  const filteredSkills = activeCategory === "Semua Teknologi"
    ? skillsList
    : skillsList.filter(skill => skill.category === activeCategory);

  return (
    <section id="skills" className="relative py-12 md:py-16 px-4 md:px-6 bg-[#020617] overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Keahlian & <span className="text-blue-500">Teknologi</span>
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-lg px-4">
            Tech stack yang saya gunakan untuk mengembangkan solusi digital di berbagai platform.
          </p>
        </div>

        {/* CHIPS FILTER BAR CONTAINER - DRAG TO SCROLL MOUSE EFFECT */}
        <div className="max-w-6xl mx-auto mb-12 relative">
          
          {/* Scroll Area Utama: Scrollbar asli di-hide total lewat class .kill-all-scrollbar-final.
              Ditambahkan state mouse grab untuk memunculkan efek kursor tangan bisa diseret */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeaveOrUp}
            onMouseUp={handleMouseLeaveOrUp}
            onMouseMove={handleMouseMove}
            className={`w-full overflow-x-auto pb-3 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] select-none ${
              isDown ? "cursor-grabbing" : "cursor-grab"
            }`}
          >
            <div className="flex items-center justify-start gap-2 px-1 w-max">
              {uniqueCategories.map((category, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setActiveCategory(category);
                    localStorage.setItem('portfolio_skills_category', category);
                  }}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 border snap-center active:scale-95 pointer-events-auto ${
                    activeCategory === category
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* PROGRESS BAR INDIKATOR MODERN DENGAN INDIKATOR ANGKA */}
          <div className="flex items-center justify-center gap-3 mt-4 select-none pointer-events-none">
            {/* Angka Kategori Aktif */}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-blue-500 tracking-wider transition-all duration-300">
                {String(uniqueCategories.indexOf(activeCategory) + 1).padStart(2, '0')}
              </span>
              <span className="text-[8px] font-mono text-slate-700">/</span>
            </div>

            {/* Jalur Progress Bar */}
            <div className="w-[120px] h-[3px] bg-slate-950 rounded-full overflow-hidden relative border border-slate-900">
              <div 
                style={{ 
                  width: `${Math.max(15, scrollPercent)}%`,
                }} 
                className={`h-full rounded-full transition-all duration-150 ease-out ${
                  scrollPercent > 1 
                    ? "bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.6)]" 
                    : "bg-slate-700"
                }`}
              />
            </div>

            {/* Total Kategori */}
            <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
              {String(uniqueCategories.length).padStart(2, '0')}
            </span>
          </div>

        </div>

        {/* GRID UTAMA: Menampilkan hasil filter */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 min-h-[300px] items-start transition-all duration-500">
          {filteredSkills.map((skill, index) => (
            <div 
              key={skill.id || index} 
              className="group relative p-5 md:p-8 bg-slate-900/40 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500 hover:border-blue-500/50 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/10 active:scale-95 animate-fade-in" 
            >
              {/* Container Logo */}
              <div className="w-10 h-10 md:w-16 md:h-16 mb-4 md:mb-6 flex items-center justify-center bg-slate-800/50 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <img 
                  src={skill.logo} 
                  alt={skill.name} 
                  className="w-6 h-6 md:w-10 md:h-10 object-contain filter grayscale opacity-40 md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 transition-all duration-500"
                />
              </div>

              {/* Nama Skill */}
              <h4 className="text-white font-bold text-sm md:text-lg mb-1 group-hover:text-blue-400 transition-colors">
                {skill.name}
              </h4>
              
              {/* Sub Deskripsi */}
              <p className="text-slate-500 text-[8px] md:text-[10px] tracking-widest uppercase font-semibold">
                {skill.desc_text}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Skills;