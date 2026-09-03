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

const obsoleteHomeCopy = {
  hero: {
    titles: ["기획부터 디자인까지", "디자인과 콘텐츠를 만들고,\n서비스 화면까지 직접 확인합니다."],
    descriptions: ["상세페이지와 배너, 유튜브 썸네일·타이틀·자막같은 디자인 작업부터 쇼핑라이브 촬영과 영상 편집 최근에는 서비스 기획과 UI/UX, QA 등을 진행했습니다.", "상세페이지와 배너, 유튜브 썸네일·타이틀·자막을 만들었습니다. 제품 촬영과 영상, 쇼핑라이브 현장을 거쳐 최근에는 서비스 기획과 UI/UX, QA, 개발 협업을 맡고 있습니다."],
  },
  about: {
    titles: ["디자인 뿐만 아니라, 기획까지 같이", "화면 안의 디자인과 촬영 현장의 일을 함께 해봤습니다."],
    descriptions: ["상세페이지와 배너, 유튜브 썸네일·타이틀·자막같은 디자인 작업부터 쇼핑라이브 기획과 최근에는 서비스 기획과 UI/UX, QA 등을 진행했습니다.", "제품을 촬영하고 상세페이지와 배너를 만들었습니다. 영상에서는 썸네일·타이틀·자막을 제작했고, 쇼핑라이브에서는 방송 준비와 현장 운영을 맡았습니다."],
  },
  projects: { titles: ["대표적인 네 가지 프로젝트를 정리했습니다."], descriptions: ["개인 프로젝트 LIVBEE부터 쇼핑라이브, 디자인 실무, 앱 출시 QA까지 실제로 맡은 일을 중심으로 소개합니다."] },
  works: { titles: ["공개 가능한 실무 작업을 골라 소개합니다."], descriptions: ["유튜브 썸네일, 영상 타이틀과 자막, 이벤트 그래픽, 쇼핑라이브 배너, 상세페이지 중 공개 가능한 결과물을 골랐습니다."] },
  career: { titles: [], descriptions: ["회사와 팀이 바뀔 때마다 맡은 역할도 달라졌습니다. 아래에 실제 경력 순서와 각 시기에 담당한 일을 적었습니다."] },
  workflow: { titles: [], descriptions: ["무엇을 보여줘야 하는지 먼저 정리합니다. 직접 제작하거나 협업으로 구현한 뒤에는 화면과 현장에서 빠진 부분을 다시 확인합니다."] },
  contact: { titles: ["디자인부터 운영까지,\n해온 일을 더 보여드리겠습니다."], descriptions: ["그래픽, 콘텐츠, 커머스, 서비스 화면을 함께 다뤄온 경험이 필요하다면 작업 모음과 경력을 살펴봐 주세요."] },
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
    thumbnail: project.thumbnail ?? hero ?? fallback.thumbnail,
    detailPageUrl: project.detailPageUrl ?? `/projects/${slug}`,
    externalUrl: project.externalUrl ?? liveUrl ?? fallback.externalUrl,
    visible: project.visible ?? true,
    showOnHome: project.showOnHome ?? true,
    sortOrder: project.sortOrder ?? index + 1,
  };
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
  } as PortfolioSnapshot;
}
