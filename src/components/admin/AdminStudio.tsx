"use client";

import { useMemo, useState } from "react";
import { adminNavigation } from "@/admin/mock-data";
import type { AdminNavItem, AdminSectionId, AdminViewport, PreviewMode } from "@/admin/types";
import { AdminPreview } from "./AdminPreview";
import { PropertyEditor } from "./PropertyEditor";
import styles from "./admin.module.css";

type SaveState = "saved" | "unsaved" | "draft" | "published";
type TabletPane = "editor" | "preview";

export function AdminStudio() {
  const [selectedId, setSelectedId] = useState<AdminSectionId>("home.hero");
  const [viewport, setViewport] = useState<AdminViewport>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("section");
  const [saveState, setSaveState] = useState<SaveState>("saved");
  const [tabletPane, setTabletPane] = useState<TabletPane>("editor");

  const selectedItem = useMemo<AdminNavItem>(
    () => adminNavigation.flatMap((group) => group.items).find((item) => item.id === selectedId) ?? adminNavigation[0].items[0],
    [selectedId],
  );

  const selectSection = (item: AdminNavItem) => {
    setSelectedId(item.id);
    if (item.id === "works.archive") setPreviewMode("page");
  };

  return (
    <main className={`${styles.adminRoot} admin-route-marker`}>
      <header className={styles.topbar}>
        <div className={styles.brandBlock}>
          <span className={styles.brandMark}>TL</span>
          <div><strong>Portfolio Editor</strong><span>Foundation workspace</span></div>
        </div>
        <div className={styles.documentState} aria-live="polite">
          <span className={`${styles.stateDot} ${saveState === "unsaved" ? styles.stateDirty : ""}`} />
          {saveState === "unsaved" ? "Unsaved changes" : saveState === "published" ? "Published" : saveState === "draft" ? "Draft saved" : "Saved"}
        </div>
        <div className={styles.topActions}>
          <button className={styles.secondaryButton} type="button" onClick={() => setSaveState("draft")}>Save Draft</button>
          <button className={styles.secondaryButton} type="button" onClick={() => setTabletPane("preview")}>Preview</button>
          <button className={styles.primaryButton} type="button" onClick={() => setSaveState("published")}>Publish</button>
        </div>
      </header>

      <div className={styles.tabletSwitch} role="tablist" aria-label="편집 화면 전환">
        <button className={tabletPane === "editor" ? styles.tabActive : ""} type="button" role="tab" aria-selected={tabletPane === "editor"} onClick={() => setTabletPane("editor")}>Editor</button>
        <button className={tabletPane === "preview" ? styles.tabActive : ""} type="button" role="tab" aria-selected={tabletPane === "preview"} onClick={() => setTabletPane("preview")}>Preview</button>
      </div>

      <div className={styles.studioGrid} data-tablet-pane={tabletPane}>
        <aside className={styles.navigator} aria-label="Portfolio section navigator">
          <div className={styles.navigatorTitle}><p className={styles.kicker}>Structure</p><h1>Portfolio</h1></div>
          <nav>
            {adminNavigation.map((group) => (
              <section key={group.label} className={styles.navGroup}>
                <h2>{group.label}</h2>
                <div>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      className={selectedId === item.id ? styles.navActive : ""}
                      type="button"
                      aria-current={selectedId === item.id ? "page" : undefined}
                      onClick={() => selectSection(item)}
                    >
                      {item.number ? <span>{item.number}</span> : <span>—</span>}
                      <strong>{item.label}</strong>
                      {selectedId === item.id ? <i aria-hidden="true" /> : null}
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </nav>
          <div className={styles.navigatorFooter}>
            <span>Draft workspace</span>
            <p>Mock adapter · no production write</p>
          </div>
        </aside>

        <div className={styles.editorColumn}>
          <PropertyEditor selectedItem={selectedItem} onDirty={() => setSaveState("unsaved")} />
        </div>
        <div className={styles.previewColumn}>
          <AdminPreview
            selectedItem={selectedItem}
            viewport={viewport}
            mode={previewMode}
            onViewportChange={setViewport}
            onModeChange={setPreviewMode}
          />
        </div>
      </div>
    </main>
  );
}
