import Image from "next/image";
import type { MediaTone, ProjectMedia } from "@/types/content";

type MediaPlaceholderProps = {
  media: ProjectMedia | { tone: MediaTone; ratio: "wide" | "portrait" | "square"; title: string; description?: string };
  priority?: boolean;
  className?: string;
};

export function MediaPlaceholder({ media, priority = false, className = "" }: MediaPlaceholderProps) {
  const isProjectMedia = "alt" in media;
  const title = isProjectMedia ? media.caption : media.title;
  const description = isProjectMedia ? media.alt : media.description ?? "";
  const source = isProjectMedia ? media.src : undefined;
  const sizes = media.ratio === "wide" ? "(max-width: 640px) 100vw, 58vw" : media.ratio === "portrait" ? "(max-width: 640px) 72vw, 34vw" : "(max-width: 640px) 72vw, 34vw";

  return (
    <div
      className={`media-placeholder${source ? " has-source" : ""} media-${media.ratio} tone-${media.tone} ${className}`}
      {...(!source ? { role: "img", "aria-label": description } : {})}
      data-priority={priority ? "true" : undefined}
    >
      {source ? <Image className="media-real-image" src={source} alt={description} fill priority={priority} sizes={sizes} /> : null}
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
