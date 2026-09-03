---
date: 2026-08-19
source: agent
topics: delivery-plan, the-catalogue
decisions:
status: historical
---

Handoff context for authoring the first catalogue leaf end to end, as the
vertical-slice test the intent owner agreed to run. The leaf is
`development.code-quality.lint-format`. Filed verbatim so a fresh session can
pick up the build with no prior context. This changes no gate; it is the build
brief for one leaf and the acceptance that judges it.

## Why this leaf, and why it is a test not just a task

The intent owner's claim is "once the intent is clear from my side, code is
cheap" — the argument for freezing all specs and letting the agent burn all 115
leaves at once. This slice is the falsifiable version of that claim. Author one
real leaf against the current specs. If it comes out green and cheap, the claim
held and the remaining 114 can be burned with confidence. If it forces a spec
contradiction into the open, the hole was found for the price of one leaf, not
115.

`lint-format` is the right first leaf on four axes:

1. It installs into essentially every real repository, so it clears the "would
   I install this into my next project" bar.
2. Its check is crisp and mechanical — run the formatter/linter, assert clean —
   so a pass or fail is unambiguous and any friction is clearly the framework's
   fault, not leaf vagueness. (This is why not `feature-implementation`, whose
   check is inherently fuzzy.)
3. Its grades map to real differences: minimal = formatter only; mid = formatter
   + linter; maximal = + CI gate and autofix policy. Three honest tiers, not
   three cosmetic ones.
4. It writes config and wires a check into the target repo, so interrupting its
   install pokes `AT-INSTALL-1` directly — the exact contradiction blocking
   Gate 2. A read-only advisory leaf would never surface it.

Runner-up if something even more self-contained is wanted:
`development.code-quality.typecheck`. Same virtues, slightly more
language-dependent. Start with lint-format.

## Exact current state of the leaf (what you are replacing)

- Directory: `rig/catalog/services/development/code-quality/lint-format/`
- `identity.md`, `minimal.md`, `mid.md`, `maximal.md` — all contain only
  `TODO(Slice 10): expand concrete checks for lint format.`
- `slices/floor.md`, `slices/behavior-oracle.md`, `slices/property-floor.md` —
  all contain only `Razor-scoped dependency slice.`
- There is no `slices/mutation-floor.md`. In `rig/catalog.json` the
  `mutation-floor` slice aliases `slices/floor.md`. Decide deliberately: author a
  real mutation-floor slice or keep the alias and document why.
- `rig/catalog.json` entry: `id: development.code-quality.lint-format`,
  `delivery: "convention"`, `owns: ["code-quality.lint-format"]`, `excludes: []`,
  checks `lint-format-core` (minimal) / `lint-format-extended` (mid) /
  `lint-format-thorough` (maximal). Those check IDs are referenced here and
  defined nowhere; no service binding exists for them yet.
- The entry uses the older `delivery` field and lacks the §5.2
  `disposition` object and `acceptance_evidence`. Confirm against
  `rig/lib/catalog.js` what the loader actually validates, and upgrade the entry
  shape as part of authoring — the entry itself is part of the leaf, not just
  the fragments.

## What "done" means — Gate 2 §5.6 authored-service gate

A complete leaf contains, per §5.6: service-specific identity, owned scope,
adjacent exclusions, applicability, explicit dependencies or `none`, cumulative
grade behavior, disposition, checks, and acceptance evidence. The mechanical
gate rejects `TODO`, `TBD`, generic filler such as `Concrete convention`,
repeated normalized fragment bodies, generic check IDs, and missing evidence
targets.

Because this leaf's disposition is `convention` (§5.2): it must declare
service-specific installed behavior plus an executable verifier of that
installed state, with no fabricated command. The verifier may not be `true`,
`echo`, an empty command, `process.exit(0)`, or any generic-success stub. For
lint-format the "installed state" is the formatter/linter config being present
and the repo being clean under it, and the verifier runs the real tool.

Mechanical presence is necessary but not sufficient. §5.6 also requires a
fresh-context semantic review of the leaf and its adjacent MECE boundary, with a
receipt bound to the exact catalogue plus fragment digest. A changed byte
invalidates it.

## The six pieces to build

1. `identity.md` — what the service is; owns `code-quality.lint-format`;
   excludes the adjacent code-quality services (typecheck, complexity, etc.) so
   the MECE boundary is explicit; applicability `source-code`. Per §5.3 the
   grade fragments below may not redefine identity, scope, dependencies, or
   report behavior.
2. `minimal.md` — formatter only. Installed behavior + how it is verified.
3. `mid.md` — adds the linter (cumulative over minimal per §5.3:
   mid = minimal + mid checks).
4. `maximal.md` — adds the CI gate and autofix policy
   (maximal = minimal + mid + maximal checks).
5. Checks — real bindings for `lint-format-core` / `-extended` / `-thorough`.
   The runner is `rig/lib/checks.js` and the materialized `.rig/bin/check.js`,
   which dispatch service bindings from `.rig/service-bindings.json` in
   dependency order. Wire the catalog entry up to the §5.2 shape with
   `acceptance_evidence` pointing at a real test target.
6. Slices — author `floor`, `behavior-oracle`, `property-floor` (currently razor
   stubs) and resolve the `mutation-floor` alias question above.

Plus: a real test that fails on the current placeholder content and passes on
the authored leaf.

## Acceptance — the three probes

1. Materialize the leaf and install it into a scratch repo. The check runs and
   passes green on a clean repo.
2. Break formatting in that repo. The check fails, loudly, for the right reason.
3. Interrupt the install mid-write (crash, signal, permission denial, full
   disk). This is the `AT-INSTALL-1` probe. §6.6/§10 say a failed apply rolls
   everything back; §7.6 and `AT-INSTALL-1` say applied writes stay in place and
   the install resumes, with a `complete: false` manifest header suppressing
   every protection claim. These are two incompatible answers for the same
   failure (see `status.md` blocker). Watch which one the framework actually
   does. If it stalls or contradicts itself here, that is the spec hole this
   whole exercise was fishing for.

## Read these first

- Gate 2 §5 catalogue contract: §5.2 entry shape, §5.3 grade composition, §5.6
  authored-service gate. Then §6.6 apply, §7.6 manifest/resume, §14 Slice 10.
- Gate 1 §4–5 for the frozen inventory this leaf is a commitment under.
- `wiki/status.md` for the live `AT-INSTALL-1` blocker.
- `wiki/reasoning/2026-08-19-product-direction-review.md` for the
  horizontal-vs-vertical fork this slice is meant to resolve.

## Constraints

- Tier 2 materialization only. Do not route new behavior through the old plugin
  runtime.
- `npm test` is the full CI gate and must be green before any push; do not push
  on a red or unrun suite. `npm run test:rig` is a fast subset, not a substitute.
- Commit as the intent owner only, with no co-author trailer.

## What the result decides

- Green and cheap: the "intent clear, code cheap" claim held. Freeze the specs
  and author the remaining 114.
- Interrupt probe contradicts itself: resolve `AT-INSTALL-1` against this
  evidence before any freeze, then proceed.
