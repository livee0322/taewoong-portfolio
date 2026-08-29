import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

export const metadata: Metadata = {
  title: {
    default: "TAEWOONG LEE — Planning, Design, Content, Commerce",
    template: "%s — TAEWOONG LEE",
  },
  description: "디자인에서 시작해 기획, 콘텐츠, 커머스까지 업무 영역을 넓혀온 이태웅의 포트폴리오.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
