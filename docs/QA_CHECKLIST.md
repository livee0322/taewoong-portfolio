# QA checklist

Run this checklist before merging a portfolio change.

## Automated checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Visual viewports

Review the rendered site at 360×800, 375×812, 390×844, 768×1024, 1280×900, and 1440×900. Reading CSS rules is not a viewport check.

- The hero has intentional whitespace and readable line breaks.
- Section spacing and text measure remain calm; the page is not a wall of cards.
- Project media is prominent and maintains its intended ratio.
- No horizontal overflow, clipping, or unexpected layout shift occurs.
- Mobile uses one readable sequence rather than compressed desktop columns.
- Header and all primary navigation destinations work.
- A project link loads its corresponding `/projects/[slug]` route.
- Korean words do not split mid-word, and intentional display breaks still read naturally on mobile.
- Horizontal galleries show a clear next item, support touch scrolling, and do not create page-level overflow.
- LIVBEE Main and Community each read as a Desktop–Mobile pair.
- At mobile widths, verify `innerWidth` and `visualViewport.width`, confirm the 640px/900px media queries match, and ensure the desktop navigation is hidden.
- Scroll `/`, `/works`, and `/projects/livbee` from top to bottom at 360px, 375px, and 390px. No in-viewport reveal target may remain transparent.
- LIVBEE responsive pairs use normal document flow with `min-height: 0` on mobile; fixed comparison height is desktop-only.

## Accessibility and performance

- Heading levels follow a logical order; landmarks and link labels are meaningful.
- Keyboard focus is visible and navigation works without a pointer.
- Motion is reduced for `prefers-reduced-motion`.
- Content stays visible without JavaScript or IntersectionObserver support, during route transitions, and after the reveal failsafe.
- Images have meaningful alt text, reserved dimensions, appropriate `sizes`, and lazy loading except the LCP image.
- No console errors, framework error overlay, or blank route.

## Content check

- Korean copy is specific, modest, and tied to an actual action.
- Role boundaries are accurate.
- Every new project follows the shared data contract.
- Canonical documents still match implementation behavior.

Perform two visual passes: first after implementation, then again after correcting issues found in the first browser review.
