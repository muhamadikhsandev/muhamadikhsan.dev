"use client";
import React, { useState, useEffect } from 'react';
// FIX: Kita pakai Image bawaan Next.js untuk optimasi gambar otomatis
import Image from 'next/image';
import { Rocket, FolderOpen, Mail } from "lucide-react";

// Deklarasi tipe data props agar aman dan terstruktur
interface HeroData {
  title: string;
  highlight_name: string;
  subtitle: string;
  description: string;
  images: string[];
}

interface HeroProps {
  data: HeroData | null;
}

const Hero = ({ data }: HeroProps) => {
  const [currentImg, setCurrentImg] = useState(0);

  // Gunakan data dari database, berikan fallback nilai default jika data belum masuk/error
  const heroContent = data || {
    title: "Muhamad",
    highlight_name: "Ikhsan",
    subtitle: "Full Stack Developer",
    description: "Membangun solusi digital yang efisien dan modern. Fokus pada performa tinggi dan pengalaman pengguna yang luar biasa.",
    images: [
      "https://wknxqscwvlphuwtvbvot.supabase.co/storage/v1/object/public/projects/me-depan.png",
      "https://wknxqscwvlphuwtvbvot.supabase.co/storage/v1/object/public/projects/me-belakang.png"
    ]
  };

  const imagesCount = heroContent.images.length;

  useEffect(() => {
    if (imagesCount <= 1) return; // Tidak perlu interval kalau gambar cuma 1
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % imagesCount);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagesCount]);

  return (
    <section className="relative min-h-screen pt-28 flex items-center justify-center px-4 overflow-hidden bg-slate-950">
      {/* Background Glow Effect */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Kolom Kiri: Teks & CTA */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium w-fit mx-auto lg:mx-0">
            <Rocket className="w-3.5 h-3.5" />
            <span>Welcome to My Portfolio Website</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-none">
            {heroContent.title}{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              {heroContent.highlight_name}
            </span>
          </h1>

          <h2 className="text-xl sm:text-2xl font-semibold text-slate-300">
            {heroContent.subtitle}
          </h2>

          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            {heroContent.description}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4">
            <a
              href="#projects"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Lihat Project</span>
            </a>
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium hover:bg-slate-800 hover:text-white transition-all active:scale-95"
            >
              <Mail className="w-4 h-4" />
              <span>Hubungi Saya</span>
            </a>
          </div>
        </div>

        {/* Kolom Kanan: Slider Foto Profil Instan */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
          <div className="relative w-[280px] h-[360px] sm:w-[320px] sm:h-[420px] rounded-2xl bg-slate-900 border border-slate-800/80 p-3 shadow-2xl backdrop-blur-sm group">
            
            {/* Area Foto Utama */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
              {heroContent.images.map((img, index) => (
                <Image
                  key={index}
                  src={img}
                  alt={`${heroContent.title} ${heroContent.highlight_name} ${index}`}
                  fill
                  priority={index === 0} // Foto pertama di-load instan duluan
                  sizes="(max-width: 768px) 260px, 380px"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    currentImg === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </div>

            {/* Dekorasi Bingkai Luar */}
            <div className="absolute -bottom-4 -left-4 w-16 h-16 border-b-2 border-l-2 border-blue-500/40 rounded-bl-3xl -z-10" />
            <div className="absolute -top-4 -right-4 w-16 h-16 border-t-2 border-r-2 border-blue-500/40 rounded-tr-3xl -z-10" />

            {/* Indikator Slider */}
            {imagesCount > 1 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                {heroContent.images.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-700 ${
                      currentImg === i ? "w-6 bg-blue-500" : "w-1.5 bg-slate-700"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </section>
  );
};

export default Hero;