import { careerEntries } from "@/data/career";
import { projects } from "@/data/projects";
import { visualWorks } from "@/data/works";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

const capabilities = [
  ["01", "Design", "UI/UX · 그래픽 · 상세페이지"],
  ["02", "Content", "촬영 기획 · YouTube 썸네일 · 타이틀/자막"],
  ["03", "Commerce", "상품 정보 · 프로모션 · 쇼핑라이브"],
  ["04", "Service QA", "웹·앱 QA · 디자인 수정 · Figma 컴포넌트"],
];

const workflow = [
  ["Design", "서비스 화면, 그래픽, 상세페이지에서 정보의 우선순위를 화면으로 정리했습니다.", "Figma · Photoshop · Illustrator"],
  ["Content", "촬영의 포인트를 잡고 썸네일·타이틀·자막으로 영상의 첫인상을 만들었습니다.", "Camera workflow · Premiere Pro"],
  ["Commerce", "상품의 특징을 읽고 프로모션, 상세페이지, 쇼핑라이브로 이어지는 흐름을 준비했습니다.", "Promotion · Detail page · Shopping Live"],
  ["Service QA", "실제 웹과 앱 화면을 확인하고, 수정이 반복되는 요소는 컴포넌트 기준으로 정리했습니다.", "QA checklist · Figma components"],
];

const featuredWork = visualWorks.find((work) => work.id === "ocean-content-thumbnail") ?? visualWorks[0];
const reelWorks = visualWorks.filter((work) => work.id !== featuredWork.id && work.ratio !== "detail").slice(0, 6);

export function HomeSections() {
  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow" data-reveal>이태웅 · 디자이너</p>
          <h1 id="hero-title" data-reveal>디자인에서 시작해,<br />일의 다음 단계까지 왔습니다.</h1>
          <p className="hero-statement" data-reveal>상세페이지와 배너를 만들던 디자이너로 시작해 촬영·영상·쇼핑라이브·서비스 기획과 QA까지 맡았습니다. 필요한 일이 생길 때마다 직접 해보며 범위를 넓혔습니다.</p>
          <div className="hero-intro-note">
            <p>2019 — NOW</p>
            <p>Design · Content · Commerce · Product</p>
          </div>
        </div>
      </section>

      <section id="about" className="identity section page-shell">
        <SectionHeading
          eyebrow="About"
          title="한 장의 디자인만 만들지 않았습니다."
          description="제품을 촬영하고 상세페이지를 만든 뒤, 같은 상품의 배너와 영상을 제작하고 쇼핑라이브 현장까지 맡았습니다. 최근에는 웹·앱 화면을 QA하고 Figma 컴포넌트를 정리하며, 개인 프로젝트 LIVBEE의 기획과 구현 검토를 이어가고 있습니다."
        />
        <div className="identity-layout" data-reveal>
          <MediaPlaceholder
            media={{
              src: "/images/selected-works/traffic-safety-title.jpg",
              alt: "도로 위 차량 장면과 생활권 안심도로 문구가 있는 영상 타이틀 그래픽",
              ratio: "wide",
              tone: "sand",
              caption: "영상 타이틀",
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
          eyebrow="대표 프로젝트"
          title="화면과 현장, 두 가지 방식으로 일했습니다."
          description="LIVBEE에서는 서비스 흐름과 반응형 화면을 설계하고 검토했습니다. 쇼핑라이브에서는 상품의 포인트를 찾고, 촬영·콘텐츠·방송 준비까지 연결했습니다."
        />
        <div className="projects-list">
          {projects.map((project) => <div data-reveal key={project.slug}><ProjectCard project={project} /></div>)}
        </div>
        <article className="representative-note">
          <p className="eyebrow">GPA KOREA / SellerChart</p>
          <div>
            <h3>셀러차트 웹·앱의 어색한 화면을 찾고, 반복되는 UI를 정리했습니다.</h3>
            <p>실제 화면을 QA하며 디자인 수정 사항을 반영했습니다. 자주 쓰이는 요소는 Figma Auto Layout과 컴포넌트로 묶었습니다.</p>
            <TextLink href="https://msellerchart.com/" target="_blank" rel="noreferrer">셀러차트 보기</TextLink>
          </div>
        </article>
      </section>

      <section id="works" className="selected-works section page-shell">
        <div className="works-heading-row">
          <SectionHeading
            eyebrow="작업 모음"
            title="설명보다 작업을 먼저 보여드립니다."
            description="유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 배너, 상세페이지 중 공개 가능한 결과물을 골랐습니다."
          />
          <TextLink href="/works">작업 전체 보기</TextLink>
        </div>
        <div className="work-showcase">
          <article className="featured-work" data-reveal>
            <MediaPlaceholder media={{ src: featuredWork.src, alt: featuredWork.alt, tone: featuredWork.tone, ratio: featuredWork.ratio, caption: featuredWork.category }} />
            <div className="featured-work-copy">
              <p className="eyebrow">{featuredWork.category}</p>
              <h3>{featuredWork.title}</h3>
              <p>{featuredWork.description}</p>
            </div>
          </article>
          <div className="work-reel" aria-label="추가 작업 가로 갤러리">
            {reelWorks.map((work) => (
              <article className="reel-card" data-reveal key={work.id}>
                <MediaPlaceholder media={{ src: work.src, alt: work.alt, tone: work.tone, ratio: work.ratio, caption: work.category }} />
                <p className="eyebrow">{work.category}</p>
                <h3>{work.title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="experience" className="career section page-shell">
        <SectionHeading
          eyebrow="경력"
          title="만드는 범위가 넓어진 만큼, 보는 기준도 달라졌습니다."
          description="제품 이미지 한 장을 만들던 일에서 출발해 영상과 판매 현장, 웹·앱 화면까지 확인하게 됐습니다. 아래는 그 범위가 넓어진 순서입니다."
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
          eyebrow="작업 방식"
          title="필요한 일을 파악하고, 끝까지 확인합니다."
          description="먼저 목적과 보여줄 정보를 정리합니다. 직접 만들거나 협업으로 구현한 뒤에는 실제 화면과 현장에서 빠진 부분이 없는지 다시 봅니다."
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
          <h2>제가 해온 일이<br />필요한 팀을 찾고 있습니다.</h2>
          <div>
            <p>디자인만 맡는 사람보다, 콘텐츠와 운영까지 함께 이해하는 사람이 필요하다면 포트폴리오의 작업과 경력을 더 살펴봐 주세요.</p>
            <TextLink href="/works">작업 모음 보기</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}
