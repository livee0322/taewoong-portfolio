import { careerEntries } from "@/data/career";
import { projects } from "@/data/projects";
import { visualWorks } from "@/data/works";
import type { AssetRecord, PortfolioSnapshot } from "./schema";

const featuredId = "ocean-content-thumbnail";
const reelIds = [
  "traffic-safety-thumbnail",
  "safety-ga-sister-thumbnail",
  "editor-pick-dochi-caption",
  "pyojoon-gobaek-thumbnail",
  "shopping-live-studio",
  "innos-monster-tv-banner",
  "sea-forest-invitation-thumbnail",
];

const aboutImage: AssetRecord = {
  id: "about-creative-workflow-studio",
  filename: "creative-workflow-studio.jpg",
  src: "/images/about/creative-workflow-studio.jpg",
  alt: "촬영 스튜디오에서 제품을 촬영하며 그래픽과 영상 편집 화면을 함께 확인하는 작업 장면",
  caption: "Design · Photo · Video",
  category: "Home",
  source: "library",
  objectPosition: "center",
};

const workAssets: AssetRecord[] = visualWorks.map((work) => ({
  id: `work-${work.id}`,
  filename: work.src.split("/").pop() ?? work.id,
  src: work.src,
  alt: work.alt,
  caption: work.category,
  category: "Works",
  source: "library",
  objectPosition: work.focus ?? "center",
}));

const projectAssets: AssetRecord[] = projects.flatMap((project) => project.thumbnail.src ? [{
  id: `project-${project.id}`,
  filename: project.thumbnail.src.split("/").pop() ?? project.id,
  src: project.thumbnail.src,
  alt: project.thumbnail.alt,
  caption: project.thumbnail.caption,
  category: "Projects",
  source: "library" as const,
  objectPosition: project.thumbnail.focus ?? "center",
}] : []);

export const seedSnapshot: PortfolioSnapshot = {
  schemaVersion: 2,
  home: {
    hero: {
      eyebrow: "이태웅 · 디자이너",
      title: "디자인에서 시작해, 기획과 서비스까지",
      description: "상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 촬영과 쇼핑라이브 현장을 거쳐 지금은 서비스 기획, UI/UX, QA까지 함께 다루고 있습니다.",
      period: "2019 — NOW",
      disciplines: "Design · Content · Commerce · Product",
      lineBreaks: "auto",
    },
    about: {
      eyebrow: "About",
      title: "화면을 만들고, 그 앞뒤의 과정까지 함께 봅니다.",
      description: "상세페이지, 배너, 썸네일과 영상 그래픽을 만들고 제품 촬영과 쇼핑라이브 현장을 경험했습니다. 최근에는 서비스 기획과 UI/UX, QA까지 맡고 있습니다.",
      image: aboutImage,
      capabilities: [
        { id: "design", title: "Design", description: "UI/UX · 그래픽 · 상세페이지", visible: true },
        { id: "content", title: "Content", description: "촬영 기획 · YouTube 썸네일 · 타이틀/자막", visible: true },
        { id: "commerce", title: "Commerce", description: "상품 정보 · 프로모션 · 쇼핑라이브", visible: true },
        { id: "product", title: "Product", description: "서비스 기획 · UX 흐름 · QA · 개발 협업", visible: true },
      ],
    },
    projects: {
      eyebrow: "대표 프로젝트",
      title: "지금의 업무 범위를 만든 네 가지 프로젝트입니다.",
      description: "개인 프로젝트 LIVBEE부터 쇼핑라이브, 디자인 실무, 앱 출시 QA까지 실제로 맡은 역할을 중심으로 정리했습니다.",
    },
    works: {
      eyebrow: "작업 모음",
      title: "실무에서 만든 작업 중 공개 가능한 결과물을 골랐습니다.",
      description: "유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 콘텐츠, 상세페이지 작업을 모았습니다.",
    },
    career: {
      eyebrow: "경력",
      title: "2019년 제품 디자인부터 지금의 서비스 기획까지.",
      description: "회사와 역할이 바뀌면서 맡는 일도 넓어졌습니다. 실제 경력 순서와 각 시기의 주요 업무를 정리했습니다.",
    },
    workflow: {
      eyebrow: "작업 방식",
      title: "목적을 정리하고, 만든 뒤에는 실제 화면에서 확인합니다.",
      description: "무엇을 보여줘야 하는지 먼저 정리하고, 제작이나 협업 이후에는 실제 화면과 현장에서 빠진 부분을 다시 확인합니다.",
    },
    contact: {
      eyebrow: "Contact",
      title: "디자인부터 운영까지, 더 이야기할 수 있습니다.",
      description: "그래픽, 콘텐츠, 커머스, 서비스 화면까지 함께 다뤄온 경험을 작업과 경력으로 정리했습니다.",
      ctaLabel: "작업 모음 보기",
      ctaUrl: "/works",
      email: "",
      resumeUrl: "",
    },
  },
  categories: [
    { id: "youtube-thumbnail", label: "유튜브 썸네일", frame: "video", visible: true },
    { id: "caption-title", label: "자막·타이틀 디자인", frame: "video", visible: true },
    { id: "event-banner", label: "이벤트 배너", frame: "square", visible: true },
    { id: "shopping-live", label: "쇼핑라이브 콘텐츠", frame: "video", visible: true },
    { id: "detail-page", label: "상세페이지", frame: "detail", visible: true },
  ],
  works: visualWorks.map((work) => ({
    ...work,
    caption: work.category,
    published: true,
    homeFeatured: work.id === featuredId,
    showOnHome: work.id === featuredId || reelIds.includes(work.id),
  })),
  projects,
  career: [
    ...careerEntries.map((entry, index) => ({ ...entry, id: `career-${index + 1}`, entryType: "career" as const, visible: true })),
    {
      id: "livbee-personal",
      entryType: "personal-project",
      period: "Personal project",
      company: "LIVBEE",
      team: "Product",
      position: "Product",
      role: "서비스 기획 / UX UI / AI Workflow / Browser QA / Project Management",
      description: "쇼핑라이브 매칭의 문제를 서비스 흐름으로 바꾸고, 실제 화면의 구현 결과를 검토하는 개인 프로젝트입니다.",
      highlights: [],
      visible: true,
    },
  ],
  workflow: [
    { id: "design", title: "Design", description: "서비스 화면, 그래픽, 상세페이지에서 정보의 우선순위를 화면으로 정리했습니다.", tools: ["Figma", "Photoshop", "Illustrator"], visible: true },
    { id: "content", title: "Content", description: "촬영의 포인트를 잡고 썸네일·타이틀·자막으로 영상의 첫인상을 만들었습니다.", tools: ["Camera workflow", "Premiere Pro"], visible: true },
    { id: "commerce", title: "Commerce", description: "상품의 특징을 읽고 프로모션, 상세페이지, 쇼핑라이브로 이어지는 흐름을 준비했습니다.", tools: ["Promotion", "Detail page", "Shopping Live"], visible: true },
    { id: "product", title: "Product", description: "서비스를 기획하고 UX 흐름을 설계한 뒤, 구현 화면을 QA하며 개발과 협업했습니다.", tools: ["Service planning", "UX flow", "QA", "Dev collaboration"], visible: true },
  ],
  assets: [aboutImage, ...projectAssets, ...workAssets].filter((asset, index, all) => all.findIndex((item) => item.src === asset.src) === index),
};
