"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  LogOut, 
  Home, 
  User, 
  Code2, 
  Briefcase, 
  Award, 
  Share2, 
  Phone, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Import Admin Subcomponents
import Login from './components/Login';
import HeroTab from './components/HeroTab';
import AboutTab from './components/AboutTab';
import SkillsTab from './components/SkillsTab';
import ProjectsTab from './components/ProjectsTab';
import CertificatesTab from './components/CertificatesTab';
import SocialsTab from './components/SocialsTab';
import ContactTab from './components/ContactTab';

export default function AdminPage() {
  const supabase = createClient();
  
  // Auth states
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard states
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'skills' | 'projects' | 'certificates' | 'socials' | 'contact'>('hero');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Dynamic Data states
  const [heroData, setHeroData] = useState<any>({
    is_available: true,
    title: "",
    highlight_name: "",
    subtitle: "",
    description: "",
    images: []
  });
  
  const [aboutData, setAboutData] = useState<any>({
    name: "",
    location: "",
    description_1: "",
    description_2: "",
    profile_image_url: "",
    cv_url: "",
    total_projects: 0,
    years_experience: 0
  });

  const [contactData, setContactData] = useState<any>({
    email: "",
    location: "",
    whatsapp_number: ""
  });

  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [socialLinks, setSocialLinks] = useState<any[]>([]);

  // Handle Notifications
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Auth Session check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthLoading(false);

      if (session) {
        fetchAllData();
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchAllData();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch all portfolio database tables
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [
        heroRes,
        aboutRes,
        contactRes,
        skillsRes,
        projectsRes,
        certsRes,
        socialsRes
      ] = await Promise.all([
        supabase.from('hero_settings').select('*').maybeSingle(),
        supabase.from('about_settings').select('*').maybeSingle(),
        supabase.from('contact_settings').select('*').eq('is_singleton', true).maybeSingle(),
        supabase.from('skills').select('*').order('id', { ascending: true }),
        supabase.from('projects').select('*').order('created_at', { ascending: false }),
        supabase.from('certificates').select('*').order('issued_date', { ascending: false }),
        supabase.from('social_links').select('*').order('id', { ascending: true })
      ]);

      if (heroRes.data) setHeroData(heroRes.data);
      if (aboutRes.data) setAboutData(aboutRes.data);
      if (contactRes.data) setContactData(contactRes.data);
      if (skillsRes.data) setSkills(skillsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
      if (certsRes.data) setCertificates(certsRes.data);
      if (socialsRes.data) setSocialLinks(socialsRes.data);
      
    } catch (err: any) {
      showNotification('error', 'Gagal memuat data dari database: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        showNotification('error', 'Login gagal: ' + error.message);
      } else {
        showNotification('success', 'Berhasil masuk ke panel admin.');
      }
    } catch (err: any) {
      setAuthError(err.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    showNotification('success', 'Berhasil keluar.');
  };

  // Save Hero settings (Singleton)
  const saveHeroSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('hero');
    try {
      const { id, created_at, ...payload } = heroData;
      const { error } = await supabase.from('hero_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (error) throw error;
      showNotification('success', 'Pengaturan Hero berhasil disimpan!');
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan pengaturan Hero: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Save About settings (Singleton)
  const saveAboutSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('about');
    try {
      const { id, created_at, ...payload } = aboutData;
      const { error } = await supabase.from('about_settings').upsert({
        id: id || 1,
        ...payload
      });

      if (error) throw error;
      showNotification('success', 'Pengaturan About berhasil disimpan!');
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan pengaturan About: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Save Contact settings (Singleton)
  const saveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading('contact');
    try {
      const { error } = await supabase.from('contact_settings').upsert({
        is_singleton: true,
        email: contactData.email,
        location: contactData.location,
        whatsapp_number: contactData.whatsapp_number
      });

      if (error) throw error;
      showNotification('success', 'Pengaturan Kontak berhasil disimpan!');
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan pengaturan Kontak: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Skills CRUD
  const saveSkill = async (skill: any) => {
    setActionLoading('skill_modal');
    try {
      if (skill.id) {
        const { error } = await supabase.from('skills').update({
          name: skill.name,
          logo: skill.logo,
          category: skill.category,
          desc_text: skill.desc_text
        }).eq('id', skill.id);
        if (error) throw error;
        showNotification('success', 'Keahlian berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('skills').insert([skill]);
        if (error) throw error;
        showNotification('success', 'Keahlian baru berhasil ditambahkan!');
      }
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan keahlian: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus keahlian ini?')) return;
    setActionLoading(`delete_skill_${id}`);
    try {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
      showNotification('success', 'Keahlian berhasil dihapus.');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menghapus keahlian: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Projects CRUD
  const saveProject = async (project: any) => {
    setActionLoading('project_modal');
    try {
      let techArray = Array.isArray(project.tech_stack) 
        ? project.tech_stack 
        : project.tech_stack.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "");

      const projectPayload = {
        title: project.title,
        description: project.description,
        tech_stack: techArray,
        icon_type: project.icon_type || 'code',
        demo_url: project.demo_url || null,
        github_url: project.github_url || null
      };

      if (project.id) {
        const { error } = await supabase.from('projects').update(projectPayload).eq('id', project.id);
        if (error) throw error;
        showNotification('success', 'Proyek berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('projects').insert([projectPayload]);
        if (error) throw error;
        showNotification('success', 'Proyek baru berhasil ditambahkan!');
      }
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan proyek: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini?')) return;
    setActionLoading(`delete_project_${id}`);
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      showNotification('success', 'Proyek berhasil dihapus.');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menghapus proyek: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Certificates CRUD
  const saveCertificate = async (cert: any) => {
    setActionLoading('cert_modal');
    try {
      const certPayload = {
        title: cert.title,
        issuer: cert.issuer,
        issued_date: cert.issued_date || new Date().toISOString().split('T')[0],
        image_url: cert.image_url,
        icon_type: cert.icon_type || 'award',
        verify_url: cert.verify_url || null
      };

      if (cert.id) {
        const { error } = await supabase.from('certificates').update(certPayload).eq('id', cert.id);
        if (error) throw error;
        showNotification('success', 'Sertifikat berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('certificates').insert([certPayload]);
        if (error) throw error;
        showNotification('success', 'Sertifikat baru berhasil ditambahkan!');
      }
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan sertifikat: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteCertificate = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus sertifikat ini?')) return;
    setActionLoading(`delete_cert_${id}`);
    try {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
      showNotification('success', 'Sertifikat berhasil dihapus.');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menghapus sertifikat: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  // Social Links CRUD
  const saveSocialLink = async (link: any) => {
    setActionLoading('social_modal');
    try {
      if (link.id) {
        const { error } = await supabase.from('social_links').update({
          icon_name: link.icon_name,
          url: link.url
        }).eq('id', link.id);
        if (error) throw error;
        showNotification('success', 'Tautan sosial berhasil diperbarui!');
      } else {
        const { error } = await supabase.from('social_links').insert([link]);
        if (error) throw error;
        showNotification('success', 'Tautan sosial baru berhasil ditambahkan!');
      }
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menyimpan tautan sosial: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteSocialLink = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus tautan sosial ini?')) return;
    setActionLoading(`delete_social_${id}`);
    try {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
      showNotification('success', 'Tautan sosial berhasil dihapus.');
      fetchAllData();
    } catch (err: any) {
      showNotification('error', 'Gagal menghapus tautan sosial: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center">
        <RefreshCw className="animate-spin text-blue-500 mb-4" size={40} />
        <p className="text-slate-400 font-mono tracking-widest text-xs uppercase animate-pulse">Menghubungkan Supabase...</p>
      </div>
    );
  }

  // Not Logged In -> Render Login Component
  if (!session) {
    return (
      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        authLoading={authLoading}
        authError={authError}
      />
    );
  }

  // Sidebar items
  const sidebarItems = [
    { id: 'hero', label: 'Hero', icon: <Home size={18} /> },
    { id: 'about', label: 'About', icon: <User size={18} /> },
    { id: 'skills', label: 'Skills', icon: <Code2 size={18} /> },
    { id: 'projects', label: 'Projects', icon: <Briefcase size={18} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={18} /> },
    { id: 'socials', label: 'Social Links', icon: <Share2 size={18} /> },
    { id: 'contact', label: 'Contact Settings', icon: <Phone size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tighter">
              MUHAMAD <span className="text-blue-500 italic">IKHSAN</span>
            </h1>
            <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl"
            >
              Lihat Website <ExternalLink size={14} />
            </a>

            <div className="h-6 w-px bg-slate-900 hidden sm:block" />

            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-400 font-medium">{session.user.email}</p>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2.5 md:px-4 md:py-2.5 bg-red-600/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold active:scale-95"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-4 gap-8 items-start relative">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, x: '-50%' }}
              animate={{ opacity: 1, y: 0, x: '-50%' }}
              exit={{ opacity: 0, y: -20, x: '-50%' }}
              className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-5 py-4 rounded-2xl shadow-xl border flex items-center gap-3 text-sm font-semibold max-w-md ${
                notification.type === 'success' 
                  ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/20' 
                  : 'bg-red-950/90 text-red-400 border-red-500/20'
              }`}
            >
              {notification.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sidebar Panel */}
        <div className="lg:col-span-1 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-3xl p-4 w-full flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1 scrollbar-none sticky top-24 z-20">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border flex-shrink-0 active:scale-95 ${
                  isActive 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-slate-900/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form / Content Workspace Panel */}
        <div className="lg:col-span-3 w-full">
          {loading ? (
            <div className="bg-slate-900/20 border border-slate-800/50 rounded-[2.5rem] p-20 flex flex-col justify-center items-center">
              <RefreshCw className="animate-spin text-blue-500 mb-4" size={32} />
              <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Memuat Data...</p>
            </div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-sm relative overflow-hidden"
            >
              
              {/* TAB 1: HERO SETTINGS */}
              {activeTab === 'hero' && (
                <HeroTab
                  heroData={heroData}
                  setHeroData={setHeroData}
                  saveHeroSettings={saveHeroSettings}
                  actionLoading={actionLoading}
                />
              )}

              {/* TAB 2: ABOUT SETTINGS */}
              {activeTab === 'about' && (
                <AboutTab
                  aboutData={aboutData}
                  setAboutData={setAboutData}
                  saveAboutSettings={saveAboutSettings}
                  actionLoading={actionLoading}
                />
              )}

              {/* TAB 3: SKILLS MANAGEMENT (CRUD) */}
              {activeTab === 'skills' && (
                <SkillsTab
                  skills={skills}
                  actionLoading={actionLoading}
                  deleteSkill={deleteSkill}
                  saveSkill={saveSkill}
                />
              )}

              {/* TAB 4: PROJECTS MANAGEMENT (CRUD) */}
              {activeTab === 'projects' && (
                <ProjectsTab
                  projects={projects}
                  actionLoading={actionLoading}
                  deleteProject={deleteProject}
                  saveProject={saveProject}
                />
              )}

              {/* TAB 5: CERTIFICATES MANAGEMENT (CRUD) */}
              {activeTab === 'certificates' && (
                <CertificatesTab
                  certificates={certificates}
                  actionLoading={actionLoading}
                  deleteCertificate={deleteCertificate}
                  saveCertificate={saveCertificate}
                />
              )}

              {/* TAB 6: SOCIAL LINKS MANAGEMENT (CRUD) */}
              {activeTab === 'socials' && (
                <SocialsTab
                  socialLinks={socialLinks}
                  actionLoading={actionLoading}
                  deleteSocialLink={deleteSocialLink}
                  saveSocialLink={saveSocialLink}
                />
              )}

              {/* TAB 7: CONTACT SETTINGS */}
              {activeTab === 'contact' && (
                <ContactTab
                  contactData={contactData}
                  setContactData={setContactData}
                  saveContactSettings={saveContactSettings}
                  actionLoading={actionLoading}
                />
              )}

            </motion.div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950/40 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} MUHAMAD IKHSAN | Admin Dashboard Hub</p>
      </footer>
    </div>
  );
}
