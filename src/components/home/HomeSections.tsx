import { careerEntries } from "@/data/career";
import { projects } from "@/data/projects";
import { visualWorks } from "@/data/works";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

const capabilities = [
  ["01", "Design", "UI/UX · Graphic · Artwork"],
  ["02", "Content", "촬영 기획 · 영상 · YouTube"],
  ["03", "Commerce", "상품 · Promotion · Shopping Live"],
  ["04", "Planning", "서비스 구조 · 기능 정의 · UX Flow"],
  ["05", "Product", "구현 협업 · Browser QA · Iteration"],
];

const workflow = [
  ["Design", "화면과 정보의 우선순위를 시각 언어로 정리합니다.", "Figma · Photoshop · Illustrator · Premiere Pro"],
  ["Work system", "일의 맥락, 범위, 다음 결정을 문서에서 이어갑니다.", "Asana · Obsidian"],
  ["AI workflow", "IDEA → PLAN → BUILD → REVIEW → QA로 구현을 검토합니다.", "ChatGPT · Claude · Codex"],
  ["Shipping", "변경 단위를 기록하고 실제 브라우저에서 결과를 확인합니다.", "GitHub · Vercel"],
];

export function HomeSections() {
  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Independent practitioner · Seoul</p>
          <h1 id="hero-title">LEE TAE WOONG</h1>
          <p className="hero-statement">디자인에서 시작해 기획하고, 만들고, 실제 결과까지 가져갑니다.</p>
        </div>
        <div className="hero-composition">
          <MediaPlaceholder
            className="hero-media hero-media-main"
            priority
            media={{
              src: "/images/selected-works/live-commerce-banner.jpg",
              alt: "자연 풍경과 디지털 기기를 배경으로 구성된 쇼핑라이브 런칭 배너",
              ratio: "wide",
              tone: "ink",
              caption: "Live commerce",
            }}
          />
          <MediaPlaceholder
            className="hero-media hero-media-detail"
            media={{
              src: "/images/selected-works/ocean-content-thumbnail.jpg",
              alt: "잠수부와 바다 풍경이 보이는 수중 콘텐츠 썸네일",
              ratio: "portrait",
              tone: "sage",
              caption: "Content",
            }}
          />
          <p className="hero-domains">Planning · Design · Content · Commerce · Product</p>
        </div>
      </section>

      <section id="about" className="identity section page-shell">
        <SectionHeading
          eyebrow="About / Identity"
          title="한 장면을 만들고, 그 장면이 실제로 작동할 때까지 봅니다."
          description="디자인으로 커리어를 시작했습니다. 이후 제품, 촬영, 영상, 콘텐츠, 쇼핑라이브, 서비스 기획과 개발 협업을 직접 경험하며 필요한 역할을 넓혀왔습니다."
        />
        <div className="identity-layout">
          <MediaPlaceholder
            media={{
              src: "/images/selected-works/ocean-content-title.jpg",
              alt: "해양 현장 콘텐츠의 제목과 바다 아이콘으로 구성된 타이틀 그래픽",
              ratio: "portrait",
              tone: "paper",
              caption: "Content title",
            }}
          />
          <div className="capability-list">
            {capabilities.map(([number, title, description]) => (
              <article key={title} className="capability-item">
                <p className="eyebrow">{number}</p>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="selected-projects section page-shell">
        <SectionHeading
          eyebrow="Selected projects"
          title="작업부터 봅니다."
          description="무엇을 할 수 있는지 한눈에 보이도록 대표 사례만 깊게 둡니다. LIVBEE는 서비스의 판단과 화면을, 쇼핑라이브는 판매 장면을 만드는 실무를 보여줍니다."
        />
        <div className="projects-list">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section id="works" className="selected-works section page-shell">
        <div className="works-heading-row">
          <SectionHeading
            eyebrow="Selected visual works"
            title="결과로 남은 장면들."
            description="라이브커머스, 캠페인, 상세페이지, 영상 콘텐츠에서 실제로 사용한 이미지와 그래픽을 선별했습니다."
          />
          <TextLink href="/works">All visual works</TextLink>
        </div>
        <div className="works-masonry">
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
              />
              <div className="work-card-copy">
                <p className="eyebrow">{work.category}</p>
                <h3>{work.title}</h3>
                <p>{work.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="experience" className="career section page-shell">
        <SectionHeading
          eyebrow="Career / Experience"
          title="Design → Content → Commerce → Planning → Product"
          description="회사 이름을 나열하기보다, 어떤 일을 직접 해보며 판단의 범위를 넓혔는지 보여줍니다. 제품 소싱과 GPA App Launch는 과장하지 않고 이 이력의 맥락으로 남깁니다."
        />
        <div className="career-route">
          {capabilities.map(([, title]) => <span key={title}>{title}</span>)}
        </div>
        <ol className="career-list">
          {careerEntries.map((entry) => (
            <li className="career-item" key={`${entry.period}-${entry.company}`}>
              <p className="career-period">{entry.period}</p>
              <div className="career-company"><h3>{entry.company}</h3><p>{entry.team}</p></div>
              <div className="career-detail"><p className="career-role">{entry.role}</p><p>{entry.description}</p></div>
            </li>
          ))}
          <li className="career-item career-item-personal">
            <p className="career-period">Personal project</p>
            <div className="career-company"><h3>LIVBEE</h3><p>Product</p></div>
            <div className="career-detail"><p className="career-role">서비스 기획 / UX UI / AI Workflow / Browser QA / Project Management</p><p>쇼핑라이브 매칭의 문제를 서비스 흐름으로 바꾸고, 실제 화면의 구현 결과를 검토하는 개인 프로젝트입니다.</p></div>
          </li>
        </ol>
      </section>

      <section className="workflow section page-shell">
        <SectionHeading
          eyebrow="Tools / Workflow"
          title="도구는 앞세우지 않고, 일의 흐름 안에 둡니다."
          description="작업의 목적과 판단 기준을 먼저 맞춘 뒤 그에 맞는 제작 도구, 협업 도구, 검토 도구를 사용합니다."
        />
        <div className="workflow-list">
          {workflow.map(([area, work, tools]) => (
            <article className="workflow-item" key={area}>
              <h3>{area}</h3>
              <p>{work}</p>
              <p className="workflow-tools">{tools}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="contact section page-shell">
        <p className="eyebrow">Contact</p>
        <div className="contact-layout">
          <h2>다음 결과를 함께 만들 준비가 되어 있습니다.</h2>
          <div>
            <p>프로젝트와 이력의 맥락이 더 궁금하다면, 대표 사례와 작업 이미지를 먼저 확인해 주세요. 연락처와 이력서 공개 범위는 최종 확인 후 연결합니다.</p>
            <TextLink href="/projects/livbee">LIVBEE 사례 보기</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}
