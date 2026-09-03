---
date: 2026-08-31
source: agent
topics: onboarding-flow, testing-strategy
decisions:
status: historical
supersedes:
tags: interdependency
summary: Technical design for RIG-151/RIG-152/RIG-124.2 — the exact reframed wording for four installed-payload sites (three in routing.md, one in tdd/SKILL.md x3 copies), the seams touched, the slice order and verification, and the one gate-mechanics point to confirm before implementation (approve-gate1.js is the MVP oracle ceremony, not re-armed per POLISH ticket).
---

# Design: routing.md / tdd hygiene reframe (RIG-151 / RIG-152 / RIG-124.2)

`rig-product-design` output for the oracle frozen-pending-wording in
[[reasoning/2026-08-31-routing-hygiene-oracle]]. Option B chosen in
[[reasoning/2026-08-31-routing-md-adaptation-not-transform]]: reframe the
phantom-convention prose as instructions to the onboarding host agent,
markdown-only. No `payload.js` transform, no two-file split, no bare deletion.

## Current-state trace

- `rig/tier-1/routing.md` installs into every target repo through a plain
  `{"op":"copy"}` in `rig/manifest.json` — no templating. `.rig/` does not
  exist in the Rig repo, so the "In this source checkout…" branches genuinely
  serve Rig contributors reading the source copy; they are just written as a
  false conditional rather than as scoped guidance. Byte-identity of source
  and installed copy is proven by `tests/rig-bootstrap.test.js`.
- `rig/tier-1/skills/tdd/SKILL.md` is mirrored byte-for-byte to
  `.claude/skills/rig-tdd/SKILL.md` and `.agents/skills/rig-tdd/SKILL.md`.
  `tests/rig-bootstrap.test.js:71-72` asserts the equality; any edit must land
  in all three files identically. `scripts/check-rule-copies.js` guards the
  `rig.md` rule copies, not these — the bootstrap test is the guard here.
- Four `(RIG-124)` occurrences in installed payload:
  `rig/tier-1/routing.md:25` and `…/tdd/SKILL.md:31` x3 copies. The
  `tests/release-blockers.test.js` test-title convention is a different,
  dev-only use and is out of scope.
- Tests that read `routing.md` and must stay green: `routing-sop.test.js`
  (10-step SOP + `taskWeight` `/skip[\s\S]*(?:full cadence|wiki-read-before-grepping)/`),
  `rig-bootstrap.test.js` (skill-index table parse, multi-host install),
  `spec-driven-pipeline.test.js` (pipeline + skill-index lines). None of the
  four edit sites touches the numbered pipeline steps or the skill-index table.

## Chosen approach and touched seams

Prose-only edits to four sites. No code, no manifest, no new file besides the
already-filed oracle test.

### Site 1 — `rig/tier-1/routing.md` header paragraph (currently lines 3-8)

FROM:

> Read this file before acting. Apply `.rig/rules/rig.md` to every coding task
> and `.rig/rules/communication.md` to every message you send the user, then
> choose the smallest set of skills whose trigger matches the work. In this
> source checkout, use `rig/tier-1/rules/rig.md` and
> `rig/tier-1/rules/communication.md` instead. Read each chosen skill completely
> before proceeding, except on the lightweight path below.

TO:

> Read this file before acting. Apply `.rig/rules/rig.md` to every coding task
> and `.rig/rules/communication.md` to every message you send the user, then
> choose the smallest set of skills whose trigger matches the work. (Working in
> the Rig source repo, before an install has created `.rig/`? Read the originals
> at `rig/tier-1/rules/rig.md` and `rig/tier-1/rules/communication.md`.) Read
> each chosen skill completely before proceeding, except on the lightweight path
> below.

### Site 2 — `rig/tier-1/routing.md` full-cadence paragraph (currently lines 22-25)

FROM:

> Everything else uses the full cadence: read this file, read the wiki, read
> each chosen skill completely, and file a dated reasoning trace then regenerate
> `wiki/status.md` at least every three minutes of active work, per `CLAUDE.md`.
> `(RIG-124)`

TO:

> Everything else uses the full cadence: read this file, read the wiki or
> whatever standing record the repo keeps, read each chosen skill completely,
> and keep a running reasoning trace — on a long or multi-step task, write down
> what you just did, what's in flight, and what's next as you go rather than
> saving it all for a final summary.
>
> Onboarding note: in Rig's own development repo that trace is a dated file
> under `wiki/reasoning/` rolled into a status index on a short cycle of active
> work, per `CLAUDE.md`. When installing Rig into another repo, map that
> practice onto whatever progress-tracking convention the project already has,
> or drop it if the project has none — do not stand up a `wiki/` the repo never
> asked for.

### Site 3 — `rig/tier-1/routing.md` skill-path paragraph (currently lines 27-31)

FROM:

> Native skill hosts discover the names below automatically. On instruction-only
> hosts, `rig-<name>` maps to `.rig/skills/<name>/SKILL.md`;
> `rig-implementation` maps to `.rig/skills/implementation/SKILL.md`. In this
> source checkout, those sources live at `rig/tier-1/skills/<name>/SKILL.md` and
> `skills/rig/SKILL.md`.

TO:

> Native skill hosts discover the names below automatically. On instruction-only
> hosts, `rig-<name>` maps to `.rig/skills/<name>/SKILL.md`, and
> `rig-implementation` maps to `.rig/skills/implementation/SKILL.md`. (Working in
> the Rig source repo, those payloads live at `rig/tier-1/skills/<name>/SKILL.md`
> and `skills/rig/SKILL.md` until an install lays down `.rig/`.)

