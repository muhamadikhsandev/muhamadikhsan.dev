import React from 'react';
import { ExternalLink, Github, Image as ImageIcon } from 'lucide-react';
import { getTechStack, hasValidUrl } from './utils';
import { ProjectItem } from './types';

interface ProjectCardProps {
  project: ProjectItem;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const projectTags = getTechStack(project);
  const bannerUrl = project.banner_url;
  const hasBanner = hasValidUrl(bannerUrl);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-900/50 transition-all duration-500 hover:-translate-y-1 hover:border-blue-500/50 hover:bg-slate-900/80 hover:shadow-2xl hover:shadow-blue-950/20">
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-800 bg-slate-950">
        {hasBanner ? (
          <img
            src={bannerUrl}
            alt={project.title}
            className="h-full w-full object-contain p-2 transition-transform duration-700 group-hover:scale-[1.03]"
            onError={(event) => {
              event.currentTarget.style.display = 'none';
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 to-slate-800 text-slate-600">
            <ImageIcon size={32} className="text-slate-700 transition-colors group-hover:text-blue-500/50" />
            <span className="text-xs font-mono">No Project Banner</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#020617]/80 via-transparent to-transparent" />
        {projectTags.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-1.5">
            {projectTags.map((tag) => (
              <span key={tag} className="rounded border border-slate-800/80 bg-slate-950/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-slate-300 backdrop-blur-md">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-grow flex-col justify-between p-6 md:p-8">
        <div>
          <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-blue-400">{project.title}</h3>
          <p className="mb-6 line-clamp-4 text-sm leading-relaxed text-slate-400">{project.description}</p>
        </div>

        <div className="flex min-h-[52px] items-center justify-between border-t border-slate-800/50 pt-6">
          {hasValidUrl(project.demo_url) ? (
            <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-bold text-white transition-colors hover:text-blue-400">
              Live Demo <ExternalLink size={16} />
            </a>
          ) : (
            <span className="text-xs italic text-slate-600">Live demo unavailable</span>
          )}

          {hasValidUrl(project.github_url) && (
            <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`GitHub ${project.title}`} className="rounded-full bg-slate-800 p-2 text-slate-400 transition-all hover:bg-blue-600 hover:text-white">
              <Github size={18} />
            </a>
          )}
        </div>
      </div>
    </article>
  );
};

export default ProjectCard;
