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
  ExternalLink,
  Menu as MenuIcon,
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Dialog, DialogPanel } from '@headlessui/react';

// Import Admin Subcomponents
import Login from './components/Login';
import HeroTab from './components/HeroTab';
import AboutTab from './components/AboutTab';
import SkillsTab from './components/SkillsTab';
import ProjectsTab from './components/ProjectsTab';
import CertificatesTab from './components/CertificatesTab';
import SocialsTab from './components/SocialsTab';
import ContactTab from './components/ContactTab';
import QueryProvider from './components/QueryProvider';
import { FormSkeleton, GridSkeleton } from './components/SkeletonLoaders';

export default function AdminPage() {
  return (
    <QueryProvider>
      <AdminDashboard />
    </QueryProvider>
  );
}

function AdminDashboard() {
  const supabase = createClient();
  const queryClient = useQueryClient();
  
  // Auth states
  const [session, setSession] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(''); // FIX TS Error: Added authError state

  // UI Navigation states
  const [activeTab, setActiveTab] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Check current auth session on load
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    };

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Handle Login authentication
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Selamat datang kembali, Admin!');
    } catch (err: any) {
      const errMsg = err.message || 'Gagal masuk ke dashboard.';
      setAuthError(errMsg);
      toast.error(errMsg);
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Logout authentication
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Berhasil keluar dari dashboard.');
      queryClient.clear();
    } catch (err: any) {
      toast.error('Gagal keluar.');
    }
  };

  // --- REACT QUERY DATA FETCHING ---
  const { data: heroData, isLoading: heroLoading } = useQuery({
    queryKey: ['hero_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hero_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { title: '', subtitle: '', cv_url: '', img_url: '' };
    },
    enabled: !!session
  });

  const { data: aboutData, isLoading: aboutLoading } = useQuery({
    queryKey: ['about_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { title: '', description: '', skills_json: [] };
    },
    enabled: !!session
  });

  const { data: skills = [], isLoading: skillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skills').select('*').order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session
  });

  const { data: certificates = [], isLoading: certificatesLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('certificates').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session
  });

  const { data: socialLinks = [], isLoading: socialsLoading } = useQuery({
    queryKey: ['social_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_links').select('*').order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session
  });

  const { data: contactData, isLoading: contactLoading } = useQuery({
    queryKey: ['contact_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_settings').select('*').single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || { email: '', phone: '', location: '', map_embed_url: '' };
    },
    enabled: !!session
  });

  // --- MUTATIONS (SAVE & DELETE OPERATIONS) ---
  const saveHeroMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('hero_settings').upsert({ id: 1, ...payload });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero_settings'] });
      toast.success('Pengaturan Hero berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan: ' + err.message)
  });

  const saveAboutMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('about_settings').upsert({ id: 1, ...payload });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['about_settings'] });
      toast.success('Pengaturan Tentang Saya berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan: ' + err.message)
  });

  const saveSkillMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('skills').upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Data keahlian berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan keahlian: ' + err.message)
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      toast.success('Keahlian berhasil dihapus.');
    },
    onError: (err: any) => toast.error('Gagal menghapus: ' + err.message)
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('projects').upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proyek berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan proyek: ' + err.message)
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Proyek berhasil dihapus.');
    },
    onError: (err: any) => toast.error('Gagal menghapus: ' + err.message)
  });

  const saveCertificateMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('certificates').upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifikat berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan sertifikat: ' + err.message)
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      toast.success('Sertifikat berhasil dihapus.');
    },
    onError: (err: any) => toast.error('Gagal menghapus sertifikat: ' + err.message)
  });

  const saveSocialLinkMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('social_links').upsert(payload);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      toast.success('Tautan sosial berhasil disimpan!');
    },
    onError: (err: any) => toast.error('Gagal menyimpan tautan: ' + err.message)
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
      toast.success('Tautan sosial berhasil dihapus.');
    },
    onError: (err: any) => toast.error('Gagal menghapus tautan: ' + err.message)
  });

  const saveContactMutation = useMutation({
    mutationFn: async (payload: any) => {
      const { error } = await supabase.from('contact_settings').upsert({ id: 1, ...payload });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_settings'] });
      toast.success('Pengaturan kontak berhasil diperbarui!');
    },
    onError: (err: any) => toast.error('Gagal memperbarui kontak: ' + err.message)
  });

  // Loading global initialization
  if (loading) {
    return (
      <div className="h-screen w-screen bg-[#020617] text-white flex flex-col items-center justify-center space-y-6 relative overflow-hidden">
        {/* Glow Background */}
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="flex flex-col items-center z-10 space-y-5">
          <span className="text-xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">IKHSAN.DEV</span>
          
          {/* Modern Progress Bar */}
          <div className="w-56 h-1.5 bg-slate-800/80 rounded-full overflow-hidden relative backdrop-blur-sm shadow-inner">
            <motion.div 
              className="absolute top-0 left-0 h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"
              animate={{ 
                x: ["-100%", "200%"],
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 1.5, 
                ease: "easeInOut" 
              }}
              style={{ width: "50%" }}
            />
          </div>
          
          <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase animate-pulse">Menginisialisasi Hub...</p>
        </div>
      </div>
    );
  }

  // Auth Guard View
  if (!session) {
    return (
      <Login 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        authLoading={authLoading}
        handleLogin={handleLogin}
        authError={authError} // Disematkan untuk resolve error Typescript LoginProps
      />
    );
  }

  // Dashboard Tab Configuration Setup
  const navigationItems = [
    { id: 'hero', name: 'Hero Banner', icon: Home },
    { id: 'about', name: 'Tentang Saya', icon: User },
    { id: 'skills', name: 'Manajemen Skill', icon: Code2 },
    { id: 'projects', name: 'Daftar Proyek', icon: Briefcase },
    { id: 'certificates', name: 'Sertifikat', icon: Award },
    { id: 'socials', name: 'Tautan Sosial', icon: Share2 },
    { id: 'contact', name: 'Info Kontak', icon: Phone },
  ];

  const currentTabLoading = 
    (activeTab === 'hero' && heroLoading) ||
    (activeTab === 'about' && aboutLoading) ||
    (activeTab === 'skills' && skillsLoading) ||
    (activeTab === 'projects' && projectsLoading) ||
    (activeTab === 'certificates' && certificatesLoading) ||
    (activeTab === 'socials' && socialsLoading) ||
    (activeTab === 'contact' && contactLoading);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#020617] text-slate-100 font-sans flex selection:bg-blue-500/30 selection:text-blue-100 relative">
      
      {/* GLOBAL BACKGROUND GLOW EFFECTS */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-blue-900/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-indigo-900/15 rounded-full blur-[140px]" />
      </div>

      {/* DESKTOP SIDEBAR NAVIGATION */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 border-r border-slate-800/60 p-6 space-y-8 backdrop-blur-xl h-full flex-shrink-0 z-20 shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">IKHSAN.DEV</span>
            <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase mt-1">Control Center v2</span>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-blue-400 transition-colors bg-slate-900/50 p-2 rounded-lg border border-slate-800/50" title="Lihat Website">
            <ExternalLink size={16} />
          </a>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer relative group ${
                  isActive 
                    ? 'text-white bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30 border border-transparent'
                }`}
              >
                <IconComponent size={18} className={isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400 transition-colors'} />
                {item.name}
                {isActive && (
                  <motion.div 
                    layoutId="activeIndicatorDesktop"
                    className="absolute right-4 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-[0_0_8px_rgba(96,165,250,0.8)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/60 pt-5 flex flex-col gap-3">
          <div className="px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl flex items-center gap-3 backdrop-blur-sm">
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </div>
            <span className="text-[11px] font-mono text-slate-300 truncate">{session?.user?.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut size={18} />
            Keluar Hub
          </button>
        </div>
      </aside>

      {/* RESPONSIVE MOBILE SIDEBAR DRAWERS */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Dialog 
            static 
            open={isMobileMenuOpen} 
            onClose={() => setIsMobileMenuOpen(false)} 
            className="relative z-50 lg:hidden"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" 
            />
            <div className="fixed inset-0 flex z-50">
              <DialogPanel className="w-full max-w-xs">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative max-w-xs w-full bg-[#020617] border-r border-slate-800 p-6 flex flex-col justify-between h-full shadow-2xl shadow-black"
                >
                  <div className="space-y-8 h-full flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-base font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">IKHSAN.DEV</span>
                        <span className="text-[10px] font-mono text-blue-400 tracking-widest uppercase mt-1">Mobile Control</span>
                      </div>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 text-slate-400 hover:text-white bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                      >
                        <CloseIcon size={20} />
                      </button>
                    </div>

                    <nav className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-1">
                      {navigationItems.map((item) => {
                        const IconComponent = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setActiveTab(item.id);
                              setIsMobileMenuOpen(false);
                            }}
                            className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                              isActive 
                                ? 'text-white bg-blue-500/10 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
                            }`}
                          >
                            <IconComponent size={18} className={isActive ? 'text-blue-400' : 'text-slate-500'} />
                            {item.name}
                          </button>
                        );
                      })}
                    </nav>
                  </div>

                  <div className="border-t border-slate-800 pt-5 flex flex-col gap-3 mt-4">
                    <div className="px-4 py-3 bg-slate-900/50 border border-slate-800/50 rounded-xl flex items-center gap-3">
                      <div className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 truncate">{session?.user?.email}</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="w-full flex items-center justify-center gap-2.5 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 hover:border-red-500/30 rounded-xl transition-all cursor-pointer"
                    >
                      <LogOut size={18} />
                      Keluar Hub
                    </button>
                  </div>
                </motion.div>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* DASHBOARD CONTENT AREA HUB (Scrollable) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto custom-scrollbar relative z-10">
        
        {/* TOP RESPONSIVE MOBILE BAR HEADER */}
        <header className="lg:hidden h-16 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur-xl px-4 flex items-center justify-between sticky top-0 z-30 shadow-md shadow-black/20 flex-shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer transition-colors"
          >
            <MenuIcon size={20} />
          </button>
          <div className="flex flex-col items-center">
            <span className="text-sm font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase">DASHBOARD</span>
          </div>
          <a href="/" target="_blank" rel="noreferrer" className="p-2.5 text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 cursor-pointer transition-colors">
            <ExternalLink size={20} />
          </a>
        </header>

        {/* MAIN SUBCOMPONENT TAB LAYOUT */}
        {currentTabLoading ? (
          <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto pb-12">
            {['hero', 'about', 'contact'].includes(activeTab) ? <FormSkeleton /> : <GridSkeleton />}
          </main>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl w-full mx-auto pb-12"
          >
            
            {/* TAB 1: HERO VIEW SETTINGS */}
            {activeTab === 'hero' && heroData && (
              <HeroTab 
                heroData={heroData} 
                setHeroData={(newData) => queryClient.setQueryData(['hero_settings'], newData)}
                saveHeroSettings={async (e) => {
                  e?.preventDefault();
                  await saveHeroMutation.mutateAsync(heroData);
                }}
                actionLoading={saveHeroMutation.isPending ? 'hero' : null}
              />
            )}

            {/* TAB 2: ABOUT CONTENT SETTINGS */}
            {activeTab === 'about' && aboutData && (
              <AboutTab
                aboutData={aboutData}
                setAboutData={(newData) => queryClient.setQueryData(['about_settings'], newData)}
                saveAboutSettings={async (e) => {
                  e?.preventDefault();
                  await saveAboutMutation.mutateAsync(aboutData);
                }}
                actionLoading={saveAboutMutation.isPending ? 'about' : null}
              />
            )}

            {/* TAB 3: SKILLS MANAGEMENT LIST */}
            {activeTab === 'skills' && (
              <SkillsTab
                skills={skills}
                actionLoading={saveSkillMutation.isPending ? 'skill_modal' : null}
                deleteSkill={async (id) => {
                  await deleteSkillMutation.mutateAsync(id);
                }}
                saveSkill={async (skill) => {
                  await saveSkillMutation.mutateAsync(skill);
                }}
              />
            )}

            {/* TAB 4: PROJECTS PORTFOLIO LIST */}
            {activeTab === 'projects' && (
              <ProjectsTab
                projects={projects}
                actionLoading={saveProjectMutation.isPending ? 'project_modal' : null}
                deleteProject={async (id) => {
                  await deleteProjectMutation.mutateAsync(id);
                }}
                saveProject={async (project) => {
                  await saveProjectMutation.mutateAsync(project);
                }}
              />
            )}

            {/* TAB 5: CERTIFICATES ARCHIVE MANAGEMENT */}
            {activeTab === 'certificates' && (
              <CertificatesTab
                certificates={certificates}
                actionLoading={saveCertificateMutation.isPending ? 'certificate_modal' : null}
                deleteCertificate={async (id) => {
                  await deleteCertificateMutation.mutateAsync(id);
                }}
                saveCertificate={async (certificate) => {
                  await saveCertificateMutation.mutateAsync(certificate);
                }}
              />
            )}

            {/* TAB 6: SOCIAL LINKS MANAGEMENT */}
            {activeTab === 'socials' && (
              <SocialsTab
                socialLinks={socialLinks}
                actionLoading={saveSocialLinkMutation.isPending ? 'social_modal' : null}
                deleteSocialLink={async (id) => {
                  await deleteSocialLinkMutation.mutateAsync(id);
                }}
                saveSocialLink={async (link) => {
                  await saveSocialLinkMutation.mutateAsync(link);
                }}
              />
            )}

            {/* TAB 7: CONTACT SETTINGS */}
            {activeTab === 'contact' && contactData && (
              <ContactTab
                contactData={contactData}
                setContactData={(newData) => queryClient.setQueryData(['contact_settings'], newData)}
                saveContactSettings={async (e) => {
                  e?.preventDefault();
                  await saveContactMutation.mutateAsync(contactData);
                }}
                actionLoading={saveContactMutation.isPending ? 'contact' : null}
              />
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
}