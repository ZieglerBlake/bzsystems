# HANDOFF — bzsystems.io

Last updated: 2026-07-18. **THE SITE IS LIVE at https://bzsystems.io** (www
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
- Tokens live in `app/globals.css` under `@theme`.

## Pages (all verified desktop + 375px, live)

- `/` — PhasedBuildIntro (fresh loads only, skippable, SSR so no flash) →
  hero (live SystemMap canvas, "DESIGNED BY US. / BUILT BY US. / OWNED BY
  US."; subline is the buyer-facing studio line "An independent software
  studio building AI, data, and automation products, and putting the same
  stack to work for financial institutions, auditees, and operators who
  need systems that hold up." As of 2026-08-20 the meta/OG/Twitter/JSON-LD
  descriptions all MATCH this exact sentence, no divergence.) → film band
  (hero.mp4 + centered logo-dark w/ vignette) → SEC.01 THE COMPANY (dark
  band) → SEC.02 OWNERSHIP (ziegler.webp headshot; opener "Founded and run
  by Blake Ziegler..."; caption no longer shows EST. 2026) → SEC.03 HOW WE
  BUILD (3 cards + 7 chips; card 03 is now "Accountable by structure") →
  thesis slab (tagline "The system is the strategy..." REMOVED from home
  2026-08-20 at Blake's request; slab intentionally kept standing with just
  "BZ SYSTEMS LLC / EST. 2026") → SEC.04 CONTACT (blake@ direct-email CTA +
  form) → footer. Organization JSON-LD at top of the page component. Hero
  badge row: FOUNDER-BUILT / REVENUE-FUNDED / FULL-STACK, IN-HOUSE.
- `/about` — centered dark-mark nameplate (logo-dark.png on an ink plate),
  four centered sections, Blake's verbatim copy: THE COMPANY / THE THESIS /
  WHAT WE BUILD / HOW WE OPERATE, then RETURN TO MAIN. No h1 by Blake's
  choice (he removed the headline); flag if SEO ever revisits. THE COMPANY
  now describes the studio as "a holding company for a set of independent
  go-to-market ventures" (changed from "parent company" 2026-07-18).
- `/ventures` — light theme, live map, "THE REGISTRY IS IN BUILD.",
  decorative password gate (`components/RegistryLock.tsx`, NOT real auth,
  every attempt refused; swap for a real check at launch), RETURN TO MAIN +
  SEND AN INQUIRY. Padlock glyph next to VENTURES in Nav. Excluded from
  sitemap and disallowed in robots while locked (one-line revert in each
  when the lineup publishes).
- `POST /api/contact` — validates, sends from/to contact@bzsystems.io via
  Resend (replyTo submitter). Form strings: loading "Sending…", success
  "▸ Message sent and received. We will get back to you ASAP."
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
still: darkened hero.mp4 frame + vignette + glowing lockup — regenerate by
recompositing, the recipe is in git history commit bfb28b2). Favicon set:
B-Z mark on ink plate — favicon.ico 16/32/48 + icon.png 512 +
apple-icon.png 180, all generated from logo-dark.png.

Assets in /public: logo.png, logo-dark.png (white knockout), hero.mp4 +
hero-poster.webp, ziegler.webp, tex/blueprint.webp (SEC.03 backdrop),
assets/logo-sig.png (522x447 BZ mark for email signatures, hosted at
/assets/logo-sig.png; added 2026-08-20).
UNUSED (safe to delete or reuse): blake.webp, tex/titleblock.webp,
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
2. Footer line "VENTURES SHIP ON THEIR OWN DOMAINS. THIS IS THE PARENT." is
   factually wrong until something ships; awaiting his replacement copy.
   (The metadata half of this flag was resolved 2026-07-18.) NOTE: /about
   now says "holding company" while this footer still says "THE PARENT" —
   reconcile the term when Blake gives footer copy.
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
