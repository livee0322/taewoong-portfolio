# Mobile P0 QA evidence

Captured from the production build for the PR #2 mobile regression fix. Each route was scrolled from top to bottom at the exact CSS viewport, with mobile emulation at `devicePixelRatio: 3`.

| Viewport | `/` | `/works` | `/projects/livbee` |
| --- | --- | --- | --- |
| 360×800 | [home](./home-360-full.jpg) | [works](./works-360-full.jpg) | [LIVBEE](./projects-livbee-360-full.jpg) |
| 375×812 | [home](./home-375-full.jpg) | [works](./works-375-full.jpg) | [LIVBEE](./projects-livbee-375-full.jpg) |
| 390×844 | [home](./home-390-full.jpg) | [works](./works-390-full.jpg) | [LIVBEE](./projects-livbee-390-full.jpg) |

The machine-readable [report](./report.json) records viewport metadata, media-query matches, navigation display states, document overflow, reveal visibility, and LIVBEE responsive-pair height. All nine runs finished with zero hidden reveal targets in the viewport and no page-level horizontal overflow.

For stable full-page evidence, the sticky header is normalized to normal document flow only at screenshot time. Sticky behavior and its 69px rendered height were measured before that capture-only normalization.
