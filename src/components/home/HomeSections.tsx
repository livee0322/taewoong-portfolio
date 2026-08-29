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
  ["Design", "서비스 화면, 그래픽, 상세페이지에서 정보의 우선순위를 화면으로 정리합니다.", "Figma · Photoshop · Illustrator"],
  ["Content", "촬영의 포인트를 잡고 썸네일·타이틀·자막으로 영상의 첫인상을 만듭니다.", "Camera workflow · Premiere Pro"],
  ["Commerce", "상품의 특징을 읽고 프로모션, 상세페이지, 쇼핑라이브로 이어지는 흐름을 준비합니다.", "Promotion · Detail page · Shopping Live"],
  ["Service QA", "실제 웹과 앱 화면을 확인하고, 수정이 반복되는 요소는 컴포넌트 기준으로 정리합니다.", "QA checklist · Figma components"],
];

export function HomeSections() {
  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow hero-eyebrow">Designer · Seoul</p>
          <h1 id="hero-title">이태웅</h1>
          <p className="hero-statement">디자인에서 시작해 콘텐츠, 커머스, 서비스 화면까지 경험을 넓혀왔습니다.</p>
        </div>
        <div className="hero-composition">
          <MediaPlaceholder
            className="hero-media hero-media-main"
            priority
            media={{
              src: "/images/selected-works/traffic-safety-motorcycle-thumbnail.jpg",
              alt: "오토바이 옆 인물과 안전 관련 문구가 들어간 교통안전 콘텐츠 썸네일",
              ratio: "wide",
              tone: "sage",
              caption: "유튜브 썸네일",
            }}
          />
          <MediaPlaceholder
            className="hero-media hero-media-detail"
            media={{
              src: "/images/selected-works/tv-purchase-knowhow-thumbnail.jpg",
              alt: "TV 전시장과 진행자 두 명, TV 구매 관련 문구가 들어간 유튜브 썸네일",
              ratio: "portrait",
              tone: "stone",
              caption: "커머스 콘텐츠",
            }}
          />
          <p className="hero-domains">Design · Content · Commerce · Service QA</p>
        </div>
      </section>

      <section id="about" className="identity section page-shell">
        <SectionHeading
          eyebrow="About"
          title="필요한 것을 배우고, 다음 작업에 직접 적용해 왔습니다."
          description="2019년부터 상세페이지, 배너, 프로모션 이미지를 만들며 일을 시작했습니다. 무엇을 판매하고 누구에게 보여야 하는지부터 이해해야 디자인이 실제 결과와 이어진다고 생각해, 촬영·영상·쇼핑라이브·서비스 화면까지 업무 범위를 넓혀왔습니다."
        />
        <div className="identity-layout">
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
          eyebrow="Selected projects"
          title="대표 작업"
          description="LIVBEE에서는 서비스의 흐름과 화면을, 쇼핑라이브 작업에서는 상품을 보여주고 판매를 준비하는 과정을 다룹니다."
        />
        <div className="projects-list">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section id="works" className="selected-works section page-shell">
        <div className="works-heading-row">
          <SectionHeading
            eyebrow="Selected visual works"
            title="분류별 작업"
            description="유튜브 썸네일과 타이틀, 이벤트 그래픽, 쇼핑라이브, 상세페이지 작업을 실제 제작 이미지로 선별했습니다."
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
          title="디자인으로 시작해, 제품과 서비스의 흐름까지."
          description="제품 촬영과 상세페이지에서 시작해 콘텐츠·쇼핑라이브·서비스 출시와 QA까지 경험했습니다. 필요한 일이 생길 때마다 직접 익히고 다음 업무에 활용하며 범위를 넓혀왔습니다."
        />
        <article className="sellerchart-note">
          <p className="eyebrow">GPA KOREA / SellerChart</p>
          <div>
            <h3>셀러차트의 웹·앱을 QA하고, 화면의 기준을 정리합니다.</h3>
            <p>웹과 앱 화면을 확인하며 QA와 디자인 수정을 진행하고, 반복되는 요소는 Figma Auto Layout과 컴포넌트로 정리했습니다.</p>
            <TextLink href="https://msellerchart.com/" target="_blank" rel="noreferrer">셀러차트 보기</TextLink>
          </div>
        </article>
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
          eyebrow="Workflow"
          title="결과물이 실제로 작동하는지까지 확인합니다."
          description="디자인을 만들고, 촬영·영상·상품·서비스 화면으로 이어진 결과를 확인합니다. 필요한 도구는 일의 목적에 맞춰 익히고 적용합니다."
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
          <h2>다음 작업을 함께 이야기해 주세요.</h2>
          <div>
            <p>프로젝트와 이력의 맥락이 더 궁금하다면 대표 사례와 작업 이미지를 먼저 확인해 주세요. 연락처와 이력서 공개 범위는 최종 확인 후 연결하겠습니다.</p>
            <TextLink href="/projects/livbee">LIVBEE 사례 보기</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}
