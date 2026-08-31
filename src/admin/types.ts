export type AdminViewport = "desktop" | "tablet" | "mobile";

export type PreviewMode = "page" | "section";

export type PublishState = "draft" | "published" | "archived";

export type AdminSectionId =
  | "home.hero"
  | "home.about"
  | "home.projects"
  | "home.works"
  | "home.career"
  | "home.workflow"
  | "home.contact"
  | "works.archive"
  | "projects.index"
  | "assets.library"
  | "settings.site";

export type AdminNavItem = {
  id: AdminSectionId;
  label: string;
  number?: string;
  previewAnchor?: string;
};

export type AdminNavGroup = {
  label: string;
  items: AdminNavItem[];
};

export type AssetSource = "upload" | "library" | "external";

export type AssetRecord = {
  id: string;
  filename: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
  fileSize: string;
  uploadedAt: string;
  usageCount: number;
  source: AssetSource;
};

export type WorkExposure = "works-only" | "home" | "home-featured";

export type AdminWorkItem = {
  id: string;
  title: string;
  category: string;
  src: string;
  exposure: WorkExposure;
  published: boolean;
};

export const viewportWidths: Record<AdminViewport, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 390,
};
