# Making the Advanced tier's compliance claims executable

**Date:** 2026-08-17
**Branch:** `implement-advanced-a-la-carte-catalogue`
**Status:** design, awaiting owner review

This document lives outside `project-dev-docs/current/spec/` deliberately. The
specification gate described below rejects a second authority in that tree, and
this is a plan for building the gate, not a competing specification of the
Advanced tier.

## 1. The problem

Three independent review passes produced fifteen findings. They are not fifteen
defects. They are one defect observed fifteen times:

**Every artifact on this branch announces a property that nothing checks.**

- `technical-spec.md` announces it is not ready to build against. ~2,700 lines
  were built against it.
- Two review sign-offs announce a review of specific bytes. They bind
  `6279bf02…` and `d8b7ba8d…`; the live file hashes to `86a8a75b…`. They also
  bind intent-document bytes that no longer exist. Nothing rejected them.
- The traceability table announces one executable test per acceptance case. 34
  of 52 cases have no test naming them. The only test file the table names,
  `advanced-spec-gate.test.js`, does not exist. `scripts/check-advanced-spec.js`,
  the checker meant to enforce all of it, was never written.
- `roadmap.md:84` announces "each line was checked against the files today" and
  states two files do not exist. Both were tracked at HEAD.
- `rig/lib/host-capabilities.js` marks 15 of 19 hosts as having verified
  live-hook enforcement. The evidence field holds a documentation URL. The
  string `first_wire` appears in that file zero times.
- One layer down, the same shape in code: `--approval` documented and never
  parsed, `remediate` returning success without acting, a "history scan" that
  was a log line with the scan commented out, and tests asserting
  `'AT-P1' === 'AT-P1'`.

An announcement with no executable check behind it is free to write and
invisible when wrong. Under agents, producing a compliant-looking artifact is
the cheapest available action and nothing pushes back. That is the root cause,
and the remedy is not to write better artifacts — it is to make the machine
reject artifacts that lie.

### What is already repaired

The working tree carries uncommitted fixes for most of the code-level findings:
plan digest verification, the `--approval` flag, a `remediate` that actually
applies and rolls back, a real first-enable history scan, `check-copies`
ordering its existence guard before `lstat`, and `inspect` surviving an in-repo
directory symlink. It also deletes the signing trust root that was re-committed
by accident. These land first, as Phase 0 below.

## 2. Decisions taken by the owner

1. **Make the controls real.** Build the missing enforcement rather than reduce
   the ceremony.
2. **Ship all 19 hosts, with no tier.** No verified/unverified distinction, in
   the product's output or anywhere else. There was never anything to lose: no
   per-host claim line was ever implemented, and no host — including Claude
   Code — has a captured first wire.
3. **No human host testing, ever.** The owner can exercise Claude Code and
   Cursor only, and the process must not depend on that. All 19 hosts are proven
   the same way: automated tests asserting the correct bytes land in the correct
   paths, needing a temporary directory and nothing else.
4. **The literal reading of the ordering rule.** The gate runs first in
   `npm test`, on every push, with no exemption or progress input. The suite
   goes red when the gate lands and stays red until every case has a real test.
   Nothing is pushed in between.

Decision 4 is the expensive one and it was made with the cost stated. Section 8
records what it means day to day.

## 3. The specification gate

`scripts/check-advanced-spec.js`, wired as the first element of `npm test`,
joined to the rest with `&&` so a failure short-circuits every code test.

Checks run in order. Each is fatal. There is no skip, exemption, waiver, or
progress input — by design, because such an input is precisely how a gate
becomes decorative.

**0 — Intent integrity.** If `project-dev-docs/current/gate1.allowed-signers`
is present the repository is *armed*: rebuild the `rig-gate1-freeze-v1` message
from the live digests of `business-spec.md` and `acceptance.md`, verify
`gate1.sig` in namespace `rig-gate1`, and on success print the matched principal
and the key's SHA-256 fingerprint so a substituted trust root is visible in
ordinary output. Missing, malformed, or non-verifying signature fails. If the
identity file is absent the repository is *unarmed*: report the intent documents
as unprotected in those words and continue, so a stranger who cloned the
repository can still run the suite. The working tree is unarmed. Arming is the
owner's deliberate act, taken separately, never as a side effect of other work.

**1 — Authority and status.** `technical-spec.md` must declare `FROZEN`. Exactly
one document may carry the authority role; a second fails. Unresolved markers
and placeholder text fail.

**2 — Digest pins.** The pins in the spec header must equal the live SHA-256 of
both intent documents. On mismatch, print both values and fail.

**3 — Traceability set equality.** Read the case IDs from `acceptance.md` on
disk — never from a count written anywhere — and require exact set equality with
the rows of the traceability table. A case with no row fails; a row with no case
fails.

