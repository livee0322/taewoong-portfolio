"use client";

import Image from "next/image";
import { useState } from "react";
import { mockWorks } from "@/admin/mock-data";
import type { AdminWorkItem } from "@/admin/types";
import styles from "./admin.module.css";

function moveItem(items: AdminWorkItem[], fromId: string, toId: string) {
  const next = [...items];
  const fromIndex = next.findIndex((item) => item.id === fromId);
  const toIndex = next.findIndex((item) => item.id === toId);
  if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return next;
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
}

export function WorksReorder() {
  const [items, setItems] = useState(mockWorks);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const moveBy = (id: string, offset: -1 | 1) => {
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === id);
      const toIndex = fromIndex + offset;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= current.length) return current;
      return moveItem(current, id, current[toIndex].id);
    });
  };

  return (
    <section className={styles.editorBlock} aria-labelledby="works-order-title">
      <div className={styles.blockHeading}>
        <div>
          <p className={styles.kicker}>Card grid</p>
          <h3 id="works-order-title">홈 노출 순서</h3>
        </div>
        <span className={styles.count}>{items.length} items</span>
      </div>
      <p className={styles.blockHelp}>카드를 끌어 순서를 바꿉니다. 저장할 때 내부 sort_order로 변환됩니다.</p>
      <div className={styles.reorderGrid}>
        {items.map((item, index) => (
          <article
            key={item.id}
            className={`${styles.reorderCard} ${draggingId === item.id ? styles.isDragging : ""}`}
            draggable
            onDragStart={() => setDraggingId(item.id)}
            onDragEnd={() => setDraggingId(null)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => {
              if (draggingId) setItems((current) => moveItem(current, draggingId, item.id));
              setDraggingId(null);
            }}
          >
            <div className={styles.reorderImage}>
              <Image src={item.src} alt="" fill sizes="140px" />
              <span className={styles.orderNumber}>{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className={styles.reorderCopy}>
              <p>{item.category}</p>
              <h4>{item.title}</h4>
              <span>{item.exposure === "home-featured" ? "홈 대표작" : item.exposure === "home" ? "홈 노출" : "Works only"}</span>
            </div>
            <div className={styles.reorderActions}>
              <button type="button" aria-label={`${item.title} 위로 이동`} disabled={index === 0} onClick={() => moveBy(item.id, -1)}>↑</button>
              <button type="button" aria-label={`${item.title} 아래로 이동`} disabled={index === items.length - 1} onClick={() => moveBy(item.id, 1)}>↓</button>
              <span className={styles.dragHandle} aria-hidden="true">⠿</span>
            </div>
          </article>
        ))}
      </div>
      <div className={styles.validationNote}>
        <span aria-hidden="true">◆</span>
        <p>홈 대표작은 한 개만 선택할 수 있습니다. 다른 카드를 대표작으로 지정하면 기존 선택이 자동 해제됩니다.</p>
      </div>
    </section>
  );
}
