"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, Github, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

interface ProjectItem {
  id?: number;
  title: string;
  description: string;
  tech_stack: string[] | string | any; // Flexibel prevent data crash
  banner_url?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
}

interface ProjectsProps {
  data: ProjectItem[];
}

const Projects = ({ data }: ProjectsProps) => {
  const [mounted, setMounted] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Semua Proyek");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Maksimal 5 proyek per halaman

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  // Drag-to-Scroll state
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  // Normalizer Helper: Memastikan input tech_stack selalu siap di-render sebagai Array murni
  const safeGetTechStack = (project: ProjectItem): string[] => {
    if (!project || !project.tech_stack) return [];
    if (Array.isArray(project.tech_stack)) return project.tech_stack;
    if (typeof project.tech_stack === 'string') {
      return project.tech_stack.split(',').map(t => t.trim()).filter(t => t !== "");
    }
    return [];
  };

  useEffect(() => {
    setMounted(true);
    
    const savedCategory = localStorage.getItem('portfolio_projects_category');
    if (savedCategory) {
      setActiveCategory(savedCategory);
    }
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

  if (!mounted) return null;

  if (!data || data.length === 0) {
    return (
      <section id="projects" className="py-8 md:py-12 px-6 bg-[#020617] text-center border-t border-slate-900/50">
        <h2 className="text-2xl font-bold text-white mb-2">Proyek Terpilih</h2>
        <p className="text-slate-500 italic text-sm">
          Tidak ada data proyek dinamis yang ditemukan di database.
        </p>
      </section>
    );
  }

  // Extract unique tags dengan validasi normalisasi agar aman dari crash CRUD
  const allTechTags = Array.from(
    new Set(data.flatMap(project => safeGetTechStack(project)))
  ).filter(t => t.trim() !== "");

  const uniqueCategories = [
    "Semua Proyek",
    ...allTechTags
  ];

  const getCategoryCount = (category: string) => {
    if (category === "Semua Proyek") return data.length;
    return data.filter(proj => safeGetTechStack(proj).includes(category)).length;
  };

  const filteredProjects = activeCategory === "Semua Proyek"
    ? data
    : data.filter(proj => safeGetTechStack(proj).includes(activeCategory));

  // Pagination Logic
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <section id="projects" className="relative py-8 md:py-12 px-6 bg-[#020617] overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tighter">
            Proyek <span className="text-blue-500 font-extrabold italic">Terpilih</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl">
            Kumpulan karya terbaik yang dimuat langsung dari database public.projects secara real-time.
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
                    setCurrentPage(1); 
                    localStorage.setItem('portfolio_projects_category', category);
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

        {/* Grid Proyek */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 min-h-[480px] items-start transition-all duration-500">
          {paginatedProjects.map((project, i) => {
            const projectTags = safeGetTechStack(project);
            const hasBanner = project.banner_url && project.banner_url !== "" && project.banner_url !== "null";

            return (
              <div 
                key={project.id || i} 
                className="group relative bg-slate-900/50 border border-slate-800 rounded-[2rem] overflow-hidden hover:border-blue-500/50 hover:bg-slate-900/80 transition-all duration-500 flex flex-col h-full animate-fade-in"
              >
                {/* MENGGANTI ICON DENGAN TAMPILAN BANNER_URL REAL IMAGE */}
                <div className="relative h-52 bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                  {hasBanner ? (
                    <img 
                      src={project.banner_url!} 
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                      onError={(e) => {
                        // Safe fallback image jika URL rusak atau broken link
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    // Default UI Fallback Premium kalau user belum masukin banner_url
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center gap-2 text-slate-600">
                      <ImageIcon size={32} className="text-slate-700 group-hover:text-blue-500/50 transition-colors" />
                      <span className="text-xs font-mono">No Project Banner</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-90" />
                  
                  <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
                    {projectTags.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md text-slate-300 text-[9px] uppercase tracking-widest font-bold rounded border border-slate-800/80">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-8 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-4">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-800/50 min-h-[52px]">
                    {project.demo_url && project.demo_url !== "" && project.demo_url !== "null" && project.demo_url !== "#" ? (
                      <a 
                        href={project.demo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-white font-bold text-sm hover:text-blue-400 transition-all cursor-pointer"
                      >
                        Live Demo<ExternalLink size={16} />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-600 italic">Live demo unavailable</span>
                    )}

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
            );
          })}
        </div>

        {/* Pagination Component */}
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

export default Projects;