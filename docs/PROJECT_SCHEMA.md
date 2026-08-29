# Project schema

The TypeScript `Project` type in `src/types/content.ts` is the working contract for a case study. It is deliberately structured but allows content depth to vary by project.

## Required overview

- `slug`, `number`, `title`, `subtitle`, `year`, `type`
- `roles`, `tools`, `summary`
- `hero` with alt text, ratio, visual placeholder tone, and an optional local `/images/...` source path

## Standard narrative sections

- context
- problem
- my role
- process
- key decisions
- output
- result / learning
- gallery
- next project

The type represents these with `intro`, `sections`, and `gallery`. A section has a label, title, body, and optional items; only meaningful sections should be added. Results may be qualitative until verified measurements are supplied.

## Extension slots

LIVBEE uses the same section type for Why, Service Structure, UX Flow, UI, Build, QA, Iteration, and Result. Product to Market can use process steps to grow into a sticky narrative later without changing the core route. Hero and gallery media may first use neutral placeholders, then gain a local `/images/...` path at the same semantic location. The shared media component uses `next/image` for supplied local paths, including responsive `sizes`, lazy loading, and an explicit priority only for LCP media.
