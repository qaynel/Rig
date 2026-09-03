---
date: 2026-08-21
source: intent owner
topics: the-catalogue, authored-service-gate, delivery-plan, onboarding-flow, distribution-and-release
decisions: D24
status: historical
---

# D24 — Build the MVP at agent discretion, generic bar, all 115 leaves

## The ruling

The intent owner ruled, in office hours on 2026-08-21, that the minimum viable
product is built **in one pass at the agent's discretion**, not leaf by leaf
with the owner in the room.

Verbatim, across three turns:

> "ideally what I want right now is that all the families of tools with all the
> sub tools be shipped out with the bare minimum, the least curated, generic of
> generic best-practice skills and plugins, and the sort of framework that I'm
> putting in with the wiki, and ship that out with my context awareness,
> automatic onboarding and all"

> "why can't the entire thing be shipped out at once if I clarify the overall
> product intent and the business intent to the fullest of my extent — can you
> not just figure out the technical parts on your own, just boilerplate the
> entire rest based on best practices and what would fit my intent, what would
> fit the user's intent"

> "we build the minimal viable product right now entirely upon the agent's
> discretion of the sort of requirements that are needed. So there are families
> of tools, each tool has certain degrees of complexity, from bare minimum to
> maximal, three degrees of complexity for each tool, and all of that wired and
> written up based on best practices. I can provide all the documentation that
> is required, just list that out and I'll import it. We'll ship it out and then
> we'll have beta users trying to play around with it and then we'll get
> feedback. The main point is having something we can show, where we are on a
> crunch of time."

The owner was offered a cheaper middle path (author five leaves, confirm the
bar, then bulk-author the remaining 110) and declined it in favour of full
agent discretion. This trace records that the declination was explicit and
informed, not an omission.

## What this overrides

D24 suspends, **for this release only**, the standing rule recorded in
[the authored-service gate](../topics/authored-service-gate.md) and locked
decision 8: that all 115 leaves are authored one at a time, in a single
context, never templated and never in parallel.

That rule exists because of the GA-10 audit, which found 432 placeholder files
passing shallow inventory tests while covering nothing. The rejection list names
"parallel bulk authoring, template-driven generation, mechanical presence as a
semantic proxy, and generic convention fallbacks" and gives the reason: they
recreate the placeholder failure at greater scale.

D24 does not claim that reasoning was wrong. It claims the reasoning targets a
different artifact than the one being built here, and the difference is a label.

## The distinction D24 rests on

What GA-10 rejected is generic content **presented as coverage**: a fragment
that reads as authored, satisfies the mechanical checks, and thereby implies the
service is handled in the user's repository when it is not.

What D24 authorises is generic content **presented as generic**: a fragment that
states the standard practice for its domain, and declares on its face that it is
baseline practice not tailored to the installing repository.

The project already carries the vocabulary for this distinction. The
Policy → Context → Evidence grade ladder (AD-32) exists precisely to express how
much assurance a service actually delivers. Nothing in the ladder requires every
leaf to occupy the top rung. **D24 authors all 115 leaves at the Policy rung and
requires the rung to be stated in the fragment itself.**

This is a truthful product. It is also, deliberately, a shallow one.

## What D24 preserves

D24 does **not** suspend the safety baseline. The rule that a missing or
malformed binding is a named, nonzero coverage gap rather than a silent skip or
a fabricated pass applies unchanged to all 115 leaves. A Policy-grade leaf that
cannot find what it needs must say so by name.

D24 does **not** waive the owner's signature. The signature remains a physical
act performed by the intent owner at release, and remains the only thing that
converts built code into a shipped release.

## The property being consciously set aside

Rig's core claim is that an agent cannot move its own goalpost. Under D24 the
agent authors the content **and** sets the bar that content is judged against,
because the owner has waived per-leaf review. For this release, in this repo,
that property is not demonstrated.

This is recorded here rather than left implicit, because the alternative is a
release that silently fails the claim the product is built to make. The owner's
position is that showing something to beta users on a time crunch is worth more
than demonstrating the property on the first release, and that feedback from
real users is the better next input. That is a legitimate founder call. It is
also reversible: promoting a leaf from Policy to Context or Evidence restores
the property for that leaf, one leaf at a time, after the MVP is in hands.

