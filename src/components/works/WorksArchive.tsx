"use client";

import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkTitle } from "@/components/ui/WorkTitle";
import { usePortfolioContent } from "@/content/ContentProvider";

export function WorksArchive() {
  const content = usePortfolioContent();
  const groups = content.categories
    .filter((category) => category.visible)
    .map((category) => ({ category, works: content.works.filter((work) => work.published && work.category === category.label) }))
    .filter(({ works }) => works.length > 0);
  return (
    <main className="works-page page-shell" data-cms-section="works.archive">
      <section className="works-page-hero"><SectionHeading eyebrow="작업 모음" title="이미지로 보는 작업들" description="유튜브 썸네일과 영상 자막, 배너와 편집물 등 직접 제작한 작업을 유형별로 모았습니다." as="h1" /></section>
      <nav className="archive-index" aria-label="작업 유형 바로가기">
        {groups.map(({ category, works }) => <a key={category.id} href={`#works-${category.id}`}>{category.label}<span>{works.length}</span></a>)}
      </nav>
      <section className="works-categories" aria-label="카테고리별 선별 작업">
        {groups.map(({ category, works: categoryWorks }, categoryIndex) => {
          return <section className={`works-category works-category-${category.frame}`} key={category.id} id={`works-${category.id}`} aria-labelledby={`category-${categoryIndex}`}>
            <div className="works-category-heading"><p className="eyebrow">{String(categoryIndex + 1).padStart(2, "0")}</p><h2 id={`category-${categoryIndex}`}>{category.label}</h2></div>
            <div className="works-category-grid" tabIndex={0} role="region" aria-label={`${category.label} 갤러리`}>{categoryWorks.map((work, workIndex) => <article className={`work-card work-${work.ratio}`} data-reveal key={work.id}>
              <MediaPlaceholder media={{ src: work.src, alt: work.alt, tone: work.tone, ratio: work.ratio, caption: work.caption ?? work.category, focus: work.focus }} priority={categoryIndex === 0 && workIndex < 2} />
              <div className="work-card-copy"><h3><WorkTitle title={work.title} /></h3>{work.description ? <p className="work-card-description">{work.description}</p> : null}{work.ratio === "detail" ? <a className="detail-view-link" href={work.src} target="_blank" rel="noreferrer">원본 전체 보기 ↗</a> : null}</div>
            </article>)}</div>
          </section>;
        })}
      </section>
    </main>
  );
}
