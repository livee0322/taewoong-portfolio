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
      title: "디자인을 시작으로 다양한 실무를 경험했습니다.",
      description: "상세페이지, 배너, 유튜브 썸네일과 영상 그래픽을 제작했습니다. 제품 촬영과 쇼핑라이브 기획·운영을 경험했고, 최근에는 서비스 기획과 UI/UX, QA 업무도 진행했습니다.",
      period: "2019 — NOW",
      disciplines: "Design · Content · Commerce · Product",
      lineBreaks: "auto",
    },
    about: {
      eyebrow: "About",
      title: "디자인 외에도 다양한 실무를 경험했습니다.",
      description: "상세페이지와 배너, 썸네일 제작부터 제품 촬영, 영상 편집, 쇼핑라이브 기획과 운영까지 진행했습니다. 이후에는 서비스 기획, UI/UX, QA 업무도 경험했습니다.",
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
      title: "대표적으로 진행한 프로젝트를 소개합니다.",
      description: "개인 프로젝트 LIVBEE, 쇼핑라이브 촬영 및 기획, 실무 디자인 작업, 셀러노트 앱 출시 QA와 디자인 개선 경험을 정리했습니다.",
    },
    works: {
      eyebrow: "작업 모음",
      title: "실무에서 제작한 작업을 모았습니다.",
      description: "유튜브 썸네일, 영상 타이틀과 자막, 이벤트 배너, 쇼핑라이브 콘텐츠, 상세페이지 등 공개 가능한 작업을 정리했습니다.",
    },
    career: {
      eyebrow: "경력",
      title: "2019년부터 다양한 디자인과 콘텐츠 업무를 경험했습니다.",
      description: "회사마다 맡은 역할이 달랐고, 제품 디자인부터 콘텐츠 제작, 쇼핑라이브, 서비스 QA와 기획 업무까지 경험했습니다.",
    },
    workflow: {
      eyebrow: "작업 방식",
      title: "업무에 필요한 방법을 찾아 직접 진행합니다.",
      description: "디자인 툴뿐 아니라 업무 관리, 파일 관리, AI 도구 등 필요한 방법을 익혀 사용해왔습니다. 작업 이후에는 실제 화면이나 결과물을 확인하면서 수정하는 편입니다.",
    },
    contact: {
      eyebrow: "Contact",
      title: "더 자세한 작업 경험이 궁금하다면 연락 주세요.",
      description: "디자인, 콘텐츠 제작, 쇼핑라이브, 서비스 기획과 QA 경험을 정리했습니다. 더 필요한 내용은 작업물과 함께 설명드릴 수 있습니다.",
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
    { id: "planning", title: "기획", description: "필요한 내용과 우선순위를 먼저 정리하고 작업을 시작했습니다.", tools: ["Asana", "Obsidian", "ChatGPT"], visible: true },
    { id: "production", title: "제작", description: "디자인, 촬영, 영상 편집 등 직접 할 수 있는 작업은 직접 진행했습니다.", tools: ["Figma", "Photoshop", "Illustrator", "Premiere Pro"], visible: true },
    { id: "collaboration", title: "협업", description: "개발, MD, 촬영팀 등 다른 역할과 필요한 내용을 정리하며 협업했습니다.", tools: ["Figma", "Asana", "GitHub"], visible: true },
    { id: "review", title: "검토", description: "결과물을 실제 화면과 운영 환경에서 확인하고 수정했습니다.", tools: ["Browser QA", "Vercel", "Figma"], visible: true },
  ],
  assets: [aboutImage, ...projectAssets, ...workAssets].filter((asset, index, all) => all.findIndex((item) => item.src === asset.src) === index),
};
