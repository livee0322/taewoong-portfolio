import type { Project } from "@/types/content";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";

type ProjectCardProps = {
  project: Project;
};

const LIVBEE_URL = "https://www.livbee.co.kr/?utm_source=portfolio&utm_medium=referral&utm_campaign=taewoong_portfolio&utm_content=livbee_project";

export function ProjectCard({ project }: ProjectCardProps) {
  const isLivbee = project.slug === "livbee";

  const media = (
    <MediaPlaceholder
      media={project.thumbnail}
      priority={project.sortOrder === 1}
      fit={project.slug === "shopping-live" ? "contain" : undefined}
    />
  );

  return (
    <article className="project-card">
      <div className="project-card-media">
        {isLivbee ? (
          <a
            href={LIVBEE_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="LIVBEE 서비스 새 탭에서 열기"
          >
            {media}
          </a>
        ) : media}
      </div>
      <div className="project-card-meta">
        <p className="eyebrow">{project.number} / {project.category}</p>
        <h3>
          {project.title}
          {isLivbee ? (
            <a
              href={LIVBEE_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="LIVBEE 서비스 새 탭에서 열기"
              title="LIVBEE 바로가기"
            >
              <sup aria-hidden="true">↗</sup>
            </a>
          ) : null}
        </h3>
        <p className="project-card-summary">{project.summary}</p>
        <ul className="project-card-tags" aria-label={`${project.title} 역할`}>
          {project.roles.slice(0, 3).map((role) => <li key={role}>{role}</li>)}
        </ul>
      </div>
    </article>
  );
}
