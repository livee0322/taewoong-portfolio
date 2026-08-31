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
- Selected visual-work images use a restrained scale reveal on hover/focus; touch layouts keep every image fully visible without a hover dependency.
- Links and controls retain visible keyboard focus.
- Hero copy reveals in reading order after hydration.
- Project, work, and responsive-pair groups reveal once as they enter the viewport, with short stagger only inside a related series.
- Reveal is progressive enhancement: content is visible by default, only a successfully observed target receives `reveal-pending`, and route changes, unsupported observers, cleanup, or a 2.4-second failsafe restore visibility.
- At 640px and below, reveal pending is not applied. Mobile keeps the intended reading order and horizontal galleries while prioritizing permanent content visibility over entrance motion.
- The home work reel and mobile archive rows use native horizontal scrolling and scroll snap; they never move without user input.
- LIVBEE Desktop–Mobile pairs reveal as one comparison unit.

## Constraints

Do not use scroll hijacking, custom cursors, continuous backgrounds, infinite marquees, heavy parallax, pervasive 3D rotation, or per-character bouncing text. Hover must only enhance already visible information; touch layouts present the information directly.

## Reduced motion

`prefers-reduced-motion: reduce` removes non-essential transitions and smooth scrolling. Any future animation must preserve that behavior.

Content remains visible without JavaScript. The observer only adds progressive enhancement and stops observing an item after its first reveal.
