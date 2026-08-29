"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const show = (target: HTMLElement) => {
      target.classList.remove("reveal-pending");
      target.classList.add("is-visible");
    };
    const showAll = () => targets.forEach(show);

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 767px)").matches ||
      !("IntersectionObserver" in window)
    ) {
      showAll();
      return;
    }

    let observer: IntersectionObserver;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            show(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -6%", threshold: 0.01 },
      );
    } catch {
      showAll();
      return;
    }

    targets.forEach((target) => {
      target.classList.remove("is-visible");
      target.classList.add("reveal-pending");
      observer.observe(target);
    });

    const failsafe = window.setTimeout(showAll, 2400);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
      showAll();
    };
  }, [pathname]);

  return null;
}
