"use client";

import { useMemo, useRef, useState } from "react";
import { SafeImage } from "@/components/ui/SafeImage";
import { validateExternalImage } from "@/content/cms-store";
import type { AssetRecord } from "@/content/schema";
import styles from "./admin.module.css";

type Props = {
  open: boolean;
  assets: AssetRecord[];
  onClose: () => void;
  onSelect: (asset: AssetRecord) => void;
  onUpload: (file: File) => Promise<AssetRecord>;
  onExternal: (url: string, alt: string) => Promise<AssetRecord>;
};

export function AssetPicker({ open, assets, onClose, onSelect, onUpload, onExternal }: Props) {
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState<"library" | "upload" | "external">("library");
  const [url, setUrl] = useState("");
  const [alt, setAlt] = useState("");
  const [verifiedUrl, setVerifiedUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const filters = useMemo(() => ["All", ...Array.from(new Set(assets.map((asset) => asset.category)))], [assets]);
  const filtered = filter === "All" ? assets : assets.filter((asset) => asset.category === filter);
  if (!open) return null;

  const handleFile = async (file?: File) => {
    if (!file) return;
    setBusy(true); setError("");
    try { const asset = await onUpload(file); onSelect(asset); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "업로드에 실패했습니다."); }
    finally { setBusy(false); }
  };
  const verifyUrl = async () => {
    setBusy(true); setError(""); setVerifiedUrl("");
    try { setVerifiedUrl(await validateExternalImage(url)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "이미지를 확인할 수 없습니다."); }
    finally { setBusy(false); }
  };
  const selectExternal = async () => {
    if (!verifiedUrl) { setError("먼저 현재 URL의 이미지를 확인하세요."); return; }
    if (!alt.trim()) { setError("alt text를 입력하세요."); return; }
    setBusy(true); setError("");
    try { onSelect(await onExternal(verifiedUrl, alt)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "외부 이미지를 저장하지 못했습니다."); }
    finally { setBusy(false); }
  };

  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}><section className={styles.assetModal} role="dialog" aria-modal="true" aria-labelledby="asset-picker-title" onMouseDown={(event) => event.stopPropagation()}>
    <header className={styles.modalHeader}><div><p className={styles.kicker}>Image source</p><h2 id="asset-picker-title">이미지 선택</h2></div><button className={styles.iconButton} type="button" onClick={onClose} aria-label="닫기">×</button></header>
    <div className={styles.sourceTabs} role="tablist">{([["library","Asset Library"],["upload","Upload"],["external","URL"]] as const).map(([value,label]) => <button key={value} className={tab === value ? styles.tabActive : ""} type="button" role="tab" aria-selected={tab === value} onClick={() => { setTab(value); setError(""); }}>{label}</button>)}</div>
    {error ? <p className={styles.previewWarning} role="alert">{error}</p> : null}
    {tab === "library" ? <><div className={styles.assetFilters}>{filters.map((item) => <button key={item} className={filter === item ? styles.filterActive : ""} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div><div className={styles.assetGrid}>{filtered.map((asset) => <button className={styles.assetCard} key={asset.id} type="button" onClick={() => onSelect(asset)}><span className={styles.assetThumb}><SafeImage src={asset.src} alt="" fill sizes="180px" style={{ objectFit: "cover" }} /></span><span className={styles.assetName}>{asset.filename}</span><span className={styles.assetMeta}>{asset.category} · {asset.source}</span></button>)}</div></> : null}
    {tab === "upload" ? <div className={styles.dropzone} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files[0]); }}><span aria-hidden="true">＋</span><strong>파일을 놓거나 PC에서 선택</strong><p>JPG, PNG, WebP · 10MB 이하</p><input ref={inputRef} hidden type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => void handleFile(event.target.files?.[0])} /><button className={styles.secondaryButton} type="button" disabled={busy} onClick={() => inputRef.current?.click()}>{busy ? "Uploading…" : "파일 선택"}</button></div> : null}
    {tab === "external" ? <div className={styles.externalPanel}><label className={styles.field}><span>HTTPS Image URL</span><input type="url" value={url} placeholder="https://example.com/image.jpg" onChange={(event) => { setUrl(event.target.value); setVerifiedUrl(""); }} /><small>원격 서버에서 실제 이미지가 열리는지 확인한 뒤에만 사용할 수 있습니다.</small></label><label className={styles.field}><span>Alt text</span><textarea required rows={3} value={alt} onChange={(event) => setAlt(event.target.value)} /></label>{verifiedUrl ? <div className={styles.externalPreview}><SafeImage src={verifiedUrl} alt={alt || "외부 이미지 미리보기"} fill style={{ objectFit: "contain" }} /></div> : null}<div className={styles.externalActions}><button className={styles.secondaryButton} type="button" disabled={busy || !url} onClick={() => void verifyUrl()}>{busy ? "Checking…" : "이미지 확인"}</button><button className={styles.primaryButton} type="button" disabled={busy || !verifiedUrl || !alt.trim()} onClick={() => void selectExternal()}>이 이미지 사용</button></div></div> : null}
  </section></div>;
}
