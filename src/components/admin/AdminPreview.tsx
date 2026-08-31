"use client";

import { useEffect, useRef } from "react";
import type { AdminNavItem, AdminSectionId, AdminViewport, PreviewMode } from "@/admin/types";
import { viewportWidths } from "@/admin/types";
import styles from "./admin.module.css";

type AdminPreviewProps = {
  selectedItem: AdminNavItem;
  viewport: AdminViewport;
  mode: PreviewMode;
  onViewportChange: (viewport: AdminViewport) => void;
  onModeChange: (mode: PreviewMode) => void;
  onSelectSection: (section: AdminSectionId) => void;
};

export function AdminPreview({ selectedItem, viewport, mode, onViewportChange, onModeChange, onSelectSection }: AdminPreviewProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const anchor = selectedItem.previewAnchor ? `#${selectedItem.previewAnchor}` : "";
  const isHomeSection = selectedItem.id.startsWith("home.");
  const path = selectedItem.id === "works.archive" ? "/works" : selectedItem.id === "projects.index" ? "/projects/livbee" : "/";
  const source = `${path}?cmsPreview=draft${anchor}`;
  const frameWidth = viewportWidths[viewport];

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "cms:select") return;
      onSelectSection(event.data.sectionId as AdminSectionId);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [onSelectSection]);

  useEffect(() => {
    frameRef.current?.contentWindow?.postMessage({ type: "cms:focus", sectionId: selectedItem.id }, window.location.origin);
  }, [selectedItem.id]);

  return (
    <section className={styles.previewPane} aria-labelledby="preview-heading">
      <div className={styles.previewToolbar}>
        <div>
          <p className={styles.kicker}>Live frame</p>
          <h2 id="preview-heading">Preview</h2>
        </div>
        <div className={styles.previewControls}>
          <div className={styles.segmented} aria-label="미리보기 범위">
            <button className={mode === "section" ? styles.segmentActive : ""} type="button" onClick={() => onModeChange("section")}>Section</button>
            <button className={mode === "page" ? styles.segmentActive : ""} type="button" onClick={() => onModeChange("page")}>Page</button>
          </div>
          <div className={styles.segmented} aria-label="미리보기 화면 크기">
            {(["desktop", "tablet", "mobile"] as AdminViewport[]).map((item) => (
              <button
                className={viewport === item ? styles.segmentActive : ""}
                key={item}
                type="button"
                onClick={() => onViewportChange(item)}
              >
                {item[0].toUpperCase()}
                <span className={styles.viewportLabel}>{item.slice(1)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.previewMeta}>
        <span>{frameWidth}px</span>
        <span>{isHomeSection ? selectedItem.id.replace("home.", "Home / ") : selectedItem.label}</span>
        {mode === "section" ? <span>linked selection</span> : null}
      </div>
      <div className={styles.previewStage} data-viewport={viewport}>
        <div className={styles.previewFrame} style={{ width: `${frameWidth}px` }}>
          <iframe ref={frameRef} key={`${path}-${mode}`} src={source} title={`${selectedItem.label} portfolio preview`} onLoad={() => frameRef.current?.contentWindow?.postMessage({ type: "cms:focus", sectionId: selectedItem.id }, window.location.origin)} />
          {mode === "section" ? <div className={styles.sectionFocusLabel}>SECTION FOCUS · {selectedItem.label}</div> : null}
        </div>
      </div>
      <p className={styles.previewFootnote}>편집값은 Draft Preview에 즉시 반영됩니다. Preview의 section을 클릭하면 왼쪽 편집 선택도 함께 이동합니다.</p>
    </section>
  );
}
