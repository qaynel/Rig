---
date: 2026-09-04
source: agent
topics: agent-working-conventions
decisions:
status: current
supersedes:
tags: interdependency, chore
summary: Wiki maintenance sweep — lifecycle sweep cut status.md from 60 traces to 18, a real defect made every link on the generated status page dead and is now fixed, a bounded task-addressable quick reference was added, ten phantom trace references were identified as never-filed, and the glossary gained ten live terms.
---

# Wiki maintenance sweep — 2026-09-04

Run autonomously while the intent owner was away, on their instruction to get
context-management chores done. Scope was wiki upkeep and stale-reference
checking, not product work. `npm test` green throughout.

Companion traces filed the same day:
[[2026-09-04-structural-workflow-fix-design]],
[[2026-09-04-structural-workflow-fix-grilling]],
[[2026-09-04-landscape-research-in-flight]],
[[2026-09-04-finished-product-design]].

---

## 1 — A real defect: every link on the generated status page was dead

`scripts/build-wiki-index.js` renders two pages from the same `link()` helper,
and that helper hardcoded a `../reasoning/` prefix. That prefix is correct for
`wiki/index/reasoning.md`, which sits one directory down. It is wrong for
`wiki/status.md`, which sits at `wiki/` — from there `../reasoning/` resolves
to a repo-root `reasoning/` that does not exist.

Consequence: **all 18 trace links on the project's "what is true right now"
page were broken**, and `wiki/agent-primer.md` sends every agent to that page
as read number two. The primary navigation path into the wiki terminated in
dead links.

Fixed by making `link(trace, prefix)` take the prefix from its caller:
`renderStatus` passes `reasoning/`, `renderIndex` passes `../reasoning/`.
Verified after: `wiki/status.md` 19 links / 0 broken,
`wiki/index/reasoning.md` 188 links / 0 broken.

A second, smaller instance of the same class: one trace's `summary:` field
contained inline relative links written for `wiki/reasoning/`, which broke when
the generator rendered that summary into `wiki/status.md`. The links were
stripped from the summary text. **Summaries must not carry relative links**,
because they are rendered at two different directory depths.

## 2 — Lifecycle sweep: 60 current traces down to 18

`wiki/status.md` is generated from every trace marked `status: current`. At 60
entries it had stopped functioning as a current-state page.

38 traces were flipped to `status: historical`. The judgment input was that PR
#143 (`path-b-adaptive-onboarding-oracle`) is merged at commit `d834e1ed`, so
Path B slice, hardening, and closeout work has shipped; likewise the Gate 1 CI
pin anchor, which is armed and enforcing at the production merge boundary.

18 traces stayed `current`, and they divide into two honest groups:

- **Blocked, not finished** — the AT-HD-* onboarding-hardening oracle still
  awaits the owner's re-sign, so the Phase 0 completion note, the oracle
  review, the technical spec, and the grilling stay current. The Phase 1
  *implementation* traces went historical: that code landed; only the oracle
  signature is outstanding.
- **Standing context, not work** — the product vision, the Path B product
  direction, the Path B follow-up locks, and the closed-loop design are
  positions that still hold rather than tasks that ship.

Two of those were judgment calls worth naming: `2026-08-31-path-b-product-direction`
and `2026-08-31-path-b-follow-up-decisions` describe work that has merged, but
what they record is a locked direction rather than a deliverable. They were
kept `current` on that basis. If the owner disagrees, flipping them is a
one-line frontmatter change.

### A convention that was wrong, and was not followed

`.claude/skills/wiki-maintenance/SKILL.md` step 1 says to leave `summary:`
empty on historical traces. Applying it destroyed 37 hand-written summaries
before the change was reverted and the summaries restored.

That convention contradicts the project's own better reasoning.
[[2026-09-02-closed-loop-workflow-and-context-realignment]] Part 5 ranks
"tiered summaries — every trace's `summary:` frontmatter is populated (one
line; **even historical traces get one**)" as the single highest-ROI context
debloat lever, precisely so an agent can triage without loading a body. The
generator only renders summaries for `current` traces on `status.md`, so
keeping them on historical traces costs nothing on that page and preserves the
triage signal in `index/reasoning.md`.

