import type { Project } from "@/types/content";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import styles from "./ProjectCard.module.css";

type ProjectCardProps = {
  project: Project;
};

const LIVBEE_URL = "https://www.livbee.co.kr/?utm_source=portfolio&utm_medium=referral&utm_campaign=taewoong_portfolio&utm_content=livbee_project";

function ExternalLinkIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M5.25 10.75 10.75 5.25M6.25 5.25h4.5v4.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10.25 8.75v2.5a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4a1.5 1.5 0 0 1 1.5-1.5h2.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
            className={styles.livbeeMediaLink}
            href={LIVBEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LIVBEE 서비스로 이동 (새 탭)"
          >
            {media}
            <span className={styles.mediaCta} aria-hidden="true">
              LIVBEE 바로가기
              <ExternalLinkIcon />
            </span>
          </a>
        ) : media}
      </div>
      <div className="project-card-meta">
        <p className="eyebrow">{project.number} / {project.category}</p>
        {isLivbee ? (
          <div className={styles.titleRow}>
            <h3>{project.title}</h3>
            <a
              className={styles.titleLink}
              href={LIVBEE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LIVBEE 서비스로 이동 (새 탭)"
              title="LIVBEE 바로가기"
            >
              <ExternalLinkIcon />
            </a>
          </div>
        ) : (
          <h3>{project.title}</h3>
        )}
        <p className="project-card-summary">{project.summary}</p>
        <ul className="project-card-tags" aria-label={`${project.title} 역할`}>
          {project.roles.slice(0, 3).map((role) => <li key={role}>{role}</li>)}
        </ul>
      </div>
    </article>
  );
}
