export type MediaTone = "ink" | "paper" | "sage" | "stone" | "rose" | "sand";

export type ProjectSection = {
  label: string;
  title: string;
  body: string;
  items?: string[];
};

export type ProjectMedia = {
  /** Local public path, added when the approved final asset is available. */
  src?: `/images/${string}`;
  alt: string;
  ratio: "wide" | "portrait" | "square" | "detail";
  tone: MediaTone;
  caption: string;
  /** object-position bias when the frame crops a taller/wider source than its target ratio. Defaults to center. */
  focus?: "top" | "center" | "bottom";
};

export type Project = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  year: string;
  type: string;
  roles: string[];
  tools: string[];
  summary: string;
  hero: ProjectMedia;
  intro: string;
  sections: ProjectSection[];
  gallery: ProjectMedia[];
  liveUrl?: string;
};

export type VisualWork = {
  id: string;
  category: string;
  title: string;
  description?: string;
  tone: MediaTone;
  ratio: "wide" | "portrait" | "square" | "detail";
  src: `/images/${string}`;
  alt: string;
  /** object-position bias when the frame crops a taller/wider source than its target ratio. Defaults to center. */
  focus?: "top" | "center" | "bottom";
};

export type CareerEntry = {
  period: string;
  company: string;
  team: string;
  position: string;
  role: string;
  description: string;
  highlights: string[];
};
