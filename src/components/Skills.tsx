"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Maksimal 12 item per halaman
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Drag-to-Scroll state
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  useEffect(() => {
    setMounted(true);
    
    const savedCategory = localStorage.getItem('portfolio_skills_category');
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }
    
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

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    const maxScroll = scrollWidth - clientWidth;

    if (maxScroll <= 0) {
      setScrollPercent(0);
      return;
    }

    const percentage = (scrollLeft / maxScroll) * 100;
    setScrollPercent(percentage);

    localStorage.setItem('portfolio_skills_scrollLeft', scrollLeft.toString());
    localStorage.setItem('portfolio_skills_scrollPercent', percentage.toString());
  };

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
    const walk = (x - startX) * 1.5; 
    scrollContainerRef.current.scrollLeft = scrollLeftState - walk;
  };

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

  const uniqueCategories = [
    "Semua Teknologi",
    ...Array.from(new Set(skillsList.map((skill) => skill.category)))
  ];

  const getCategoryCount = (category: string) => {
    if (category === "Semua Teknologi") return skillsList.length;
    return skillsList.filter(s => s.category === category).length;
  };

  const filteredSkills = activeCategory === "Semua Teknologi"
    ? skillsList
    : skillsList.filter(skill => skill.category === activeCategory);

  // Pagination Logic
  const totalPages = Math.ceil(filteredSkills.length / itemsPerPage);
  const paginatedSkills = filteredSkills.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="skills" className="relative py-8 md:py-12 px-4 md:px-6 bg-[#020617] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Keahlian & <span className="text-blue-500">Teknologi</span>
          </h2>
          <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full mb-6" />
          <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-lg px-4">
            Tech stack yang saya gunakan untuk mengembangkan solusi digital di berbagai platform.
          </p>
        </div>

        {/* CHIPS FILTER BAR CONTAINER */}
        <div className="max-w-6xl mx-auto mb-8 relative">
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
                    setCurrentPage(1); // Reset page on category change
                    localStorage.setItem('portfolio_skills_category', category);
                  }}
                  className={`group flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 border snap-center active:scale-95 pointer-events-auto cursor-pointer ${
                    activeCategory === category
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20"
                      : "bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                  }`}
                >
                  <span>{category}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold transition-all border ${
                    activeCategory === category
                      ? "bg-blue-700 text-blue-100 border-blue-500"
                      : "bg-slate-950/80 text-slate-500 border-slate-900 group-hover:text-slate-300 group-hover:border-slate-800"
                  }`}>
                    {getCategoryCount(category)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* PROGRESS BAR INDIKATOR */}
          <div className="flex items-center justify-center gap-3 mt-4 select-none pointer-events-none">
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold text-blue-500 tracking-wider transition-all duration-300">
                {String(uniqueCategories.indexOf(activeCategory) + 1).padStart(2, '0')}
              </span>
              <span className="text-[8px] font-mono text-slate-700">/</span>
            </div>

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

            <span className="text-[10px] font-mono font-bold text-slate-500 tracking-wider">
              {String(uniqueCategories.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* GRID UTAMA */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 min-h-[200px] items-start transition-all duration-500">
          {paginatedSkills.map((skill, index) => (
            <div 
              key={skill.id || index} 
              className="group relative p-5 md:p-8 bg-slate-900/40 border border-slate-800 rounded-[1.5rem] md:rounded-[2.5rem] transition-all duration-500 hover:border-blue-500/50 hover:-translate-y-1 md:hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-900/10 active:scale-95 animate-fade-in" 
            >
              <div className="w-10 h-10 md:w-16 md:h-16 mb-4 md:mb-6 flex items-center justify-center bg-slate-800/50 rounded-xl md:rounded-2xl group-hover:scale-110 transition-transform duration-500">
                <img 
                  src={skill.logo} 
                  alt={skill.name} 
                  className="w-6 h-6 md:w-10 md:h-10 object-contain filter grayscale opacity-40 md:opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-active:grayscale-0 group-active:opacity-100 transition-all duration-500"
                />
              </div>

              <h4 className="text-white font-bold text-sm md:text-lg mb-1 group-hover:text-blue-400 transition-colors">
                {skill.name}
              </h4>
              
              <p className="text-slate-500 text-[8px] md:text-[10px] tracking-widest uppercase font-semibold">
                {skill.desc_text}
              </p>
            </div>
          ))}
        </div>

        {/* Modern Pagination Component */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={16} />
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNum = idx + 1;
              const isActive = currentPage === pageNum;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-10 h-10 rounded-xl border font-mono font-bold text-sm transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all active:scale-95 cursor-pointer"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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