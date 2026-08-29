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
          <h2 id="gallery-title">{project.slug === "livbee" ? "같은 화면을, 크기에 맞게 다시 설계했습니다." : "준비부터 현장까지 이어진 작업입니다."}</h2>
          {project.slug === "livbee" ? (
            <p className="gallery-note">PC 화면을 단순히 줄이지 않고 정보의 순서와 탐색 방식을 모바일 폭에 맞게 재배치했습니다. Main과 Community를 같은 화면끼리 비교할 수 있습니다.</p>
          ) : null}
        </div>
        {project.slug === "livbee" ? (
          <div className="responsive-pairs">
            <article className="responsive-pair" data-reveal>
              <div className="responsive-pair-copy"><p className="eyebrow">01 / Main</p><h3>넓은 탐색 화면과 한 손의 탐색 흐름</h3><p>데스크톱의 좌측 탐색과 넓은 콘텐츠 영역을, 모바일에서는 상단 정보와 하단 내비게이션 중심으로 다시 배치했습니다.</p></div>
              <figure className="pair-desktop"><MediaPlaceholder media={project.hero} /><figcaption>Main · Desktop</figcaption></figure>
              <figure className="pair-mobile"><MediaPlaceholder media={project.gallery[1]} /><figcaption>Main · Mobile</figcaption></figure>
            </article>
            <article className="responsive-pair responsive-pair-reverse" data-reveal>
              <div className="responsive-pair-copy"><p className="eyebrow">02 / Community</p><h3>목록의 밀도는 유지하고, 조작은 단순하게</h3><p>게시글 구조와 카테고리 맥락은 유지하면서 모바일에서는 검색과 탐색 요소가 화면을 가리지 않도록 정리했습니다.</p></div>
              <figure className="pair-desktop"><MediaPlaceholder media={project.gallery[0]} /><figcaption>Community · Desktop</figcaption></figure>
              <figure className="pair-mobile"><MediaPlaceholder media={project.gallery[2]} /><figcaption>Community · Mobile</figcaption></figure>
            </article>
          </div>
        ) : (
          <div className="project-gallery-grid">
            {project.gallery.map((media) => (
              <figure className="project-gallery-item" data-reveal key={media.caption}>
                <MediaPlaceholder media={media} />
                <figcaption>{media.caption}</figcaption>
                {media.ratio === "detail" && media.src ? (
                  <a className="detail-view-link" href={media.src} target="_blank" rel="noreferrer">
                    원본 전체 보기 ↗
                  </a>
                ) : null}
              </figure>
            ))}
          </div>
        )}
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
