"use client";

import React, { useRef } from 'react';
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value: string;
  onChange: (file: File | null, previewUrl: string) => void;
  onClear: () => void;
  label: string;
  accept?: string;
  isDocument?: boolean;
}

export default function ImageUpload({
  value,
  onChange,
  onClear,
  label,
  accept = "image/*",
  isDocument = false
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!isDocument && !file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar!");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onChange(file, previewUrl);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!isDocument && !file.type.startsWith('image/')) {
        toast.error("File harus berupa gambar!");
        return;
      }
      const previewUrl = URL.createObjectURL(file);
      onChange(file, previewUrl);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="text-xs font-mono uppercase tracking-widest text-slate-400">{label}</label>
      
      {value ? (
        <div className="flex gap-4 items-center bg-slate-950/30 p-4 border border-slate-800 rounded-2xl relative overflow-hidden group">
          {isDocument ? (
            <div className="w-16 h-16 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-blue-500">
              <FileText size={28} />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 flex-shrink-0 relative">
              <img 
                src={value} 
                alt={label} 
                className="w-full h-full object-cover animate-fade-in" 
                onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97'; }}
              />
            </div>
          )}
          
          <div className="flex-grow space-y-1 overflow-hidden">
            <p className="text-xs text-slate-400 font-mono truncate">
              {value.startsWith('blob:') ? 'File baru terpilih' : value.split('/').pop()}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[10px] font-bold text-slate-300 hover:text-blue-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg cursor-pointer transition-all flex items-center gap-1 active:scale-95"
              >
                <Upload size={10} /> Ganti File
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onClear}
            className="p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-600 text-red-400 hover:text-white rounded-xl transition-all flex-shrink-0 active:scale-95"
            title="Hapus File"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99] group/drop"
        >
          {isDocument ? (
            <FileText className="text-slate-500 group-hover/drop:text-blue-400 transition-colors" size={32} />
          ) : (
            <ImageIcon className="text-slate-500 group-hover/drop:text-blue-400 transition-colors" size={32} />
          )}
          <div className="text-center">
            <p className="text-xs text-slate-300 font-bold group-hover/drop:text-white transition-colors">Pilih atau Seret File</p>
            <p className="text-[10px] text-slate-500 mt-1">{isDocument ? 'PDF, DOC, DOCX (Maks 10MB)' : 'PNG, JPG, SVG (Maks 5MB)'}</p>
          </div>
        </div>
      )}
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept={accept}
        className="hidden"
      />
    </div>
  );
}
