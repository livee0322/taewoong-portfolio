import Link from "next/link";
import type { Project } from "@/types/content";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="project-card">
      <Link className="project-card-media" href={`/projects/${project.slug}`} aria-label={`${project.title} 프로젝트 보기`}>
        <MediaPlaceholder media={project.hero} priority={project.number === "01"} />
      </Link>
      <div className="project-card-meta">
        <p className="eyebrow">{project.number} / {project.type}</p>
        <div className="project-card-title-row">
          <h3>{project.title}</h3>
          <Link href={`/projects/${project.slug}`} aria-label={`${project.title} 프로젝트 보기`} className="round-link">
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <p className="project-card-subtitle">{project.subtitle}</p>
        <p className="project-card-summary">{project.summary}</p>
        <ul className="project-card-tags" aria-label={`${project.title} 역할`}>
          {project.roles.slice(0, 3).map((role) => <li key={role}>{role}</li>)}
        </ul>
      </div>
    </article>
  );
}
