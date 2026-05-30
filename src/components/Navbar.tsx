"use client";
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);

  const menuItems = [
    { name: 'Beranda', id: 'home' },
    { name: 'Tentang', id: 'about' },
    { name: 'Keahlian', id: 'skills' },
    { name: 'Proyek', id: 'projects' },
    { name: 'Sertifikat', id: 'certificates' },
    { name: 'Kontak', id: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Navbar transparan di atas, blur saat scroll
      setIsScrolled(window.scrollY > 20);

      const sections = menuItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150;

      sections.forEach((section) => {
        if (section && scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
          setActiveSection(section.id);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed w-full z-50 top-0 px-4 pt-6 transition-all duration-500">
      {/* Container Utama */}
      <div className={`max-w-6xl mx-auto transition-all duration-500 rounded-2xl px-6 py-4 ${
        isScrolled || isOpen 
          ? 'bg-slate-900/80 backdrop-blur-md border border-slate-700/50 shadow-2xl' 
          : 'bg-transparent border border-transparent'
      }`}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tighter">
            PORTFOLIO
          </div>
          
          {/* Desktop Menu - Capsule Style */}
          <div className="hidden md:flex space-x-1 items-center bg-slate-950/20 p-1 rounded-full border border-white/5">
            {menuItems.map((item) => (
              <a 
                key={item.id} 
                href={`#${item.id}`} 
                className={`relative px-5 py-2 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 rounded-full ${
                  activeSection === item.id ? 'text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="relative z-10">{item.name}</span>
                {activeSection === item.id && (
                  <div className="absolute inset-0 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-in fade-in zoom-in duration-300"></div>
                )}
              </a>
            ))}
          </div>

          {/* Toggle Menu Modern - 3 Garis Asimetris */}
          <button 
            className="md:hidden flex flex-col justify-center items-end w-10 h-10 gap-1.5 focus:outline-none z-50 group" 
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={`h-0.5 bg-blue-400 transition-all duration-300 rounded-full ${
              isOpen ? 'w-8 rotate-45 translate-y-2' : 'w-8'
            }`}></span>
            <span className={`h-0.5 bg-blue-400 transition-all duration-300 rounded-full ${
              isOpen ? 'opacity-0 w-0' : 'w-8'
            }`}></span>
            <span className={`h-0.5 bg-blue-400 transition-all duration-300 rounded-full ${
              isOpen ? 'w-8 -rotate-45 -translate-y-2' : 'w-4 group-hover:w-8'
            }`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - Diperbarui jaraknya agar tidak menempel */}
      <div className={`md:hidden absolute top-28 left-4 right-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl transition-all duration-500 ${
        isOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-10 invisible'
      }`}>
        <div className="flex flex-col space-y-4">
          {menuItems.map((item) => (
            <a 
              key={item.id} 
              href={`#${item.id}`} 
              onClick={() => setIsOpen(false)}
              className={`px-4 py-3 rounded-xl font-bold transition-all duration-300 ${
                activeSection === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                  : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;