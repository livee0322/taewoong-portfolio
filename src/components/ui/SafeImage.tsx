import Image from "next/image";
import type { CSSProperties } from "react";

type SafeImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  style?: CSSProperties;
};

export function SafeImage({ src, alt, fill, sizes, priority, className, style }: SafeImageProps) {
  if (src.startsWith("/")) {
    return <Image src={src} alt={alt} fill={fill} sizes={sizes} priority={priority} loading={priority ? "eager" : "lazy"} className={className} style={style} />;
  }
  if (!src.startsWith("https://") && !src.startsWith("data:image/")) return null;
  // Remote sources bypass the Next image proxy. They are validated before entering the CMS,
  // which avoids a wildcard optimizer allowlist and prevents server-side fetching of arbitrary hosts.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading={priority ? "eager" : "lazy"} className={className} style={{ ...(fill ? { position: "absolute", inset: 0, width: "100%", height: "100%" } : {}), ...style }} />;
}
