"use client";

import { useState, type SyntheticEvent } from "react";
import { SafeImage } from "./SafeImage";
import type { MediaTone, ObjectPosition, ProjectMedia } from "@/types/content";

type MediaPlaceholderProps = {
  media:
    | ProjectMedia
    | { tone: MediaTone; ratio: "wide" | "portrait" | "square" | "detail"; title: string; description?: string; focus?: ObjectPosition };
  priority?: boolean;
  className?: string;
  /** When true, a portrait-oriented source image is shown uncropped (contain) instead of being cover-cropped to the frame. Landscape/square sources are unaffected. */
  fitToOrientation?: boolean;
};

const FOCUS_POSITION: Record<ObjectPosition, string> = {
  "top-left": "left 20%",
  top: "center 20%",
  "top-right": "right 20%",
  left: "left center",
  center: "center",
  right: "right center",
  "bottom-left": "left 80%",
  bottom: "center 80%",
  "bottom-right": "right 80%",
};

export function MediaPlaceholder({ media, priority = false, className = "", fitToOrientation = false }: MediaPlaceholderProps) {
  const isProjectMedia = "alt" in media;
  const title = isProjectMedia ? media.caption : media.title;
  const description = isProjectMedia ? media.alt : media.description ?? "";
  const source = isProjectMedia ? media.src : undefined;
  const sizes = media.ratio === "wide" ? "(max-width: 767px) 100vw, 58vw" : media.ratio === "detail" ? "(max-width: 767px) 72vw, 28vw" : "(max-width: 767px) 72vw, 34vw";
  const objectPosition = media.focus ? FOCUS_POSITION[media.focus] : undefined;
  const [isPortraitSource, setIsPortraitSource] = useState(false);
  const handleLoad = fitToOrientation
    ? (event: SyntheticEvent<HTMLImageElement>) => {
        const img = event.currentTarget;
        if (img.naturalHeight > img.naturalWidth) setIsPortraitSource(true);
      }
    : undefined;
  const style = fitToOrientation && isPortraitSource
    ? { objectFit: "contain" as const, objectPosition: "center" }
    : objectPosition ? { objectFit: "cover" as const, objectPosition } : undefined;

  return (
    <div
      className={`media-placeholder${source ? " has-source" : ""} media-${media.ratio} tone-${media.tone} ${className}`}
      {...(!source ? { role: "img", "aria-label": description } : {})}
      data-priority={priority ? "true" : undefined}
    >
      {source ? (
        <SafeImage
          className="media-real-image"
          src={source}
          alt={description}
          fill
          priority={priority}
          sizes={sizes}
          style={style}
          onLoad={handleLoad}
        />
      ) : null}
      <div className="media-placeholder-grid" aria-hidden="true" />
      <div className="media-placeholder-mark" aria-hidden="true">
        <span>TL</span>
      </div>
      <div className="media-placeholder-copy">
        <span>{title}</span>
      </div>
    </div>
  );
}
