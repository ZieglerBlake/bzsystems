# HANDOFF — bzsystems.io

Last updated: 2026-10-25. **THE SITE IS LIVE at https://bzsystems.io** (www
is the primary host; apex 308s to it). This doc is the authoritative state;
read it fully before changing anything. Resume incantation for any session:
"read HANDOFF.md in the bzsystems repo and pick up."

## The one-minute orientation

- Repo: `github.com/ZieglerBlake/bzsystems` — **PUBLIC on purpose** (see
  Deploy rules). Local checkout: `~/code/bzsystems`. Develop on `main`;
  every push to `main` auto-deploys to production via Vercel. There is no
  staging; verify locally first.
- Parent-company flagship for BZ Systems LLC (independent software studio,
  Columbus OH, Blake Robert Ziegler). Ventures ship elsewhere; this site is
  brand + about + contact. Design language: "bright control room x
  schematic". Next.js 15 App Router, Tailwind v4, TypeScript.
- Contact form is LIVE and delivering: site -> Resend -> contact@bzsystems.io
  -> Porkbun forward -> Blake's gmail. Verified end to end 2026-07-18.

## Hard rules (violating these has bitten before)

1. **NO em dashes anywhere, ever.** Gate before any copy commit:
   `grep -rn "—" app components --include="*.tsx"` must return comments only.
2. **No invented metrics, claims, or details.** Copy is Blake's verbatim or
   drawn from existing page copy; when in doubt, ask him.
3. **NO Co-Authored-By trailers in commits.** Vercel Hobby blocked deploys
   over them 2026-07-18 (treats co-authors as non-member contributors);
   history was rewritten to clear it. Author stays
   BlakeRobertZiegler@gmail.com.
4. **Repo stays PUBLIC** while on Vercel Hobby. Going private re-blocks
   future deploys (existing site would stay up). Vercel Pro removes this.
5. **Never touch the Porkbun MX/TXT DNS records.** They carry contact@
   forwarding (fwd1/fwd2.porkbun.com) and Resend sending (send subdomain +
   resend._domainkey). Breaking them kills the contact pipeline.
