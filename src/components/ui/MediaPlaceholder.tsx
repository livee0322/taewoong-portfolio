import Image from "next/image";
import type { MediaTone, ProjectMedia } from "@/types/content";

type MediaPlaceholderProps = {
  media:
    | ProjectMedia
    | { tone: MediaTone; ratio: "wide" | "portrait" | "square" | "detail"; title: string; description?: string; focus?: "top" | "center" | "bottom" };
  priority?: boolean;
  className?: string;
};

const FOCUS_POSITION: Record<"top" | "center" | "bottom", string> = {
  top: "center 20%",
  center: "center",
  bottom: "center 80%",
};

export function MediaPlaceholder({ media, priority = false, className = "" }: MediaPlaceholderProps) {
  const isProjectMedia = "alt" in media;
  const title = isProjectMedia ? media.caption : media.title;
  const description = isProjectMedia ? media.alt : media.description ?? "";
  const source = isProjectMedia ? media.src : undefined;
  const sizes = media.ratio === "wide" ? "(max-width: 767px) 100vw, 58vw" : media.ratio === "detail" ? "(max-width: 767px) 72vw, 28vw" : "(max-width: 767px) 72vw, 34vw";
  const objectPosition = media.focus ? FOCUS_POSITION[media.focus] : undefined;

  return (
    <div
      className={`media-placeholder${source ? " has-source" : ""} media-${media.ratio} tone-${media.tone} ${className}`}
      {...(!source ? { role: "img", "aria-label": description } : {})}
      data-priority={priority ? "true" : undefined}
    >
      {source ? (
        <Image
          className="media-real-image"
          src={source}
          alt={description}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          sizes={sizes}
          style={objectPosition ? { objectFit: "cover", objectPosition } : undefined}
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
