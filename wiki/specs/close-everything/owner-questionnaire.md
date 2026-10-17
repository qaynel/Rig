# Owner questionnaire — v6.0.0 QA-prod promotion

Filed 2026-10-17, after the de-duplication commit `ba123844` went green on the
full gate and was pushed to PR #153 (`qa-prod` ← `vaibhav-kodiyan/universal-issues-closure`).

Every agent-side closeout task is finished. What is left needs either a
decision only the owner can make or a credential/click this box does not have.

## Decisions

### Q1 — Who fires the T-10.5 review receipt, and with which model?

The receipt spawns a 30-minute ephemeral reviewer and binds to the exact bytes.
A `fail` verdict burns one of the two attempts RIG-124 allows, so the model
choice is a real cost decision.

- **A.** Owner fires it with `claude-opus-5-5` (as the task list says today).
- **B.** Owner names the model and the agent fires it, reporting the verdict verbatim.
- **C.** Interim pass first with a cheap model (`--interim`, writes no receipt),
  then the binding run.

Recommendation: **C then B.** The interim pass costs one cheap run and protects
the two real attempts.

### Q2 — `npm run test:e2e` (T-6.6): apply the pin amendment, or defer?

`package.json` scripts are frozen by the signed `wiki/gate1/package-scripts.json`.
The candidate amendment is already written
(`candidate-amendments/06-e2e/package-scripts.md`); nothing can move without a
re-signature.

- **A.** Apply it and re-sign Gate 1 once more before promotion.
- **B.** Ship v6.0.0 without the entrypoint; the E2E workflow already runs in CI
  under its own job, so only the convenience script is missing.

Recommendation: **B.** A re-signature to add a script alias is the expensive
half of a release gate for the cheap half of a feature.

### Q3 — `gate1-pin` as a required check on `qa-prod`?

Today it is documented as required on `prod` only. On `qa-prod` it reports but
does not block. This box gets 403 on the branch-protection API, so it is a click.

- **A.** Make it required on `qa-prod` now.
- **B.** Leave it reporting-only on `qa-prod`; `prod` protection is the real gate.

Recommendation: **A.** North star 11 promotes on automated evidence from the
exact QA commit; a non-blocking pin check weakens exactly that evidence.

### Q4 — Tracker closure timing (T-1.6, T-1.7, T-10.8)

- **A.** Close the issues when the PR merges to `qa-prod`.
- **B.** Close them only after the tag is published and the download smoke test passes.

Recommendation: **B.** T-9.7 and T-6.8 both depend on the published tag, so
closing at merge would leave two tasks open against closed issues.

### Q5 — The 71 overlapping `closure-*` reasoning traces

Several are red/green or attempt/final pairs of the same work.

- **A.** Leave them; the wiki rules treat a failed-attempt record as deliverable.
- **B.** Consolidate in a post-release wiki-maintenance pass.
- **C.** Consolidate before promotion.

Recommendation: **B.** Not **C** — it would add a large docs commit on top of
the gate-green bytes the receipt and the promotion evidence bind to.

### Q6 — Anything else you want removed before promotion?

The de-duplication kept three things on purpose, each with a written reason in
`wiki/reasoning/2026-10-17-retire-the-duplicate-services-catalogue.md`:
`rig/catalog/skills/` (pinned upstream shelf reference), `rig/catalog/plumbing/`
(named by `rig/corpus/corpus.json`), and the `rig-mcp/` ↔ `rig/mcp-runtime/`
pair (merge blocked by the pinned `npm test --prefix rig-mcp` script).

- **A.** Keep all three.
- **B.** Name one to remove and the agent does it with its fallout.

Recommendation: **A** for this release.

## Blocked on the owner

| Task | What is needed | Why it cannot be done here |
| --- | --- | --- |
| 🔒 T-10.4 | Tick it | The amendments are applied and `check-advanced-spec` verifies the re-signed manifest (16 files, 95 cases, `gate1-owner`). Only the owner marks their own signature done. |
| T-10.5 | Fire the receipt, or answer Q1 | Model choice and the two-attempt cap are the owner's call. |
| 🔒 T-10.7 | Confirm `test` + `browse-process-cleanup` green on `ba123844`, then make `gate1-pin` required (Q3) | Branch protection returns 403 to this box. |
| 🔒 T-10.8 | Tracker closures, exact-SHA promotion, tag, release, download smoke test | Needs write access to the tracker and the release. |
| 🔒 T-6.7 | Tick once CI is green on `ba123844` | macOS and Linux `descendants-*` were already green on `8288742a`; the `test` failure there was the tracker token, fixed in `test.yml` and now pushed. |
| 🔒 T-2.9 | Tick it | All three `browse-process-cleanup` jobs were green on `8288742a`. |
| T-6.6 | Answer Q2 | `package.json` scripts are frozen by the signed pin. |
| 🔒 T-6.8 | Post-publication download smoke test | Waits on the tag. |
| 🔒 T-8.8 | Health workflow dispatch on the QA ref, plus one deliberately failing run | Needs `workflow_dispatch` permission. |
| T-9.7 | Re-run the README install once the tag exists | `install rig --version v6.0.0` 404s until T-10.8. |
| 🔒 T-1.6 / T-1.7 | GitHub issue closures | Needs tracker write access. |

## State of the branch

- Remote head and PR #153 head: `ba123844`, the exact commit the full gate
  passed locally (exit 0, zero failures, no `implementation_digest` flake).
- Nothing is in flight on the agent side.