6. **PhasedBuildIntro's fresh-load detection is deliberate.** The hydration
   initializer checks for the server-rendered `.pbi` node in the DOM: fresh
   document loads have it (intro plays), client-side route transitions do
   not (never plays), hash deep links (/#contact) never gate. Do NOT replace
   with effect-ordering tricks; a layout-level tracker was tried and lost
   the hydration race.

## Design law

- Field `#F7F8F6` (token `void` — name kept for class stability), panel
  white, ink `#101312`, one signal blue `#1E70CD` (bright-on-dark `#5B9BE8`,
  text-on-light `#15529E`). Fonts: Archivo variable (wdth axis; display 125,
  semi 112) + JetBrains Mono. Blue seams: `h-[2px] bg-signal shadow-glow`.
- Since 2026-10-25: dark bands use token `night` `#0B1220` (deep navy, NOT
  ink); the How we build band uses `wash` `#EEF3FA`; `ink-dim` is 0.72.
  Primary actions are SOLID signal-blue buttons (hero "Get in touch", form
  "Send"). Nav and footer use `public/logo-mark.png` (transparent, made
  from logo.png by color-to-alpha); logo.png has a white background and
  shows as a box on dark, so do not use it in UI.
- Tokens live in `app/globals.css` under `@theme`.

## Pages (all verified desktop + 375px, live)

- `/` (as of 2026-10-25, five panels) — PhasedBuildIntro (fresh loads only,
  ~3.8s canvas: drops + floor ripples, particles assemble logo-dark.png,
  dash ignition + scan, ripple wipe; sets `html[data-intro]` so hero and
  story canvases pause while it plays) → hero (SystemMap `still` + 
  `components/WaterSurface.tsx` ripples; headline "YOUR IDEA, BUILT. /
  YOUR PROCESS, UPGRADED." with the two "YOUR ..." halves in signal blue;
  subline "An independent studio that builds software from the idea up:
  for our own ventures, for people with an idea worth building, and for
  teams whose processes need upgrading." which meta/OG/Twitter/JSON-LD
  mirror; solid "Get in touch"; badges FOUNDER RUN / CUSTOM BUILT /
  PROCESS ENHANCING, no hyphens by Blake's choice) → HOW WE WORK
  (`components/ProcessStory.tsx`, wash band, two canvas stories that
  auto-alternate with tabs, never pin the scroll: "Your idea, built" =
  sticky notes -> wireframe -> browser UI -> LIVE, DAY ONE / AN IDEA IN
  PIECES. -> LAUNCH DAY / BUILT AND RUNNING., 01 IDEA..04 LIVE tracker;
  "Your process, upgraded" = six manual steps fixed one by one then
  folded to three, CURRENT STATE / MANUAL AND SILOED. -> FUTURE STATE /
  AUTOMATED AND EFFICIENT. Stat numbers in the idea UI are illustrative) →
  SEC.01 THE COMPANY (navy band; "RUN LIKE A STARTUP. / HELD LIKE A
  HOLDCO." (Blake: the HOLDCO half stays no matter what); holding company
  + same stack in client work, "The focus runs from small businesses to
  regulated teams in finance.", ventures page "locked, open to clients
  and partners on request") → SEC.02 HOW WE BUILD (cards 01 Built
  in-house, end to end / 02 Small first, then compound / 03 One builder,
  no handoffs; capability groups "Your idea, built" and "Your process,
  upgraded" moved to /about only (home links "See what we build"); closer "LESS PITCH. MORE PRODUCT." + Start
  something) → SEC.03 CONTACT ("Have an idea you want built, or a process
  that needs an upgrade? Email me directly..." + form) → footer (centered
  logo-mark; "© 2026 BZ SYSTEMS LLC, OHIO, USA. ALL RIGHTS RESERVED." /
  "BZ SYSTEMS LLC IS A PRIVATELY HELD HOLDING COMPANY. EACH VENTURE
  OPERATES UNDER ITS OWN BRAND AND IS OWNED BY BZ SYSTEMS LLC OR ITS
  AFFILIATES."). Removed 2026-10-25: film band, thesis slab, OWNERSHIP
  panel (photo moved to /about).
- `/about` (rebuilt 2026-10-25, company "we" voice) — photo (ziegler.webp,
  caption "BLAKE ZIEGLER / FOUNDER, PRINCIPAL / FORMERLY MORGAN STANLEY",
  Blake approved naming the firm; plain text only, never a logo) beside h1
  "BUILT FROM COLUMBUS. / BUILT IN AMERICA." (Blake's pick) + intro (Columbus, founded on
  investment banking and software engineering backgrounds, "institutional
  standards and the speed of an agile team") + LinkedIn / blakeziegler.app
  / email → 01 WHAT WE BUILD (two long panels, idea / process, each with
  two paragraphs and three capability items) → closer "HAVE AN IDEA?
  LET'S BUILD IT." + Start something. Blake found the longer version "WAY
  too much": How we work and the company band were cut 2026-10-25; keep
  this page short.
- Work is done by Blake, employees, or U.S.-based contractors (Blake,
  2026-10-25); home card 03 "Built in America" and the About rule say so.
  Do not reintroduce "I write all of it" / one-builder claims.
- `/ventures` — light theme, live map, label "Registry", "THE REGISTRY IS
  IN BUILD.", decorative password gate (`components/RegistryLock.tsx`, NOT
  real auth; copy "LOCKED WHILE IN BUILD. NO PUBLIC KEYS YET." / "▸ NO
  MATCH. THE REGISTRY IS STILL IN BUILD."), BACK TO HOME + SEND AN
  INQUIRY. Padlock glyph next to VENTURES in Nav. Excluded from sitemap and
  disallowed in robots while locked (one-line revert in each when the
  lineup publishes).
- `POST /api/contact` — validates, sends from/to contact@bzsystems.io via
  Resend (replyTo submitter). Form strings: loading "Sending…", success
  "▸ Message sent. You'll hear back within one business day."
  EMAIL SPLIT (2026-08-20): every VISIBLE email + mailto + the JSON-LD
  contact email is now blake@bzsystems.io, but route.ts send-to stays
  contact@bzsystems.io (the address with Porkbun forwarding to Blake's
  gmail). DO NOT change route.ts to blake@ to "fix" the mismatch unless
  blake@ has its own working forwarding/mailbox, or form delivery breaks.
  DEPENDENCY: the public "email blake@ directly" CTA needs blake@bzsystems.io
  to actually receive mail (Porkbun forward or mailbox); verify externally.

Shared components: Nav, Footer, SectionRule, Reveal (scroll reveal,
anchor-jump-safe), SystemMap (light/dark variants), PhasedBuildIntro,
ContactForm, RegistryLock. Unused but kept: CoreArtifact, CircuitField.

SEO state: per-page title/description/OG/Twitter on all routes (verbatim
from page copy), canonicals, Organization JSON-LD on home, sitemap.ts +
robots.ts, static OG image `app/opengraph-image.png` (cinematic brand
still: darkened hero.mp4 frame (hero.mp4 deleted 2026-10-25; recover it from git history to regenerate) + vignette + glowing lockup — regenerate by
recompositing, the recipe is in git history commit bfb28b2). Favicon set:
B-Z mark on ink plate — favicon.ico 16/32/48 + icon.png 512 +
apple-icon.png 180, all generated from logo-dark.png.

Assets in /public: logo.png, logo-dark.png (white knockout; the intro samples it), ziegler.webp, tex/blueprint.webp (SEC.03 backdrop),
assets/logo-sig.png (522x447 BZ mark for email signatures, hosted at
/assets/logo-sig.png; added 2026-08-20).
UNUSED (safe to delete or reuse): tex/titleblock.webp,
tex/contour.webp.

## Infrastructure map (who does what)

- **Vercel** (project bzsystems-dgcx, Hobby, Blake's account): hosting +
  auto-deploy from `main` + RESEND_API_KEY env var + domains. Local CLI
  token is scope-restricted; dashboard changes are Blake's to make.
- **Porkbun**: domain registrar + DNS (A @ -> 216.198.79.1, CNAME www ->
  cname.vercel-dns.com) + free email forwarding contact@ -> Blake's gmail.
- **Resend** (Blake's account): transactional sender, bzsystems.io verified.
  Free tier, 100 emails/day.
- **@vercel/analytics**: wired in layout, collecting since launch.

## Still open (all waiting on Blake's words, zero engineering blockers)

1. Ventures registry content: names, one-liners, statuses, links. When it
   lands: build the registry, consider real auth for the gate, re-add
   /ventures to sitemap.ts and drop the robots disallow.
2. Do clients own the code they pay for? Is investor interest an audience?
   Both unanswered; copy avoids claiming either.
3. Home SEC.02 vs /about duplication: awaiting slim/re-point go-ahead.

## Dev workflow (follow exactly; each step earned its place)

- Local checkout lives at `~/code/bzsystems` (moved there 2026-10-22; the
  old ~/Desktop/NewBZSys location no longer exists). Dev server: preview
  config `bzsystems-dev` (port 3105) is now IN this repo at
  `.claude/launch.json`. Any session can also `npm run dev -- -p 3105`.
- Build ritual: STOP the dev server first, then
  `rm -rf .next && npm run build`. Building while the dev server runs
  corrupts `.next`.
- Shell cwd resets between commands; always `cd` explicitly or git/build
  runs in the wrong repo.
- Browser panes cache hard: verify with `curl localhost:3105` when "old
  site" is reported; cache-bust navigations (?v=...) fix stale tabs.
- Ship = commit to `main` (no trailers!) + push; Vercel deploys in ~2 min.
  Verify live with a cache-busted curl:
  `curl -s "https://www.bzsystems.io/?f=$(date +%s)" | grep <something new>`.
- iMessage/social link previews cache per URL on their side; stale previews
  age out on their own, nothing to fix server-side.
