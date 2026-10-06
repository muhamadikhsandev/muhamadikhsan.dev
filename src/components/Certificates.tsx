"use client";

import React, { useState } from 'react';
import { Award, Calendar, ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface CertificateItem {
  id?: number;
  title: string;
  issuer?: string | null;
  issued_date?: string | null;
  image_url?: string | null;
}

interface CertificatesProps {
  data: CertificateItem[];
}

const isValidUrl = (url?: string | null): url is string => (
  Boolean(url && url !== 'null' && url !== '#')
);

const formatIssuedDate = (date?: string | null) => {
  if (!date) return 'Tanggal tidak tersedia';

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return date;

  return parsedDate.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
  });
};

interface CertificateImageProps {
  certificate: CertificateItem;
  onOpen: (certificate: CertificateItem) => void;
}

const CertificateImage = ({ certificate, onOpen }: CertificateImageProps) => (
  <div className="relative h-full w-28 shrink-0 overflow-hidden border-r border-slate-800 bg-slate-950 sm:w-36">
    {isValidUrl(certificate.image_url) ? (
      <button
        type="button"
        onClick={() => onOpen(certificate)}
        aria-label={`Perbesar sertifikat ${certificate.title}`}
        className="relative block h-full w-full cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <img
          src={certificate.image_url}
          alt={`Sertifikat ${certificate.title}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain p-1.5 transition-transform duration-500 group-hover:scale-[1.04] sm:p-2"
        />
        <span className="absolute bottom-2 left-2 inline-flex items-center justify-center rounded-full border border-white/10 bg-slate-950/85 p-1.5 text-white opacity-90 backdrop-blur-md transition-opacity group-hover:opacity-100" title="Perbesar sertifikat">
          <ZoomIn size={13} />
        </span>
      </button>
    ) : (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-700">
        <Award size={22} className="text-slate-800 transition-colors group-hover:text-blue-500/30" />
        <span className="text-[10px] font-mono tracking-wider">No Certificate Image</span>
      </div>
    )}

  </div>
);

interface CertificateCardProps {
  certificate: CertificateItem;
  onOpen: (certificate: CertificateItem) => void;
}

const CertificateCard = ({ certificate, onOpen }: CertificateCardProps) => (
  <article className="group flex min-h-[116px] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500/50 hover:bg-slate-900/80">
    <CertificateImage certificate={certificate} onOpen={onOpen} />

    <div className="flex min-w-0 flex-grow flex-col justify-between p-3 sm:p-4">
      <div>
        <p className="mb-1 truncate text-[9px] font-bold uppercase tracking-wider text-blue-500">
          {certificate.issuer || 'Sertifikasi Profesional'}
        </p>
        <h3 className="line-clamp-2 text-xs font-bold leading-snug text-white transition-colors group-hover:text-blue-400 sm:text-sm">
          {certificate.title}
        </h3>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2 border-t border-slate-800/70 pt-2">
        <div className="flex min-w-0 items-center gap-1 text-[9px] text-slate-400 sm:text-[10px]">
          <Calendar size={12} className="shrink-0 text-blue-500" />
          <span className="truncate capitalize">{formatIssuedDate(certificate.issued_date)}</span>
        </div>

        <span className="text-[9px] font-medium text-slate-600 sm:text-[10px]">Sertifikat</span>
      </div>
    </div>
  </article>
);

const Certificates = ({ data }: CertificatesProps) => {
  const [selectedCertificate, setSelectedCertificate] = useState<CertificateItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (!data || data.length === 0) {
    return (
      <section id="certificates" className="border-t border-slate-900 bg-[#020617] px-6 py-10 text-center">
        <h3 className="mb-2 text-2xl font-extrabold tracking-tight text-white">Sertifikasi & Penghargaan</h3>
        <p className="text-sm italic text-slate-400">Belum ada data sertifikat yang tersedia saat ini.</p>
      </section>
    );
  }

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedCertificates = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <section id="certificates" className="relative overflow-hidden border-t border-slate-900/40 bg-[#020617] px-4 py-12 md:px-6 md:py-16">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-600/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-8 md:mb-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-5xl">
              Sertifikasi & <span className="font-extrabold italic text-blue-500">Penghargaan</span>
            </h2>
            <div className="shrink-0 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-[10px] font-semibold text-blue-300 sm:px-4 sm:py-2 sm:text-xs">
              Total {data.length} sertifikat
            </div>
          </div>
          <div className="mb-5 h-1 w-16 rounded-full bg-blue-600" />
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-lg">
            Bukti kredibilitas dan pengalaman yang mendukung setiap solusi digital yang saya bangun.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
          {paginatedCertificates.map((certificate, index) => (
            <CertificateCard
              key={certificate.id ?? `${certificate.title}-${(currentPage - 1) * itemsPerPage + index}`}
              certificate={certificate}
              onOpen={setSelectedCertificate}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              aria-label="Halaman sertifikat sebelumnya"
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-2 font-mono text-xs font-bold text-blue-400">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              aria-label="Halaman sertifikat berikutnya"
              className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-400 transition-colors hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}

      </div>

      {selectedCertificate && isValidUrl(selectedCertificate.image_url) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`Preview sertifikat ${selectedCertificate.title}`}
          onClick={() => setSelectedCertificate(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-800 px-4 py-3 md:px-6">
              <div className="min-w-0">
                <p className="truncate text-xs font-bold uppercase tracking-wider text-blue-400">{selectedCertificate.issuer || 'Sertifikasi Profesional'}</p>
                <h3 className="truncate text-sm font-bold text-white md:text-base">{selectedCertificate.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCertificate(null)}
                aria-label="Tutup preview sertifikat"
                className="shrink-0 rounded-full bg-slate-800 p-2 text-slate-300 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex min-h-0 items-center justify-center overflow-auto bg-slate-950 p-3 md:p-6">
              <img
                src={selectedCertificate.image_url}
                alt={`Preview sertifikat ${selectedCertificate.title}`}
                className="max-h-[calc(92vh-7rem)] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Certificates;
