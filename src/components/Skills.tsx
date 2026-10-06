"use client";

import React from 'react';

interface SkillItem {
  id?: number;
  name: string;
  logo: string;
  category: string;
  desc_text: string;
}

interface SkillsProps {
  data: SkillItem[];
}

const solutionDescriptions: Record<string, string> = {
  "Web Framework & Library": "Antarmuka web modern yang cepat, fleksibel, dan mudah dikembangkan.",
  "Programming Language": "Fondasi kode yang rapi, aman, dan siap tumbuh bersama kebutuhan bisnis.",
  "Mobile Development": "Pengalaman aplikasi mobile lintas platform yang konsisten di berbagai perangkat.",
  "Game Development": "Interaksi digital yang imersif untuk menghadirkan pengalaman pengguna yang berbeda.",
  "Backend & Database": "Sistem backend yang stabil dengan pengelolaan data yang aman dan terstruktur.",
};

const defaultSkills: SkillItem[] = [
  { name: "React", logo: "https://cdn.simpleicons.org/react/61DAFB", category: "Web Framework & Library", desc_text: "Frontend Library" },
  { name: "Next.js", logo: "https://cdn.simpleicons.org/nextdotjs/white", category: "Web Framework & Library", desc_text: "React Framework" },
  { name: "Laravel", logo: "https://cdn.simpleicons.org/laravel/FF2D20", category: "Web Framework & Library", desc_text: "PHP Framework" },
  { name: "Tailwind", logo: "https://cdn.simpleicons.org/tailwindcss/06B6D4", category: "Web Framework & Library", desc_text: "CSS Framework" },
  { name: "TypeScript", logo: "https://cdn.simpleicons.org/typescript/3178C6", category: "Programming Language", desc_text: "Typed JavaScript" },
  { name: "Flutter", logo: "https://cdn.simpleicons.org/flutter/02569B", category: "Mobile Development", desc_text: "Cross-Platform Mobile" },
  { name: "Godot Engine", logo: "https://cdn.simpleicons.org/godotengine/478CBF", category: "Game Development", desc_text: "2D/3D Game Engine" },
  { name: "Node.js", logo: "https://cdn.simpleicons.org/nodedotjs/339933", category: "Backend & Database", desc_text: "JavaScript Runtime" },
  { name: "PostgreSQL", logo: "https://cdn.simpleicons.org/postgresql/4169E1", category: "Backend & Database", desc_text: "Relational Database" },
  { name: "MySQL", logo: "https://cdn.simpleicons.org/mysql/4479A1", category: "Backend & Database", desc_text: "Relational Database" },
];

const Skills = ({ data }: SkillsProps) => {
  const skills = data?.length > 0 ? data : defaultSkills;
  const groupedSkills = skills.reduce((groups, skill) => {
    const categorySkills = groups.get(skill.category) ?? [];
    categorySkills.push(skill);
    groups.set(skill.category, categorySkills);
    return groups;
  }, new Map<string, SkillItem[]>());

  return (
    <section id="skills" className="relative overflow-hidden bg-[#020617] px-4 py-12 md:px-6 md:py-20">
      <div className="pointer-events-none absolute left-1/2 top-0 h-full w-full -translate-x-1/2 rounded-full bg-blue-600/5 blur-[120px]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Keahlian & <span className="text-blue-500">Teknologi</span>
          </h2>
          <div className="mx-auto mb-6 h-1 w-16 rounded-full bg-blue-600" />
          <p className="mx-auto max-w-2xl px-2 text-sm leading-relaxed text-slate-400 md:text-lg">
            Dari ide hingga produk siap digunakan, saya memadukan teknologi yang tepat untuk membangun solusi digital yang berdampak.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 md:gap-6">
          {Array.from(groupedSkills).map(([category, categorySkills], index) => (
            <article key={category} className="group relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/50 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-blue-950/30 md:p-7">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-blue-600/10 blur-3xl" />
              <div className="relative">
                <div className="mb-5 flex items-start justify-between gap-4">
                  <div>
                    <span className="mb-2 block font-mono text-xs font-bold tracking-widest text-blue-500">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="text-lg font-bold text-white md:text-xl">{category}</h3>
                  </div>
                  <span className="rounded-full border border-slate-700 bg-slate-950/60 px-3 py-1 text-xs font-semibold text-slate-400">{categorySkills.length} teknologi</span>
                </div>
                <p className="mb-6 max-w-lg text-sm leading-relaxed text-slate-400">
                  {solutionDescriptions[category] ?? "Teknologi pilihan untuk menciptakan solusi digital yang relevan dan efisien."}
                </p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {categorySkills.map((skill) => (
                    <div key={`${category}-${skill.name}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-950/50 p-3 transition-colors group-hover:border-slate-700">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800/80">
                        <img src={skill.logo} alt="" aria-hidden="true" className="h-5 w-5 object-contain" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-bold text-white">{skill.name}</h4>
                        <p className="truncate text-[10px] uppercase tracking-wider text-slate-500">{skill.desc_text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
