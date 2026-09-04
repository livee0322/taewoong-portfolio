# Project schema

The TypeScript `Project` type in `src/types/content.ts` is the working contract for a case study. It is deliberately structured but allows content depth to vary by project.

## Required overview

- `id`, `slug`, `category`, `title`, `summary`
- `thumbnail` with alt text, ratio, focal position, visual placeholder tone, and an optional source path
- `roles`, `detailPageUrl`, optional `externalUrl`
- `visible`, `showOnHome`, `sortOrder`

Home, project detail routes and `/admin` all read this same `Project[]`. There is no separate Home-card model or SellerNote supporting-note model. `number`, `subtitle`, `year`, `type`, `tools`, `intro`, `sections` and `gallery` extend the same record for detail pages.

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

The type represents these with `intro`, `sections`, and `gallery`. A section has a label, title, body, and optional items; only meaningful sections should be added. A project may launch with a short overview and no gallery until approved material exists.

## Extension slots

LIVBEE uses the same section type for Why, Service Structure, UX Flow, UI, Build, QA, Iteration, and Result. Thumbnail and gallery media use a local `/images/...` path only after approval through the asset workflow. The shared media component uses `next/image` for supplied local paths, including responsive `sizes`, lazy loading, and an explicit priority only for LCP media. Home thumbnail frames are always rendered at 4:3 regardless of the source ratio. Use the `detail` media ratio for substantial vertical detail-page previews.
