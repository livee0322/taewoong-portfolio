import Link from "next/link";
import type { ComponentProps } from "react";

type TextLinkProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
  className?: string;
  arrow?: "↗" | "↑" | "←";
};

export function TextLink({ children, className = "", arrow = "↗", ...props }: TextLinkProps) {
  return (
    <Link className={`text-link ${className}`} {...props}>
      <span>{children}</span>
      <span className="text-link-arrow" aria-hidden="true" data-arrow={arrow} />
    </Link>
  );
}
