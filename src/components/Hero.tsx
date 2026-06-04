"use client";
import React, { useState, useEffect } from 'react';
import PriorityImage from './PriorityImage';

// Deklarasi tipe data props agar aman dan terstruktur
interface HeroData {
  is_available: boolean;
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
    is_available: true,
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
      setCurrentImg((prev) => (prev === imagesCount - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [imagesCount]);

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center bg-[#020617] overflow-hidden pt-32 md:pt-20"
    >
      {/* Efek Cahaya Latar Belakang */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[300px] h-[300px] md:w-[500px] md:h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Container utama */}
      <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center z-10">
        
        {/* Kolom Teks */}
        <div className="text-left order-2 md:order-1 pt-6 md:pt-0">
          {heroContent.is_available && (
            <div className="inline-block px-3 py-1 mb-6 text-xs font-semibold tracking-widest text-blue-400 uppercase bg-blue-400/10 rounded-full border border-blue-400/20">
              Tersedia untuk proyek baru
            </div>
          )}
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tighter leading-[1.1]">
            {heroContent.title} <span className="text-blue-500">{heroContent.highlight_name}</span>
          </h1>
          <h2 className="text-xl md:text-2xl font-medium text-slate-300 mb-6">
            {heroContent.subtitle}
          </h2>
          <p className="text-slate-400 max-w-md text-base md:text-lg mb-10 leading-relaxed">
            {heroContent.description}
          </p>
          
          <div className="flex flex-wrap gap-4">
            <a 
              href="#projects" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-1"
            >
              Lihat Proyek
            </a>
            <a 
              href="#contact" 
              className="bg-transparent border border-slate-700 hover:bg-slate-700 text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Kontak
            </a>
          </div>
        </div>

        {/* Kolom Foto dengan Transisi Smooth */}
        <div className="relative flex justify-center items-center order-1 md:order-2">
          <div className="relative w-[260px] h-[320px] md:w-[380px] md:h-[480px]">
            
            {/* Wrapper Gambar */}
            <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
              {heroContent.images.map((img, index) => (
                <PriorityImage
                  key={index}
                  src={img}
                  alt={`${heroContent.title} ${heroContent.highlight_name} ${index}`}
                  fill
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
                      currentImg === i ? "w-10 bg-blue-500" : "w-3 bg-slate-800"
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