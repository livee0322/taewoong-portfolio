# Admin ↔ Portfolio frontend contract

## Boundary

This PR adds Admin-only code and contracts. It does not modify public rendering, props, copy, images or `src/app/globals.css`. The mappings below describe a later integration PR.

Source baseline: PR #2 head `a6b7dba82f9ed0b30be454f64c6b2e892207a014`.

## Snapshot root

The public renderer will receive one validated immutable shape.

```ts
type PortfolioSnapshot = {
  schemaVersion: 1;
  publishedVersion: number;
  home: HomeSnapshot;
  works: WorksSnapshot;
  projects: ProjectSnapshot[];
  assets: Record<string, PublishedAsset>;
};
```

Draft rows are never passed to public pages. Preview receives the same shape from a draft snapshot adapter so preview and published rendering share one renderer.

## Home mapping

### Hero

Current source: `src/components/home/HomeSections.tsx` first `<section className="home-hero">`.

Future source: `cms.home.hero`.

| CMS field | Current target |
| --- | --- |
| `eyebrow` | `.hero-eyebrow` text |
| `title.policy/text/segments` | `#hero-title`; segments become text + controlled `<br>` only |
| `description` | `.hero-statement` |
| `period` | `.hero-intro-note` first paragraph |
| `disciplines[]` | `.hero-intro-note` second paragraph joined with ` · ` |

Do not store HTML. Manual line breaks are semantic text segments.

### About

Current source: `HomeSections.tsx`, `#about`, local `capabilities`, `MediaPlaceholder` props.

Future source: `cms.home.about`.

| CMS field | Current target |
| --- | --- |
| heading `eyebrow/title/description` | `SectionHeading` props |
| representative asset + alt/caption | `MediaPlaceholder.media` |
| object position | future expanded media focus adapter |
| `capabilities[]` | `.capability-list` ordered articles |

### Featured Projects

Current source: `HomeSections.tsx` `#projects`, `projects.map`, and hardcoded `representative-note`.

Future source: `cms.home.projectsHeading`, `cms.projects.filter(showOnHome)`, `cms.home.projectsSupportingNote`.

| CMS field | Current target |
| --- | --- |
| heading fields | `SectionHeading` |
| project order | `.projects-list` order |
| project card fields | existing `ProjectCard` data contract |
| supporting note | `.representative-note` |

### Selected Works

Current source: `HomeSections.tsx` `#works`; `featuredWork` lookup and `reelWorkIds` array.

Future source: `cms.home.worksHeading`, `cms.visualWorks.find(homeFeatured)`, `cms.visualWorks.filter(showOnHome).sort(homeSortOrder)`.

| CMS field | Current target |
| --- | --- |
| `homeFeatured` | `.featured-work` single item |
| `showOnHome`, `homeSortOrder` | `.work-reel` items/order |
| title/category/description/asset/alt/ratio | existing card/media rendering |

The initial migration maps `ocean-content-thumbnail` to featured and preserves the seven current reel ids in their current order.

### Career

Current source: `src/data/career.ts` plus a separate hardcoded Personal project `<li>` in `HomeSections.tsx`.

Future source: `cms.home.careerHeading`, `cms.careerEntries.filter(visible).sort(sortOrder)`.

`entryType=personal_project` selects the existing personal-row presentation. It does not require a second query or table.

### Workflow

Current source: `HomeSections.tsx` local `workflow` array and section without id.

Future source: `cms.home.workflowHeading`, `cms.workflowEntries`.

Tools are stored as an array and joined for the current `.workflow-tools` string. Public integration adds `data-cms-section="home.workflow"` but does not change layout or copy.

### Contact

Current source: `HomeSections.tsx` `#contact`.

Future source: `cms.home.contact`.

| CMS field | Current target |
| --- | --- |
| eyebrow/title/description | existing contact copy nodes |
| CTA label/URL | existing `TextLink` |
| public email/resume/external links | render only when approved and non-empty |

## Works mapping

Current source: `src/app/works/page.tsx`, local `workCategories`, and `src/data/works.ts`.

