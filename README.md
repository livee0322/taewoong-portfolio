# TAEWOONG LEE Portfolio

이태웅의 개인 포트폴리오입니다. 디자인에서 출발해 콘텐츠, 커머스, 서비스 기획까지 확장해 온 실무 경험을 프로젝트 중심으로 소개합니다.

## Stack

- Next.js (App Router), React, TypeScript
- CSS variables 기반 design token
- GitHub 파일 기반 CMS 콘텐츠 데이터

## Local development

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인합니다.

CMS에서 저장하려면 `.env.local`에 서버 전용 `GITHUB_CONTENT_TOKEN`을 설정합니다. 토큰은 이 저장소의 Contents 읽기/쓰기 권한만 부여하고 `NEXT_PUBLIC_` 접두사를 사용하지 않습니다. `/admin`의 Draft와 Publish는 각각 `content/portfolio.draft.json`, `content/portfolio.published.json`에 저장되며, 업로드 이미지는 `public/images/uploads/`에 추가됩니다.

## Quality commands

```bash
npm run lint
npm run typecheck
npm run build
```

## Directories

| Path | Purpose |
| --- | --- |
| `src/app` | routes, global styles, metadata |
| `src/components` | layout, home, project, reusable UI components |
| `src/data` | projects, works, career data |
| `src/types` | shared content types |
| `content` | CMS Draft, Published snapshot, revision history |
| `public/images` | optimized visual assets by project |
| `docs` | this portfolio's canonical operating documents |

## Canonical documents

- [Portfolio brief](docs/PORTFOLIO_BRIEF.md) — intent, audience, IA, content priorities
- [Design system](docs/DESIGN_SYSTEM.md) — tokens and layout primitives
- [Content guide](docs/CONTENT_GUIDE.md) — writing rules and content maintenance
- [Interaction spec](docs/INTERACTION_SPEC.md) — motion and interaction constraints
- [Project schema](docs/PROJECT_SCHEMA.md) — shared case-study data contract
- [Asset workflow](docs/ASSET_WORKFLOW.md) — source selection, privacy review, and local asset rules
- [QA checklist](docs/QA_CHECKLIST.md) — release verification criteria

Before making a visual or structural change, read the brief and the document that owns the relevant rule. The documents intentionally do not repeat each other.

## Adding a project

1. Add its media to `public/images/<project-slug>/`.
2. Add a `Project` entry in `src/data/projects.ts`, following [the project schema](docs/PROJECT_SCHEMA.md).
3. Use `/projects/<slug>` to review the generated reusable detail template.
4. Add long-form material under `content/projects/` when it grows beyond the data entry.

## Adding a visual work

1. Follow [the asset workflow](docs/ASSET_WORKFLOW.md), then put an approved optimized preview in `public/images/selected-works/`.
2. Add a `VisualWork` entry in `src/data/works.ts` with meaningful alt text.
3. Assign one of the existing editorial sizes. Do not create a new visual category page for an individual work.
