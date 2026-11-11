import "server-only";

import { normalizeSnapshot } from "./normalize";
import { seedSnapshot } from "./seed";
import type { PortfolioSnapshot, RevisionRecord } from "./schema";

const DEFAULT_REPOSITORY = "livee0322/taewoong-portfolio";
const DEFAULT_BRANCH = "main";
const DRAFT_PATH = "content/portfolio.draft.json";
const PUBLISHED_PATH = "content/portfolio.published.json";
const REVISIONS_PATH = "content/portfolio.revisions.json";

type GitHubFile = { content?: string; encoding?: string; sha?: string };

function settings() {
  const repository = process.env.GITHUB_REPOSITORY || DEFAULT_REPOSITORY;
  const [owner, repo] = repository.split("/");
  if (!owner || !repo) throw new Error("GITHUB_REPOSITORY는 owner/repository 형식이어야 합니다.");
  return { owner, repo, branch: process.env.GITHUB_CONTENT_BRANCH || DEFAULT_BRANCH, token: process.env.GITHUB_CONTENT_TOKEN };
}

async function github(path: string, init: RequestInit = {}) {
  const { token } = settings();
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    cache: "no-store",
    headers: { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(`GitHub 요청 실패 (${response.status}): ${detail.message || response.statusText}`);
  }
  return response;
}

function contentsPath(filePath: string, ref?: string) {
  const { owner, repo, branch } = settings();
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  return `/repos/${owner}/${repo}/contents/${encoded}?ref=${encodeURIComponent(ref || branch)}`;
}

async function readJson<T>(filePath: string, fallback: T, ref?: string): Promise<T> {
  const response = await github(contentsPath(filePath, ref));
  if (!response) return structuredClone(fallback);
  const file = await response.json() as GitHubFile;
  if (!file.content || file.encoding !== "base64") return structuredClone(fallback);
  return JSON.parse(Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8")) as T;
}

async function writeFile(filePath: string, contentBase64: string, message: string) {
  const { owner, repo, branch, token } = settings();
  if (!token) throw new Error("서버에 GITHUB_CONTENT_TOKEN이 설정되지 않아 저장할 수 없습니다.");
  const current = await github(contentsPath(filePath));
  const sha = current ? ((await current.json()) as GitHubFile).sha : undefined;
  const encoded = filePath.split("/").map(encodeURIComponent).join("/");
  const response = await github(`/repos/${owner}/${repo}/contents/${encoded}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: contentBase64, branch, ...(sha ? { sha } : {}) }),
  });
  if (!response) throw new Error("GitHub에 파일을 저장하지 못했습니다.");
}

const encodeJson = (value: unknown) => Buffer.from(`${JSON.stringify(value, null, 2)}\n`, "utf8").toString("base64");

export async function readPublishedSnapshot() {
  try {
    const snapshot = await readJson<PortfolioSnapshot>(PUBLISHED_PATH, seedSnapshot);
    return normalizeSnapshot(snapshot, structuredClone(seedSnapshot));
  } catch {
    return structuredClone(seedSnapshot);
  }
}

export async function readDraftSnapshot() {
  const published = await readPublishedSnapshot();
  const snapshot = await readJson<PortfolioSnapshot>(DRAFT_PATH, published);
  return normalizeSnapshot(snapshot, structuredClone(seedSnapshot));
}

export async function saveDraftSnapshot(snapshot: PortfolioSnapshot, note = "Save portfolio draft") {
  await writeFile(DRAFT_PATH, encodeJson(snapshot), `cms: ${note}`);
}

export async function readRevisions() {
  try { return await readJson<RevisionRecord[]>(REVISIONS_PATH, []); }
  catch { return []; }
}

export async function publishSnapshot(snapshot: PortfolioSnapshot): Promise<RevisionRecord> {
  const revisions = await readRevisions();
  const revision: RevisionRecord = { id: crypto.randomUUID(), versionNumber: (revisions[0]?.versionNumber ?? 0) + 1, snapshot: structuredClone(snapshot), publishedAt: new Date().toISOString() };
  await writeFile(PUBLISHED_PATH, encodeJson(snapshot), `cms: publish portfolio v${revision.versionNumber}`);
  await writeFile(REVISIONS_PATH, encodeJson([revision, ...revisions].slice(0, 20)), `cms: record portfolio v${revision.versionNumber}`);
  return revision;
}

export async function uploadImage(file: File) {
  const safeName = file.name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  const filename = `${Date.now()}-${safeName || "image"}`;
  await writeFile(`public/images/uploads/${filename}`, Buffer.from(await file.arrayBuffer()).toString("base64"), `cms: upload ${filename}`);
  return { filename, src: `/images/uploads/${filename}` };
}