Future source: `cms.works.heading`, `cms.workCategories`, `cms.visualWorks`.

| CMS field | Current target |
| --- | --- |
| category name/order/visible/preview type | category sections and grid class |
| work category relation | current category filter |
| work sort order | cards within category |
| ratio/preview type | `work-${ratio}` and `MediaPlaceholder` ratio |
| object position | `MediaPlaceholder` style through expanded media contract |
| published | public filter |

Current category names are migrated exactly. Changing a category name must not silently change its preview frame.

## Project mapping

Current source: `src/data/projects.ts`, `src/types/content.ts`, `ProjectCard.tsx`, `ProjectDetail.tsx`.

Future source: `cms.projects` and `cms.projectSections`.

| CMS field | Existing `Project` target |
| --- | --- |
| slug, number, title, subtitle, year label, type | same overview fields |
| roles, tools, summary, intro | same arrays/copy |
| hero asset metadata | `hero` media object |
| ordered project sections | `sections[]` |
| gallery snapshot | `gallery[]` until a real normalized gallery editor is needed |
| external URL | `liveUrl` |

Project-specific LIVBEE responsive-pair rendering currently branches on `project.slug === "livbee"`. V1 integration preserves this renderer/template key. Arbitrary project creation stays disabled until template selection replaces slug-based branching.

## Image adapter

Current public components expect `/images/...` paths and three vertical focal values. CMS assets may be Storage or imported external URLs and use a 3×3 position.

The integration adapter must:

1. resolve asset UUID to a published immutable URL,
2. require alt text at publish time,
3. map `top-left ... bottom-right` to CSS percentages,
4. pass `sizes` and priority using the existing LCP rules,
5. configure approved Supabase Storage host in `next.config.ts` only when remote images are introduced.

Do not widen `src` to any arbitrary URL without host validation.

## Section selection protocol

Later public changes add only stable attributes to existing section roots:

```tsx
<section data-cms-section="home.about" ... />
```

Admin Navigator sends `cms:focus`; preview reports `cms:select`. Message payload:

```ts
type CmsPreviewMessage =
  | { type: "cms:focus"; sectionId: AdminSectionId }
  | { type: "cms:select"; sectionId: AdminSectionId };
```

Both sides validate origin and known section ids. Cross-origin preview can scroll/select only when the deployed preview bridge is intentionally enabled; otherwise iframe remains read-only and Navigator uses URLs/anchors.

## Files that will change later

These files are explicitly deferred and unchanged in this PR:

| Integration phase | Expected file |
| --- | --- |
| provider/snapshot boundary | new `src/cms/**` adapter and validators |
| Home snapshot renderer | `src/components/home/HomeSections.tsx` |
| Works snapshot renderer | `src/app/works/page.tsx` |
| Project snapshot renderer | `src/app/projects/[slug]/page.tsx`, `ProjectDetail.tsx`, `ProjectCard.tsx` |
| compatibility types | `src/types/content.ts` or a snapshot adapter beside it |
| remote Storage images | `next.config.ts` |
| section click bridge | existing section roots + a small preview-only client bridge |

`src/app/globals.css` should not change merely to connect CMS data. Any visual diff is a regression unless separately approved.

## Migration order

1. Apply database/RLS and import assets/current TypeScript data.
2. Build server-side `PortfolioCmsAdapter` and runtime validators.
3. Connect Admin initial reads; compare every value with the hardcoded source.
4. Connect Save Draft and revision creation.
5. Generate draft `PortfolioSnapshot`; render it in Preview with the existing public components.
6. Add section identifiers/message bridge and complete bidirectional selection.
7. Enable validated Publish and immutable current version.
8. Switch Home Hero/About first, compare screenshots, then Projects, Works, Career, Workflow, Contact.
9. Switch `/works`, then project detail pages.
10. Remove hardcoded data only after all route/viewports match and rollback snapshot is verified.

## Visual parity gate

For every public integration step, compare the previous hardcoded renderer and CMS snapshot at 390×844, 768×1024, 1280×900 and 1440×900. Copy, order, image crop, line breaks, page height and overflow must match before removing the previous source.
