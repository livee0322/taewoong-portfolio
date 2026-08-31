"use client";

import { useEffect } from "react";

export function CmsPreviewBridge() {
  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("cmsPreview") === "draft";
    if (!preview) return;
    const focus = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.data?.type !== "cms:focus") return;
      document.querySelector(`[data-cms-section="${CSS.escape(event.data.sectionId)}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    const click = (event: MouseEvent) => {
      const section = (event.target as Element | null)?.closest?.("[data-cms-section]");
      if (!section) return;
      window.parent.postMessage({ type: "cms:select", sectionId: section.getAttribute("data-cms-section") }, window.location.origin);
    };
    window.addEventListener("message", focus);
    document.addEventListener("click", click);
    return () => { window.removeEventListener("message", focus); document.removeEventListener("click", click); };
  }, []);
  return null;
}