**4 — Target existence.** `stat` every test file named by a row. `node --test`
on a missing file prints `Could not find` and **exits 0**, so a row naming a
vanished file would otherwise read as green. Absence is a coverage gap, never a
pass.

**5 — Substantiveness.** Described in section 4. This is the check that makes
the rest non-decorative.

**6 — Review receipt.** Described in section 5.

## 4. Substantiveness by coverage delta

The gate must distinguish a real test from one that names a case and asserts
nothing. Static analysis of test bodies was rejected: it guesses at intent,
misfires on table-driven tests, and is satisfied by a decorative `require`.

Instead, for each case ID:

1. Run only that test: `node --test --experimental-test-coverage
   --test-reporter=lcov --test-name-pattern=<ID> <file>`.
2. Run the same file with a pattern that matches nothing. This is the file's
   **module-load baseline** — the lines executed merely by importing it.
3. Require the case run's line-hit set, minus the baseline set, restricted to
   `rig/` product code, to be **non-empty**.
4. Require at least one test to have matched, all matched tests to have passed,
   and none to be skipped or marked todo.

A test that asserts `'AT-P1' === 'AT-P1'` moves the counter by exactly zero and
fails. A test naming a file that does not exist matches nothing and fails. There
is no heuristic and nothing to game short of actually exercising product code.

Verified on Node v24.18.0 before adopting it:

| Run | Product lines hit | Delta vs baseline |
|---|---|---|
| baseline — pattern matches nothing | 2 / 8 | — |
| substantive test | 6 / 8 | **+4** |
| `assert.equal('AT-FAKE-1','AT-FAKE-1')` | 2 / 8 | **0** |

**Cost.** Roughly 48 case runs plus one baseline per test file that carries a
case, against 51 test files. Isolated runs measured well under a second each,
but the heavy fixtures (bootstrap, catalogue) dominate; budget one to two
minutes added to every `npm test`. The owner priced this deliberately, given the
gate runs ahead of everything on every push.

**The repo-invariant escape, and its danger.** A small number of cases assert
facts about the repository rather than behavior of product code — that no
publish workflow exists, that report paths are git-ignored, that no second
invariant file exists. These legitimately execute no `rig/` code. Such a case
may declare its evidence kind as `repo-invariant` **in the traceability table
itself**, where it is visible and subject to review. The gate still requires the
test to exist, match, run and pass; only the coverage-delta requirement is
replaced, by a requirement that the test assert against at least one real path
resolved on disk.

This is the one seam through which decorative compliance could return. It is
constrained deliberately: the kind is declared per row in a reviewed document,
never passed to the gate at runtime, and expected to cover fewer than five
cases. If it grows, that growth is itself visible in the diff of the spec.

## 5. Review receipt with a verdict per case

`scripts/review-receipt.js` today emits a single global verdict and flat arrays,
which structurally cannot express what the requirements ask for. Replace with:

```json
{
  "schema": "rig-spec-review/v1",
  "reviewed": {
    "project-dev-docs/current/spec/technical-spec.md": "<sha256>",
    "project-dev-docs/current/spec/business-spec.md": "<sha256>",
    "project-dev-docs/current/acceptance.md": "<sha256>"
  },
  "authoring_model": "claude-opus-5",
  "reviewer_model": "<wrapper-written>",
  "reviewed_at": "<wrapper-written, ISO 8601>",
  "run_id": "<wrapper-written>",
  "cases": [
    { "id": "AT-GATE-1", "testable": true, "conflicts": [], "verdict": "pass", "note": "…" }
  ],
  "unresolved": []
}
```

The gate requires: `reviewed` digests equal the live files; `cases` in exact set
equality with the case IDs read from disk; every verdict `pass`; `unresolved`
empty; and `reviewer_model` different from `authoring_model`.

The four attested fields are written by the wrapper after the reviewing agent
returns, and the wrapper rejects any agent output that already contains them —
so the agent cannot author its own identity or the digest it claims to have
reviewed. The wrapper continues to refuse to run under the authoring model.

The two existing receipts are void — they bind bytes that no longer exist — and
are deleted in Phase 0 rather than left to imply a review that did not happen.

## 6. Amending the requirements: removing the host tier

Decision 2 removes a distinction that four acceptance cases exist solely to
draw. This is an amendment to frozen requirements and is the owner's act, not
the implementer's.

**Delete:** the case requiring per-axis evidence bundles; the case blocking
release on an advertised set; the case requiring each host's status stated in
user-facing words; the case requiring that disclosure not gate the unverified
path.

**Rewrite:** the case requiring the whole roster to be built, so it now reads
that all 19 hosts and 6 providers are built and emitted, no code path skips a
host, and every host receives an identical invocation surface. Rewrite the
per-property coverage case to point at it.

**Preserve:** the out-of-repository write disclosure that lived inside the
deleted status case. Fold it into the case governing user-global writes, where
it belongs. It is about writing outside the repo, not about host tiers, and
losing it would be an unintended narrowing.

