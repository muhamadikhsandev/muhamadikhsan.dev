"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  confirmColor: string;
  onConfirm: () => Promise<void>;
  isSaving: boolean;
  progress: number;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  title,
  message,
  confirmText,
  confirmColor,
  onConfirm,
  isSaving,
  progress
}: ConfirmModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = {
    hidden: { opacity: 0, y: isMobile ? '100%' : '-50%', x: isMobile ? '0%' : '-50%', scale: isMobile ? 1 : 0.95 },
    visible: { opacity: 1, y: isMobile ? '0%' : '-50%', x: isMobile ? '0%' : '-50%', scale: 1, transition: { type: 'spring', damping: 25, stiffness: 350 } },
    exit: { opacity: 0, y: isMobile ? '100%' : '-50%', x: isMobile ? '0%' : '-50%', scale: isMobile ? 1 : 0.95, transition: { duration: 0.2 } }
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onClose={() => !isSaving && onClose()} className="relative z-50">
          {/* Backdrop overlay */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={overlayVariants}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal positioner */}
          <div className="fixed inset-0 overflow-y-auto flex items-end sm:items-center justify-center p-0 sm:p-4">
            <DialogPanel
              as={motion.div}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={modalVariants}
              className={`bg-slate-900 border border-slate-800 shadow-2xl p-6 w-full max-h-[85vh] overflow-y-auto flex flex-col justify-between absolute
                ${isMobile ? 'bottom-0 left-0 right-0 rounded-t-[2.5rem] pb-8 pt-6' : 'top-1/2 left-1/2 rounded-[2.5rem] max-w-md border-white/5'}`}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-500/10 rounded-2xl flex items-center justify-center text-yellow-500 flex-shrink-0">
                    <AlertTriangle size={20} />
                  </div>
                  <DialogTitle className="text-xl font-bold text-white tracking-tight">
                    {title}
                  </DialogTitle>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed pl-1">
                  {message}
                </p>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={onClose}
                  className="flex-1 py-3.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  Batal
                </button>
                
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={async () => {
                    await onConfirm();
                  }}
                  className={`relative overflow-hidden flex-1 py-3.5 px-4 flex justify-center text-white font-bold rounded-2xl transition-all text-xs uppercase tracking-wider active:scale-95 disabled:opacity-90 cursor-pointer ${confirmColor}`}
                >
                  {/* Progress Bar background overlay */}
                  {isSaving && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 bg-black/30"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progress}%` }}
                      transition={{ ease: "easeOut", duration: 0.3 }}
                    />
                  )}
                  {/* Status text */}
                  <span className="relative z-10 flex items-center gap-2">
                    {isSaving ? `Memproses ${progress}%` : confirmText}
                  </span>
                </button>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
