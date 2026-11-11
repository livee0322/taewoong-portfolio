import type { PortfolioSnapshot } from "./schema";

export function validateSnapshot(snapshot: PortfolioSnapshot) {
  const errors: string[] = [];
  if (!snapshot.home.hero.title.trim()) errors.push("Hero title은 필수입니다.");
  if (!snapshot.home.hero.description.trim()) errors.push("Hero description은 필수입니다.");
  if (!snapshot.home.about.image.alt.trim()) errors.push("About 이미지 alt는 필수입니다.");
  if (snapshot.projects.length !== 4) errors.push("대표 프로젝트는 4개여야 합니다.");
  if (new Set(snapshot.projects.map((project) => project.id)).size !== snapshot.projects.length) errors.push("Project ID는 중복될 수 없습니다.");
  if (new Set(snapshot.projects.map((project) => project.sortOrder)).size !== snapshot.projects.length) errors.push("Project 순서는 중복될 수 없습니다.");
  if (snapshot.projects.some((project) => !project.id.trim() || !project.slug.trim() || !project.category.trim() || !project.title.trim() || !project.summary.trim() || !project.thumbnail.alt.trim() || !project.detailPageUrl.startsWith("/projects/"))) errors.push("모든 Project에는 ID, slug, category, title, summary, thumbnail alt, detail URL이 필요합니다.");
  const featured = snapshot.works.filter((work) => work.homeFeatured);
  if (featured.length !== 1) errors.push("홈 대표작은 정확히 한 개여야 합니다.");
  if (featured.some((work) => !work.showOnHome)) errors.push("홈 대표작은 Home 노출 상태여야 합니다.");
  if (snapshot.works.some((work) => !work.title.trim() || !work.alt.trim() || !work.src.trim())) errors.push("모든 Work에는 title, image, alt가 필요합니다.");
  const urls = [snapshot.home.contact.resumeUrl, ...snapshot.projects.map((project) => project.externalUrl ?? "")].filter(Boolean);
  for (const value of urls) {
    try { const url = new URL(value); if (url.protocol !== "https:") errors.push(`HTTPS URL만 게시할 수 있습니다: ${value}`); }
    catch { errors.push(`올바르지 않은 URL입니다: ${value}`); }
  }
  if (errors.length) throw new Error(errors.join(" "));
}