## A consequence worth naming

D23 carved a one-release exception so the specification gate would evaluate
`AT-SHAPE-6` against `development.code-quality.lint-format` alone, because the
other 114 leaves' placeholder state would otherwise hold `npm test` red forever.

If D24 completes, that exception becomes unnecessary: all 115 leaves carry real
Policy-grade content, and `AT-SHAPE-6` can revert to covering the full catalogue
as originally written. D24 therefore retires a workaround rather than adding
one. The build must confirm this rather than assume it.

## What the build produces

1. **All 115 leaves authored at Policy grade**, across the four families
   (development 26, testing 40, infrastructure 31, product-security 18) and 34
   groups. Each leaf keeps its existing five to seven fragments: `identity.md`,
   `minimal.md`, `mid.md`, `maximal.md`, and its `slices/*` where
   `rig/catalog.json` defines them. The three grade fragments remain cumulative
   and additive, matching the authored lint-format leaf's shape.
2. **Every fragment declares its grade** and states that it is baseline practice
   not tailored to the installing repository.
3. **The 56 swallowed skills wired** into materialize and host discovery so they
   are installable and callable by their Rig names.
4. **Context-aware onboarding**: detect which of the 19 hosts a repository
   already uses from the researched per-host paths, and install only into the
   trees that exist. Family selection stays explicit and trimmable, defaulting
   to the full set.
5. **A distribution path**: root `install.sh` fetching a released tag by name,
   never `curl | sh`, and the package moved from `4.8.4` to `5.0.0`.
6. **The record brought back into sync**, including the 56 swallowed skills,
   which landed in commit `ff7cea5` without touching a single wiki file and are
   therefore currently invisible to the project's own source of truth.

## What the build must not do

- Must not fabricate a pass, or substitute a generic success command for a
  missing binding. Named coverage gap, always.
- Must not claim Context or Evidence grade for any leaf authored under D24.
  lint-format is the only leaf permitted a higher claim, and only on its own
  existing evidence.
- Must not edit the frozen oracle. D24 authorises authoring catalogue content
  and building the delivery path; it does not authorise moving acceptance.

## What only the intent owner can do

1. **Sign the oracle at release.** Not delegable, and the signing mechanism does
   not exist yet: neither `gate1.sig` nor `gate1.allowed-signers` is present
   anywhere in the repository.
2. **Rule on the swallowed suite's licensing.** The 56 skills were vendored with
   every reference to the upstream name stripped and no upstream `LICENSE` or
   `NOTICE` carried across, into a repository licensed MIT. This is a release
   blocker of legal rather than technical character.

## Documentation the owner offered to import

The owner offered to supply whatever documentation the build needs. Having
checked the repository, the honest answer is that almost everything needed is
already present and does not need importing:

- `rig/catalog.json` already carries all 115 service definitions with ids,
  families, groups, labels, MECE `owns`/`excludes`, delivery type, fragment
  paths, per-grade check ids, and slice definitions. The structural work is done.
- The 19-host map with per-host instruction, skills, hook, and MCP paths is
  already researched and recorded, and the seams exist in
  `rig/lib/host-capabilities.js`, `rig/lib/renderers.js`, `rig/lib/ci-adapters.js`,
  and `rig/lib/config.js`.
- The authored lint-format leaf is a sufficient reference shape for all 115.
- The curation lineage (superpowers, gstack, ponytail/mattpocock) is either
  vendored in-repo or reflected in the existing Tier 1 skills.

The two genuinely useful imports are the upstream licence terms for the
swallowed suite, and beta-user context: who they are, what repositories and
hosts they will run this in. The second shapes onboarding defaults and which
families deserve the sharpest Policy text.

## Success criteria for the MVP

- A person who has never seen this repository installs it with one command into
  a fresh repository and receives working onboarding.
- Onboarding writes only into host trees that repository already uses.
- All 115 leaves return real content and a stated grade; none returns filler.
- A missing binding produces a named coverage gap, never a fabricated pass.
- The specification gate can evaluate all 115 leaves without D23's exception.
- Beta users can exercise the catalogue and produce feedback.

## Status

D24 is a ruling, not an implementation. Office hours produces design only. The
build runs in a normal working session against this trace.
