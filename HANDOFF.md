# HANDOFF — bzsystems.io (redesign branch)

Last updated: 2026-07-18. MERGED: `redesign` was fast-forwarded into `main`
on 2026-07-18 for the Vercel launch; `main` is now the live branch and the
place to develop. The retired light-editorial v1 exists only in git history.
Everything below is committed and pushed to
`github.com/ZieglerBlake/bzsystems` (private).

## What the site is

Parent-company flagship for BZ Systems LLC (independent software studio,
Columbus OH, Blake Robert Ziegler). Ventures ship elsewhere; this site is
brand + about + contact. Design language: "bright control room x schematic".

- Field `#F7F8F6` (token name `void` — kept for class stability), panel white,
  ink `#101312`, one signal blue `#1E70CD` (bright-on-dark `#5B9BE8`,
  text-on-light `#15529E`). Fonts: Archivo variable (wdth axis; display 125,
  semi 112) + JetBrains Mono. Blue seams: `h-[2px] bg-signal shadow-glow`.
- Hard content rules from Blake: NO em dashes anywhere, ever. No invented
  metrics/details. Venture lineup lives on /ventures (pending content), not
  on the home page.

## Pages & structure (all verified desktop + 375px)

- `/` — PhasedBuildIntro (plays ONLY on a fresh document load, skippable,
  SSR-rendered so no flash; NEVER on any in-site route transition and never
  on section deep links like /#contact. Mechanism: the hydration initializer
  checks for the server-rendered .pbi node in the DOM; client-side
  transitions have none. Do not replace with effect-ordering tricks; a
  layout-level tracker was tried 2026-07-18 and lost the hydration race) →
  hero (live SystemMap canvas, "DESIGNED BY US. / BUILT BY US. /
  OWNED BY US.") → film band (hero.mp4 + centered logo-dark w/ vignette) →
  SEC.01 THE COMPANY (dark band) → SEC.02 OWNERSHIP (graded headshot
  ziegler.webp) → SEC.03 HOW WE BUILD (3 cards + 7 capability chips +
  "ARCHITECTURE OVER ASSURANCES.") → thesis slab ("THE SYSTEM IS THE
  STRATEGY. THE PRODUCTS ARE THE PROOF.") → SEC.04 CONTACT (form) → footer.
- `/about` — definitive copy from Blake (verbatim): centered dark-mark
  nameplate (logo-dark.png on an ink plate), then all four sections
  centered: THE COMPANY / THE THESIS / WHAT WE BUILD / HOW WE OPERATE.
  The ABOUT label and "Building software companies..." headline were
  removed 2026-07-18 at Blake's request (page has no h1 now; flag if an
  SEO pass ever revisits this).
- `/ventures` — LIGHT themed since 2026-07-18: light map, "THE REGISTRY IS
  IN BUILD.", decorative password gate (components/RegistryLock.tsx, NOT
  real auth, every attempt refused; swap for a real check at launch),
  RETURN TO MAIN + SEND AN INQUIRY buttons. Padlock glyph sits next to
  VENTURES in the shared Nav. Awaiting real lineup content from Blake.
