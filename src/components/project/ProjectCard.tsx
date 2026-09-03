import Link from "next/link";
import type { Project } from "@/types/content";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <Link className="project-card-media" href={project.detailPageUrl} aria-label={`${project.title} 프로젝트 보기`}>
        <MediaPlaceholder media={project.thumbnail} priority={project.sortOrder === 1} />
      </Link>
      <div className="project-card-meta">
        <p className="eyebrow">{project.number} / {project.category}</p>
        <h3>{project.title}</h3>
        <p className="project-card-summary">{project.summary}</p>
        <ul className="project-card-tags" aria-label={`${project.title} 역할`}>
          {project.roles.slice(0, 3).map((role) => <li key={role}>{role}</li>)}
        </ul>
        <Link href={project.detailPageUrl} aria-label={`${project.title} 프로젝트 보기`} className="project-card-cta">
          프로젝트 보기 <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
