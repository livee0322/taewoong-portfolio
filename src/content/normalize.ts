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
      projects: {
        ...fallback.home.projects,
        ...legacyHome?.projects,
        ...(isLegacy ? fallback.home.projects : {}),
      },
      workflow: {
        ...fallback.home.workflow,
        ...legacyHome?.workflow,
        ...(isLegacy ? fallback.home.workflow : {}),
      },
    },
    projects: orderedProjects,
  } as PortfolioSnapshot;
}
