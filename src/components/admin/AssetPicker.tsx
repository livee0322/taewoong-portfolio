"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { mockAssets } from "@/admin/mock-data";
import type { AssetRecord } from "@/admin/types";
import styles from "./admin.module.css";

type AssetPickerProps = {
  open: boolean;
  onClose: () => void;
  onSelect: (asset: AssetRecord) => void;
};

const filters = ["All", "Home", "LIVBEE", "Works", "Shopping Live"];

export function AssetPicker({ open, onClose, onSelect }: AssetPickerProps) {
  const [filter, setFilter] = useState("All");
  const [sourceTab, setSourceTab] = useState<"library" | "upload" | "external">("library");
  const filteredAssets = useMemo(
    () => (filter === "All" ? mockAssets : mockAssets.filter((asset) => asset.category === filter)),
    [filter],
  );

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.assetModal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="asset-picker-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className={styles.modalHeader}>
          <div>
            <p className={styles.kicker}>Image source</p>
            <h2 id="asset-picker-title">이미지 선택</h2>
          </div>
          <button className={styles.iconButton} type="button" onClick={onClose} aria-label="이미지 선택 닫기">×</button>
        </header>

        <div className={styles.sourceTabs} role="tablist" aria-label="이미지 입력 방식">
          {([
            ["library", "Asset Library"],
            ["upload", "Upload"],
            ["external", "External URL"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              className={sourceTab === value ? styles.tabActive : ""}
              type="button"
              role="tab"
              aria-selected={sourceTab === value}
              onClick={() => setSourceTab(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {sourceTab === "library" ? (
          <>
            <div className={styles.assetFilters} aria-label="Asset category filter">
              {filters.map((item) => (
                <button
                  key={item}
                  className={filter === item ? styles.filterActive : ""}
                  type="button"
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className={styles.assetGrid}>
              {filteredAssets.map((asset) => (
                <button className={styles.assetCard} key={asset.id} type="button" onClick={() => onSelect(asset)}>
                  <span className={styles.assetThumb}>
                    <Image src={asset.src} alt="" fill sizes="180px" />
                  </span>
                  <span className={styles.assetName}>{asset.filename}</span>
                  <span className={styles.assetMeta}>{asset.width} × {asset.height} · {asset.usageCount}곳 사용</span>
                </button>
              ))}
            </div>
          </>
        ) : null}

        {sourceTab === "upload" ? (
          <div className={styles.dropzone}>
            <span aria-hidden="true">＋</span>
            <strong>파일을 놓거나 PC에서 선택</strong>
            <p>JPG, PNG, WebP · 원본 10MB 이하 권장</p>
            <button className={styles.secondaryButton} type="button">파일 선택</button>
          </div>
        ) : null}

        {sourceTab === "external" ? (
          <div className={styles.externalPanel}>
            <label className={styles.field}>
              <span>Image URL</span>
              <input type="url" placeholder="https://example.com/image.jpg" />
              <small>외부 이미지는 주소 변경·차단 위험이 있어 게시 전 Storage 복사를 권장합니다.</small>
            </label>
            <button className={styles.secondaryButton} type="button">URL 확인</button>
          </div>
        ) : null}
      </section>
    </div>
  );
}
