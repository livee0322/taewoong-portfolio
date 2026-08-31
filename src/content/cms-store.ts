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

type AssetRow = {
  id: string;
  storage_path: string | null;
  external_url: string | null;
  public_path: string | null;
  filename: string;
  mime_type: string;
  byte_size: number;
  alt_text: string;
  caption: string;
  category: string;
  source: AssetRecord["source"];
  object_position: AssetRecord["objectPosition"];
};

function assetFromRow(client: SupabaseClient, row: AssetRow): AssetRecord {
  const src = row.storage_path
    ? client.storage.from("portfolio-assets").getPublicUrl(row.storage_path).data.publicUrl
    : row.external_url ?? row.public_path ?? "";
  return {
    id: row.id,
    filename: row.filename,
    src,
    alt: row.alt_text,
    caption: row.caption,
    category: row.category,
    source: row.source,
    objectPosition: row.object_position,
    mimeType: row.mime_type,
    byteSize: Number(row.byte_size),
    storagePath: row.storage_path ?? undefined,
  };
}

function assetToRow(asset: AssetRecord): AssetRow {
  const isLocal = asset.src.startsWith("/");
  const isExternal = asset.source === "external";
  return {
    id: asset.id,
    storage_path: asset.storagePath ?? null,
    external_url: isExternal ? asset.src : null,
    public_path: isLocal ? asset.src : null,
    filename: asset.filename,
    mime_type: asset.mimeType ?? (isExternal ? "image/external" : "image/local"),
    byte_size: asset.byteSize ?? 0,
    alt_text: asset.alt,
    caption: asset.caption,
    category: asset.category,
    source: asset.source,
    object_position: asset.objectPosition,
  };
}

async function loadAssets(client: SupabaseClient) {
  const { data, error } = await client.from("assets").select("id,storage_path,external_url,public_path,filename,mime_type,byte_size,alt_text,caption,category,source,object_position").order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((row) => assetFromRow(client, row as AssetRow));
}

async function persistAssets(client: SupabaseClient, assets: AssetRecord[]) {
  if (!assets.length) return;
  const { error } = await client.from("assets").upsert(assets.map(assetToRow), { onConflict: "id" });
  if (error) throw error;
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
    const [{ data, error }, assets] = await Promise.all([
      client.from("portfolio_cms_state").select("draft_snapshot").eq("id", "portfolio").maybeSingle(),
      loadAssets(client),
    ]);
    if (error) throw error;
    const snapshot = data?.draft_snapshot ? structuredClone(data.draft_snapshot as PortfolioSnapshot) : cloneSeed();
    if (assets.length) {
      const seedAssets = data?.draft_snapshot ? [] : snapshot.assets;
      snapshot.assets = [...seedAssets, ...assets].filter((asset, index, all) => all.findIndex((item) => item.id === asset.id) === index);
    }
    return snapshot;
  }
  return readLocal(STORAGE_KEYS.draft, cloneSeed());
}

export async function loadPublished(preview = false): Promise<PortfolioSnapshot> {
  if (preview) return readLocal(STORAGE_KEYS.preview, await loadDraft());
  const client = getSupabase();
  if (client) {
    const { data, error } = await client.from("published_versions").select("snapshot").eq("is_current", true).maybeSingle();
    if (error) throw error;
    if (data?.snapshot) return data.snapshot as PortfolioSnapshot;
    return cloneSeed();
  }
  return readLocal(STORAGE_KEYS.published, cloneSeed());
}

export async function saveDraft(snapshot: PortfolioSnapshot, note = "Draft saved") {
  validateSnapshot(snapshot);
  const client = getSupabase();
  if (client) {
    await persistAssets(client, snapshot.assets);
    const { error } = await client.rpc("save_portfolio_draft", { candidate: snapshot, note });
    if (error) throw error;
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
    if (error) throw new PublishError(error.message);
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

export class PublishError extends Error {
  readonly draftSaved = true;
  constructor(message: string) {
    super(message);
    this.name = "PublishError";
  }
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
    const asset: AssetRecord = { id: crypto.randomUUID(), filename: file.name, src, alt: "", caption: "", category: "Uploads", source, objectPosition: "center", mimeType: file.type, byteSize: file.size, storagePath: path };
    const { error: metadataError } = await client.from("assets").insert(assetToRow(asset));
    if (metadataError) {
      const { error: cleanupError } = await client.storage.from("portfolio-assets").remove([path]);
      throw new Error(cleanupError ? `${metadataError.message} (orphan cleanup failed: ${cleanupError.message})` : metadataError.message);
    }
    return asset;
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

export async function validateExternalImage(url: string): Promise<string> {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") throw new Error("HTTPS 이미지 URL만 사용할 수 있습니다.");
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    const timer = window.setTimeout(() => reject(new Error("이미지 확인 시간이 초과되었습니다.")), 10000);
    image.onload = () => {
      window.clearTimeout(timer);
      if (image.src && image.naturalWidth > 0) resolve();
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
  const parsed = new URL(validatedUrl);
  const filename = parsed.pathname.split("/").pop() || "external-image";
  const asset: AssetRecord = { id: crypto.randomUUID(), filename, src: validatedUrl, alt: alt.trim(), caption: "", category: "External", source: "external", objectPosition: "center", mimeType: "image/external", byteSize: 0 };
  const client = getSupabase();
  if (client) {
    const { error } = await client.from("assets").insert(assetToRow(asset));
    if (error) throw error;
  }
  return asset;
}
