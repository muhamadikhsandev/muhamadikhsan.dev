import { ProjectItem } from './types';

export const getTechStack = (project: ProjectItem): string[] => {
  if (!project?.tech_stack) return [];

  if (Array.isArray(project.tech_stack)) {
    return project.tech_stack.filter(Boolean).map(String);
  }

  return project.tech_stack
    .split(',')
    .map((tech) => tech.trim())
    .filter(Boolean);
};

export const hasValidUrl = (url?: string | null): url is string => (
  Boolean(url && url !== 'null' && url !== '#')
);