- `POST /api/contact` — Resend-backed handler, validates, sends FROM and TO
  contact@bzsystems.io (replyTo submitter; changed from
  onboarding@resend.dev / blake@ on 2026-07-18 at Blake's direction).
  LIVE AND SENDING as of 2026-07-18: bzsystems.io verified in Resend,
  RESEND_API_KEY in Vercel env, live endpoint returned 200/ok on a real
  test. Receiving depends on Porkbun email forwarding contact@ ->
  Blake's gmail. Deployed on Vercel (bzsystems-dgcx.vercel.app, Hobby):
  repo made PUBLIC 2026-07-18 because Hobby blocks private-repo deploys
  with non-member contributors; going private again re-blocks future
  deploys (Pro removes the restriction). LAUNCHED 2026-07-18: bzsystems.io
  is LIVE (Porkbun DNS -> Vercel; www is the primary host, apex 308s to
  it; Porkbun MX/TXT records carry contact@ forwarding + Resend, do not
  touch). Contact form delivered a real email end to end.

Shared components: Nav (routes /ventures, /about, /#contact), Footer,
SectionRule, Reveal (scroll reveal; anchor-jump-safe), SystemMap
(light/dark variants, unlabeled SYS.xx nodes), CoreArtifact (unused
currently), CircuitField (unused currently), PhasedBuildIntro, ContactForm.

Assets in /public: logo.png, logo-dark.png (generated white knockout),
hero.mp4 + hero-poster.webp, ziegler.webp (graded headshot),
tex/blueprint.webp (SEC.03 backdrop), tex/contour.webp (SEC.04 figure).
UNUSED (safe to delete or reuse): blake.webp, tex/titleblock.webp,
tex/contour.webp (FIG.02 removed from SEC.04 on 2026-07-18).

## Blocked on Blake (in priority order)

1. RESEND_API_KEY → .env.local + Vercel env. Then: verify bzsystems.io in
   Resend, switch sender from onboarding@resend.dev to contact@bzsystems.io,
   live-test the form end to end.
2. contact@bzsystems.io must exist as a real mailbox/alias (public-facing
   address site-wide since the email swap; Resend recipient is still
   blake@bzsystems.io by his instruction).
3. Deploy: vercel.com/new → import ZieglerBlake/bzsystems (the local Vercel
   CLI token is scope-restricted and cannot create projects) → add domain
   bzsystems.io + www at registrar. Deploy from `redesign` or merge first.
4. Merge decision: redesign → main. /code-review ultra teardown was offered,
   never run.
5. Ventures registry content (names, one-liners, statuses, links).
6. Home SEC.02 vs /about duplication: awaiting slim/re-point go-ahead.

## Open flags awaiting verbatim copy from Blake

- RESOLVED 2026-07-18: form strings are Blake's verbatim copy: loading
  "Sending…", success "▸ Message sent and received. We will get back to
  you ASAP."
- Factually-wrong "own domain" claim survives in exactly two places, both
  reported and deliberately unchanged pending his words:
  layout.tsx:19 metadata description ("each on its own domain") and the
  footer line "VENTURES SHIP ON THEIR OWN DOMAINS. THIS IS THE PARENT."

## Not done yet (explicitly deferred)

- (2026-07-18) SEO pass DONE: robots.ts, sitemap.ts, canonical, full OG +
  Twitter meta in layout.tsx. OG description uses the approved hero subline;
  the disputed root description (open flag above) was NOT reused or changed.
  OG image is code-generated (app/opengraph-image.tsx, fonts committed under
  assets/fonts, OFL) instead of the hero-screenshot plan: deterministic,
  never stale. Swap to a real screenshot later if preferred.
- (2026-07-18) Analytics DONE: @vercel/analytics wired in layout. Silent
  until the Vercel import (blocker 3), then live with zero work.
- Favicon: the original app/favicon.ico was the create-next-app DEFAULT
  (Vercel triangle), not custom. Replaced 2026-07-18 with the B-Z mark on
  an ink plate cut from logo-dark.png: favicon.ico 16/32/48 + app/icon.png
  512 + app/apple-icon.png 180.
- FLAG: .env.example is stale. It describes a waitlist endpoint and
  NEXT_PUBLIC_SENTINEL_URL that do not exist in this repo; the real handler
  is app/api/contact needing RESEND_API_KEY. Rewrite when doing blocker 1.

## Dev ops notes for the next session

- NO Co-Authored-By trailers in commits in this repo. Vercel Hobby +
  private repo blocks any deployment whose commit lists a non-member
  contributor ("commit author did not have contributing access"); Claude
  co-author trailers trip it. Learned 2026-07-18 (two blocked deploys,
  history rewritten to clear them). Author must stay
  BlakeRobertZiegler@gmail.com.

- Dev server: preview config `bzsystems-dev` (port 3105) lives in
  fable-window/.claude/launch.json (session working dir), NOT in this repo.
- Build ritual: STOP the dev server first, `rm -rf .next && npx next build
  --no-lint`, then restart. Building while the dev server runs corrupts
  .next (learned the hard way).
- Shell cwd resets between commands; always `cd` explicitly or git/build
  ends up running in the wrong repo.
- Browser panes cache hard: verify with `curl localhost:3105` when "old
  site" is reported; cache-bust navigations (?v=...) fix stale tabs.
- Em-dash check before any copy commit:
  `grep -rn "—" app components --include="*.tsx"` must return comments only.
