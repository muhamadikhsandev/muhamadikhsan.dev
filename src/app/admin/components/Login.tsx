"use client";

import React from 'react';
import { Mail, Lock, RefreshCw, ChevronRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  handleLogin: (e: React.FormEvent) => void;
  authLoading: boolean;
  authError: string | null;
}

export default function Login({
  email,
  setEmail,
  password,
  setPassword,
  handleLogin,
  authLoading,
  authError
}: LoginProps) {
  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center relative px-6 py-12 overflow-hidden">
      {/* Glow Backgrounds */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 w-[350px] h-[350px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md z-10">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tighter">
            MUHAMAD <span className="text-blue-500 italic">IKHSAN</span>
          </h1>
          <div className="h-1 w-12 bg-blue-500 mx-auto rounded-full mt-2 mb-3" />
          <p className="text-xs font-mono uppercase tracking-widest text-slate-500">Panel Kontrol Admin</p>
        </div>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-slate-900/40 backdrop-blur-md border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative"
        >
          {authError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 mb-6 flex items-start gap-3 text-sm">
              <AlertCircle className="flex-shrink-0 mt-0.5" size={18} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Alamat Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@domain.com"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono uppercase tracking-widest text-slate-400">Kata Sandi</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white text-sm outline-none focus:border-blue-500/50 transition-all placeholder:text-slate-700"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 group text-sm active:scale-[0.98]"
            >
              {authLoading ? (
                <RefreshCw className="animate-spin" size={18} />
              ) : (
                <>
                  Masuk Panel Admin
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer Back Button */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="inline-flex items-center gap-2 text-slate-500 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            Kembali ke Landing Page
          </a>
        </div>
      </div>
    </div>
  );
}