**Every trace now carries a summary regardless of status.** The
wiki-maintenance skill's step 1 wording should be corrected to match; it is
left as-is here because changing a skill payload is outside a chore's scope
and touches three byte-identical copies.

One junk summary was replaced: `2026-09-02-path-b-fix3-interrupt-sibling`
carried the generator's fallback string "Current trace from historical."

## 3 — Quick reference: the bounded middle

Added `wiki/index/quick-reference.md`, linked from both `wiki/agent-primer.md`
and `wiki/Home.md`.

This is the smallest possible answer to the defect diagnosed in
[[2026-09-04-structural-workflow-fix-design]]: the wiki offers "skip it"
(cheap, uninformed) or "follow the links" (informed, unbounded), with nothing
addressable in between. The page routes by **task** rather than by date, caps
itself at 150 lines (currently 91), and puts a real line count beside every
link so an agent can budget before opening anything.

It is not the ledger that design proposes and does not pre-empt that decision —
it is navigation, not enforcement.

## 4 — Stale references

A link check across 336 markdown files under `wiki/` plus the root instruction
files found, after correcting for two false-positive classes in the first
pass:

- **The status.md defect above** — 20 dead links, now 0.
- **Ten phantom `[[trace]]` references.** Ticket documents cite reasoning
  traces that were never filed: no file of that name exists, and
  `git log --diff-filter=D` shows none was ever committed and deleted. They
  are recorded in [path map § Phantom references](../index/path-map.md) with
  every citing location, so the next agent resolves them in one lookup instead
  of a search.
- **`wiki/gate1/` has genuinely broken internal links** — `business-spec.md`
  points at `../acceptance.md` where the file is `acceptance.md`, 17 times,
  and `acceptance.md` points at `spec/business-spec.md`. **Not fixed, and must
  not be**: Gate 1 is signed, and any byte change invalidates the signature.
  Recorded here for the owner to fold into the next re-sign, which is already
  pending for the hardening oracle.

False positives worth recording so the next audit does not re-raise them: the
`sources/reviews/rig-120-*.json` targets exist and were missed by a resolver
that only indexed `.md`; `[[foo]]` and `[[hooks.hooks]]` are illustrative
examples inside code spans.

## 5 — Glossary

Ten terms in active use across traces, tickets, and skills had no entry:
AHE (Agentic Harness Engineering), enforcement site, journal, mistake file,
oracle, Path A / Path B, re-sign multiplier, skill shelf, Tier 1, and unfreeze
request. 41 entries to 51, alphabetical, every authority link verified.

Two carry a live caveat rather than a settled definition: **enforcement site**
is designed and not implemented, and **Tier 1** records that the markdown-only
constraint was retired by the owner on 2026-09-04 while `CLAUDE.md` still
asserts it.

## 6 — What was deliberately not done

- **`CLAUDE.md`'s markdown-only text was not corrected.** It is a policy
  statement about the owner's own product, flagged for their decision, not a
  chore. It is surfaced in the glossary, the quick reference, and the grilling
  trace so nobody acts on the stale version meanwhile.
- **No topic hub was rewritten.** Hubs are synthesis and a sweep should not
  silently move what they assert.
- **No ticket file was edited** to annotate its phantom links; the record is
  centralised in the path map instead of scattering markers through closed
  tickets.
- **The mistakes ledger was not built.** That is slice 1 of the workflow fix
  and is waiting on the owner's go-ahead.
- **Step 7 (token-load instrumentation)** remains `PENDING` in
  `wiki-maintenance.js status`. It is marked optional and wants a
  before/after measurement pair that this sweep is not positioned to produce.

## 7 — Verification

- `npm test` exit code 0 after the generator change.
- `node scripts/wiki-maintenance.js status`: steps 0 and 2–6 `DONE`, step 1
  `RECURRING` (its keyword regex always re-lists remaining traces), step 7
  `PENDING`/optional.
- Generated pages: 0 broken links across 207 links.
- `git diff` on `wiki/reasoning/` touched frontmatter only — no trace body was
  modified, per the immutability rule.
