import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { visualWorks } from "@/data/works";

export default function WorksPage() {
  return (
    <main className="works-page page-shell">
      <section className="works-page-hero">
        <SectionHeading
          eyebrow="Selected visual works"
          title="디자인 작업의 장면들."
          description="작업 유형을 계속 분리하지 않고, 실제 프로젝트를 보완하는 시각 작업을 한 흐름으로 보여줍니다."
          as="h1"
        />
      </section>
      <section className="works-masonry works-masonry-full" aria-label="선별된 비주얼 작업">
        {visualWorks.map((work) => (
          <article className={`work-card work-${work.ratio}`} key={work.id}>
            <MediaPlaceholder media={{ tone: work.tone, ratio: work.ratio, title: work.category, description: `${work.category}: ${work.title}` }} />
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
