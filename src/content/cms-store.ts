"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { seedSnapshot } from "./seed";
import type { AssetRecord, PortfolioSnapshot, RevisionRecord } from "./schema";

export const STORAGE_KEYS = {
  draft: "portfolio-cms-draft-v1",
  published: "portfolio-cms-published-v1",
  preview: "portfolio-cms-live-preview-v1",
  revisions: "portfolio-cms-revisions-v1",
} as const;

const cloneSeed = () => structuredClone(seedSnapshot);

export function validateSnapshot(snapshot: PortfolioSnapshot) {
  const errors: string[] = [];
  if (!snapshot.home.hero.title.trim()) errors.push("Hero title은 필수입니다.");
  if (!snapshot.home.hero.description.trim()) errors.push("Hero description은 필수입니다.");
  if (!snapshot.home.about.image.alt.trim()) errors.push("About 이미지 alt는 필수입니다.");
  const featured = snapshot.works.filter((work) => work.homeFeatured);
  if (featured.length !== 1) errors.push("홈 대표작은 정확히 한 개여야 합니다.");
  if (featured.some((work) => !work.showOnHome)) errors.push("홈 대표작은 Home 노출 상태여야 합니다.");
  if (snapshot.works.some((work) => !work.title.trim() || !work.alt.trim() || !work.src.trim())) errors.push("모든 Work에는 title, image, alt가 필요합니다.");
  const urls = [snapshot.home.projects.supportingUrl, snapshot.home.contact.resumeUrl, ...snapshot.projects.map((project) => project.liveUrl ?? "")].filter(Boolean);
  for (const value of urls) {
    try { const url = new URL(value); if (url.protocol !== "https:") errors.push(`HTTPS URL만 게시할 수 있습니다: ${value}`); }
    catch { errors.push(`올바르지 않은 URL입니다: ${value}`); }
  }
  if (errors.length) throw new Error(errors.join(" "));
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocal(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
  new BroadcastChannel("portfolio-cms").postMessage({ key });
}

function getSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) : null;
}

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
}

export function setLivePreview(snapshot: PortfolioSnapshot) {
  writeLocal(STORAGE_KEYS.preview, snapshot);
}

export async function loadDraft(): Promise<PortfolioSnapshot> {
  const client = getSupabase();
  if (client) {
    const { data } = await client.from("portfolio_cms_state").select("draft_snapshot").eq("id", "portfolio").maybeSingle();
    if (data?.draft_snapshot) return data.draft_snapshot as PortfolioSnapshot;
  }
  return readLocal(STORAGE_KEYS.draft, cloneSeed());
}

export async function loadPublished(preview = false): Promise<PortfolioSnapshot> {
  if (preview) return readLocal(STORAGE_KEYS.preview, await loadDraft());
  const client = getSupabase();
  if (client) {
    const { data } = await client.from("published_versions").select("snapshot").eq("is_current", true).maybeSingle();
    if (data?.snapshot) return data.snapshot as PortfolioSnapshot;
  }
  return readLocal(STORAGE_KEYS.published, cloneSeed());
}

export async function saveDraft(snapshot: PortfolioSnapshot, note = "Draft saved") {
  validateSnapshot(snapshot);
  const client = getSupabase();
  if (client) {
    const { data: state } = await client.from("portfolio_cms_state").select("draft_revision").eq("id", "portfolio").maybeSingle();
    const nextRevision = Number(state?.draft_revision ?? 0) + 1;
    const { error } = await client.from("portfolio_cms_state").upsert({ id: "portfolio", draft_snapshot: snapshot, draft_revision: nextRevision, updated_at: new Date().toISOString() });
    if (error) throw error;
    await client.from("draft_revisions").insert({ draft_revision: nextRevision, snapshot, change_note: note });
  } else {
    writeLocal(STORAGE_KEYS.draft, snapshot);
  }
  setLivePreview(snapshot);
}

export async function publishDraft(snapshot: PortfolioSnapshot): Promise<RevisionRecord> {
  await saveDraft(snapshot, "Publish candidate");
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.rpc("publish_portfolio");
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return { id: String(row.id), versionNumber: Number(row.version_number), snapshot, publishedAt: String(row.published_at) };
  }
  const revisions = readLocal<RevisionRecord[]>(STORAGE_KEYS.revisions, []);
  const revision: RevisionRecord = {
    id: crypto.randomUUID(),
    versionNumber: (revisions[0]?.versionNumber ?? 0) + 1,
    snapshot: structuredClone(snapshot),
    publishedAt: new Date().toISOString(),
  };
  writeLocal(STORAGE_KEYS.published, snapshot);
  writeLocal(STORAGE_KEYS.revisions, [revision, ...revisions].slice(0, 20));
  return revision;
}

export async function loadRevisions(): Promise<RevisionRecord[]> {
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.from("published_versions").select("id,version_number,snapshot,published_at,change_note").order("version_number", { ascending: false }).limit(20);
    if (error) throw error;
    return (data ?? []).map((item) => ({ id: String(item.id), versionNumber: Number(item.version_number), snapshot: item.snapshot as PortfolioSnapshot, publishedAt: String(item.published_at), note: item.change_note ?? undefined }));
  }
  return readLocal(STORAGE_KEYS.revisions, []);
}

export async function restoreRevision(revision: RevisionRecord) {
  await saveDraft(revision.snapshot, `Restored from version ${revision.versionNumber}`);
  return revision.snapshot;
}

export async function uploadAsset(file: File): Promise<AssetRecord> {
  if (!file.type.startsWith("image/")) throw new Error("이미지 파일만 업로드할 수 있습니다.");
  if (file.size > 10 * 1024 * 1024) throw new Error("이미지는 10MB 이하여야 합니다.");
  const client = getSupabase();
  let src = "";
  let source: AssetRecord["source"] = "upload";
  if (client) {
    const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
    const { error } = await client.storage.from("portfolio-assets").upload(path, file, { upsert: false, contentType: file.type });
    if (error) throw error;
    src = client.storage.from("portfolio-assets").getPublicUrl(path).data.publicUrl;
  } else {
    src = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
    source = "upload";
  }
  return { id: crypto.randomUUID(), filename: file.name, src, alt: "", caption: "", category: "Uploads", source, objectPosition: "center" };
}
