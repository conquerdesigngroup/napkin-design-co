# NAPKIN DESIGN CO. — WEBSITE BUILD PROMPT
### v1 — master brief. Paste into Claude Code / Cursor / your builder of choice.

---

## 0. HOW TO USE THIS DOCUMENT

Everything in `[BRACKETS]` is a slot to fill once brand assets land. Everything else is a
directive. Sections 4, 6, and 8 are the non-negotiables — if scope has to get cut, cut from
Section 5 first, never from 8.

Build order: **Section 1 (concept) → 3 (art direction) → 4 (intro) → 5 (pages) → 8 (quality floor).**
Do not start writing components until the concept in Section 1 is locked, because every
motion and material decision downstream derives from it.

---

## 1. THE CONCEPT — READ THIS FIRST

The name is the whole strategy. **Every great idea starts on a napkin.**

Napkin Design Co. is where a half-formed thought scrawled in ballpoint at a bar table becomes
a shipped brand. That is the entire site: **the gap between the scribble and the finished thing,
and how short we make it.**

This gives us a material tension to art-direct against, which is what separates a memorable
site from a nice one:

| The Napkin | The Execution |
|---|---|
| Matte, absorbent, cheap, disposable | Liquid glass — wet, refractive, expensive, permanent |
| Hand-drawn, wobbly, fast | Machined, precise, considered |
| Ballpoint blue / Sharpie black | Full-spectrum, chromatic, lit |
| The idea | The proof |

**Every major interaction on this site should move in one direction: napkin → glass.**
Rough resolves into refined. That is the signature. It's on-brand, it's ownable, and it's
not something any other agency can run.

Services get framed as napkin-to-glass, not as a bulleted list:

> Web Design · UI/UX · Graphics · Video · Photo · SEO
> → *"Six ways we get it off the napkin."*

**Write the copy in the studio's voice: confident, short, a little smart-ass, zero corporate
filler.** Sentence case. Active verbs. No "we leverage synergies." No "elevate your brand."
If a line could appear on any other agency site, delete it and write a better one.

---

## 2. BRAND & POSITIONING

- **Name:** Napkin Design Co.
- **Category:** Full-service creative studio — Web Design, UI/UX, Graphic Design, Video,
  Photography, SEO
- **Positioning:** Not a traditional agency. Faster, looser, more fun to work with, and the
  work is sharper than the people charging triple.
- **Audience:** Founders and marketing leads who are tired of agencies that talk for six weeks
  before showing anything.
- **The feeling on arrival:** *"…okay, these people are actually good."* Earned in the first
  three seconds, before a single word is read.

`[LOGO PRIMARY]` · `[LOGO MARK]` · `[BRAND COLORS]` · `[BRAND FONTS]` · `[EXISTING WORK / CASE STUDY ASSETS]`
— to be supplied. Where these conflict with Section 3, **the real brand assets win.**

---

## 3. ART DIRECTION

### 3.1 Liquid glass — build it properly

Most "glassmorphism" on the web is `backdrop-filter: blur()` and stops there. That's **frosted**
glass — flat, matte, 2015. Liquid glass is **refractive**: it bends what's behind it, splits
light at the edges, and has a wet specular highlight. Build all three layers:

**Layer 1 — Refraction (the part everyone skips).**
Two viable routes; pick per component:

- *CSS route (cheap, for UI chrome — nav, cards, buttons):* an SVG filter using
  `<feTurbulence>` → `<feDisplacementMap>` referenced from `backdrop-filter: url(#glass) blur(6px) saturate(180%)`.
  Chromium handles this well. **Safari and Firefox degrade** — feature-detect with
  `@supports` and fall back to blur + saturate + a gradient edge. Never let the fallback look broken.
- *WebGL route (for the hero object only):* `MeshTransmissionMaterial` from `@react-three/drei`.
  Starting values: `transmission: 1`, `ior: 1.45–1.52`, `thickness: 0.8–1.5`,
  `roughness: 0.05–0.15`, `chromaticAberration: 0.04`, `anisotropy: 0.2`, `distortion: 0.3`.
  Tune live — these are a starting point, not gospel.

