# 001, Keycap rain and push-through intro beat

- **Status**: DONE (executed in the same session, commit follows)
- **Commit**: e9bb7c8
- **Severity**: LOW (additive delight, not corrective)
- **Category**: Missed opportunities / purpose and frequency
- **Estimated scope**: 2 files (components/Intro.tsx, app/globals.css), ~90 lines

## Problem

The intro ends abruptly for what it is. After the logomark fills, the wipe opens
and the headline rises 250ms later. The site's most distinctive assets, the seven
3D keycap renders, never appear as a set. The request: after the loading beat,
roughly two more seconds where the keycaps drop onto the revealed page, then the
camera pushes through them into the homepage.

Frequency check per the audit table: the intro is session-gated (plays once per
browser session), skippable on any input, and bypassed by reduced motion and
no-JS. That is the "rare / first-time" row, where delight is allowed and longer
durations are legitimate.

Current beat map, `components/Intro.tsx:74-87`:

```ts
function finishSequence() {
  if (done) return;
  later(() => intro!.classList.add('b2'), 0); // outline fills + sheen
  later(() => intro!.classList.add('b3'), 420 * K); // clip-path wipe
  later(() => hero!.classList.add('on'), (420 + 250) * K); // hero lines up from behind the mask
  later(() => {
    nav!.style.opacity = '1';
    html.classList.remove('locked');
    done = true;
    remember();
    removeSkip();
  }, (420 + 250 + 720) * K);
  later(() => intro!.classList.add('gone'), (420 + 620) * K);
}
```

`endState()` at `components/Intro.tsx:59-72` is the skip and reduced-motion path;
it adds `'b1', 'b2', 'b3', 'gone'` and must stay a complete jump to the final
state.

## Target

Two new beats between the wipe and the headline rise. All motion is transform
and opacity only. JS owns every duration and delay (multiplied by the existing
`K` mobile factor, `0.72` under 700px), CSS owns curves and geometry, exactly the
pattern the mark draw already uses at `components/Intro.tsx:99-100`.

Beat map (times in ms, multiplied by K):

| t | beat | what happens |
| --- | --- | --- |
| 0 | b2 | mark fills + gleam (unchanged) |
| 420 | b3 | wipe opens onto the page, headline still masked (unchanged) |
| 460 | b4 | seven keycaps rain down, staggered 70ms, each 620ms |
| 1540 | | last cap has landed |
| 1720 | b5 | stage scales 1 to 8.5 over 850ms, caps fade out 320ms starting 400ms in |
| 1940 | | `hero.on`, headline rises mid-zoom |
| 2570 | | nav in, unlock scroll, done, remember() |
| 2600 | gone | `#intro` display:none |

Drop curve: `cubic-bezier(.5,.05,.55,1.4)`. Slow start (gravity accelerates the
fall), roughly 8 percent overshoot past the resting point, settle. Never
`ease-out` for a fall: a fall speeds up.

Zoom curve: the site token `--ease-reveal: cubic-bezier(0.65,0.05,0,1)`
(app/globals.css:23), the same curve every cinematic reveal already uses.
Transform-origin `47% 45%`, which sits over the SEO cap so the push-through
passes the hero's own key.

Cap layout, deterministic, no randomness (values are viewport-relative for
position, px for size, degrees for rotation, ms for stagger):

| file | left | top | --w | --r0 (falling) | --r1 (landed) | delay |
| --- | --- | --- | --- | --- | --- | --- |
| cta.webp | 7vw | 12vh | 96px | -32deg | -18deg | 0 |
| photo.webp | 76vw | 9vh | 104px | 26deg | 13deg | 70 |
| brand.webp | 14vw | 56vh | 126px | -16deg | -8deg | 140 |
| design.webp | 36vw | 16vh | 86px | 38deg | 22deg | 210 |
| social.webp | 67vw | 52vh | 110px | -26deg | -12deg | 280 |
| ai.webp | 87vw | 30vh | 90px | 14deg | 6deg | 350 |
| seo.webp | 41vw | 36vh | 158px | 18deg | 5deg | 460 |

The SEO cap is largest, lands last, near the zoom origin: it is the hero's own
object, so the sequence hands off to it.

CSS to add after the `#intro.gone` rule (app/globals.css, intro section):

