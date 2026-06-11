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
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Layout states
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'skills' | 'projects' | 'certificates' | 'socials' | 'contact'>('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Auth Session check
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setAuthLoading(false);
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch queries using React Query
  const { data: heroData, isLoading: isHeroLoading } = useQuery({
    queryKey: ['hero_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('hero_settings').select('*').maybeSingle();
      if (error) throw error;
      return data || { is_available: true, title: "", highlight_name: "", subtitle: "", description: "", images: [] };
    },
    enabled: !!session,
  });

  const { data: aboutData, isLoading: isAboutLoading } = useQuery({
    queryKey: ['about_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('about_settings').select('*').maybeSingle();
      if (error) throw error;
      return data || { name: "", location: "", description_1: "", description_2: "", profile_image_url: "", cv_url: "", total_projects: 0, years_experience: 0 };
    },
    enabled: !!session,
  });

  const { data: contactData, isLoading: isContactLoading } = useQuery({
    queryKey: ['contact_settings'],
    queryFn: async () => {
      const { data, error } = await supabase.from('contact_settings').select('*').eq('is_singleton', true).maybeSingle();
      if (error) throw error;
      return data || { email: "", location: "", whatsapp_number: "" };
    },
    enabled: !!session,
  });

  const { data: skills = [], isLoading: isSkillsLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const { data, error } = await supabase.from('skills').select('*').order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  const { data: projects = [], isLoading: isProjectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  const { data: certificates = [], isLoading: isCertificatesLoading } = useQuery({
    queryKey: ['certificates'],
    queryFn: async () => {
      const { data, error } = await supabase.from('certificates').select('*').order('issued_date', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  const { data: socialLinks = [], isLoading: isSocialLinksLoading } = useQuery({
    queryKey: ['social_links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('social_links').select('*').order('id', { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!session,
  });

  // Prefetch all queries when session is active to ensure instant loading on tab switch
  useEffect(() => {
    if (session) {
      queryClient.prefetchQuery({
        queryKey: ['hero_settings'],
        queryFn: async () => {
          const { data } = await supabase.from('hero_settings').select('*').maybeSingle();
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['about_settings'],
        queryFn: async () => {
          const { data } = await supabase.from('about_settings').select('*').maybeSingle();
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['contact_settings'],
        queryFn: async () => {
          const { data } = await supabase.from('contact_settings').select('*').eq('is_singleton', true).maybeSingle();
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['skills'],
        queryFn: async () => {
          const { data } = await supabase.from('skills').select('*').order('id', { ascending: true });
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['projects'],
        queryFn: async () => {
          const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['certificates'],
        queryFn: async () => {
          const { data } = await supabase.from('certificates').select('*').order('issued_date', { ascending: false });
          return data;
        }
      });
      queryClient.prefetchQuery({
        queryKey: ['social_links'],
        queryFn: async () => {
          const { data } = await supabase.from('social_links').select('*').order('id', { ascending: true });
          return data;
        }
      });
    }
  }, [session, queryClient]);

  // Auth Operations
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setAuthError(error.message);
        toast.error('Login gagal: ' + error.message);
      } else {
        toast.success('Berhasil masuk ke panel admin.');
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
    queryClient.clear();
    toast.success('Berhasil keluar.');
  };

  // React Query Mutations with Optimistic Updates
  const saveHeroMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { id, created_at, ...payload } = updatedData;
      const { error } = await supabase.from('hero_settings').upsert({ id: id || 1, ...payload });
      if (error) throw error;
      return updatedData;
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['hero_settings'] });
      const previousData = queryClient.getQueryData(['hero_settings']);
      queryClient.setQueryData(['hero_settings'], updatedData);
      return { previousData };
    },
    onError: (err, newValues, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['hero_settings'], context.previousData);
      }
      toast.error('Gagal menyimpan Hero: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Pengaturan Hero berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['hero_settings'] });
    }
  });

  const saveAboutMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { id, created_at, ...payload } = updatedData;
      const { error } = await supabase.from('about_settings').upsert({ id: id || 1, ...payload });
      if (error) throw error;
      return updatedData;
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['about_settings'] });
      const previousData = queryClient.getQueryData(['about_settings']);
      queryClient.setQueryData(['about_settings'], updatedData);
      return { previousData };
    },
    onError: (err, newValues, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['about_settings'], context.previousData);
      }
      toast.error('Gagal menyimpan About: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Pengaturan About berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['about_settings'] });
    }
  });

  const saveContactMutation = useMutation({
    mutationFn: async (updatedData: any) => {
      const { error } = await supabase.from('contact_settings').upsert({
        is_singleton: true,
        email: updatedData.email,
        location: updatedData.location,
        whatsapp_number: updatedData.whatsapp_number
      });
      if (error) throw error;
      return updatedData;
    },
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries({ queryKey: ['contact_settings'] });
      const previousData = queryClient.getQueryData(['contact_settings']);
      queryClient.setQueryData(['contact_settings'], updatedData);
      return { previousData };
    },
    onError: (err, newValues, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['contact_settings'], context.previousData);
      }
      toast.error('Gagal menyimpan Kontak: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Pengaturan Kontak berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['contact_settings'] });
    }
  });

  const saveSkillMutation = useMutation({
    mutationFn: async (skill: any) => {
      if (skill.id) {
        const { error } = await supabase.from('skills').update({
          name: skill.name,
          logo: skill.logo,
          category: skill.category,
          desc_text: skill.desc_text
        }).eq('id', skill.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('skills').insert([skill]);
        if (error) throw error;
      }
    },
    onMutate: async (newSkill) => {
      await queryClient.cancelQueries({ queryKey: ['skills'] });
      const previousSkills = queryClient.getQueryData(['skills']);
      
      queryClient.setQueryData(['skills'], (old: any[] | undefined) => {
        const list = old ? [...old] : [];
        if (newSkill.id) {
          return list.map(item => item.id === newSkill.id ? { ...item, ...newSkill } : item);
        } else {
          return [...list, { ...newSkill, id: Date.now() }];
        }
      });
      return { previousSkills };
    },
    onError: (err, newSkill, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(['skills'], context.previousSkills);
      }
      toast.error('Gagal menyimpan keahlian: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Keahlian berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    }
  });

  const deleteSkillMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('skills').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['skills'] });
      const previousSkills = queryClient.getQueryData(['skills']);
      queryClient.setQueryData(['skills'], (old: any[] | undefined) => {
        return old ? old.filter(item => item.id !== id) : [];
      });
      return { previousSkills };
    },
    onError: (err, id, context) => {
      if (context?.previousSkills) {
        queryClient.setQueryData(['skills'], context.previousSkills);
      }
      toast.error('Gagal menghapus keahlian: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Keahlian berhasil dihapus.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    }
  });

  const saveProjectMutation = useMutation({
    mutationFn: async (project: any) => {
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
      } else {
        const { error } = await supabase.from('projects').insert([projectPayload]);
        if (error) throw error;
      }
    },
    onMutate: async (newProject) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old: any[] | undefined) => {
        const list = old ? [...old] : [];
        const techArray = Array.isArray(newProject.tech_stack) 
          ? newProject.tech_stack 
          : newProject.tech_stack.split(',').map((t: string) => t.trim()).filter((t: string) => t !== "");

        const formatted = { ...newProject, tech_stack: techArray };

        if (newProject.id) {
          return list.map(item => item.id === newProject.id ? { ...item, ...formatted } : item);
        } else {
          return [{ ...formatted, id: Date.now(), created_at: new Date().toISOString() }, ...list];
        }
      });
      return { previousProjects };
    },
    onError: (err, newProject, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      toast.error('Gagal menyimpan proyek: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Proyek berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['projects'] });
      const previousProjects = queryClient.getQueryData(['projects']);
      queryClient.setQueryData(['projects'], (old: any[] | undefined) => {
        return old ? old.filter(item => item.id !== id) : [];
      });
      return { previousProjects };
    },
    onError: (err, id, context) => {
      if (context?.previousProjects) {
        queryClient.setQueryData(['projects'], context.previousProjects);
      }
      toast.error('Gagal menghapus proyek: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Proyek berhasil dihapus.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const saveCertificateMutation = useMutation({
    mutationFn: async (cert: any) => {
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
      } else {
        const { error } = await supabase.from('certificates').insert([certPayload]);
        if (error) throw error;
      }
    },
    onMutate: async (newCert) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });
      const previousCerts = queryClient.getQueryData(['certificates']);
      queryClient.setQueryData(['certificates'], (old: any[] | undefined) => {
        const list = old ? [...old] : [];
        if (newCert.id) {
          return list.map(item => item.id === newCert.id ? { ...item, ...newCert } : item);
        } else {
          return [{ ...newCert, id: Date.now() }, ...list];
        }
      });
      return { previousCerts };
    },
    onError: (err, newCert, context) => {
      if (context?.previousCerts) {
        queryClient.setQueryData(['certificates'], context.previousCerts);
      }
      toast.error('Gagal menyimpan sertifikat: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Sertifikat berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    }
  });

  const deleteCertificateMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('certificates').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['certificates'] });
      const previousCerts = queryClient.getQueryData(['certificates']);
      queryClient.setQueryData(['certificates'], (old: any[] | undefined) => {
        return old ? old.filter(item => item.id !== id) : [];
      });
      return { previousCerts };
    },
    onError: (err, id, context) => {
      if (context?.previousCerts) {
        queryClient.setQueryData(['certificates'], context.previousCerts);
      }
      toast.error('Gagal menghapus sertifikat: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Sertifikat berhasil dihapus.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    }
  });

  const saveSocialLinkMutation = useMutation({
    mutationFn: async (link: any) => {
      if (link.id) {
        const { error } = await supabase.from('social_links').update({
          icon_name: link.icon_name,
          url: link.url
        }).eq('id', link.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('social_links').insert([link]);
        if (error) throw error;
      }
    },
    onMutate: async (newLink) => {
      await queryClient.cancelQueries({ queryKey: ['social_links'] });
      const previousLinks = queryClient.getQueryData(['social_links']);
      queryClient.setQueryData(['social_links'], (old: any[] | undefined) => {
        const list = old ? [...old] : [];
        if (newLink.id) {
          return list.map(item => item.id === newLink.id ? { ...item, ...newLink } : item);
        } else {
          return [...list, { ...newLink, id: Date.now() }];
        }
      });
      return { previousLinks };
    },
    onError: (err, newLink, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['social_links'], context.previousLinks);
      }
      toast.error('Gagal menyimpan tautan sosial: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Tautan sosial berhasil disimpan!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
    }
  });

  const deleteSocialLinkMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('social_links').delete().eq('id', id);
      if (error) throw error;
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['social_links'] });
      const previousLinks = queryClient.getQueryData(['social_links']);
      queryClient.setQueryData(['social_links'], (old: any[] | undefined) => {
        return old ? old.filter(item => item.id !== id) : [];
      });
      return { previousLinks };
    },
    onError: (err, id, context) => {
      if (context?.previousLinks) {
        queryClient.setQueryData(['social_links'], context.previousLinks);
      }
      toast.error('Gagal menghapus tautan sosial: ' + err.message);
    },
    onSuccess: () => {
      toast.success('Tautan sosial berhasil dihapus.');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['social_links'] });
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex flex-col justify-center items-center">
        <FormSkeleton />
        <p className="text-slate-400 font-mono tracking-widest text-xs uppercase animate-pulse mt-4">Menghubungkan Supabase...</p>
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
  ] as const;

  // Determine active tab loading state
  const isTabLoading = 
    (activeTab === 'hero' && isHeroLoading) ||
    (activeTab === 'about' && isAboutLoading) ||
    (activeTab === 'contact' && isContactLoading) ||
    (activeTab === 'skills' && isSkillsLoading) ||
    (activeTab === 'projects' && isProjectsLoading) ||
    (activeTab === 'certificates' && isCertificatesLoading) ||
    (activeTab === 'socials' && isSocialLinksLoading);

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-slate-950/80 backdrop-blur-md border-b border-slate-900 sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
              title="Menu Navigasi"
            >
              <MenuIcon size={20} />
            </button>

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
              className="p-2.5 md:px-4 md:py-2.5 bg-red-600/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs font-bold active:scale-95 cursor-pointer"
              title="Logout"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Slide-over Panel */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <Dialog open={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} className="relative z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
            
            <div className="fixed inset-0 flex z-50">
              <DialogPanel
                as={motion.div}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 22, stiffness: 220 }}
                className="relative max-w-xs w-full bg-slate-950 border-r border-slate-900 p-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-extrabold text-white">Menu Admin</h2>
                    <button 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl cursor-pointer"
                    >
                      <CloseIcon size={18} />
                    </button>
                  </div>
                  
                  <nav className="flex flex-col gap-1.5">
                    {sidebarItems.map((item) => {
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileMenuOpen(false);
                          }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all border cursor-pointer ${
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
                  </nav>
                </div>
                
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3.5 bg-red-600/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:bg-red-600 hover:text-white transition-all"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              </DialogPanel>
            </div>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-6 py-8 grid lg:grid-cols-4 gap-8 items-start relative">
        
        {/* Sidebar Panel (Desktop only) */}
        <div className="hidden lg:flex lg:col-span-1 bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-3xl p-4 flex-col gap-1 sticky top-24 z-20">
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 border active:scale-95 cursor-pointer ${
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
        <div className="col-span-4 lg:col-span-3 w-full">
          {isTabLoading ? (
            <div className="bg-slate-900/20 border border-slate-800 rounded-[2.5rem] p-6 md:p-10 backdrop-blur-sm relative">
              {['hero', 'about', 'contact'].includes(activeTab) ? (
                <FormSkeleton />
              ) : (
                <GridSkeleton count={activeTab === 'skills' ? 6 : 4} />
              )}
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
              {activeTab === 'hero' && heroData && (
                <HeroTab
                  heroData={heroData}
                  setHeroData={(newData) => queryClient.setQueryData(['hero_settings'], newData)}
                  saveHeroSettings={async (e) => {
                    // Handled inside HeroTab but we can wrap mutation trigger here
                    e?.preventDefault();
                  }}
                  actionLoading={saveHeroMutation.isPending ? 'hero' : null}
                />
              )}

              {/* TAB 2: ABOUT SETTINGS */}
              {activeTab === 'about' && aboutData && (
                <AboutTab
                  aboutData={aboutData}
                  setAboutData={(newData) => queryClient.setQueryData(['about_settings'], newData)}
                  saveAboutSettings={async (e) => {
                    e?.preventDefault();
                  }}
                  actionLoading={saveAboutMutation.isPending ? 'about' : null}
                />
              )}

              {/* TAB 3: SKILLS MANAGEMENT */}
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

              {/* TAB 4: PROJECTS MANAGEMENT */}
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

              {/* TAB 5: CERTIFICATES MANAGEMENT */}
              {activeTab === 'certificates' && (
                <CertificatesTab
                  certificates={certificates}
                  actionLoading={saveCertificateMutation.isPending ? 'cert_modal' : null}
                  deleteCertificate={async (id) => {
                    await deleteCertificateMutation.mutateAsync(id);
                  }}
                  saveCertificate={async (cert) => {
                    await saveCertificateMutation.mutateAsync(cert);
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

      {/* FOOTER */}
      <footer className="py-8 bg-slate-950/40 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>© {new Date().getFullYear()} MUHAMAD IKHSAN | Admin Dashboard Hub</p>
      </footer>
    </div>
  );
}