**Layer 2 — Edge specularity.** Glass reads as glass at its *edges*. Every glass surface gets a
1px border of a vertical gradient from ~55% white down to ~8% white, plus
`box-shadow: inset 0 1px 0 rgba(255,255,255,0.4)`. Without this it looks like a blurred div.

**Layer 3 — Something worth refracting.** Glass over a flat background is invisible. There must
always be motion, color, or texture behind it — a slow gradient mesh, a video, a scrolling
image wall. **Design the backdrop first, the glass second.**

**Rule:** glass is for *chrome and hero moments only.* Nav bar, hero object, CTA buttons, modals.
Body copy sits on solid surfaces. Glass over paragraphs is unreadable, and the whole point is
that it's precious.

### 3.2 Typography — clean and edgy, executed with restraint

Three roles. Pair deliberately:

- **Display:** a tight, wide-set contemporary grotesk with attitude. `Clash Display`,
  `PP Right Grotesk Compact`, `Monument Extended`, or `Archivo Expanded`.
  Set it **huge** — hero at `clamp(3.5rem, 11vw, 12rem)`, tracking around `-0.03em`,
  line-height `0.88`. Tight enough that letters nearly touch.
- **Body:** a clean, low-personality neo-grotesk that gets out of the way.
  `Satoshi`, `General Sans`, or `Inter`. `1.05rem`, line-height `1.55`, max measure `62ch`.
- **Utility:** a mono for labels, indices, timestamps, captions. `JetBrains Mono` or
  `Geist Mono`. Uppercase, `0.72rem`, tracking `0.14em`. This is what makes it feel like a
  studio rather than a template.

`Clash Display`, `Satoshi`, and `General Sans` are all free for commercial use via Fontshare —
worth noting for an agency site.

**The napkin layer is not a font.** Do not reach for a handwriting typeface — Caveat and
Permanent Marker will torch the credibility instantly. The hand-drawn quality comes from
**real SVG assets**: actual scanned or drawn marks, animated with `stroke-dasharray` /
`stroke-dashoffset` so they draw themselves in. If a marker face is used at all, it appears
**once**, at small size, as an annotation — never as a headline.

### 3.3 Color

Starting token set — **override with real brand colors when supplied.** The logic: the canvas
goes near-black so the glass has something to refract and the napkin-white reads as a
physical object rather than a background. The accent is derived from the subject — ballpoint
pen ink, the color every napkin idea is actually drawn in.

```
--ink-void:    #0A0A0B   /* canvas — near-black, slightly warm-neutral */
--napkin:      #F2EFE6   /* paper, used as an OBJECT not a background */
--ballpoint:   #2B4DE0   /* primary accent — pen ink blue */
--bleed:       #FF4A24   /* secondary accent, used sparingly — marker red */
--smoke:       #8A8A94   /* muted text, rules, disabled */
--glass-tint:  rgba(255,255,255,0.06)
```

Accent usage stays under ~8% of any viewport. Restraint is what makes it look expensive.

### 3.4 Motion

- **Easing:** custom cubic-bezier only. `cubic-bezier(0.65, 0.05, 0, 1)` for reveals,
  `cubic-bezier(0.22, 1, 0.36, 1)` for UI. **Never `ease-in-out`.** Default easings are the
  single loudest tell of an unconsidered build.
- **Durations:** UI `180–260ms`. Section reveals `600–900ms`. Intro beats per Section 4.
- **Stagger:** `40–70ms` between siblings. Text reveals split by line (not by character —
  character-splitting a whole paragraph reads as showing off and destroys screen readers).
- **Scroll:** smooth scroll via **Lenis** (`lerp: 0.08`). Scroll-linked animation via
  **GSAP ScrollTrigger**. Pin sparingly — one, maybe two pinned sections on the whole homepage.
