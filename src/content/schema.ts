import type { CareerEntry, ObjectPosition, Project, VisualWork } from "@/types/content";

export type EditableSection = {
  eyebrow: string;
  title: string;
  description: string;
};

export type Capability = {
  id: string;
  title: string;
  description: string;
  visible: boolean;
};

export type WorkflowEntry = {
  id: string;
  title: string;
  description: string;
  tools: string[];
  visible: boolean;
};

export type CmsCareerEntry = CareerEntry & {
  id: string;
  entryType: "career" | "personal-project";
  visible: boolean;
};

export type CmsProject = Project;

export type CmsWork = VisualWork & {
  caption?: string;
  published: boolean;
  showOnHome: boolean;
  homeFeatured: boolean;
};

export type WorkCategory = {
  id: string;
  label: string;
  frame: "video" | "square" | "detail";
  visible: boolean;
};

export type AssetRecord = {
  id: string;
  filename: string;
  src: string;
  alt: string;
  caption: string;
  category: string;
  source: "library" | "upload" | "external";
  objectPosition: ObjectPosition;
  mimeType?: string;
  byteSize?: number;
  storagePath?: string;
};

export type PortfolioSnapshot = {
  schemaVersion: 2;
  home: {
    hero: EditableSection & { period: string; disciplines: string; lineBreaks: "auto" | "manual" };
    about: EditableSection & { image: AssetRecord; capabilities: Capability[] };
    projects: EditableSection;
    works: EditableSection;
    career: EditableSection;
    workflow: EditableSection;
    contact: EditableSection & { ctaLabel: string; ctaUrl: string; email: string; resumeUrl: string };
  };
  categories: WorkCategory[];
  works: CmsWork[];
  projects: CmsProject[];
  career: CmsCareerEntry[];
  workflow: WorkflowEntry[];
  assets: AssetRecord[];
};

export type RevisionRecord = {
  id: string;
  versionNumber: number;
  snapshot: PortfolioSnapshot;
  publishedAt: string;
  note?: string;
};
