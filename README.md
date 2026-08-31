# TAEWOONG LEE Portfolio

이태웅의 개인 포트폴리오입니다. 디자인에서 출발해 콘텐츠, 커머스, 서비스 기획까지 확장해 온 실무 경험을 프로젝트 중심으로 소개합니다.

## Stack

- Next.js (App Router), React, TypeScript
- CSS variables 기반 design token
- 파일 기반 TypeScript 콘텐츠 데이터

## Local development

```bash
npm install
npm run dev
```

`http://localhost:3000`에서 확인합니다.

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
| `content` | future long-form project and work content source |
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