- **Cursor:** a custom cursor that behaves like a pen — it leaves a short ballpoint trail that
  fades over ~800ms, and it inverts/scales over interactive elements. Desktop and
  fine-pointer only; disabled entirely on touch.

---

## 4. THE INTRO SEQUENCE — THE MOST IMPORTANT 3.5 SECONDS

**Concept: the napkin sketch resolves into the real thing.**

The user lands on what appears to be a rough scrawl and watches it become the actual site.
Napkin → glass, stated in the first gesture. It is literally the studio's pitch, performed.

### Beat sheet

| t (ms) | Beat |
|---|---|
| 0 | Full-bleed `--ink-void`. Silence. A single hairline `--smoke` rule at vertical center. |
| 0–1200 | Hairline draws left→right. Above it, a mono percentage counter (`00` → `100`) ticks **against real asset load progress, not a fake timer.** Below it, `[LOGO MARK]` renders as an SVG *outline*, drawing itself in via `stroke-dashoffset` — like a pen sketching it. |
| 1200–1600 | Counter hits 100. Outline logo **fills** — stroke resolves to solid, then picks up a specular sheen. The sketch became the object. |
| 1600–2100 | Logo scales up slightly and the whole preloader layer wipes away on a `clip-path` reveal from the center outward, easing `cubic-bezier(0.65,0.05,0,1)`. |
| 2100–2900 | Hero content arrives underneath: headline reveals **line by line** on `70ms` stagger from a `110%` y-offset behind a mask. Hero glass object fades up from `opacity: 0` + `scale: 1.06`. |
| 2900–3400 | Nav and footer meta (location, time, availability) fade in last at `opacity: 0 → 1`, no movement. Scroll unlocks. |

### Rules — all four are mandatory

1. **Total ≤ 3.5s.** If assets load faster, the sequence runs faster. Never hold the user
   hostage to a fixed timeline.
2. **Skippable.** Any click, keypress, or scroll jumps to the end state immediately.
3. **Once per session.** Gate on `sessionStorage`. A returning visitor going to the contact
   page should never sit through this again. This is the detail almost every award site
   gets wrong.
4. **`prefers-reduced-motion: reduce` → no intro at all.** Straight to hero, fully rendered.

Body scroll is locked for the duration and released on completion.

---

## 5. SITE STRUCTURE

### Homepage

1. **Intro** — Section 4.
2. **Hero** — Oversized display headline stating the napkin thesis. One glass object,
   slow-rotating, reacting subtly to cursor position. Mono meta strip along the bottom edge:
   `[CITY]` · local time (live) · current availability.
3. **The six services** — Not a card grid with icons. Each service is a row that, on hover
   or scroll-into-view, **transitions from a hand-drawn SVG scribble to a crisp glass
   nameplate.** Same napkin→glass move, six times, at small scale. This is the section that
   sells the concept.
4. **Selected work** — 4–6 projects. Large imagery, minimal chrome. Hover reveals the
   original "napkin" — the initial sketch, wireframe, or storyboard — layered over the final
   result. **The before/after IS the portfolio.** For a studio that does video and photo,
   at least two tiles should be autoplaying muted video, `preload="none"`, lazy-mounted
   via IntersectionObserver.
5. **How we work** — Three or four steps. Numbering is earned here because it's a genuine
   sequence. Mono numerals, generous whitespace.
6. **Proof** — Testimonials or client logos. Quiet. Let it breathe.
7. **CTA** — Full-bleed. One glass button. One line of copy. Nothing else.
8. **Footer** — Mono. Contact, socials, `[EMAIL]`, colophon.

### Additional pages

- `/work` — filterable index, filters by discipline
- `/work/[slug]` — case studies; napkin-to-final narrative structure throughout
- `/studio` — who we are, the philosophy, the room
- `/contact` — a form that doesn't feel like a form. Conversational, one question at a time.
- `/journal` *(optional)* — **exists primarily for SEO.** See Section 8.

