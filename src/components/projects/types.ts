export interface ProjectItem {
  id?: number;
  title: string;
  description: string;
  tech_stack: string[] | string | null | undefined;
  banner_url?: string | null;
  demo_url?: string | null;
  github_url?: string | null;
}

export interface ProjectsProps {
  data: ProjectItem[];
}