### Site 3b — coherence follow-on, `rig/tier-1/routing.md` task-weight paragraph (currently lines 17-18)

The lightweight path currently says it skips "the 3-minute `status.md`
cadence". Once Site 2 no longer names a 3-minute `status.md` cadence, this
phrase is a stale phantom of its own. Minimal coherence edit:

FROM: `…and skip the wiki-read-before-grepping step and the 3-minute
`status.md` cadence.`
TO: `…and skip the wiki-read-before-grepping step and the reasoning-trace
cadence described below.`

Keeps `routing-sop.test.js:79` green (`skip` … `wiki-read-before-grepping`
both retained).

### Site 4 — `rig/tier-1/skills/tdd/SKILL.md` line 31, and its two mirrors

FROM: `   right before push. `(RIG-124)``
TO:   `   right before push.`

Identical edit in `rig/tier-1/skills/tdd/SKILL.md`,
`.claude/skills/rig-tdd/SKILL.md`, `.agents/skills/rig-tdd/SKILL.md`.

## Oracle regex conformance (traced, not assumed)

`tests/installed-router-hygiene.test.js` on the edited `routing.md`:

- `doesNotMatch /\(RIG-\d+(?:\.\d+)?\)/` — `(RIG-124)` removed, none remain. ✓
- `doesNotMatch /every three minutes/i` — replaced with "on a short cycle". ✓
- `doesNotMatch /regenerate\s+`?wiki\/status\.md`?/i` — "rolled into a status
  index"; the literal string `wiki/status.md` no longer appears. ✓
- `doesNotMatch /in this\s+source\s+checkout/i` — all three "In this source
  checkout" clauses gone; replacements say "the Rig source repo". ✓
- `match /reasoning trace/i` — "keep a running reasoning trace" (Site 2). ✓
- `match /onboard|installing rig into|…|rig'?s own (?:development|dev)/i` —
  "Onboarding note", "installing Rig into another repo", "Rig's own
  development repo" all match (Site 2). ✓
- `match /rig\/tier-1\//` — retained at Sites 1 and 3. ✓

On each of the three `tdd/SKILL.md` copies:

- `doesNotMatch /\(RIG-\d+(?:\.\d+)?\)/` — suffix removed. ✓
- `match /right before push/i` — sentence intact. ✓

## Data / safety / failure boundaries

None. Markdown instruction text only; no execution path, no data flow, no
trust boundary, no rollout concern. The only integrity constraint is the
tdd/SKILL.md three-copy byte-identity, handled by editing all three in the
same slice.

## Slices and verification

1. **routing.md, Sites 1 + 2 + 3 + 3b** — one file, four paragraphs.
   Verify: `node --test tests/installed-router-hygiene.test.js`
   (RIG-151 + RIG-152 tests go green; RIG-124.2 routing assertion goes green),
   `node --test tests/routing-sop.test.js` (still green).
2. **tdd/SKILL.md + two mirrors** — three files, identical one-token deletion.
   Verify: `node --test tests/installed-router-hygiene.test.js`
   (RIG-124.2 tdd loop goes green), `node --test tests/rig-bootstrap.test.js`
   (copy-equality still green).
3. **Full gate** — `npm test` green before push
   (`check-rule-copies`, `check-versions`, node suite, pi-extension tests).

## Rejected alternatives

- **`payload.js` transform** — rejected in the option-B decision; puts
  adaptation in installer code, the opposite of the forward-deployed model.
- **Bare deletion of the phantom lines** — rejected; loses the contributor
  guidance and the onboarding signal for barely-lower cost than the reframe.
- **Leaving Site 3b (the "3-minute status.md cadence" mention) untouched** —
  rejected; it becomes an orphan phantom the moment Site 2 lands, and the
  fix is one clause.
- **Adding `tests/installed-router-hygiene.test.js` to
  `wiki/gate1/testing-infrastructure.manifest`** — rejected. That manifest is
  the MVP D24/D28 oracle; `check-advanced-spec.js` asserts every manifested
  test title maps to a Gate 1 acceptance ID. A hygiene lint has no such ID.
  See the gate-mechanics note below.

## Gate-mechanics note (confirm before implementation)

The pipeline's step 3 — "Sign the key — `node scripts/approve-gate1.js`" — is
the SSHSIG ceremony over the **five-file MVP oracle manifest** (business-spec,
acceptance, and the advanced-spec test manifest). It has not been re-run for a
POLISH ticket: RIG-149 (#132), RIG-150, and RIG-124 (#134) all landed without
touching it. For this bundle the "one signature" the grilling gate calls for
is the intent owner's **informed approval of the drafted wording above plus
the red `tests/installed-router-hygiene.test.js`** — recorded here and on the
tickets — taken before implementation, not the `approve-gate1.js` run. If the
owner wants the SSHSIG ceremony extended to cover this test, that is a larger
change (a new Gate 1 acceptance ID) and should be its own decision.

## Risks / returns to grilling

None. No oracle contradiction. The design satisfies acceptance cases 1-4 in
the oracle trace as traced above.

## Sign-off

**Owner approved 2026-08-31.** The reframed wording for all four sites plus the
red `tests/installed-router-hygiene.test.js` is the frozen oracle for this
bundle. Lightweight sign-off (recorded here + on the tickets), not the
`approve-gate1.js` SSHSIG ceremony — consistent with the RIG-149/150/124
precedent for POLISH tickets; the owner declined to extend the ceremony to
this test. `rig-tdd` / `rig-implementation` may proceed; the implementer must
not edit the oracle (wording targets or test) without a filled unfreeze
request.
