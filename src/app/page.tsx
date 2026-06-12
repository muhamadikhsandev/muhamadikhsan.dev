import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects'; 
import Certificates from '@/components/Certificates';
import Contact from '@/components/Contact'; 
import Footer from '@/components/Footer'; 
import BackToTop from '@/components/BackToTop';

// FIX IMPORT: Kita panggil fungsi createClient bawaan client utility lo
import { createClient } from '@/utils/supabase/client'; 

// Mengaktifkan ISR agar halaman di-cache dan otomatis di-update di background setiap 1 Jam
export const revalidate = 3600;

const Page = async () => {
  // Jalankan fungsi createClient() dari file client.ts untuk membuat instance supabase statis
  const supabase = createClient();

  // Jalankan semua fetch secara paralel (Promise.all) agar proses build ISR secepat kilat
  const [
    { data: heroData, error: heroError },
    { data: aboutData, error: aboutError },
    { data: skillsData, error: skillsError },
    { data: projectsData, error: projectsError },
    { data: certificatesData, error: certificatesError },
    { data: socialData, error: socialError }
  ] = await Promise.all([
    supabase.from('hero_settings').select('*').maybeSingle(),
    supabase.from('about_settings').select('*').maybeSingle(),
    supabase.from('skills').select('*').order('id', { ascending: true }), 
    supabase.from('projects').select('*').order('created_at', { ascending: false }), 
    supabase.from('certificates').select('*').order('issued_date', { ascending: false }),
    supabase.from('social_links').select('*').order('id', { ascending: true })
  ]);

  // Log error di console server jika ada masalah pada tabel database
  if (heroError) console.error("Error Hero:", heroError.message);
  if (aboutError) console.error("Error About:", aboutError.message);
  if (skillsError) console.error("Error Skills:", skillsError.message);
  if (projectsError) console.error("Error Projects:", projectsError.message);
  if (certificatesError) console.error("Error Certificates:", certificatesError.message);
  if (socialError) console.error("Error Social Links:", socialError.message);

  return (
    <main className="bg-[#020617] min-h-screen">
      <Navbar />
      
      <Hero data={heroData} />
      
      {/* Menghitung total project secara dinamis dari database */}
      <About data={aboutData} projectsCount={projectsData?.length || 0} />
      
      <Skills data={skillsData || []} />
      
      <Projects data={projectsData || []} />
      
      <Certificates data={certificatesData || []} />
      
      <Contact />
      
      <Footer data={socialData || []} />

      <BackToTop />
    </main>
  );
};

export default Page;