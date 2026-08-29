import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "livbee",
    number: "01",
    title: "LIVBEE",
    subtitle: "쇼호스트·모델과 브랜드가 조건을 확인하고 일을 시작하도록 돕는 매칭 서비스.",
    year: "Personal project · Ongoing",
    type: "Product / Service",
    roles: ["Product Planning", "UX/UI", "AI Workflow", "Browser QA", "Project Management"],
    tools: ["Figma", "Asana", "Obsidian", "ChatGPT", "Claude", "Codex", "GitHub", "Vercel"],
    summary:
      "쇼핑라이브 현장에서 반복되는 불분명한 요청과 섭외 방식을, 조건을 확인할 수 있는 서비스 흐름으로 바꿔보는 개인 프로젝트입니다. 문제 정의부터 화면 기준, 구현 검토와 브라우저 QA까지 직접 연결합니다.",
    hero: {
      src: "/images/livbee/main-desktop.png",
      alt: "LIVBEE 프리뷰의 데스크톱 메인 화면. 쇼호스트 매칭 배너와 쇼핑라이브 목록이 보인다.",
      ratio: "wide",
      tone: "paper",
      caption: "LIVBEE preview · main",
    },
    intro:
      "쇼핑라이브를 경험하며 무보수 출연, 합의되지 않은 요청, DM과 지인 소개에 의존하는 섭외, 브랜드가 출연자의 역량을 판단하기 어려운 상황을 보았습니다. 그 불편을 ‘서로의 조건과 포트폴리오를 확인하고 일을 시작하는 채널’로 바꾸기 위해 LIVBEE를 기획했습니다.",
    sections: [
      {
        label: "Problem / Purpose",
        title: "현장의 애매한 요청을, 확인 가능한 매칭 흐름으로 바꿉니다.",
        body: "처음에는 프로필과 메시지로 시작했습니다. 이후 매칭, 제안, 조건 협의, 계약, 커뮤니티까지 단계가 이어지도록 서비스의 목적과 현재 상태, 기대 결과를 문서와 화면에서 함께 정의했습니다.",
        items: ["PROFILE", "MESSAGE", "MATCHING", "OFFER", "CONTRACT", "COMMUNITY"],
      },
      {
        label: "Flow / Scope",
        title: "화면보다 먼저, 사용 흐름과 예외를 맞춥니다.",
        body: "각 기능에서 사용자가 무엇을 확인하고 다음에 무엇을 할 수 있어야 하는지 정리했습니다. 개발 협업에서는 문제, 목적, 현재 상태, 기대 결과, 사용자 흐름, 예외 상황, 범위를 한 단위로 확인합니다.",
        items: ["Problem", "Purpose", "User flow", "Exceptions", "Scope"],
      },
      {
        label: "Build / QA",
        title: "AI 도구를 활용하되, 구현 결과는 직접 확인합니다.",
        body: "IDEA → PLAN → BUILD → REVIEW → QA의 흐름으로 ChatGPT, Claude, Codex를 활용합니다. 요구사항을 정리하고 개발 작업을 나누며, 실제 브라우저 화면에서 구현 결과를 검토해 문제를 다시 수정합니다.",
        items: ["ChatGPT · Claude · Codex", "GitHub · Vercel", "Responsive QA", "Iteration"],
      },
    ],
    gallery: [
      {
        src: "/images/livbee/community-desktop.png",
        alt: "LIVBEE 프리뷰의 데스크톱 커뮤니티 화면. 게시글 목록과 검색창이 보인다.",
        ratio: "wide",
        tone: "paper",
        caption: "Community · desktop",
      },
      {
        src: "/images/livbee/main-mobile.png",
        alt: "LIVBEE 프리뷰의 모바일 메인 화면",
        ratio: "portrait",
        tone: "paper",
        caption: "Main · mobile",
      },
      {
        src: "/images/livbee/community-mobile.png",
        alt: "LIVBEE 프리뷰의 모바일 커뮤니티 화면",
        ratio: "portrait",
        tone: "paper",
        caption: "Community · mobile",
      },
    ],
    liveUrl: "https://www.livbee.co.kr",
  },
  {
    slug: "shopping-live",
    number: "02",
    title: "쇼핑라이브 & 커머스 콘텐츠",
    subtitle: "상품을 보여주는 장면부터 판매를 준비하는 과정까지 이어온 실무 경험.",
    year: "Commerce experience",
    type: "Shopping Live / Commerce Content",
    roles: ["Product Analysis", "Content Planning", "Promotion Design", "Live Operation"],
    tools: ["Photoshop", "Illustrator", "Premiere Pro", "Camera workflow"],
    summary:
      "상품의 특성을 읽고 촬영, 상세페이지, 프로모션, 쇼핑라이브로 연결해 온 경험입니다. 실제 방송 현장과 제작 결과를 중심으로 작업을 선별했습니다.",
    hero: {
      src: "/images/selected-works/tv-purchase-knowhow-thumbnail.jpg",
      alt: "TV 전시장과 진행자 두 명, TV 구매 관련 문구가 들어간 유튜브 썸네일",
      ratio: "wide",
      tone: "stone",
      caption: "Commerce content · YouTube thumbnail",
    },
    intro:
      "쇼핑라이브는 방송 전의 준비에서 많은 부분이 결정됩니다. 상품의 포인트와 필요한 장면을 정리한 뒤, 상세페이지·프로모션·현장 운영까지 하나의 판매 맥락으로 연결했습니다.",
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
