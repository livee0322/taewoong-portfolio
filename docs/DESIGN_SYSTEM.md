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

## Layout primitives

- Global frame: maximum 1440px, responsive side padding.
- Content frame: maximum 1280px.
- Desktop: 12 columns; tablet: 8; mobile: 4.
- Mobile horizontal padding: 20px.
- Desktop section rhythm: 120–160px; smaller internal spacing uses the shared token scale only.

Components use `.page-shell`, `.content-grid`, and responsive CSS grid rules rather than each route inventing its own width.

## Surface rules

Borders organize secondary information. Shadows are near-absent. Radius signals media and controls, not every page section. A section should be a composition in space before it becomes a card.
