"use client";
import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Instagram, Twitter, Globe } from 'lucide-react';

interface SocialLinkItem {
  id?: number;
  icon_name: string; // Mengambil string nama ikon dari database
  url: string;       // Tautan dinamis
}

interface FooterProps {
  data: SocialLinkItem[]; // Menerima data array dari database
}

const Footer = ({ data = [] }: FooterProps) => {
  // State untuk tahun agar tidak terjadi hydration mismatch
  const [year, setYear] = useState<number | string>("");

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Fungsi pembantu untuk me-render komponen Lucide Icon berdasarkan string dari database
  const renderIcon = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'github':
        return <Github size={20} />;
      case 'linkedin':
        return <Linkedin size={20} />;
      case 'instagram':
        return <Instagram size={20} />;
      case 'twitter':
        return <Twitter size={20} />;
      default:
        return <Globe size={20} />; // Fallback jika nama ikon tidak dikenal
    }
  };

  return (
    <footer className="py-16 bg-[#020617] border-t border-slate-900 relative">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold text-white mb-2 tracking-tighter">
            MUHAMAD <span className="text-blue-500">IKHSAN</span>
          </h2>
          <p className="text-slate-500 text-sm">
            © {year || "2026"} All rights reserved.
          </p>
        </div>

        {/* CONTAINER ICON: DI-RENDER 100% DINAMIS DARI DATABASE */}
        <div className="flex gap-4">
          {data.map((social, index) => (
            <a 
              key={social.id || index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-blue-400 hover:border-blue-500/50 transition-all hover:-translate-y-1 active:scale-95 flex items-center justify-center"
            >
              {renderIcon(social.icon_name)}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;