# QA checklist

Run this checklist before merging a portfolio change.

## Automated checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

## Visual viewports

Review at 375px, 768px, 1280px, and 1440px or wider.

- The hero has intentional whitespace and readable line breaks.
- Section spacing and text measure remain calm; the page is not a wall of cards.
- Project media is prominent and maintains its intended ratio.
- No horizontal overflow, clipping, or unexpected layout shift occurs.
- Mobile uses one readable sequence rather than compressed desktop columns.
- Header and all primary navigation destinations work.
- A project link loads its corresponding `/projects/[slug]` route.

## Accessibility and performance

- Heading levels follow a logical order; landmarks and link labels are meaningful.
- Keyboard focus is visible and navigation works without a pointer.
- Motion is reduced for `prefers-reduced-motion`.
- Images have meaningful alt text, reserved dimensions, appropriate `sizes`, and lazy loading except the LCP image.
- No console errors, framework error overlay, or blank route.

## Content check

- Korean copy is specific, modest, and tied to an actual action.
- Role boundaries are accurate.
- Every new project follows the shared data contract.
- Canonical documents still match implementation behavior.
