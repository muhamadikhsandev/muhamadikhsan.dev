"use client";

import React from 'react';
import ProjectCard from './projects/ProjectCard';
import { ProjectsProps } from './projects/types';

const Projects = ({ data }: ProjectsProps) => {
  if (!data || data.length === 0) {
    return (
      <section id="projects" className="border-t border-slate-900/50 bg-[#020617] px-6 py-12 text-center">
        <h2 className="mb-2 text-2xl font-bold text-white">Proyek Terpilih</h2>
        <p className="text-sm italic text-slate-500">Belum ada data proyek yang tersedia.</p>
      </section>
    );
  }

  return (
    <section id="projects" className="relative overflow-hidden bg-[#020617] px-4 py-12 md:px-6 md:py-20">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-blue-600/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-purple-600/5 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-6xl">
        <header className="mb-10 md:mb-14">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Proyek <span className="font-extrabold italic text-blue-500">Terpilih</span>
          </h2>
          <div className="mb-6 h-1 w-16 rounded-full bg-blue-600" />
          <p className="max-w-2xl text-sm leading-relaxed text-slate-400 md:text-lg">
            Kumpulan karya yang dirancang untuk mengubah kebutuhan menjadi pengalaman digital yang fungsional, menarik, dan berdampak.
          </p>
        </header>

        <div className="grid gap-5 md:grid-cols-2 md:gap-7 lg:grid-cols-3">
          {data.map((project, index) => (
            <ProjectCard key={project.id ?? `${project.title}-${index}`} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
