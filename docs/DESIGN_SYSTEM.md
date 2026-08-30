# Design system

## Principles

The UI is neutral so that future project imagery carries the colour and personality. Editorial hierarchy, generous whitespace, and a consistent grid carry more weight than decorative cards or effects.

## Tokens

The implementation owns the canonical token values in `src/app/globals.css`.

| Group | Defined values |
| --- | --- |
| Background | warm white `#F5F4F0`, surface `#FFFFFF` |
| Text | primary `#171717`, muted neutral gray |
| Border | low-contrast neutral gray |
| Type weights | 400, 500, 600 |
| Display XL | `clamp(4rem, 8vw, 7rem)` |
| Display LG | `clamp(3.25rem, 6vw, 5.5rem)` |
| Heading 1–3 | responsive 64/48/32px maximums |
| Body | 20px large, 17px standard, 15px small, 13px label |
| Space | 4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160px |
| Radius | 6, 12, 20px |
| Motion | 160ms fast, 280ms base, 450ms slow |

No accent colour is chosen at this stage. Do not add brand blue, purple, green, or a gradient until actual work establishes a reason for one.

## Typography

Pretendard is the intended Korean typeface; use the system fallback stack until a licensed/local asset is supplied. Use weight and space sparingly: display hierarchy comes from scale and line length, not repeated heavy bold text.

- Display and section titles use weight 500, balanced wrapping, and a controlled maximum line length.
- Body large, body, caption, eyebrow, and CTA roles keep their shared size and line-height instead of receiving page-specific values.
- Korean headings use `word-break: keep-all` and `text-wrap: balance`. Shorten the sentence or adjust its measure before adding an intentional `<br>`; a manual break is reserved for a stable semantic pause in a display sentence.

## Layout primitives

- Global frame: maximum 1440px, responsive side padding.
- Content frame: maximum 1280px.
- Desktop: 12 columns; tablet: 8; mobile: 4.
- Mobile horizontal padding: 20px.
- Desktop section rhythm: 120–160px; smaller internal spacing uses the shared token scale only.

Semantic spacing variables in `globals.css` own page edge, major section, chapter, heading-to-body, body-to-media, media-to-media, media-to-caption, and CTA gaps. Related media stays within the media gap; a new chapter uses the larger chapter or section gap.

Components use `.page-shell`, `.content-grid`, and responsive CSS grid rules rather than each route inventing its own width.

## Surface rules

Borders organize secondary information. Shadows are near-absent. Radius signals media and controls, not every page section. A section should be a composition in space before it becomes a card.

Use a major divider only for a chapter change and a minor divider for repeated records such as career rows. Do not add a divider when the section gap already makes the grouping clear.

## Image grouping

- Project storytelling may preserve a source image's native character, but archive previews use a category frame so each series reads as one group: video thumbnails and title graphics use `16:9`, event graphics use `1:1`, and long detail pages use `4:5`.
- Preview frames use `object-fit: cover`; set a work-specific focal position when a face, product, title, or other essential information would otherwise be cropped.
- A long vertical detail page pairs its `4:5` preview with a text link to the original file, so the full page is never lost, only summarized.
- A visual series shares its image top and bottom, title start, caption position, and media gap. The archive uses three equal columns on desktop, two on tablet, and a large single-card horizontal gallery on mobile.
- Responsive product screens are presented as a named Desktop–Mobile pair, with the desktop image as the base visual and the mobile image overlapping or following it.
- Home uses one large lead work followed by a finite horizontal reel; the archive may use denser category compositions.
- A mobile horizontal gallery card is sized `calc(100vw - 76px)` so the next card peeks by a constant ~20px regardless of viewport width, and the scroll container is edge-masked so a peeking card's title/description fades out instead of showing legible cut-off text.

## Reveal safety

Reveal is progressive enhancement, never a visibility dependency. Viewports up to 1023px, coarse pointers, and reduced-motion environments render content immediately. Desktop observation keeps a short failsafe and must leave zero hidden targets after a full-page scroll.
