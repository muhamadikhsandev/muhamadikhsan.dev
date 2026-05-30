"use client";
import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  User, 
  MessageSquare, 
  Send, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  ExternalLink 
} from 'lucide-react';
// Pastikan path inisialisasi supabase client lo sudah benar
import { createClient } from '@/utils/supabase/client'; 

export default function Contact() {
  const supabase = createClient();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // State untuk menampung data dinamis dari database
  const [settings, setSettings] = useState({
    email: "muhamadikhsan.dev@gmail.com",
    location: "Depok, Jawa Barat, Indonesia",
    whatsapp_number: "628123456789"
  });

  // 1. Fungsi mengambil data dari Supabase secara Realtime / Client-side
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('contact_settings')
          .select('email, location, whatsapp_number')
          .eq('is_singleton', true)
          .single();

        if (error) {
          console.error("Gagal mengambil data contact_settings:", error.message);
        } else if (data) {
          setSettings({
            email: data.email,
            location: data.location,
            whatsapp_number: data.whatsapp_number
          });
        }
      } catch (err) {
        console.error("Error fetch:", err);
      }
    };

    fetchSettings();
  }, [supabase]);

  // 2. Helper format tampilan nomor WhatsApp (Contoh: +62 812-3456-789)
  const formatWhatsAppDisplay = (num: string) => {
    const cleaned = num.replace(/\D/g, '');
    if (cleaned.startsWith('62') && cleaned.length >= 11) {
      return `+62 ${cleaned.slice(2, 5)}-${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
    }
    return `+${cleaned}`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    
    // KODE FIX: Memasukkan Access Key Web3Forms milik lo secara valid
    formData.append("access_key", "03fad5d4-4602-4ba1-b473-1095f63eba70"); 

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        setIsSubmitting(false);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setIsSuccess(false), 5000);
      }
    } catch (error) {
      console.error("Error", error);
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-12 md:py-24 px-4 sm:px-6 bg-[#020617] overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-600/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Hubungi <span className="text-blue-500">Saya</span>
          </h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Tertarik bekerja sama, tanya-tanya, atau sekadar ngobrol santai? 
            Silakan hubungi saya melalui form atau kontak di bawah ini.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
          
          {/* SISI KIRI: INFORMASI KONTAK */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">
                Mari Bicara <span className="text-blue-500">Proyek</span>
              </h3>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
                Saya selalu terbuka untuk diskusi proyek baru, ide kreatif, atau peluang untuk menjadi bagian dari visi Anda.
              </p>
            </div>

            <div className="grid gap-4 sm:gap-6">
              {/* Lokasi */}
              <div className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                  <MapPin size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-widest">Lokasi</p>
                  <p className="text-white font-semibold text-sm md:text-lg">{settings.location}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                  <Mail size={20} className="md:w-6 md:h-6" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-widest">Email</p>
                  <a href={`mailto:${settings.email}`} className="text-white font-semibold text-sm md:text-lg hover:text-blue-400 transition-colors flex items-center gap-2 truncate">
                    {settings.email}
                    <ExternalLink size={14} className="opacity-50" />
                  </a>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-center gap-4 group p-3 rounded-2xl hover:bg-white/5 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center text-blue-500 group-hover:border-blue-500/50 transition-all">
                  <Phone size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] md:text-xs font-medium uppercase tracking-widest">WhatsApp</p>
                  <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white font-semibold text-sm md:text-lg hover:text-blue-400 transition-colors">
                    {formatWhatsAppDisplay(settings.whatsapp_number)}
                  </a>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/5 border border-blue-500/10 rounded-full">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              <span className="text-blue-400 text-xs md:text-sm font-medium">Tersedia untuk Freelance</span>
            </div>
          </div>

          {/* SISI KANAN: FORMULIR */}
          <div className="order-1 lg:order-2 bg-slate-900/40 border border-slate-800 p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-sm shadow-2xl relative">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-10 animate-in fade-in zoom-in duration-500 text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} className="md:w-10 md:h-10" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">Pesan Terkirim!</h3>
                <p className="text-slate-400 text-sm md:text-base">Saya akan segera menghubungi Anda kembali.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="text" name="name" placeholder="Nama" required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white text-sm md:text-base outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                      type="email" name="email" placeholder="Email" required
                      className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white text-sm md:text-base outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-600"
                    />
                  </div>
                </div>
                <div className="relative group">
                  <MessageSquare className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <textarea 
                    name="message" 
                    rows={5} 
                    placeholder="Ceritakan proyek Anda..." 
                    required
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-xl md:rounded-2xl py-3 md:py-4 pl-12 pr-4 text-white text-sm md:text-base outline-none focus:border-blue-500/50 transition-all resize-none placeholder:text-slate-600 min-h-[150px]"
                  ></textarea>
                </div>
                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-3 md:py-4 rounded-xl md:rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group text-sm md:text-base"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                  {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}