```css
/* beats 4 and 5: keycap rain, then the camera pushes through */
#intro .stage{
  position:absolute;inset:0;overflow:hidden;pointer-events:none;
  opacity:0;transform-origin:47% 45%;will-change:transform,opacity;
}
#intro.b4 .stage{opacity:1}
#intro .stage img{
  position:absolute;width:var(--w);height:auto;
  transform:translateY(-130vh) rotate(var(--r0));
  filter:drop-shadow(0 18px 26px rgba(0,0,0,.5));
  will-change:transform;
}
#intro.b4 .stage img{
  transform:translateY(0) rotate(var(--r1));
  /* curve only: JS sets duration and delay, scaled by K */
  transition:transform 620ms cubic-bezier(.5,.05,.55,1.4);
}
#intro.b5 .stage{
  transform:scale(8.5);opacity:0;
  transition:transform 850ms var(--ease-reveal),opacity 320ms linear 400ms;
}
@media (max-width:700px){
  #intro .stage img{width:calc(var(--w) * .68)}
}
```

JSX: a `.stage` div inside `#intro`, after `.mark`, holding the seven imgs with
inline `left`, `top`, `--w`, `--r0`, `--r1`. The whole `#intro` is already
`aria-hidden`, and every img gets `alt=""`. Images load eagerly on purpose: the
intro's honest progress counts every non-lazy image (`components/Intro.tsx:107`),
so the counter now genuinely waits for the caps it is about to drop.

`finishSequence` gains, before the existing hero.on line (which moves to 1940K):

```ts
later(() => {
  intro!.querySelectorAll<HTMLElement>('.stage img').forEach((c, i) => {
    c.style.transitionDuration = `${Math.round(620 * K)}ms`;
    c.style.transitionDelay = `${Math.round(RAIN[i].delay * K)}ms`;
  });
  intro!.classList.add('b4');
}, 460 * K);
later(() => {
  const stage = intro!.querySelector<HTMLElement>('.stage');
  if (stage) {
    stage.style.transitionDuration = `${Math.round(850 * K)}ms, ${Math.round(320 * K)}ms`;
    stage.style.transitionDelay = `0ms, ${Math.round(400 * K)}ms`;
  }
  intro!.classList.add('b5');
}, 1720 * K);
```

`endState()` adds `'b4', 'b5'` to its classList.add so a skip or reduced motion
jumps straight to the finished state under the existing `.no-anim` guard.

## Repo conventions to follow

- JS-scaled durations: `markPath.style.transitionDuration = drawMs + 'ms'` at
  components/Intro.tsx:100 is the exemplar.
- Curves: only `--ease-reveal` and `--ease-ui` tokens plus purpose-built cubic
  beziers declared inline in the intro block.
- Beat classes: b1/b2/b3 pattern in app/globals.css intro section.
- Zero em or en dashes anywhere, checked by `grep -rP '[\x{2014}\x{2013}]' app components`.

## Boundaries

- Do NOT touch the loading counter, the mark draw, the wipe, or the skip logic.
- Do NOT add dependencies or keyframes: transitions only, they retarget when skipped.
- Do NOT animate anything but transform and opacity.
- Do NOT let the sequence run under reduced motion, on repeat visits, or without JS.

## Verification

- **Mechanical**: `npx tsc --noEmit` clean; `npm run build` clean; dash grep
  returns nothing; SSR HTML still has exactly one h1; First Load JS stays 102 kB.
- **Feel check**: fresh session, watch the full run. The caps must read as
  falling (accelerating) not floating down; the last land must breathe for a
  beat (~180ms) before the zoom; the headline must be rising while the zoom is
  still finishing, so the handoff overlaps instead of queueing. Then press any
  key mid-rain: the page must be instantly usable with no half-dropped caps.
- Session-gate check: reload after a completed run, intro must not replay.

## Revision 1, fluidity pass

Feedback: make the rain more fluid, smoother ease in and out. Changes:

- Fall: 620ms flat became per-cap 780 to 940ms (big caps fall longer), curve
  cubic-bezier(.5,.05,.55,1.4) became cubic-bezier(.4,0,.22,1.18): the ~8
  percent overshoot dropped to ~4 and the settle is gradual instead of snapped.
- Motion blur: caps fall with filter blur(7px) clearing to blur(0) on the same
  curve and duration as the transform, so each cap sharpens as it lands.
- Zoom: 850ms on --ease-reveal became 1000ms on cubic-bezier(.77,0,.175,1),
  the strong ease-in-out from the audit playbook: a camera push wants symmetric
  acceleration, not the reveal curve's mid snap. Cap fade is 420ms ease at 480ms.
- Beats shifted: b5 at 2040, hero.on at 2290, done 3090, gone 3120 (times x K).
  The sequence gained ~500ms in exchange for the softer motion.
