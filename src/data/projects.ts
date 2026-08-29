import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "livbee",
    number: "01",
    title: "LIVBEE",
    subtitle: "브랜드와 쇼호스트가 조건과 작업 이력을 확인하고 대화를 시작하는 매칭 서비스.",
    year: "Personal project · Ongoing",
    type: "Product / Service",
    roles: ["Product Planning", "UX/UI", "AI Workflow", "Browser QA", "Project Management"],
    tools: ["Figma", "Asana", "Obsidian", "ChatGPT", "Claude", "Codex", "GitHub", "Vercel"],
    summary:
      "쇼핑라이브 현장에서 겪은 섭외와 조건 협의의 불편을 서비스로 풀고 있습니다. 기능을 기획하고 화면을 설계한 뒤, 구현 결과를 브라우저에서 확인하며 계속 고쳤습니다.",
    hero: {
      src: "/images/livbee/main-desktop.png",
      alt: "LIVBEE 프리뷰의 데스크톱 메인 화면. 쇼호스트 매칭 배너와 쇼핑라이브 목록이 보인다.",
      ratio: "wide",
      tone: "paper",
      caption: "LIVBEE preview · main",
    },
    intro:
      "쇼핑라이브 현장에서는 출연 조건이 명확하지 않거나, DM과 지인 소개에 의존해 사람을 찾는 일이 반복됐습니다. 브랜드와 출연자가 서로의 조건과 작업 이력을 먼저 확인할 수 있도록 LIVBEE를 기획했습니다.",
    sections: [
      {
        label: "Problem / Purpose",
        title: "DM으로 흩어지던 조건을 한 흐름에 모았습니다.",
        body: "프로필과 메시지에서 시작해 매칭, 제안, 조건 협의, 계약으로 이어지는 순서를 정리했습니다. 각 단계에서 사용자가 확인할 정보와 다음 행동을 문서와 화면에 함께 정의했습니다.",
        items: ["PROFILE", "MESSAGE", "MATCHING", "OFFER", "CONTRACT", "COMMUNITY"],
      },
      {
        label: "Flow / Scope",
        title: "화면을 그리기 전에 다음 행동과 예외를 적었습니다.",
        body: "사용자가 무엇을 확인하고 어디로 이동해야 하는지, 권한이 다르거나 정보가 비어 있을 때는 어떻게 보일지 먼저 정리했습니다. 개발 작업에도 문제·목적·현재 상태·기대 결과·예외 범위를 함께 전달했습니다.",
        items: ["Problem", "Purpose", "User flow", "Exceptions", "Scope"],
      },
      {
        label: "Build / QA",
        title: "개발 도구가 만든 결과를 브라우저에서 다시 확인했습니다.",
        body: "ChatGPT, Claude, Codex로 요구사항을 정리하고 개발 작업을 나눴습니다. 구현 뒤에는 역할별 계정과 여러 화면 크기로 직접 확인하고, 어색한 흐름과 문구를 다시 수정했습니다.",
        items: ["ChatGPT · Claude · Codex", "GitHub · Vercel", "Responsive QA", "Iteration"],
      },
    ],
    gallery: [
      {
        src: "/images/livbee/community-desktop.png",
        alt: "LIVBEE 프리뷰의 데스크톱 커뮤니티 화면. 게시글 목록과 검색창이 보인다.",
        ratio: "wide",
        tone: "paper",
        caption: "PC · 커뮤니티",
      },
      {
        src: "/images/livbee/main-mobile.png",
        alt: "LIVBEE 프리뷰의 모바일 메인 화면",
        ratio: "portrait",
        tone: "paper",
        caption: "모바일 · 메인",
      },
      {
        src: "/images/livbee/community-mobile.png",
        alt: "LIVBEE 프리뷰의 모바일 커뮤니티 화면",
        ratio: "portrait",
        tone: "paper",
        caption: "모바일 · 커뮤니티",
      },
    ],
    liveUrl: "https://www.livbee.co.kr",
  },
  {
    slug: "shopping-live",
    number: "02",
    title: "쇼핑라이브 & 커머스 콘텐츠",
    subtitle: "상품의 포인트를 찾고, 촬영과 콘텐츠를 거쳐 방송 현장까지 연결한 실무 작업.",
    year: "Commerce experience",
    type: "Shopping Live / Commerce Content",
    roles: ["Product Analysis", "Content Planning", "Promotion Design", "Live Operation"],
    tools: ["Photoshop", "Illustrator", "Premiere Pro", "Camera workflow"],
    summary:
      "상품 정보를 정리한 뒤 촬영, 상세페이지, 프로모션, 쇼핑라이브 순서로 준비했습니다. 실제 방송에 쓰인 이미지와 현장 작업을 중심으로 선별했습니다.",
    hero: {
      src: "/images/selected-works/tv-purchase-knowhow-thumbnail.jpg",
      alt: "TV 전시장과 진행자 두 명, TV 구매 관련 문구가 들어간 유튜브 썸네일",
      ratio: "wide",
      tone: "stone",
      caption: "Commerce content · YouTube thumbnail",
    },
    intro:
      "쇼핑라이브는 방송 전의 준비에서 많은 부분이 결정됐습니다. 상품의 포인트와 필요한 장면을 정리한 뒤, 상세페이지·프로모션·현장 운영까지 하나의 판매 맥락으로 연결했습니다.",
    sections: [
      {
        label: "Preparation",
        title: "상품을 먼저 읽고, 보여줄 순서를 만듭니다.",
        body: "제품의 특징과 사용 장면을 살펴본 뒤 판매 포인트를 정리하고, 촬영·썸네일·상세페이지에서 각 정보가 어떤 순서로 보여야 하는지 잡았습니다.",
        items: ["Product analysis", "Selling points", "Photo / video", "Detail page"],
      },
      {
        label: "Live operation",
        title: "콘텐츠와 현장 운영을 같은 흐름으로 봅니다.",
        body: "방송 전 프로모션부터 진행 화면, 출연자와 세팅, 제품 설명까지 끊기지 않도록 준비했습니다. 아래 자료는 그 과정에서 제작한 현장 썸네일, 프로모션, 상세페이지 일부입니다.",
        items: ["Promotion", "Run of show", "On-site setup", "Live operation"],
      },
    ],
    gallery: [
      {
        src: "/images/selected-works/live-commerce-studio.png",
        alt: "TV 전시 공간에서 두 명의 진행자가 제품을 소개하는 쇼핑라이브 썸네일",
        ratio: "wide",
        tone: "stone",
        caption: "Shopping Live studio",
      },
      {
        src: "/images/selected-works/mini-led-campaign.jpg",
        alt: "숲과 빛나는 화면을 배경으로 한 미니 LED 캠페인 배너",
        ratio: "wide",
        tone: "ink",
        caption: "Mini LED campaign",
      },
      {
        src: "/images/selected-works/tv-product-detail.jpg",
        alt: "TV 화면의 밝기와 CPU, 해상도를 설명하는 세로형 상세페이지",
        ratio: "detail",
        tone: "paper",
        caption: "Product detail page · crop preview",
      },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
