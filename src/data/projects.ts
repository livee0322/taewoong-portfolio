import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "livbee",
    number: "01",
    title: "LIVBEE",
    subtitle: "A personal service from the first question to the release checklist.",
    year: "Personal project · In progress",
    type: "Product / Service",
    roles: ["Product / Service Planning", "UX/UI", "QA", "Project Management"],
    tools: ["Figma", "AI-assisted development tools", "QA checklist"],
    summary:
      "서비스의 방향과 화면 흐름을 정리하고, 구현 결과를 확인하는 과정을 하나의 작업 흐름으로 준비하고 있습니다.",
    hero: {
      alt: "LIVBEE 서비스의 향후 화면과 구조를 위한 플레이스홀더",
      ratio: "wide",
      tone: "ink",
      caption: "Service planning · UX/UI · QA",
    },
    intro:
      "LIVBEE는 기획, 화면 설계, 구현 검토, QA가 분리되지 않도록 운영하는 개인 서비스 프로젝트입니다. 실제 화면과 기록이 준비되는 대로 이 페이지에 사례를 연결합니다.",
    sections: [
      {
        label: "Why",
        title: "문제와 시작점",
        body: "서비스가 해결하려는 상황과 초기 가설을 정리할 영역입니다. 현재는 실제 사용자 맥락과 검증 기록을 추가할 기반만 마련했습니다.",
      },
      {
        label: "Service structure",
        title: "기능과 흐름을 먼저 맞춥니다.",
        body: "요구사항과 주요 화면의 관계를 정리하고, 구현 전에 확인할 기준을 함께 둡니다.",
        items: ["서비스 구조", "UX Flow", "UI states"],
      },
      {
        label: "Build & QA",
        title: "구현 과정은 검토 가능한 단위로 봅니다.",
        body: "AI 기반 개발 도구를 활용한 구현 과정은 기획 의도와 비교해 확인합니다. 실제 코드 기여 범위와 협업 방식은 기록이 준비된 뒤 정확히 설명합니다.",
        items: ["Implementation review", "QA", "Iteration"],
      },
    ],
    gallery: [
      { alt: "LIVBEE UX 흐름 자료 플레이스홀더", ratio: "wide", tone: "paper", caption: "UX flow" },
      { alt: "LIVBEE UI 화면 자료 플레이스홀더", ratio: "portrait", tone: "sage", caption: "UI states" },
      { alt: "LIVBEE QA 기록 자료 플레이스홀더", ratio: "square", tone: "stone", caption: "QA & iteration" },
    ],
  },
  {
    slug: "new-app-launch",
    number: "02",
    title: "New App Launch",
    subtitle: "GPA Korea — planning screens for an early-stage app launch.",
    year: "2024",
    type: "Planning / UX/UI",
    roles: ["Service Planning", "UX/UI", "Figma", "Developer Collaboration", "QA"],
    tools: ["Figma", "Auto Layout", "Components", "QA notes"],
    summary:
      "신규 앱의 화면과 기능을 Figma로 정리하고, 개발자와 구현 방법을 조율하며 결과를 확인한 경험을 정리할 프로젝트입니다.",
    hero: {
      alt: "신규 앱 출시 프로젝트의 화면 설계 자료 플레이스홀더",
      ratio: "wide",
      tone: "sage",
      caption: "Planning · UI design · QA",
    },
    intro:
      "초기 출시 단계에서 화면 설계와 기능 정의, 개발 협업, QA가 어떻게 이어졌는지를 보여줄 사례입니다. 현재는 추후 실제 Figma 화면과 개선 기록을 담을 구조를 제공합니다.",
    sections: [
      {
        label: "Scope",
        title: "화면과 기능의 기준을 정리했습니다.",
        body: "사용 흐름, 화면 상태, 우선순위를 같은 문서와 Figma 파일에서 확인할 수 있도록 구성한 내용을 추가할 예정입니다.",
        items: ["User flow", "Screen definition", "Components"],
      },
      {
        label: "Collaboration",
        title: "구현 전에 판단 기준을 맞춥니다.",
        body: "개발자와 동작 방식과 예외 상황을 조율하고, 구현 결과를 화면 기준으로 확인한 과정을 기록합니다.",
        items: ["Implementation review", "QA", "UI improvement"],
      },
    ],
    gallery: [
      { alt: "신규 앱 출시 사용자 흐름 플레이스홀더", ratio: "wide", tone: "paper", caption: "User flow" },
      { alt: "신규 앱 출시 Figma 컴포넌트 플레이스홀더", ratio: "square", tone: "ink", caption: "Figma components" },
    ],
  },
  {
    slug: "product-to-market",
    number: "03",
    title: "Product to Market",
    subtitle: "From a product sample to a selling context.",
    year: "Commerce experience",
    type: "Commerce / Content",
    roles: ["Product Review", "Content Planning", "Photo / Video", "Promotion"],
    tools: ["Product sample", "Photo / video", "Detail page", "Shopping Live"],
    summary:
      "상품을 보고 판매 가능성을 검토한 뒤, 콘텐츠와 프로모션, 쇼핑라이브까지 연결하는 과정의 경험을 보여줄 프로젝트입니다.",
    hero: {
      alt: "상품을 시장에 연결하는 과정의 플레이스홀더",
      ratio: "wide",
      tone: "rose",
      caption: "Product review · Content · Promotion",
    },
    intro:
      "디자인 결과물만 따로 보지 않고 상품, 촬영, 상세페이지, 프로모션, 판매 현장을 연결해 본 경험을 담습니다. 실제 제품별 기록이 모이면 단계별로 확장합니다.",
    sections: [
      {
        label: "Process",
        title: "상품을 보는 일에서 판매를 준비하는 일까지.",
        body: "소싱과 샘플 확인부터 콘텐츠 제작, 프로모션, 판매까지 각 단계의 판단을 한 흐름으로 기록할 자리입니다.",
        items: [
          "Product sourcing", "Sample order & inspection", "Product review", "Content planning", "Photo / video", "Detail page", "Promotion", "Shopping Live", "Sale",
        ],
      },
      {
        label: "Decision",
        title: "무엇을 보여줄지 제품의 맥락에서 정합니다.",
        body: "상품성, 사용 장면, 판매 포인트를 보고 촬영과 상세페이지, 프로모션의 우선순위를 정한 사례를 추가합니다.",
      },
    ],
    gallery: [
      { alt: "상품 샘플 확인 자료 플레이스홀더", ratio: "portrait", tone: "sand", caption: "Sample review" },
      { alt: "상세페이지 콘텐츠 자료 플레이스홀더", ratio: "wide", tone: "paper", caption: "Content direction" },
      { alt: "판매 프로모션 자료 플레이스홀더", ratio: "square", tone: "rose", caption: "Promotion" },
    ],
  },
  {
    slug: "shopping-live",
    number: "04",
    title: "Shopping Live",
    subtitle: "A live broadcast is planned long before it starts.",
    year: "Commerce experience",
    type: "Live Commerce / Content",
    roles: ["Product Analysis", "Broadcast Planning", "Content Production", "Live Operation"],
    tools: ["Run sheet", "Photo / video", "Promotion content", "On-site operation"],
    summary:
      "방송 사진을 나열하는 대신, 상품 분석부터 방송 운영까지 준비와 실행이 이어지는 과정을 담을 프로젝트입니다.",
    hero: {
      alt: "쇼핑라이브 기획과 운영 과정의 플레이스홀더",
      ratio: "wide",
      tone: "sand",
      caption: "Planning · Content · Live operation",
    },
    intro:
      "쇼핑라이브는 화면 앞의 방송만으로 완성되지 않습니다. 판매 포인트, 콘텐츠, 촬영 세팅, 출연자 협업, 현장 운영을 하나의 사례로 보여줄 수 있게 설계했습니다.",
    sections: [
      {
        label: "Preparation",
        title: "상품과 판매 포인트부터 확인합니다.",
        body: "상품 분석을 바탕으로 어떤 메시지와 장면이 필요한지 정하고, 방송 전 콘텐츠와 세팅을 준비한 내용을 보강합니다.",
        items: ["Product analysis", "Selling point", "Broadcast plan", "Content production"],
      },
      {
        label: "Operation",
        title: "현장에서 바뀌는 조건까지 운영합니다.",
        body: "촬영과 세팅, 출연자 협업, 방송 진행 과정의 실제 역할과 판단을 자료가 준비되는 대로 기록합니다.",
        items: ["Shooting & setup", "Cast collaboration", "Live operation"],
      },
    ],
    gallery: [
      { alt: "쇼핑라이브 방송 기획안 플레이스홀더", ratio: "wide", tone: "paper", caption: "Run of show" },
      { alt: "쇼핑라이브 촬영 세팅 플레이스홀더", ratio: "portrait", tone: "stone", caption: "Set-up" },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((project) => project.slug === slug);
