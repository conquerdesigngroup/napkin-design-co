# Napkin Design Co. - Claude Code starter

Everything needed to turn the finished single-file homepage into a production Next.js site, with the three design skills that shaped it already installed.

## Quickstart
1. Unzip, then open the folder in a terminal:
   ```
   cd napkin-design-co
   claude
   ```
2. Paste the kickoff prompt below. Claude Code reads `CLAUDE.md` automatically and the skills in `.claude/skills/` are picked up on their own.

## Kickoff prompt (paste into Claude Code)
```
Read CLAUDE.md, PRODUCT.md, and DESIGN.md, then open reference/napkin-design-co.html and skim its CSS and script so you know the whole build. Run node .claude/skills/impeccable/scripts/context.mjs once. Then scaffold a Next.js App Router + TypeScript project in this repo and port the reference 1:1, in this order: tokens and fonts (next/font/local from assets/fonts), static sections with verbatim copy, then the client-side behaviors from the CLAUDE.md checklist one at a time, testing each against the reference. Finish with the definition-of-done checks in CLAUDE.md, run the design-taste-frontend pre-flight, and have review-animations look at all motion code.
```

First look without any setup: double-click `reference/napkin-design-co.html`. It is fully self-contained (fonts and images embedded).

## What is in here
```
CLAUDE.md          project instructions Claude Code follows (invariants, checklist, definition of done)
PRODUCT.md         product truth: real claims, people, brand commitments
DESIGN.md          the design system recorded from the shipped build
reference/         napkin-design-co.html, the source of truth (open in a browser)
docs/              the original client brief + content inventory
assets/logo/       standalone wordmark + logomark SVGs, originals in source/
assets/keycaps/    the seven 3D keycap renders, web-optimized
assets/fonts/      Archivo variable + JetBrains Mono 400/700 (production files + the exact subsets the reference embeds)
.claude/skills/    impeccable, design-taste-frontend (Taste Skill), emil-design-eng, review-animations (vendored, licenses included)
.claude/agents/    impeccable's finish reviewer, documenter, asset producer, edit applier
```

## Notes
- The full-resolution keycap PNGs are not bundled (7 MB+); you have the originals. The webp versions are what the site uses.
- To update impeccable later: `npx impeccable install` from the project root. Sources for all vendored skills are in `.claude/skills/VENDORED-SKILLS.md`.
- One rule above all others, from the skill pass: zero em or en dashes anywhere in the product. `CLAUDE.md` has the grep.