---

## 6. SIGNATURE — SPEND THE BOLDNESS IN ONE PLACE

Pick **one** interactive centerpiece and execute it to a very high standard. Three or four
half-finished clever ideas read as noise; one perfect one gets remembered and shared.

**Recommended: "Sketch it."** A persistent affordance lets the visitor draw directly on the
page in ballpoint blue, on a canvas layer above the content. After ~2 seconds of inactivity,
whatever they drew **resolves** — the wobbly line snaps to a smoothed, refractive glass
stroke. They perform the studio's entire value proposition with their own hand. Optionally,
their sketch can be attached to the contact form as the first thing they send.

Alternatives if that doesn't fit the brand once assets land:
- A hero glass object that's a **draggable, physics-y crumpled napkin** which un-crumples on release
- A work index built as an **infinite draggable grid** that wraps seamlessly in both axes

Whichever is chosen: it must work on touch, it must be discoverable without instructions,
and it must never block the path to the contact page.

---

## 7. TECH STACK

```
Framework     Next.js (App Router) + TypeScript
Styling       Tailwind CSS + CSS custom properties for the token layer
Animation     GSAP + ScrollTrigger  ·  Lenis (smooth scroll)  ·  SplitType (line splitting)
3D            react-three-fiber + drei  — hero object ONLY, lazy-loaded, never blocking
Media         next/image (AVIF+WebP)  ·  Mux or Cloudflare Stream for video
CMS           Sanity — so work and journal can be updated without a deploy
Forms         Resend or Formspree, with server-side validation
Deploy        Vercel
Analytics     Plausible or Vercel Analytics (cookieless — avoids a consent banner entirely)
```

**Hard constraint:** the 3D bundle is dynamically imported with `ssr: false` and only mounts
when its container enters the viewport. It must never be in the critical path. If WebGL is
unavailable or the device is low-power, render a high-quality static poster image of the same
object and continue. Nothing on this site is allowed to be a blank rectangle.

---

## 8. NON-NEGOTIABLES

### 8.1 SEO — this one is strategic, not technical

I fetched the reference site as a text-only crawler would. It returned **the nav links, a
tagline, and a city name.** Nothing else. Every headline, every case study, every word of
body copy is locked behind JavaScript and canvas rendering.

For a venture fund that gets its deal flow from a network, that's a fine trade. **For a studio
that sells SEO as a service, it's disqualifying.** A prospect who checks whether the SEO
agency's own site ranks — and they will — needs to find something.

So: **animate the presentation layer, never gate the content layer.**

- All copy server-rendered in real semantic HTML. Text that animates in must be **present in
  the DOM at load** and revealed with `transform`/`opacity`/`clip-path` — never injected by JS.
- Correct heading hierarchy. Exactly one `h1` per page.
- Per-page metadata, OG images, and canonicals via the Next.js Metadata API.
- `Organization`, `LocalBusiness`, and `CreativeWork` JSON-LD schema.
- Real `alt` text on every image — written, not filenames.
- `sitemap.xml` and `robots.txt` generated at build.
- The `/journal` route exists so there's indexable long-form content targeting
  `[CITY] + [service]` terms. Ship it with three real posts, not placeholders.

**Acceptance test: disable JavaScript, load the homepage, and read the entire value
proposition.** If you can't, it isn't done.

### 8.2 Performance

- Lighthouse **≥ 90 on mobile** for Performance, Accessibility, Best Practices, and SEO.
- LCP < 2.5s on a throttled 4G connection.
- CLS < 0.1 — the intro sequence is the main risk here; reserve layout space up front.
- Self-hosted fonts, `woff2`, subset, `font-display: swap`, preloaded for display face only.
- Total JS on first load under ~250KB gzipped, excluding the lazy 3D chunk.

### 8.3 Accessibility

- `prefers-reduced-motion: reduce` disables the intro, parallax, cursor trail, and smooth
  scroll. This is a real, tested code path — not an afterthought.
