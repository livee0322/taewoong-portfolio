import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { WorkTitle } from "@/components/ui/WorkTitle";
import { visualWorks } from "@/data/works";

const workCategories = [
  { name: "유튜브 썸네일", frame: "video" },
  { name: "자막·타이틀 디자인", frame: "video" },
  { name: "이벤트 배너", frame: "square" },
  { name: "쇼핑라이브 콘텐츠", frame: "video" },
  { name: "상세페이지", frame: "detail" },
] as const;

export default function WorksPage() {
  return (
    <main className="works-page page-shell">
      <section className="works-page-hero">
        <SectionHeading
          eyebrow="작업 모음"
          title="실무에서 만든 작업을 모았습니다."
          description="유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 콘텐츠, 상세페이지 중 공개 가능한 작업을 선별했습니다."
          as="h1"
        />
      </section>
      <section className="works-categories" aria-label="카테고리별 선별 작업">
        {workCategories.map((category, categoryIndex) => {
          const categoryWorks = visualWorks.filter((work) => work.category === category.name);
          if (categoryWorks.length === 0) return null;
          return (
            <section className={`works-category works-category-${category.frame}`} key={category.name} aria-labelledby={`category-${categoryIndex}`}>
              <div className="works-category-heading">
                <p className="eyebrow">{String(categoryIndex + 1).padStart(2, "0")}</p>
                <h2 id={`category-${categoryIndex}`}>{category.name}</h2>
              </div>
              <div className="works-category-grid">
                {categoryWorks.map((work) => (
                  <article className={`work-card work-${work.ratio}`} data-reveal key={work.id}>
                    <MediaPlaceholder
                      media={{
                        src: work.src,
                        alt: work.alt,
                        tone: work.tone,
                        ratio: work.ratio,
                        caption: work.category,
                      }}
                      priority={work.id === "ocean-content-thumbnail" || work.id === "traffic-safety-thumbnail"}
                    />
                    <div className="work-card-copy">
                      <h3><WorkTitle title={work.title} /></h3>
                      {work.description ? <p className="work-card-description">{work.description}</p> : null}
                      {work.ratio === "detail" ? (
                        <a className="detail-view-link" href={work.src} target="_blank" rel="noreferrer">
                          원본 전체 보기 ↗
                        </a>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </section>
    </main>
  );
}
