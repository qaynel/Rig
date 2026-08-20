---
status: draft
---

# Lint-format vertical slice

Status: bounded pre-freeze tracer design, 2026-08-20. For this leaf's current
state and the ordered path from here to production, see
[the lint-format roadmap](lint-format-roadmap.md) — that file is kept current;
this one is the fixed design record.

## Outcome

Author `development.code-quality.lint-format` as the first real catalogue leaf.
It adapts to formatter and linter commands the target repository already owns;
it does not install packages or choose an ecosystem for the user. Missing
commands are a nonzero coverage gap. Checks and CI are read-only. Maximal grade
records an explicit user-invoked fix command but never runs it during checking.

The slice tests the catalogue framework before Gate 2 freezes. It does not make
the failed Gate 2 candidate production authority and does not edit Gate 1.

## Existing seams

- `rig/lib/catalog.js` validates source catalogue entries and composes grade
  check IDs.
- `rig/lib/plan.js` resolves the selected grade and plans the target files.
- `rig/lib/apply.js` composes service prose and writes
  `.rig/service-bindings.json` plus `.rig/bin/check.js`.
- `rig/lib/checks.js` and the materialized check runner execute bindings with
  `shell: false`.
- `rig/lib/ci-adapters.js` emits the existing additive CI check command.

## Chosen design

1. Upgrade only the lint-format catalogue entry to the authored-service shape.
   A focused validator proves its required fields and rejects placeholder or
   generic content without pretending the other 114 leaves are complete.
2. Discover `format:check` for minimal, add `lint` for mid, and require an
   existing `format` or `lint:fix` script plus an emitted CI adapter for
   maximal. Store each effective check ID with its own argv/state verifier in
   `.rig/service-bindings.json`.
3. Extend both check runners to execute that check map in order. They fail
   loudly on discovery gaps or missing required paths. The recorded `fix` argv
   is never dispatched by a check.
4. Keep `mutation-floor` aliased to `floor`: both dependency slices require the
   same formatter-cleanliness floor and neither imports lint, CI, or autofix.
   The other dependency slices receive distinct service-specific prose.

## Safety and failure boundaries

- Parse `package.json` as data; malformed or missing script maps become named
  coverage gaps.
- Execute only argv arrays with `shell: false`; repository package scripts are
  run only after the user selected this convention service.
- Do not install packages, mutate source during checks, or execute the recorded
  fix command implicitly.
- Gate 1 `AT-INSTALL-1` remains the oracle for interruption: applied writes must
  remain with an incomplete manifest and resume. The current rollback path is a
  known competing mechanism; the probe reports which behavior exists rather
  than hiding it inside leaf-specific code.

## Tracer bullets

1. Authored entry/fragments/slices — `node --test tests/advanced-lint-format.test.js`
2. Clean and broken formatter/linter checks — same focused test target.
3. Maximal CI plus explicit autofix — same focused test target.
4. Interrupted apply probe — focused install probe, followed by the existing
   apply suite.
5. Fresh semantic receipt, then `npm test` before any push.

## Rejected alternatives

- Installing Prettier, ESLint, or another ecosystem tool: violates the chosen
  discovery-first behavior and expands dependency/removal scope.
- Shell-composed `formatter && linter`: conflicts with the argv-array binding
  contract and weakens command safety.
- Running autofix from checks or CI: makes verification mutate the evidence it
  is supposed to judge.
- Generalizing bindings for all 115 leaves now: this tracer has one authored
  convention; the second real disposition can justify any shared abstraction.
