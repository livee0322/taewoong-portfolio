"use client";

import { usePortfolioContent } from "@/content/ContentProvider";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";
import { WorkTitle } from "@/components/ui/WorkTitle";

function Lines({ value, manual = true }: { value: string; manual?: boolean }) {
  const lines = value.split("\n");
  if (!manual) return <>{value.replace(/\n/g, " ")}</>;
  return <>{lines.map((line, index) => <span key={`${line}-${index}`}>{line}{index < lines.length - 1 ? <br /> : null}</span>)}</>;
}

export function HomeSections() {
  const content = usePortfolioContent();
  const { home } = content;
  const capabilities = home.about.capabilities.filter((item) => item.visible);
  const featuredWork = content.works.find((work) => work.published && work.showOnHome && work.homeFeatured)
    ?? content.works.find((work) => work.published && work.showOnHome)
    ?? content.works[0];
  const homeWorkGroups = content.categories
    .filter((category) => category.visible)
    .map((category) => ({
      category,
      works: content.works.filter((work) => work.published && work.showOnHome && work.id !== featuredWork?.id && work.category === category.label),
    }))
    .filter((group) => group.works.length > 0);
  const homeProjects = content.projects
    .filter((project) => project.visible && project.showOnHome)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const [name, role] = home.hero.eyebrow.split("·").map((part) => part.trim());

  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="hero-title" data-cms-section="home.hero">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow" data-reveal>{home.hero.eyebrow}</p>
          <h1 id="hero-title" data-reveal><Lines value={home.hero.title} manual={home.hero.lineBreaks === "manual"} /></h1>
          <p className="hero-statement" data-reveal>{home.hero.description}</p>
          <div className="hero-intro-note"><p>{home.hero.period}</p><p>{home.hero.disciplines}</p></div>
        </div>
      </section>

      <section id="about" className="identity section page-shell" data-cms-section="home.about">
        <SectionHeading eyebrow={home.about.eyebrow} title={home.about.title} description={home.about.description} />
        <div className="identity-layout" data-reveal>
          <div className="capability-list">
            {capabilities.map((item, index) => <article key={item.id} className="capability-item"><p className="eyebrow">{String(index + 1).padStart(2, "0")}</p><h3>{item.title}</h3><p>{item.description}</p></article>)}
          </div>
        </div>
      </section>

      <section id="projects" className="selected-projects section page-shell" data-cms-section="home.projects">
        <SectionHeading eyebrow={home.projects.eyebrow} title={home.projects.title} description={home.projects.description} />
        <div className="projects-list">{homeProjects.map((project) => <div data-reveal key={project.id}><ProjectCard project={project} /></div>)}</div>
      </section>

      <section id="experience" className="career section page-shell" data-cms-section="home.career">
        <SectionHeading eyebrow={home.career.eyebrow} title={home.career.title} description={home.career.description} />
        <div className="career-route">{capabilities.map((item) => <span key={item.id}>{item.title}</span>)}</div>
        <ol className="career-list">{content.career.filter((entry) => entry.visible).map((entry) => <li className={`career-item${entry.entryType === "personal-project" ? " career-item-personal" : ""}`} key={entry.id}><p className="career-period">{entry.period}</p><div className="career-company"><h3>{entry.company}</h3><p>{entry.team}</p></div><div className="career-detail"><p className="career-role">{entry.role}</p><p>{entry.description}</p></div></li>)}</ol>
      </section>

      <section id="workflow" className="workflow section page-shell" data-cms-section="home.workflow">
        <SectionHeading eyebrow={home.workflow.eyebrow} title={home.workflow.title} description={home.workflow.description} />
        <div className="workflow-list">{content.workflow.filter((item) => item.visible).map((item) => <article className="workflow-item" key={item.id}><h3>{item.title}</h3><p>{item.description}</p><p className="workflow-tools">{item.tools.join(" · ")}</p></article>)}</div>
      </section>

      <section id="works" className="selected-works section page-shell" data-cms-section="home.works">
        <div className="works-heading-row"><SectionHeading eyebrow={home.works.eyebrow} title={home.works.title} description={home.works.description} /></div>
        {featuredWork ? <div className="work-showcase">
          <article className="featured-work" data-reveal>
            <MediaPlaceholder media={{ src: featuredWork.src, alt: featuredWork.alt, tone: featuredWork.tone, ratio: featuredWork.ratio, caption: featuredWork.caption ?? featuredWork.category, focus: featuredWork.focus }} />
            <div className="featured-work-copy"><p className="eyebrow">{featuredWork.category}</p><h3><WorkTitle title={featuredWork.title} /></h3>{featuredWork.description ? <p>{featuredWork.description}</p> : null}</div>
          </article>
          <div className="home-work-groups">{homeWorkGroups.map(({ category, works }) => <section className="home-work-group" key={category.id} aria-labelledby={`home-work-${category.id}`}>
            <div className="home-work-group-heading"><h3 id={`home-work-${category.id}`}>{category.label}</h3><p>{String(works.length).padStart(2, "0")} selected works</p></div>
            <div className={`work-reel work-reel-${category.frame}`} aria-label={`${category.label} 가로 갤러리`}>{works.map((work) => <article className="reel-card" data-reveal key={work.id}><MediaPlaceholder media={{ src: work.src, alt: work.alt, tone: work.tone, ratio: category.frame === "square" ? "square" : "wide", caption: work.caption ?? work.category, focus: work.focus }} /><p className="eyebrow">{work.category}</p><h4><WorkTitle title={work.title} /></h4></article>)}</div>
          </section>)}</div>
        </div> : null}
        <div className="works-footer-link"><TextLink href="/works">작업 전체 보기</TextLink></div>
      </section>

      <section id="contact" className="contact section page-shell" data-cms-section="home.contact">
        <div className="contact-ending">
          <p className="eyebrow">{home.contact.eyebrow}</p>
          <h2><Lines value={home.contact.title} /></h2>
          <p className="contact-intro">{home.contact.description}</p>
          <div className="contact-card">
            <p className="contact-name">{name}</p>
            {role ? <p className="contact-role">{role}</p> : null}
            {home.contact.email ? <p className="contact-line"><span>Contact</span><a href={`mailto:${home.contact.email}`}>{home.contact.email}</a></p> : null}
          </div>
        </div>
      </section>
    </main>
  );
}
