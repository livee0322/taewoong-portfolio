"use client";

import { SafeImage } from "@/components/ui/SafeImage";
import { useState } from "react";
import type { CmsWork } from "@/content/schema";
import styles from "./admin.module.css";

function moveItem(items: CmsWork[], fromId: string, toId: string) {
  const next = [...items];
  const fromIndex = next.findIndex((item) => item.id === fromId);
  const toIndex = next.findIndex((item) => item.id === toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return next;
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function WorksReorder({ items, onChange }: { items: CmsWork[]; onChange: (items: CmsWork[]) => void }) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const moveBy = (id: string, offset: -1 | 1) => {
    const fromIndex = items.findIndex((item) => item.id === id);
    const toIndex = fromIndex + offset;
    if (fromIndex >= 0 && toIndex >= 0 && toIndex < items.length) onChange(moveItem(items, id, items[toIndex].id));
  };
  const setFeatured = (id: string) => onChange(items.map((item) => ({ ...item, showOnHome: item.id === id ? true : item.showOnHome, homeFeatured: item.id === id })));

  return <section className={styles.editorBlock} aria-labelledby="works-order-title">
    <div className={styles.blockHeading}><div><p className={styles.kicker}>Card grid</p><h3 id="works-order-title">홈 노출 및 순서</h3></div><span className={styles.count}>{items.length} items</span></div>
    <p className={styles.blockHelp}>카드를 끌거나 화살표로 순서를 바꿉니다. 대표작은 항상 한 개만 선택됩니다.</p>
    <div className={styles.reorderGrid}>{items.map((item, index) => <article key={item.id} className={`${styles.reorderCard} ${draggingId === item.id ? styles.isDragging : ""}`} draggable onDragStart={() => setDraggingId(item.id)} onDragEnd={() => setDraggingId(null)} onDragOver={(event) => event.preventDefault()} onDrop={() => { if (draggingId) onChange(moveItem(items, draggingId, item.id)); setDraggingId(null); }}>
      <div className={styles.reorderImage}><SafeImage src={item.src} alt="" fill sizes="140px" style={{ objectFit: "cover" }} /><span className={styles.orderNumber}>{String(index + 1).padStart(2, "0")}</span></div>
      <div className={styles.reorderCopy}><p>{item.category}</p><h4>{item.title}</h4><label><input type="checkbox" checked={item.showOnHome} disabled={item.homeFeatured} onChange={(event) => onChange(items.map((work) => work.id === item.id ? { ...work, showOnHome: event.target.checked } : work))} /> 홈 Reel</label><label><input type="radio" name="featured-work" checked={item.homeFeatured} onChange={() => setFeatured(item.id)} /> 홈 대표작</label></div>
      <div className={styles.reorderActions}><button type="button" aria-label={`${item.title} 위로 이동`} disabled={!index} onClick={() => moveBy(item.id, -1)}>↑</button><button type="button" aria-label={`${item.title} 아래로 이동`} disabled={index === items.length - 1} onClick={() => moveBy(item.id, 1)}>↓</button><span className={styles.dragHandle} aria-hidden="true">⠿</span></div>
    </article>)}</div>
  </section>;
}
