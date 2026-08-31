"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import type { AssetRecord } from "@/content/schema";
import styles from "./admin.module.css";

type Props = { open: boolean; assets: AssetRecord[]; onClose: () => void; onSelect: (asset: AssetRecord) => void; onUpload: (file: File) => Promise<AssetRecord> };

export function AssetPicker({ open, assets, onClose, onSelect, onUpload }: Props) {
  const [filter, setFilter] = useState("All");
  const [tab, setTab] = useState<"library" | "upload" | "external">("library");
  const [url, setUrl] = useState("");
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
  const useUrl = () => {
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== "https:") throw new Error("HTTPS 이미지 URL만 사용할 수 있습니다.");
      const filename = parsed.pathname.split("/").pop() || "external-image";
      onSelect({ id: crypto.randomUUID(), filename, src: parsed.toString(), alt: "", caption: "", category: "External", source: "external", objectPosition: "center" });
    } catch (reason) { setError(reason instanceof Error ? reason.message : "올바른 URL을 입력하세요."); }
  };

  return <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}><section className={styles.assetModal} role="dialog" aria-modal="true" aria-labelledby="asset-picker-title" onMouseDown={(event) => event.stopPropagation()}>
    <header className={styles.modalHeader}><div><p className={styles.kicker}>Image source</p><h2 id="asset-picker-title">이미지 선택</h2></div><button className={styles.iconButton} type="button" onClick={onClose} aria-label="닫기">×</button></header>
    <div className={styles.sourceTabs} role="tablist">{([['library','Asset Library'],['upload','Upload'],['external','URL']] as const).map(([value,label]) => <button key={value} className={tab === value ? styles.tabActive : ""} type="button" role="tab" aria-selected={tab === value} onClick={() => { setTab(value); setError(""); }}>{label}</button>)}</div>
    {error ? <p className={styles.previewWarning} role="alert">{error}</p> : null}
    {tab === "library" ? <><div className={styles.assetFilters}>{filters.map((item) => <button key={item} className={filter === item ? styles.filterActive : ""} type="button" onClick={() => setFilter(item)}>{item}</button>)}</div><div className={styles.assetGrid}>{filtered.map((asset) => <button className={styles.assetCard} key={asset.id} type="button" onClick={() => onSelect(asset)}><span className={styles.assetThumb}><Image src={asset.src} alt="" fill sizes="180px" unoptimized={asset.src.startsWith("data:")} /></span><span className={styles.assetName}>{asset.filename}</span><span className={styles.assetMeta}>{asset.category} · {asset.source}</span></button>)}</div></> : null}
    {tab === "upload" ? <div className={styles.dropzone} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); void handleFile(event.dataTransfer.files[0]); }}><span aria-hidden="true">＋</span><strong>파일을 놓거나 PC에서 선택</strong><p>JPG, PNG, WebP · 10MB 이하</p><input ref={inputRef} hidden type="file" accept="image/*" onChange={(event) => void handleFile(event.target.files?.[0])} /><button className={styles.secondaryButton} type="button" disabled={busy} onClick={() => inputRef.current?.click()}>{busy ? "Uploading…" : "파일 선택"}</button></div> : null}
    {tab === "external" ? <div className={styles.externalPanel}><label className={styles.field}><span>HTTPS Image URL</span><input type="url" value={url} placeholder="https://example.com/image.jpg" onChange={(event) => setUrl(event.target.value)} /><small>외부 URL은 원본 변경이나 hotlink 차단 위험이 있습니다.</small></label><button className={styles.secondaryButton} type="button" onClick={useUrl}>이 이미지 사용</button></div> : null}
  </section></div>;
}
