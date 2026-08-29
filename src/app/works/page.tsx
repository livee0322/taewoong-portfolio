import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { visualWorks } from "@/data/works";

const workCategories = ["유튜브 썸네일", "자막·타이틀 디자인", "이벤트 배너", "쇼핑라이브 콘텐츠", "상세페이지"];

export default function WorksPage() {
  return (
    <main className="works-page page-shell">
      <section className="works-page-hero">
        <SectionHeading
          eyebrow="작업 모음"
          title="매체가 달라져도, 먼저 보여야 할 것을 정리했습니다."
          description="영상의 첫 장면, 이벤트 참여 방법, 상품의 장점처럼 각 작업에서 가장 먼저 읽혀야 할 정보를 화면으로 만들었습니다. 공개 가능한 실무 결과물만 골랐습니다."
          as="h1"
        />
      </section>
      <section className="works-categories" aria-label="카테고리별 선별 작업">
        {workCategories.map((category) => {
          const categoryWorks = visualWorks.filter((work) => work.category === category);
          if (categoryWorks.length === 0) return null;
          return (
            <section className="works-category" key={category} aria-labelledby={`category-${category}`}>
              <div className="works-category-heading">
                <p className="eyebrow">{String(workCategories.indexOf(category) + 1).padStart(2, "0")}</p>
                <h2 id={`category-${category}`}>{category}</h2>
                <p>{categoryWorks.length}개의 선별 작업</p>
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
                      priority={work.id === "tv-purchase-thumbnail" || work.id === "traffic-safety-thumbnail"}
                    />
                    <div className="work-card-copy">
                      <h3>{work.title}</h3>
                      <p>{work.description}</p>
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
