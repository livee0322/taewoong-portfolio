"use client";

import { useEffect, useMemo, useState } from "react";
import { adminNavigation } from "@/admin/navigation";
import type { AdminNavItem, AdminSectionId, AdminViewport, PreviewMode } from "@/admin/types";
import { isSupabaseConfigured, loadDraft, loadRevisions, PublishError, publishDraft, restoreRevision, saveDraft, setLivePreview } from "@/content/cms-store";
import { seedSnapshot } from "@/content/seed";
import type { PortfolioSnapshot, RevisionRecord } from "@/content/schema";
import { AdminPreview } from "./AdminPreview";
import { PropertyEditor } from "./PropertyEditor";
import styles from "./admin.module.css";

type SaveState = "loading" | "saved" | "unsaved" | "saving" | "draft" | "publishing" | "published" | "error";
type TabletPane = "editor" | "preview";
type ConnectionState = "checking" | "connected" | "local" | "saving" | "error";

export function AdminStudio() {
  const [selectedId, setSelectedId] = useState<AdminSectionId>("home.hero");
  const [viewport, setViewport] = useState<AdminViewport>("desktop");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("section");
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [tabletPane, setTabletPane] = useState<TabletPane>("editor");
  const [content, setContent] = useState<PortfolioSnapshot>(seedSnapshot);
  const [revisions, setRevisions] = useState<RevisionRecord[]>([]);
  const [message, setMessage] = useState("");
  const [connectionState, setConnectionState] = useState<ConnectionState>("checking");
  const [projectPreviewSlug, setProjectPreviewSlug] = useState("livbee");

  useEffect(() => {
    Promise.all([loadDraft(), loadRevisions()]).then(([draft, history]) => {
      setContent(draft); setRevisions(history); setLivePreview(draft); setSaveState("saved"); setConnectionState(isSupabaseConfigured() ? "connected" : "local");
    }).catch((error: unknown) => { setMessage(error instanceof Error ? error.message : "CMS를 불러오지 못했습니다."); setSaveState("error"); setConnectionState("error"); });
  }, []);

  useEffect(() => {
    if (saveState === "unsaved") setLivePreview(content);
  }, [content, saveState]);

  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (saveState === "unsaved") event.preventDefault(); };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [saveState]);

  const selectedItem = useMemo<AdminNavItem>(() => adminNavigation.flatMap((group) => group.items).find((item) => item.id === selectedId) ?? adminNavigation[0].items[0], [selectedId]);
  const updateContent = (next: PortfolioSnapshot) => { setContent(next); setSaveState("unsaved"); setMessage(""); };

  const handleSave = async () => {
    setSaveState("saving"); if (isSupabaseConfigured()) setConnectionState("saving");
    try { await saveDraft(content); setSaveState("draft"); setConnectionState(isSupabaseConfigured() ? "connected" : "local"); setMessage("Draft가 저장되었습니다. 공개 화면은 아직 변경되지 않았습니다."); }
    catch (error) { setSaveState("error"); setConnectionState("error"); setMessage(error instanceof Error ? error.message : "Draft 저장에 실패했습니다."); }
  };

  const handlePublish = async () => {
    setSaveState("publishing"); if (isSupabaseConfigured()) setConnectionState("saving");
    try {
      const revision = await publishDraft(content);
      setRevisions((current) => [revision, ...current.filter((item) => item.id !== revision.id)].slice(0, 20));
      setSaveState("published"); setConnectionState(isSupabaseConfigured() ? "connected" : "local"); setMessage(`Version ${revision.versionNumber}을 ${new Date(revision.publishedAt).toLocaleString("ko-KR")}에 공개했습니다.`);
    } catch (error) {
      if (error instanceof PublishError) {
        setSaveState("draft"); setConnectionState("error"); setMessage(`Draft saved · Publish failed: ${error.message}`);
      } else {
        setSaveState("error"); setConnectionState("error"); setMessage(error instanceof Error ? error.message : "Publish에 실패했습니다.");
      }
    }
  };

  const handleRestore = async (revision: RevisionRecord) => {
    const restored = await restoreRevision(revision);
    setContent(structuredClone(restored)); setLivePreview(restored); setSaveState("draft");
    setMessage(`Version ${revision.versionNumber}을 Draft로 복원했습니다. Publish 전까지 공개 화면은 유지됩니다.`);
  };

  const stateLabel: Record<SaveState, string> = {
    loading: "Loading", saved: "Saved", unsaved: "Unsaved changes", saving: "Saving…", draft: "Draft saved", publishing: "Publishing…", published: "Published", error: "Action failed",
  };
  const connectionLabel: Record<ConnectionState, string> = { checking: "Connecting…", connected: "Connected", local: "Local mode", saving: "Saving", error: "Error" };

  return <main className={`${styles.adminRoot} admin-route-marker`}>
    <header className={styles.topbar}>
      <div className={styles.brandBlock}><span className={styles.brandMark}>TL</span><div><strong>Portfolio Editor</strong><span>{isSupabaseConfigured() ? `Supabase · ${connectionLabel[connectionState]}` : "Local fallback · env missing"}</span></div></div>
      <div className={styles.documentState} aria-live="polite"><span className={`${styles.stateDot} ${saveState === "unsaved" || connectionState === "error" ? styles.stateDirty : ""}`} />{connectionLabel[connectionState]} · {stateLabel[saveState]}</div>
      <div className={styles.topActions}>
        <button className={styles.secondaryButton} type="button" disabled={saveState === "saving" || saveState === "publishing"} onClick={handleSave}>Save Draft</button>
        <button className={styles.secondaryButton} type="button" onClick={() => setTabletPane("preview")}>Preview</button>
        <button className={styles.primaryButton} type="button" disabled={saveState === "loading" || saveState === "publishing"} onClick={handlePublish}>Publish</button>
      </div>
    </header>
    {message ? <div className={styles.statusBanner} role={saveState === "error" ? "alert" : "status"}>{message}</div> : null}
    <div className={styles.tabletSwitch} role="tablist" aria-label="편집 화면 전환"><button className={tabletPane === "editor" ? styles.tabActive : ""} type="button" role="tab" aria-selected={tabletPane === "editor"} onClick={() => setTabletPane("editor")}>Editor</button><button className={tabletPane === "preview" ? styles.tabActive : ""} type="button" role="tab" aria-selected={tabletPane === "preview"} onClick={() => setTabletPane("preview")}>Preview</button></div>
    <label className={styles.mobileSectionPicker}><span>Section</span><select value={selectedId} onChange={(event) => setSelectedId(event.target.value as AdminSectionId)}>{adminNavigation.map((group) => <optgroup label={group.label} key={group.label}>{group.items.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</optgroup>)}</select></label>
    <div className={styles.studioGrid} data-tablet-pane={tabletPane}>
      <aside className={styles.navigator} aria-label="Portfolio section navigator">
        <div className={styles.navigatorTitle}><p className={styles.kicker}>Structure</p><h1>Portfolio</h1></div>
        <nav>{adminNavigation.map((group) => <section key={group.label} className={styles.navGroup}><h2>{group.label}</h2><div>{group.items.map((item) => <button key={item.id} className={selectedId === item.id ? styles.navActive : ""} type="button" aria-current={selectedId === item.id ? "page" : undefined} onClick={() => { setSelectedId(item.id); if (item.id === "works.archive" || item.id === "projects.index") setPreviewMode("page"); }}><span>{item.number ?? "—"}</span><strong>{item.label}</strong>{selectedId === item.id ? <i aria-hidden="true" /> : null}</button>)}</div></section>)}</nav>
        <div className={styles.navigatorFooter}><span>Public write CMS</span><p>No login · Draft / Publish separated</p></div>
      </aside>
      <div className={styles.editorColumn}><PropertyEditor selectedItem={selectedItem} content={content} onChange={updateContent} revisions={revisions} onRestore={handleRestore} onProjectSelect={setProjectPreviewSlug} /></div>
      <div className={styles.previewColumn}><AdminPreview selectedItem={selectedItem} viewport={viewport} mode={previewMode} onViewportChange={setViewport} onModeChange={setPreviewMode} onSelectSection={setSelectedId} projectSlug={projectPreviewSlug} /></div>
    </div>
  </main>;
}
