"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/works", label: "Works" },
  { href: "/#contact", label: "Resume" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${isScrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner page-shell">
        <Link className="wordmark" href="/" aria-label="TAEWOONG LEE 홈">
          TAEWOONG LEE
        </Link>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className={`mobile-nav${isMenuOpen ? " is-open" : ""}`}
        aria-label="Mobile navigation"
      >
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
