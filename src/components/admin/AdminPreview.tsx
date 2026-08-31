"use client";

import type { AdminNavItem, AdminViewport, PreviewMode } from "@/admin/types";
import { viewportWidths } from "@/admin/types";
import styles from "./admin.module.css";

type AdminPreviewProps = {
  selectedItem: AdminNavItem;
  viewport: AdminViewport;
  mode: PreviewMode;
  onViewportChange: (viewport: AdminViewport) => void;
  onModeChange: (mode: PreviewMode) => void;
};

export function AdminPreview({ selectedItem, viewport, mode, onViewportChange, onModeChange }: AdminPreviewProps) {
  const anchor = selectedItem.previewAnchor ? `#${selectedItem.previewAnchor}` : "";
  const isHomeSection = selectedItem.id.startsWith("home.");
  const source = selectedItem.id === "works.archive" ? "/works" : selectedItem.id === "projects.index" ? "/projects/livbee" : `/${anchor}`;
  const frameWidth = viewportWidths[viewport];

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
        {mode === "section" && !selectedItem.previewAnchor ? <span className={styles.previewWarning}>anchor contract pending</span> : null}
      </div>
      <div className={styles.previewStage} data-viewport={viewport}>
        <div className={styles.previewFrame} style={{ width: `${frameWidth}px` }}>
          <iframe key={`${source}-${mode}`} src={source} title={`${selectedItem.label} portfolio preview`} />
          {mode === "section" ? <div className={styles.sectionFocusLabel}>SECTION FOCUS · {selectedItem.label}</div> : null}
        </div>
      </div>
      <p className={styles.previewFootnote}>현재 iframe은 published Portfolio를 그대로 읽습니다. 편집값 반영과 Preview 클릭 선택은 integration contract의 section identifier 연결 후 활성화됩니다.</p>
    </section>
  );
}
