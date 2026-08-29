import { careerEntries } from "@/data/career";
import { projects } from "@/data/projects";
import { visualWorks } from "@/data/works";
import { ProjectCard } from "@/components/project/ProjectCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TextLink } from "@/components/ui/TextLink";

const capabilities = [
  ["01", "Planning", "서비스 / 제품 / 콘텐츠 기획"],
  ["02", "Design", "UI/UX / Graphic / Artwork"],
  ["03", "Content", "촬영 / 영상 / YouTube"],
  ["04", "Commerce", "상품 / Promotion / Shopping Live"],
];

const workflow = [
  ["Planning / Product", "서비스 기획 · 기능 정의 · UX Flow · QA", "Figma · Asana · Obsidian"],
  ["Design", "UI/UX · Graphic · Artwork", "Figma · Photoshop · Illustrator"],
  ["Content", "촬영 기획 · 영상 편집 · YouTube Content", "Premiere Pro · Camera workflow"],
  ["AI", "Research · Requirement · Development Collaboration · QA", "ChatGPT · Claude · Codex"],
];

export function HomeSections() {
  return (
    <main>
      <section className="home-hero page-shell" aria-labelledby="hero-title">
        <p className="eyebrow hero-eyebrow">Independent practitioner based in Seoul</p>
        <h1 id="hero-title">
          <span>디자인에서 시작해</span>
          <span>기획, 콘텐츠, 커머스까지.</span>
        </h1>
        <div className="hero-bottom">
          <p>필요한 일을 배우고, 실제 결과로 만드는 일을 좋아합니다.</p>
          <p className="hero-domains">Planning · Design · Content · Commerce</p>
        </div>
      </section>

      <section id="about" className="identity section page-shell">
        <SectionHeading
          eyebrow="About / Identity"
          title="저는 디자인만 하는 사람이 아닙니다."
          description="디자인으로 커리어를 시작했지만 제품, 촬영, 영상, 콘텐츠, 쇼핑라이브, 서비스 기획과 개발 협업까지 필요한 역할을 직접 경험하며 업무의 범위를 넓혀왔습니다."
        />
        <div className="identity-layout">
          <MediaPlaceholder media={{ tone: "stone", ratio: "portrait", title: "TAEWOONG LEE", description: "이태웅 프로필 이미지 자리" }} />
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
          title="한 가지 결과물을 넘어, 일이 굴러가는 과정을 다룹니다."
          description="기획, 디자인, 콘텐츠, 커머스가 만나는 대표 사례를 먼저 정리합니다. 실제 기록과 화면은 프로젝트별로 차례로 추가됩니다."
        />
        <div className="projects-list">
          {projects.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section id="works" className="selected-works section page-shell">
        <div className="works-heading-row">
          <SectionHeading
            eyebrow="Selected visual works"
            title="기억에 남는 장면을 만드는 디자인."
            description="YouTube, 프로모션, 상세페이지, 촬영과 영상 작업 중 일부를 선별해 보여줍니다."
          />
          <TextLink href="/works">All visual works</TextLink>
        </div>
        <div className="works-masonry">
          {visualWorks.slice(0, 5).map((work) => (
            <article className={`work-card work-${work.ratio}`} key={work.id}>
              <MediaPlaceholder media={{ tone: work.tone, ratio: work.ratio, title: work.category, description: `${work.category}: ${work.title}` }} />
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
          description="회사 이름을 나열하기보다, 업무의 범위가 어떻게 넓어졌는지 보이도록 정리합니다."
        />
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
            <div className="career-detail"><p className="career-role">서비스 기획 / UX UI / AI Workflow / QA / Project Management</p><p>서비스를 기획하고 구현 결과를 검토하는 개인 프로젝트입니다.</p></div>
          </li>
        </ol>
      </section>

      <section className="workflow section page-shell">
        <SectionHeading
          eyebrow="Tools / Workflow"
          title="도구보다 먼저, 어떤 일을 해결해야 하는지 봅니다."
          description="툴은 결과를 위한 수단입니다. 업무마다 필요한 기준과 협업 방식을 먼저 정리합니다."
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
          <h2>함께 풀어야 할 일이 있다면, 이야기해 주세요.</h2>
          <div>
            <p>연락처와 이력서 파일은 실제 정보를 확인한 뒤 추가합니다. 현재는 포트폴리오 구조와 사례를 정리하는 단계입니다.</p>
            <TextLink href="#projects" arrow="↑">Selected projects 보기</TextLink>
          </div>
        </div>
      </section>
    </main>
  );
}
