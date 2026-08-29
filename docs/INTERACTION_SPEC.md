# Interaction specification

Motion communicates hierarchy, navigation, or state. It must never be required to access content.

## Tokens

| Token | Duration | Use |
| --- | --- | --- |
| Fast | 160ms | controls, focus, small hover feedback |
| Base | 280ms | image and link transitions |
| Slow | 450ms | entrance or page-level reveal |

Use a natural decelerating easing. Allowed properties are opacity, `translateY` within 12–28px, and subtle scale from 0.98–1.03.

## Implemented foundation interactions

- Header gains a faint surface and border after scrolling.
- Project media scales slightly and the arrow shifts on hover/focus.
- Links and controls retain visible keyboard focus.

## Constraints

Do not use scroll hijacking, custom cursors, continuous backgrounds, infinite marquees, heavy parallax, pervasive 3D rotation, or per-character bouncing text. Hover must only enhance already visible information; touch layouts present the information directly.

## Reduced motion

`prefers-reduced-motion: reduce` removes non-essential transitions and smooth scrolling. Any future animation must preserve that behavior.
