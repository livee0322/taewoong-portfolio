# Admin ↔ Portfolio frontend contract

## Canonical mapping

| CMS selection | Renderer | Public identifier |
| --- | --- | --- |
| `home.hero` | `HomeSections` Hero | `data-cms-section="home.hero"` |
| `home.about` | About + capabilities | `home.about` |
| `home.projects` | project cards + supporting note | `home.projects` |
| `home.works` | single featured + ordered reel | `home.works` |
| `home.career` | career/personal records | `home.career` |
| `home.workflow` | workflow records | `home.workflow` |
| `home.contact` | Contact copy/links | `home.contact` |
| `works.archive` | category/order filtered Works | `works.archive` |
| `projects.index` | existing project detail renderer | `projects.index` |

`ContentProvider` starts with the V1 seed for SSR/hydration parity, then loads current Published or Draft Preview. Public routes never read Draft. `?cmsPreview=draft` reads the live Draft channel and is used only inside Admin Preview.

## Media

`MediaPlaceholder` remains the only public image frame. CMS image data maps to the existing ratio/tone contract and expands focal position from vertical bias to the 3×3 values. Local `/images/**`, Supabase public URLs, HTTPS external URLs and local data URL fallback all use the same component. Public spacing, typography, frame CSS and responsive breakpoints are unchanged.

## Works rules

- `/works` filters `published=true`, category visible, and preserves snapshot order.
- Home filters `published && showOnHome`.
- `homeFeatured=true` selects one feature; it is removed from the reel list.
- Drag/drop and keyboard arrows write the same array order used by Preview/Public.
- Category deletion is not exposed; the fixed V1 taxonomy can be renamed, hidden and reordered.

## Projects

The two existing slugs remain statically routable. The client detail renderer resolves the current snapshot by slug, so title, subtitle, summary, intro, roles, tools, external URL and visibility can change without code edits. The original specialized LIVBEE responsive comparison layout is retained.

## Failure behavior

- Supabase absent/unreachable with no returned data: seed/local fallback keeps the portfolio renderable.
- Draft save validation failure: no persistence and no Publish.
- Publish failure: previous `is_current` remains public because the RPC is transactional.
- Restore: copies a historical Published snapshot into Draft; a separate Publish is required.

## Known deployment requirement

Repository code cannot discover or create a user's Supabase project. Before shared production operation, apply the migration and set the two public environment values. Until then, edits are intentionally limited to the browser that owns the local fallback data.
