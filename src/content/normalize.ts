import { projects as canonicalProjects } from "@/data/projects";
import type { PortfolioSnapshot } from "./schema";
import type { Project } from "@/types/content";

type LegacyProject = Partial<Project> & {
  hero?: Project["thumbnail"];
  liveUrl?: string;
};

type LegacySnapshot = Omit<Partial<PortfolioSnapshot>, "projects"> & {
  schemaVersion?: number;
  projects?: LegacyProject[];
};

const canonicalTitle = new Map(canonicalProjects.map((project) => [project.id, project.title]));

const obsoleteProjectSummaries: Record<string, readonly string[]> = {
  livbee: ["쇼핑라이브 현장의 섭외와 조건 협의 문제를 서비스로 풀고 있습니다. 기능 기획과 화면 설계부터 브라우저 QA까지 직접 이어갑니다.", "쇼핑라이브 현장에서 겪은 섭외와 조건 협의의 불편을 서비스로 풀고 있습니다. 기능을 기획하고 화면을 설계한 뒤, 구현 결과를 브라우저에서 확인하며 계속 고쳤습니다."],
  "shopping-live": ["상품 정보를 정리하고 촬영, 상세페이지, 프로모션, 방송 현장까지 연결했습니다. 방송에 쓰인 이미지와 현장 작업을 선별했습니다.", "상품 정보를 정리한 뒤 촬영, 상세페이지, 프로모션, 쇼핑라이브 순서로 준비했습니다. 실제 방송에 쓰인 이미지와 현장 작업을 중심으로 선별했습니다."],
  "design-content": ["제품과 채널의 목적을 정리해 상세페이지, 프로모션 배너, 유튜브 썸네일과 영상 그래픽으로 제작했습니다. 공개 가능한 결과물을 소개합니다."],
  sellernote: ["셀러노트 출시 전 웹·앱 화면을 QA하고 반복 UI를 Figma 컴포넌트로 정리했습니다. 발견한 문제는 화면 개선으로 연결했습니다."],
};

const obsoleteHomeCopy = {
  hero: {
    titles: ["기획부터 디자인까지", "디자인과 콘텐츠를 만들고,\n서비스 화면까지 직접 확인합니다.", "디자인에서 시작해, 기획과 서비스까지"],
    descriptions: ["상세페이지와 배너, 유튜브 썸네일·타이틀·자막같은 디자인 작업부터 쇼핑라이브 촬영과 영상 편집 최근에는 서비스 기획과 UI/UX, QA 등을 진행했습니다.", "상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 제품 촬영과 영상, 쇼핑라이브 현장을 거쳐 최근에는 서비스 기획과 UI/UX, QA, 개발 협업을 맡고 있습니다.", "상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 촬영과 쇼핑라이브 현장을 거쳐 지금은 서비스 기획, UI/UX, QA까지 함께 다루고 있습니다."],
  },
  about: {
    titles: ["디자인 뿐만 아니라, 기획까지 같이", "화면 안의 디자인과 촬영 현장의 일을 함께 해봤습니다.", "화면을 만들고, 그 앞뒤의 과정까지 함께 봅니다."],
    descriptions: ["상세페이지와 배너, 유튜브 썸네일·타이틀·자막같은 디자인 작업부터 쇼핑라이브 기획과 최근에는 서비스 기획과 UI/UX, QA 등을 진행했습니다.", "제품을 촬영하고 상세페이지와 배너를 만들었습니다. 영상에서는 썸네일·타이틀·자막을 제작했고, 쇼핑라이브에서는 방송 준비와 현장 운영을 맡았습니다.", "상세페이지, 배너, 썸네일과 영상 그래픽을 만들고 제품 촬영과 쇼핑라이브 현장을 경험했습니다. 최근에는 서비스 기획과 UI/UX, QA까지 맡고 있습니다."],
  },
  projects: { titles: ["대표적인 네 가지 프로젝트를 정리했습니다.", "지금의 업무 범위를 만든 네 가지 프로젝트입니다."], descriptions: ["개인 프로젝트 LIVBEE부터 쇼핑라이브, 디자인 실무, 앱 출시 QA까지 실제로 맡은 일을 중심으로 소개합니다.", "개인 프로젝트 LIVBEE부터 쇼핑라이브, 디자인 실무, 앱 출시 QA까지 실제로 맡은 역할을 중심으로 정리했습니다."] },
  works: { titles: ["공개 가능한 실무 작업을 골라 소개합니다.", "실무에서 만든 작업 중 공개 가능한 결과물을 골랐습니다."], descriptions: ["유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 배너, 상세페이지 중 공개 가능한 결과물을 골랐습니다.", "유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 콘텐츠, 상세페이지 작업을 모았습니다."] },
  career: { titles: ["2019년 제품 디자인부터 지금의 서비스 기획까지."], descriptions: ["회사와 팀이 바뀔 때마다 맡은 역할도 달라졌습니다. 아래에 실제 경력 순서와 각 시기에 담당한 일을 적었습니다.", "회사와 역할이 바뀌면서 맡는 일도 넓어졌습니다. 실제 경력 순서와 각 시기의 주요 업무를 정리했습니다."] },
  workflow: { titles: ["목적을 정리하고, 만든 뒤에는 실제 화면에서 확인합니다."], descriptions: ["무엇을 보여줘야 하는지 먼저 정리합니다. 직접 제작하거나 협업으로 구현한 뒤에는 화면과 현장에서 빠진 부분을 다시 확인합니다.", "무엇을 보여줘야 하는지 먼저 정리하고, 제작이나 협업 이후에는 실제 화면과 현장에서 빠진 부분을 다시 확인합니다."] },
  contact: { titles: ["디자인부터 운영까지,\n해온 일을 더 보여드리겠습니다.", "디자인부터 운영까지, 더 이야기할 수 있습니다."], descriptions: ["그래픽, 콘텐츠, 커머스, 서비스 화면을 함께 다뤄온 경험이 필요하다면 작업 모음과 경력을 살펴봐 주세요.", "그래픽, 콘텐츠, 커머스, 서비스 화면까지 함께 다뤄온 경험을 작업과 경력으로 정리했습니다."] },
} as const;

const normalizeCopyWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

function includesCopy(values: readonly string[], candidate: string) {
  const normalizedCandidate = normalizeCopyWhitespace(candidate);
  return values.some((value) => normalizeCopyWhitespace(value) === normalizedCandidate);
}

function migrateSectionCopy<T extends { title: string; description: string }>(incoming: T | undefined, fallback: T, obsolete: { readonly titles: readonly string[]; readonly descriptions: readonly string[] }): T {
  if (!incoming) return structuredClone(fallback);
  return {
    ...fallback,
    ...incoming,
    title: includesCopy(obsolete.titles, incoming.title) ? fallback.title : incoming.title,
    description: includesCopy(obsolete.descriptions, incoming.description) ? fallback.description : incoming.description,
  };
}

function normalizeProject(project: LegacyProject, index: number, isLegacy: boolean): Project | null {
  const slug = project.slug;
  if (!slug) return null;
  const fallback = canonicalProjects.find((item) => item.slug === slug);
  if (!fallback) return null;
  const id = project.id ?? slug;
  const { hero, liveUrl, ...current } = project;
  return {
    ...fallback,
    ...current,
    id,
    slug,
    category: project.category ?? project.type ?? fallback.category,
    title: isLegacy ? (canonicalTitle.get(id) ?? project.title ?? fallback.title) : (project.title ?? fallback.title),
    summary: project.summary && !includesCopy(obsoleteProjectSummaries[id] ?? [], project.summary) ? project.summary : fallback.summary,
    thumbnail: project.thumbnail ?? hero ?? fallback.thumbnail,
    detailPageUrl: project.detailPageUrl ?? `/projects/${slug}`,
    externalUrl: project.externalUrl ?? liveUrl ?? fallback.externalUrl,
    visible: project.visible ?? true,
    showOnHome: project.showOnHome ?? true,
    sortOrder: project.sortOrder ?? index + 1,
  };
}

function normalizeWorkflowEntries(incoming: PortfolioSnapshot["workflow"] | undefined, fallback: PortfolioSnapshot["workflow"]) {
  if (!incoming?.length) return structuredClone(fallback);
  const legacyTitles = ["Design", "Content", "Commerce", "Product"];
  const isKnownLegacyWorkflow = incoming.length === legacyTitles.length
    && incoming.every((item, index) => item.title === legacyTitles[index]);
  return isKnownLegacyWorkflow ? structuredClone(fallback) : incoming;
}

export function normalizeSnapshot(value: unknown, fallback: PortfolioSnapshot): PortfolioSnapshot {
  if (!value || typeof value !== "object") return structuredClone(fallback);
  const legacy = value as LegacySnapshot;
  const isLegacy = legacy.schemaVersion !== 2;
  const incoming = (legacy.projects ?? []).map((project, index) => normalizeProject(project, index, isLegacy)).filter((item): item is Project => Boolean(item));
  const byId = new Map(incoming.map((project) => [project.id, project]));
  const projects = canonicalProjects.map((project) => byId.get(project.id) ?? structuredClone(project));
  const orderedProjects = (isLegacy ? projects.map((project, index) => ({ ...project, sortOrder: index + 1 })) : projects)
    .sort((a, b) => a.sortOrder - b.sortOrder);
  const legacyHome = legacy.home;

  return {
    ...structuredClone(fallback),
    ...legacy,
    schemaVersion: 2,
    home: {
      ...structuredClone(fallback.home),
      ...legacyHome,
      hero: migrateSectionCopy(legacyHome?.hero, fallback.home.hero, obsoleteHomeCopy.hero),
      about: migrateSectionCopy(legacyHome?.about, fallback.home.about, obsoleteHomeCopy.about),
      projects: isLegacy ? structuredClone(fallback.home.projects) : migrateSectionCopy(legacyHome?.projects, fallback.home.projects, obsoleteHomeCopy.projects),
      works: migrateSectionCopy(legacyHome?.works, fallback.home.works, obsoleteHomeCopy.works),
      career: migrateSectionCopy(legacyHome?.career, fallback.home.career, obsoleteHomeCopy.career),
      workflow: isLegacy ? structuredClone(fallback.home.workflow) : migrateSectionCopy(legacyHome?.workflow, fallback.home.workflow, obsoleteHomeCopy.workflow),
      contact: migrateSectionCopy(legacyHome?.contact, fallback.home.contact, obsoleteHomeCopy.contact),
    },
    projects: orderedProjects,
    workflow: normalizeWorkflowEntries(legacy.workflow, fallback.workflow),
  } as PortfolioSnapshot;
}
