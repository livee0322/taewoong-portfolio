import type { AdminNavGroup } from "./types";

export const adminNavigation: AdminNavGroup[] = [
  { label: "Home", items: [
    { id: "home.hero", number: "01", label: "Hero" },
    { id: "home.about", number: "02", label: "About", previewAnchor: "about" },
    { id: "home.projects", number: "03", label: "Featured Projects", previewAnchor: "projects" },
    { id: "home.works", number: "04", label: "Selected Works", previewAnchor: "works" },
    { id: "home.career", number: "05", label: "Career", previewAnchor: "experience" },
    { id: "home.workflow", number: "06", label: "Workflow" },
    { id: "home.contact", number: "07", label: "Contact", previewAnchor: "contact" },
  ] },
  { label: "Works", items: [{ id: "works.archive", label: "Works Archive" }] },
  { label: "Projects", items: [{ id: "projects.index", label: "Project Entries" }] },
  { label: "Assets", items: [{ id: "assets.library", label: "Asset Library" }] },
];
