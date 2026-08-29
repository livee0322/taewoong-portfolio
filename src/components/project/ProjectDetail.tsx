import { projectBySlug, projects } from "@/data/projects";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { TextLink } from "@/components/ui/TextLink";
import { notFound } from "next/navigation";

type ProjectDetailProps = {
  slug: string;
};

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const project = projectBySlug(slug);

  if (!project) notFound();

  const currentIndex = projects.findIndex((item) => item.slug === project.slug);
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <main>
      <section className="project-hero page-shell">
        <div className="project-hero-intro">
          <p className="eyebrow">{project.number} / {project.type} / {project.year}</p>
          <h1>{project.title}</h1>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-summary">{project.summary}</p>
        </div>
        <MediaPlaceholder media={project.hero} priority className="project-hero-media" />
      </section>

      <section className="project-overview section page-shell">
        <div className="overview-lead">
          <p className="eyebrow">Overview</p>
          <p>{project.intro}</p>
        </div>
        <dl className="project-facts">
          <div><dt>Role</dt><dd>{project.roles.join(" / ")}</dd></div>
          <div><dt>Tools</dt><dd>{project.tools.join(" / ")}</dd></div>
          <div><dt>Type</dt><dd>{project.type}</dd></div>
        </dl>
      </section>

      <section className="project-story section page-shell">
        {project.sections.map((section, index) => (
          <article className="story-section" key={section.label}>
            <div>
              <p className="eyebrow">{String(index + 1).padStart(2, "0")} / {section.label}</p>
            </div>
            <div>
              <h2>{section.title}</h2>
              <p>{section.body}</p>
              {section.items ? (
                <ul className="detail-list">
                  {section.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <section className="project-gallery page-shell section" aria-labelledby="gallery-title">
        <div className="gallery-heading">
          <p className="eyebrow">Selected material</p>
          <h2 id="gallery-title">실제 화면과 선별한 작업 장면.</h2>
        </div>
        <div className="project-gallery-grid">
          {project.gallery.map((media) => <MediaPlaceholder key={media.caption} media={media} />)}
        </div>
        {project.liveUrl ? (
          <TextLink className="project-live-link" href={project.liveUrl} target="_blank" rel="noreferrer">
            LIVBEE 방문하기
          </TextLink>
        ) : null}
      </section>

      <section className="next-project page-shell section">
        <p className="eyebrow">Next project</p>
        <TextLink href={`/projects/${nextProject.slug}`} className="next-project-link">
          {nextProject.number} — {nextProject.title}
        </TextLink>
      </section>
    </main>
  );
}
