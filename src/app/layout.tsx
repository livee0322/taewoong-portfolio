import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { RevealObserver } from "@/components/ui/RevealObserver";

export const metadata: Metadata = {
  title: {
    default: "TAEWOONG LEE — Planning, Design, Content, Commerce",
    template: "%s — TAEWOONG LEE",
  },
  description: "상세페이지와 배너부터 촬영, 영상, 쇼핑라이브, 서비스 기획과 QA까지 직접 해온 이태웅의 포트폴리오.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <RevealObserver />
        {children}
        <Footer />
      </body>
    </html>
  );
}
