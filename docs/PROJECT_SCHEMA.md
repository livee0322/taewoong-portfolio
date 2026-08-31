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

LIVBEE uses the same section type for Why, Service Structure, UX Flow, UI, Build, QA, Iteration, and Result. A compact career item can remain outside the route list until it has a reviewable story and real final material. Hero and gallery media use a local `/images/...` path only after approval through the asset workflow. The shared media component uses `next/image` for supplied local paths, including responsive `sizes`, lazy loading, and an explicit priority only for LCP media. Use the `detail` media ratio for substantial vertical detail-page previews.
