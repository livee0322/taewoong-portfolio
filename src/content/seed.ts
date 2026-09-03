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
      title: "디자인과 콘텐츠를 만들고,\n서비스 화면까지 직접 확인합니다.",
      description: "상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 제품 촬영과 영상, 쇼핑라이브 현장을 거쳐 최근에는 서비스 기획과 UI/UX, QA, 개발 협업을 맡고 있습니다.",
      period: "2019 — NOW",
      disciplines: "Design · Content · Commerce · Product",
      lineBreaks: "manual",
    },
    about: {
      eyebrow: "About",
      title: "화면 안의 디자인과 촬영 현장의 일을 함께 해봤습니다.",
      description: "제품을 촬영하고 상세페이지와 배너를 만들었습니다. 영상에서는 썸네일·타이틀·자막을 제작했고, 쇼핑라이브에서는 방송 준비와 현장 운영을 맡았습니다.",
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
      title: "대표적인 네 가지 프로젝트를 정리했습니다.",
      description: "개인 프로젝트 LIVBEE부터 쇼핑라이브, 디자인 실무, 앱 출시 QA까지 실제로 맡은 일을 중심으로 소개합니다.",
    },
    works: {
      eyebrow: "작업 모음",
      title: "공개 가능한 실무 작업을 골라 소개합니다.",
      description: "유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 배너, 상세페이지 중 공개 가능한 결과물을 골랐습니다.",
    },
    career: {
      eyebrow: "경력",
      title: "2019년 제품 디자인부터 지금의 서비스 기획까지.",
      description: "회사와 팀이 바뀔 때마다 맡은 역할도 달라졌습니다. 아래에 실제 경력 순서와 각 시기에 담당한 일을 적었습니다.",
    },
    workflow: {
      eyebrow: "작업 방식",
      title: "목적을 정리하고, 만든 뒤에는 실제 화면에서 확인합니다.",
      description: "무엇을 보여줘야 하는지 먼저 정리합니다. 직접 제작하거나 협업으로 구현한 뒤에는 화면과 현장에서 빠진 부분을 다시 확인합니다.",
    },
    contact: {
      eyebrow: "Contact",
      title: "디자인부터 운영까지,\n해온 일을 더 보여드리겠습니다.",
      description: "그래픽, 콘텐츠, 커머스, 서비스 화면을 함께 다뤄온 경험이 필요하다면 작업 모음과 경력을 살펴봐 주세요.",
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
