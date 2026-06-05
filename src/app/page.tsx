import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects'; // Pastikan nama file fisiknya nanti adalah Projects.tsx (P Besar)
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact'; 
import Footer from '@/components/Footer'; 
import BackToTop from '@/components/BackToTop';

// Import Client Supabase untuk Sisi Server
import { createClient } from '@/utils/supabase/server';

// FIX ISR: Diubah dari 0 menjadi 3600 detik (1 Jam) agar performa secepat kilat & ramah SEO
export const revalidate = 3600;

const Page = async () => {
  const supabase = await createClient();

  // Jalankan semua fetch secara paralel (Promise.all) agar proses pembuatan halaman statis jauh lebih cepat
  const [
    { data: heroData, error: heroError },
    { data: aboutData, error: aboutError },
    { data: skillsData, error: skillsError },
    { data: projectsData, error: projectsError },
    { data: certificatesData, error: certificatesError },
    { data: socialData, error: socialError } // Fetch data tautan media sosial dari database
  ] = await Promise.all([
    supabase.from('hero_settings').select('*').maybeSingle(),
    supabase.from('about_settings').select('*').maybeSingle(),
    
    // FIX ERROR SEBELUMNYA: Mengurutkan menggunakan kolom 'id' agar tidak memicu error column level
    supabase.from('skills').select('*').order('id', { ascending: true }), 
    
    supabase.from('projects').select('*').order('created_at', { ascending: false }), 
    supabase.from('certificates').select('*').order('issued_date', { ascending: false }),
    supabase.from('social_links').select('*').order('id', { ascending: true }) // Query mengambil list icon sosmed
  ]);

  // Log error di console server jika ada tabel yang belum dibuat atau bermasalah
  if (heroError) console.error("Error Hero:", heroError.message);
  if (aboutError) console.error("Error About:", aboutError.message);
  if (skillsError) console.error("Error Skills:", skillsError.message);
  if (projectsError) console.error("Error Projects:", projectsError.message);
  if (certificatesError) console.error("Error Certificates:", certificatesError.message);
  if (socialError) console.error("Error Social Links:", socialError.message);

  return (
    <main className="bg-[#020617] min-h-screen">
      <Navbar />
      
      {/* Semua data dilempar ke props masing-masing komponen */}
      <Hero data={heroData} />
      
      {/* MENGHITUNG TOTAL PROJECT SECARA DINAMIS DARI LENGTH ARRAY PROJECTS DATA */}
      <About data={aboutData} projectsCount={projectsData?.length || 0} />
      
      <Skills data={skillsData || []} />
      
      {/* MURNI DATA DINAMIS DARI DATABASE SUPABASE LO */}
      <Projects data={projectsData || []} />
      
      <Certificates data={certificatesData || []} />
      
      <Contact />
      
      {/* Melemparkan data array social_links ke komponen Footer */}
      <Footer data={socialData || []} />

      <BackToTop />
    </main>
  );
};

export default Page;