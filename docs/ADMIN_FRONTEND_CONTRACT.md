# Admin ↔ Portfolio frontend contract

## Canonical mapping

| CMS selection | Renderer | Public identifier |
| --- | --- | --- |
| `home.hero` | `HomeSections` Hero | `data-cms-section="home.hero"` |
| `home.about` | About + capabilities | `home.about` |
| `home.projects` | four ordered project cards | `home.projects` |
| `home.works` | single featured + ordered reel | `home.works` |
| `home.career` | career/personal records | `home.career` |
| `home.workflow` | workflow records | `home.workflow` |
| `home.contact` | Contact copy/links | `home.contact` |
| `works.archive` | category/order filtered Works | `works.archive` |
| `projects.index` | existing project detail renderer | `projects.index` |

Public route server components read the current Published snapshot before rendering and pass it to `ContentProvider`, so initial HTML/SEO and hydration use the same canonical content. Published가 없을 때만 V1 Seed를 사용한다. Public routes never read Draft. `?cmsPreview=draft` reads the live Draft channel and is used only inside Admin Preview.

## Media

`MediaPlaceholder` remains the only public image frame. Local `/images/**`만 Next Image로 최적화하고, 검증된 Supabase/HTTPS URL은 wildcard optimizer allowlist 없이 safe native renderer를 사용한다. CMS image data maps to the existing ratio/tone contract and 3×3 focal position. Public spacing, typography, frame CSS and responsive breakpoints are unchanged.

## Works rules

- `/works` filters `published=true`, category visible, and preserves snapshot order.
- Home filters `published && showOnHome`.
- `homeFeatured=true` selects one feature; it is removed from the reel list.
- Drag/drop and keyboard arrows write the same array order used by Preview/Public.
- Category deletion is not exposed; the fixed V1 taxonomy can be renamed, hidden and reordered.

## Projects

The four canonical slugs (`livbee`, `shopping-live`, `design-content`, `sellernote`) are routable. Home order is the same `sortOrder` managed in Admin. The client detail renderer resolves the current snapshot by slug, so category, title, summary, thumbnail/alt/focal position, roles, detail/external URL and visibility can change without a separate Home model. Legacy schema-v1 snapshots are normalized to this contract at read time. The original specialized LIVBEE responsive comparison layout is retained.

## Failure behavior

- Supabase env absent: seed/local fallback keeps local development renderable.
- Supabase env present but query/RLS/network/Storage fails: surface an Error; never fall back to local persistence.
- Draft save validation failure: no persistence and no Publish.
- Publish failure: previous `is_current` remains public because the RPC is transactional.
- Restore: copies a historical Published snapshot into Draft; a separate Publish is required.

## Production deployment

Production Supabase migration과 Vercel Preview 환경값이 적용되어 있다. Empty database는 Seed를 표시하지만 Save 전에는 row를 만들지 않고, Save Draft와 Publish가 명시적으로 실행될 때만 persistent state를 변경한다.
