import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { visualWorks } from "@/data/works";

export default function WorksPage() {
  return (
    <main className="works-page page-shell">
      <section className="works-page-hero">
        <SectionHeading
          eyebrow="작업 모음"
          title="작업 모음"
          description="유튜브 썸네일과 타이틀, 이벤트 그래픽, 쇼핑라이브, 상세페이지. 이전 포트폴리오의 분류 기준에 맞춰 실제 제작 이미지를 다시 선별했습니다."
          as="h1"
        />
      </section>
      <section className="works-masonry works-masonry-full" aria-label="선별된 비주얼 작업">
        {visualWorks.map((work) => (
          <article className={`work-card work-${work.ratio}`} key={work.id}>
            <MediaPlaceholder
              media={{
                src: work.src,
                alt: work.alt,
                tone: work.tone,
                ratio: work.ratio,
                caption: work.category,
              }}
              priority={work.id === "traffic-safety-title"}
            />
            <div className="work-card-copy">
              <p className="eyebrow">{work.category}</p>
              <h2>{work.title}</h2>
              <p>{work.description}</p>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