- Visible keyboard focus states. The custom cursor never replaces focus rings.
- 4.5:1 contrast minimum on all body text. **Audit glass surfaces specifically** — text on
  translucent backgrounds is where this always fails.
- Full keyboard navigation. Skip-to-content link. Semantic landmarks.
- Canvas and WebGL elements marked `aria-hidden` with text equivalents adjacent.

### 8.4 Responsive

Mobile is not a reduction — it's a re-choreography. On mobile: intro shortens to ~2s, the 3D
object becomes a poster image, the cursor trail is off, hover states become scroll-triggered
reveals, and type scales down but stays confident. **Test on a real mid-range Android**, not
just a simulator.

---

## 9. ANTI-PATTERNS — DO NOT

- **Do not clone the reference site.** No paintball gun, no desktop-OS dashboard, no
  toroidal grid, no lifted copy or icon system. That work is specific to that client and
  copying it makes us look like exactly the derivative agency we're claiming not to be.
  Take the *architecture* — orchestrated intro, one signature interaction, uncompromising
  craft — and apply it to the napkin idea.
- No stock "creative agency" language. No "we craft digital experiences."
- No purple-to-blue gradients. No generic 3D blobs. No floating particle fields.
- No default easing curves.
- No animation on more than ~30% of viewport elements at once.
- No autoplaying audio, ever.
- No cookie banner — use cookieless analytics and skip the problem.
- No scroll-jacking that fights the user. Lenis smooths; it must never hijack.
- No text baked into images.
- No lorem ipsum shipped. Every string is real copy.

---

## 10. ACCEPTANCE CRITERIA

Ship when all of these are true:

- [ ] Homepage loads, intro completes, and scroll unlocks in under 3.5s on 4G
- [ ] Intro is skippable, session-gated, and fully disabled under reduced-motion
- [ ] Full value proposition readable with JavaScript disabled
- [ ] Lighthouse ≥ 90 mobile across all four categories
- [ ] Glass surfaces pass 4.5:1 contrast on every text element sitting on them
- [ ] Site is fully keyboard navigable, with visible focus throughout
- [ ] Every one of the six services has a working napkin→glass transition
- [ ] The signature interaction works on touch
- [ ] Zero placeholder copy anywhere
- [ ] Tested on real iOS Safari, Chrome Android, and Firefox desktop — glass degrades
      gracefully in all three

---

## APPENDIX — WHAT'S ACTUALLY IN THE REFERENCE SITE

From analyzing `damngoodbrands.com` and the build studio's own case study
(Analogue, UK — the site won **Awwwards Site of the Day** and a **Developer Award**):

**Stack:** Next.js + Sanity CMS, heavy WebGL/Three.js, GSAP-driven motion.

**Structure:** four routes — Dashboard, About, Hypeboard, Let's Work. Deliberately small.
The depth is in the interactions, not the sitemap.

**Signature interactions:**
- A functional digital paintball gun that splatters color and destroys headline text
- "Hypeboard" — an infinitely looping randomized grid mapped to a torus, so it wraps in
  every direction as you drag
- A drag-and-drop desktop-OS environment for their portfolio companies
- A WebGL 3D car with switchable materials (wireframe / glass) and a percentage-based
  model loader

**On the intro specifically:** a text-only fetch returns almost nothing, which confirms the
homepage is fully JS/canvas-gated behind a preloader. I could read the architecture and the
asset pipeline, but not the frame-by-frame timing of the entrance animation — that would need
eyes on it in a browser. The Section 4 beat sheet is built from the pattern this class of
site uses (percentage-driven preloader → masked reveal → staggered hero) and tuned to the
napkin concept, rather than reverse-engineered shot-for-shot. Worth screen-recording their
intro and comparing against Section 4 before locking timings.

**The real lesson from it:** the site is built around *one belief about the client*, executed
obsessively. Its concept was "grit meets glam." Ours is **"napkin to glass."** That's the part
worth taking.
