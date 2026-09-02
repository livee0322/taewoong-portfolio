"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadPublished, STORAGE_KEYS } from "./cms-store";
import { seedSnapshot } from "./seed";
import type { PortfolioSnapshot } from "./schema";

const ContentContext = createContext<PortfolioSnapshot>(seedSnapshot);

export function ContentProvider({ children, initialContent = seedSnapshot }: { children: React.ReactNode; initialContent?: PortfolioSnapshot }) {
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("cmsPreview") === "draft";
    let active = true;
    const refresh = () => loadPublished(preview).then((next) => { if (active) setContent(next); });
    void refresh();
    const channel = new BroadcastChannel("portfolio-cms");
    const receive = (key: string | null | undefined) => {
      if ((preview && (key === STORAGE_KEYS.preview || key === STORAGE_KEYS.draft)) || (!preview && key === STORAGE_KEYS.published)) void refresh();
    };
    channel.onmessage = (event) => receive(event.data?.key);
    const storage = (event: StorageEvent) => receive(event.key);
    window.addEventListener("storage", storage);
    return () => { active = false; channel.close(); window.removeEventListener("storage", storage); };
  }, []);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export function usePortfolioContent() {
  return useContext(ContentContext);
}
