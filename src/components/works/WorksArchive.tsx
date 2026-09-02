"use client";

import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkTitle } from "@/components/ui/WorkTitle";
import { usePortfolioContent } from "@/content/ContentProvider";

export function WorksArchive() {
  const content = usePortfolioContent();
  return (
    <main className="works-page page-shell" data-cms-section="works.archive">
      <section className="works-page-hero"><SectionHeading eyebrow="작업 모음" title="실무에서 만든 작업을 모았습니다." description="유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 콘텐츠, 상세페이지 중 공개 가능한 작업을 선별했습니다." as="h1" /></section>
      <section className="works-categories" aria-label="카테고리별 선별 작업">
        {content.categories.filter((category) => category.visible).map((category, categoryIndex) => {
          const categoryWorks = content.works.filter((work) => work.published && work.category === category.label);
          if (!categoryWorks.length) return null;
          return <section className={`works-category works-category-${category.frame}`} key={category.id} aria-labelledby={`category-${categoryIndex}`}>
            <div className="works-category-heading"><p className="eyebrow">{String(categoryIndex + 1).padStart(2, "0")}</p><h2 id={`category-${categoryIndex}`}>{category.label}</h2></div>
            <div className="works-category-grid">{categoryWorks.map((work, workIndex) => <article className={`work-card work-${work.ratio}`} data-reveal key={work.id}>
              <MediaPlaceholder media={{ src: work.src, alt: work.alt, tone: work.tone, ratio: work.ratio, caption: work.caption ?? work.category, focus: work.focus }} priority={categoryIndex === 0 && workIndex < 2} />
              <div className="work-card-copy"><h3><WorkTitle title={work.title} /></h3>{work.description ? <p className="work-card-description">{work.description}</p> : null}{work.ratio === "detail" ? <a className="detail-view-link" href={work.src} target="_blank" rel="noreferrer">원본 전체 보기 ↗</a> : null}</div>
            </article>)}</div>
          </section>;
        })}
      </section>
    </main>
  );
}
