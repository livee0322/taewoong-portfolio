"use client";

import { seedSnapshot } from "./seed";
import type { AssetRecord, PortfolioSnapshot, RevisionRecord } from "./schema";
import { normalizeSnapshot } from "./normalize";
import { validateSnapshot } from "./validate";

export const STORAGE_KEYS = { draft: "portfolio-cms-draft-v1", published: "portfolio-cms-published-v1", preview: "portfolio-cms-live-preview-v1", revisions: "portfolio-cms-revisions-v1" } as const;
const cloneSeed = () => structuredClone(seedSnapshot);

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, { cache: "no-store", ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const body = await response.json().catch(() => ({})) as T & { error?: string };
  if (!response.ok) throw new Error(body.error || `CMS 요청에 실패했습니다 (${response.status}).`);
  return body;
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try { const value = window.localStorage.getItem(key); return value ? JSON.parse(value) as T : fallback; }
  catch { return fallback; }
}

function writeLocal(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  new BroadcastChannel("portfolio-cms").postMessage({ key });
}

export function setLivePreview(snapshot: PortfolioSnapshot) { writeLocal(STORAGE_KEYS.preview, snapshot); }

export async function loadDraft() {
  return normalizeSnapshot(await api<PortfolioSnapshot>("/api/cms?mode=draft"), cloneSeed());
}

export async function loadPublished(preview = false) {
  if (preview) return readLocal(STORAGE_KEYS.preview, await loadDraft());
  return normalizeSnapshot(await api<PortfolioSnapshot>("/api/cms?mode=published"), cloneSeed());
}

export async function saveDraft(snapshot: PortfolioSnapshot) {
  validateSnapshot(snapshot);
  await api<{ ok: true }>("/api/cms", { method: "PUT", body: JSON.stringify(snapshot) });
  setLivePreview(snapshot);
}

export async function publishDraft(snapshot: PortfolioSnapshot) {
  validateSnapshot(snapshot);
  const revision = await api<RevisionRecord>("/api/cms", { method: "POST", body: JSON.stringify(snapshot) });
  writeLocal(STORAGE_KEYS.published, snapshot);
  return revision;
}

export class PublishError extends Error {
  readonly draftSaved = true;
  constructor(message: string) { super(message); this.name = "PublishError"; }
}

export async function loadRevisions() { return api<RevisionRecord[]>("/api/cms?mode=revisions"); }
export async function restoreRevision(revision: RevisionRecord) { await saveDraft(revision.snapshot); return revision.snapshot; }

export async function uploadAsset(file: File): Promise<AssetRecord> {
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
  if (file.size > 10 * 1024 * 1024) throw new Error("이미지는 10MB 이하여야 합니다.");
  const form = new FormData(); form.set("file", file);
  const response = await fetch("/api/cms/upload", { method: "POST", body: form });
  const body = await response.json() as { filename?: string; src?: string; error?: string };
  if (!response.ok || !body.filename || !body.src) throw new Error(body.error || "이미지 업로드에 실패했습니다.");
  return { id: crypto.randomUUID(), filename: body.filename, src: body.src, alt: "", caption: "", category: "Uploads", source: "upload", objectPosition: "center", mimeType: file.type, byteSize: file.size };
}

export async function validateExternalImage(url: string): Promise<string> {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("HTTPS 이미지 URL만 사용할 수 있습니다.");
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => reject(new Error("이미지 확인 시간이 초과되었습니다.")), 10000);
    image.onload = () => {
      window.clearTimeout(timer);
      if (image.naturalWidth > 0) resolve();
      else reject(new Error("유효한 이미지가 아닙니다."));
    };
    image.onerror = () => { window.clearTimeout(timer); reject(new Error("URL에서 이미지를 불러올 수 없습니다.")); };
    image.src = parsed.toString();
  });
  return parsed.toString();
}

export async function registerExternalAsset(url: string, alt: string): Promise<AssetRecord> {
  if (!alt.trim()) throw new Error("외부 이미지 alt text를 입력하세요.");
  const validatedUrl = await validateExternalImage(url);
  const filename = new URL(validatedUrl).pathname.split("/").pop() || "external-image";
  return { id: crypto.randomUUID(), filename, src: validatedUrl, alt: alt.trim(), caption: "", category: "External", source: "external", objectPosition: "center", mimeType: "image/external", byteSize: 0 };
}

export { validateSnapshot };