Case count moves **52 → 48**.

The host verification reference documents stay in the tree as provenance for
where the configuration surfaces came from. They are documentation, not
evidence bundles.

## 7. Re-labelling the registry

`rig/lib/host-capabilities.js` uses `verified` to mean "the vendor documents
this configuration surface." The requirements use the same word to mean "we
observed enforcement fire." One spelling, two meanings, and the stronger one is
what a reader assumes.

Rename the axis value `verified` → `documented`, and `VERIFIED_ON` →
`DOCS_CHECKED_ON`. Restate the header: *documented* means the vendor documents
this surface as of the date recorded; Rig does not assert it has observed
enforcement firing on any host. Apply the same rename to `ci-adapters.js`,
preserving its existing gating logic unchanged — only the label moves.

This is not a tier. It is the same honest statement for all 19.

## 8. Sequence

**Phase 0 — land the repairs.** Commit the working-tree fixes. Delete the two
void receipts. Correct the false status lines in `roadmap.md` and `handoff.md`.
Remove the stale RED-window claim in `docs/advanced/dev-ci-red-status.md`. This
is the last point at which `npm test` is green.

**Phase 1 — amend the requirements.** Section 6. Owner's act.

**Phase 2 — rewrite the traceability table** against 48 cases, every row naming
a real design anchor and a real test file, with evidence kinds declared.

**Phase 3 — build the gate.** Sections 3–5, wired first into `npm test`.
**The suite goes red here.**

**Phase 4 — fresh-context review** under a different model, producing a receipt
with 48 verdicts bound to live digests. Freeze the spec.

**Phase 5 — cases needing no new product.** The four ordering/authority cases,
the authored-catalogue and honest-disposition cases, the rewritten roster case,
the host contract and evaluator cases, the MCP retirement case, the four
baseline control cases, the self-activation case, the secret-handling and
reporting cases, the remediation and testing-scope cases, and the presence case.
Also replace the two decorative alias tests with ones that invoke the real
scenarios.

**Phase 6 — product debt, in dependency order.** Each item is code that does not
exist:

1. The append-only install journal — ordered `seq`, record-before-mutate,
   `install_id`, resume, and the incomplete-install header that suppresses every
   protection claim. Unlocks the interrupted-install case.
2. The content-addressed preimage store, reverse-order removal, managed-block
   stripping, and the verified-clean versus best-effort split. Unlocks the three
   uninstall cases. Today's `rig/lib/uninstall.js` is receipt-driven over a
   hard-coded path list and does not do this.
3. The user-global write ledger keyed by `install_id`. Unlocks the two
   multi-repository attribution cases.
4. The five remaining CI providers and their first-run receipts. Unlocks the
   four CI cases.
5. The standalone install stub and its container test. Unlocks the
   stranger-install case.

**Phase 7 — suite green. Push.**

### What Phase 3 costs day to day

Once the gate is wired, `npm test` short-circuits before the code tests. That is
the requirement, working as specified — but it means `npm test` stops being
usable as a development loop from Phase 3 until Phase 7. Development runs
`node --test tests/<file>` directly during the burn-down; `npm test` is purely
the push gate and will not be green for the duration.

`CLAUDE.md` currently instructs running `npm test` and confirming green before
pushing. That instruction stays correct — it is the reason nothing gets pushed
during the burn-down — but it should gain a sentence naming the per-file command
as the development loop, so a future session does not read a red suite as a
defect to work around.

## 9. Non-goals

- **Mutation testing.** The stronger measure of whether a test pins behavior
  down, and the natural later ratchet. Deferred: it needs a harness this repo
  does not have, and it consumes exactly the per-case coverage map section 4
  produces, so building section 4 first is on its critical path anyway.
- **Any per-host verified/unverified claim**, in output or in data. Removed by
  decision 2.
- **Arming the signature.** The gate supports it and reports honestly when
  unarmed. Arming is the owner's deliberate act with a key of their choosing,
  taken on its own, never bundled into unrelated work — which is how the test
  key got committed twice.

## 10. Risks

- **A long unpushed branch.** Phases 5 and 6 are substantial, and decision 4
  means none of it is pushed until all of it is done. This is the known cost of
  the literal reading.
- **The repo-invariant escape** is the seam where decorative compliance could
  return. Section 4 constrains it; watch its population in spec diffs.
- **Coverage delta proves execution, not assertion.** A test that calls product
  code and asserts nothing meaningful passes the delta check. Mutation testing
  is the answer, and is deferred; per-case review verdicts are the interim
  control.
- **Phase 1 is an amendment to frozen requirements.** Amendments are how frozen
  documents stop meaning anything. This one is justified by a constraint the
  owner cannot change — he cannot test 17 hosts — but it should be the last one
  taken without a fresh grilling pass.
