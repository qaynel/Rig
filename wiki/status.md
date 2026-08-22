# Status — checked 2026-08-22 (one-gate D24 oracle preparation)

Where the project actually is. Every line below was checked against the files on
this date, not copied from another document.

Time-sensitive by design. When it goes stale, rewrite it — do not add a revision
note. Permanent things belong in [`topics/`](topics/); dated things belong in
[`reasoning/`](reasoning/).

---

## The gate is now one freeze (2026-08-21)

The two-gate model was collapsed into **one gate** to streamline the development
cycle. The gate freezes the **oracle** — intent, acceptance, and testing
infrastructure — under one signature before code; the technical spec is checked
for presence, not frozen, and the code adapts to it. This is now live in the
router and the grilling / product-design skills.
[intent](reasoning/2026-08-21-one-gate-streamlining-intent.md) ·
[escape hatch](reasoning/2026-08-21-one-gate-escape-hatch-resolved.md) ·
[the gate](topics/the-two-gates.md)

**Consequence: implementation is no longer blocked by a second freeze.** The
technical-spec review-round history further down (v0.5→v0.11, round-6 findings)
is retained as record of how the design got here, but it **no longer gates
implementation** — those rounds existed only to clear the retired second freeze.
The remaining real design content in them (rollback, recovery-credential
handling, evidence-gate consistency) survives as ordinary working-spec design the
code adapts around, not as freeze blockers.

**Authority defect resolved 2026-08-21:** the intent owner approved the
recommended D24/one-gate amendment and both Gate 1 files now carry it. The
completed test infrastructure and manifest still need the owner's live-human
signature before implementation; approval in chat is authority for the
amendment, not a substitute for the cryptographic ceremony.

---

## D24 — the MVP is built at agent discretion (2026-08-21, later the same day)

The intent owner ruled that the minimum viable product is authored **in one
pass at the agent's discretion**, not leaf by leaf. All 115 leaves get real
content at the **Policy** rung of the grade ladder, each fragment declaring its
grade and declaring that it is baseline practice not tailored to the installing
repository. This suspends locked decision 8 (one at a time, single context,
never templated) **for this release only**. The safety baseline is unchanged:
a missing binding is still a named, nonzero coverage gap, never a fabricated
pass.

Recorded honestly: under D24 the agent both authors the content and sets the bar
it is judged against, so **this release does not demonstrate the "an agent
cannot move its own goalpost" property.** The owner accepted that trade to reach
beta users on a time crunch, and it is reversible by promoting leaves to Context
or Evidence afterwards. D24 is now in Gate 1 and retires D23's one-release
`AT-SHAPE-6` exception.
[ruling](reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[owner approval](reasoning/2026-08-21-d24-owner-approval.md)

### Record defects tracked as of this date

1. **Commit `ff7cea5` vendored 56 upstream skills plus `bin`/`lib` plumbing into
   `rig/catalog/skills` and `rig/catalog/plumbing` and updated zero wiki files.**
   Nothing in `rig/lib`, `rig/manifest.json`, `rig/bootstrap.sh`, `scripts`,
   `tests`, or `package.json` references them, so they are both unwired and
   invisible to this wiki. The catalogue, delivery-plan, and distribution hubs
   all need them.
2. **Resolved 2026-08-21: upstream provenance, MIT notice, and owner ruling.**
   Vendored version `1.60.1.0` maps to upstream release commit `7c9df1c…`; the
   required 2026 Garry Tan copyright and permission notice ships beside the
   modified partial distribution. The owner permits release under MIT provided
   the notice and provenance ship in every installed copy and Rig claims no
   upstream endorsement.
3. **Resolved 2026-08-21: the `ff7cea5` secret-scan regression.** The swallowed
   suite README and this status page now describe the neutralized credential
   shapes without reproducing them. `npm test` passes the secret floor, all 264
   root tests, and all 15 pi-extension tests. This restores the pre-existing
   gate; it does not create the still-missing specification gate.

---

## The one-line version

D24 and the one-gate contract are now owner-approved and landed in both Gate 1
files. The ID set remains **68**, but the release boundary is now the complete
MVP: all 115 leaves at declared Policy grade, all 55 vendored skills wired by
Rig name, detected-host-only onboarding, and named-tag version `5.0.0`
distribution. D24 supersedes D21's lint-format-only boundary and retires D23's
`AT-SHAPE-6` carve-out. Lint-format remains the only leaf allowed to retain
higher-grade claims from existing evidence.

The owner also approved the modified partial vendored suite under MIT, with the
upstream notice and provenance required in every installed copy and no upstream
endorsement claim. The approval is filed
[verbatim](reasoning/2026-08-21-d24-owner-approval.md).

The working technical spec is now v0.12 and retraced to D24. It is checked for
presence rather than frozen.
The executable oracle candidate now has deterministic static targets for all 68
cases, a stable five-file testing-infrastructure manifest, exact ID equality
across Gate 1, Gate 2, and the manifested tests, and a first-running verifier.
Its pre-implementation baseline is 5 passing and 63 failing cases: the failures
name missing product behavior rather than missing oracle structure. The only
remaining pre-implementation blocker is the owner's live-human signature over
both Gate 1 documents plus the manifest digest.

---
## Gate standing

| | State |
|---|---|
| **The oracle** — [`gate1/business-spec.md`](gate1/business-spec.md) + [`gate1/acceptance.md`](gate1/acceptance.md) + testing infrastructure | **D24-approved executable candidate**, 68 cases. The sorted five-file manifest is complete and verifies; D24 makes all 115 Policy leaves release-blocking. Awaiting owner review and the physical signature. |
| **Technical spec** — [`gate2/technical-spec.md`](gate2/technical-spec.md) | **Working v0.12, retraced to D24.** Checked for presence, not frozen. All 68 trace rows name their exact manifested static test title. |
| **Oracle signature** | **Unarmed.** Neither `gate1.sig` nor `gate1.allowed-signers` exists. The owner must review and sign both Gate 1 files plus the completed testing-infrastructure manifest before implementation. |
| **Executable oracle** | **Complete candidate.** `node scripts/check-advanced-spec.js` reports `Gate 1 unprotected` and verifies 5 manifested files/68 exact cases. The production baseline is intentionally red: 5 pass, 63 fail on named missing behavior. |

### Current digests

| File | SHA-256 |
|---|---|
| `gate1/business-spec.md` | `0c93eaf5a9e28128a767806b8d0fcb1075b3b7ee4744f0d20a214aebc3952990` |
| `gate1/acceptance.md` | `1e9fcd0e9aec2126995f836bead1aac3e48efdcdf48ef102ec1c9bfb9f62f360` |
| `gate1/testing-infrastructure.manifest` | `99e303617fa83c44dd5275a7b681dbf4a367a4576aaa633fc9e335106321e4ac` |
| `gate2/technical-spec.md` | `a2da45da5c18d312806d9a848825f2c22104e22109b09176518acbde13fd0b62` |

Both Gate 1 digests changed on 2026-08-21 under the owner-approved D24/one-gate
amendment. Gate 2 v0.11 still pins the superseded D23 digests and is therefore
superseded; v0.12 pins the current D24 bytes.

The Gate 2 digest is `a2da45da…` as of the 2026-08-22 v0.12 executable-target retrace
correction (it was `69c38149…` at v0.10, `df4b8ec7…` at v0.9, `0f62d984…` at v0.8, `cdd07515…` at
v0.7, `645e5536…` at v0.6, and `5f4edd7a…` at v0.5). Re-check at any time:

```sh
shasum -a 256 wiki/gate1/business-spec.md wiki/gate1/acceptance.md wiki/gate1/testing-infrastructure.manifest wiki/gate2/technical-spec.md
```

Traceability has exact **ID-set equality** at 68 and every row names a static
test title in the signed manifest. The verifier checks that equality before any
product test. See [acceptance cases](index/acceptance-cases.md).

---

## Historical: the vertical-release conflict

**This is resolved as of 2026-08-21 by D21.** The intent-owner ruling asked for
lint-format to become the first production leaf while the other 114 leaves
remain future commitments; Gate 2 recorded that path first (`AD-24`/`AD-31`),
and frozen Gate 1 previously still said all 115 leaves were release-blocking,
so the production path had no Gate-1 authority. D21 narrows Gate 1's release
condition to match: `development.code-quality.lint-format` alone is
release-blocking for this release, and the other 114 leaves block only their
own future support and the complete-catalogue claim. See
[`gate1/business-spec.md`](gate1/business-spec.md)'s D21 revision note and §3/§5.

All twenty lint-format product-intent questions (`GA-16`–`GA-35` plus the
reconciled 1–3) were already closed by the grilling audit; D21 is the Gate 1
amendment that gives them authority, and the acceptance
([acceptance-authoring handoff](specs/lint-format-grilling-handoff.md)) is
authored and approved — Stage A and Stage B (cases 4–5) are done. What remains
is Stage B step 6 (the intent owner's signature — a physical act this document
cannot perform) and Stage C (handoff to `rig-product-design`).

Full handoff: [lint-format production grilling audit](reasoning/2026-08-20-lint-format-production-grilling-audit.md).
[Release-contract reconciliation](reasoning/2026-08-20-lint-format-grilling-release-contract.md).

---

## Review state: v0.11 is not reviewed

[`sources/reviews/gate2-v0.6-round4.review.json`](sources/reviews/gate2-v0.6-round4.review.json)
bound Gate 2 `645e5536…` and the current Gate 1 bytes. Its verdict was **fail**:
one blocker, one major finding, one minor finding, and no unresolved Gate 1 ID.
The v0.7 correction (`cdd07515…`) resolves both accepted findings and **voids
this receipt**.

| Severity | Where | Finding | Correction in v0.7 |
|---|---|---|---|
| ~~blocker~~ | §5.7 / AD-32 vs `AT-LF-8` / `AT-LF-9` | "Return at the lowest level that yields a definitive verdict" can stop after a clean Policy pass, making selected Context/Evidence work a no-op despite the strict cumulative-superset contract. | **Corrected.** §5.7 and AD-32 now short-circuit only on a lower-grade *failure*; a clean lower-grade pass runs through to the selected grade, the reported assurance is the highest grade actually completed, and the `AT-LF-7`/`AT-LF-8`/`AT-LF-9` §13 rows assert the no-op-on-clean-pass case fails. No Gate 1 change. |
| ~~major~~ | §11.3 vs §8.9 / §9.1 | The generic repo-CI runner says it executes every selected executable service, while lint-format says CI enforcement belongs to Evidence, leaving Policy/Context behavior undefined when a Rig CI job already exists. | **Corrected.** §8.9 (authoritative), §11.2, §11.3, and the `AT-LF-13` row now make repository-CI applicability grade-aware: lint-format participates in CI only at Evidence, and a Policy/Context leaf stays out of a pre-existing Rig CI job. Gate 1 is intentionally silent below Evidence. |
| minor | §1 / AD-26 | Three senses of `verified` create a risk that an implementation test targets the wrong one. | **Carried, not churned.** The receipt itself says the current text already disambiguates the terms; the distinction is carried into the eventual claim-string test rather than re-edited in Gate 2. |

See [`reasoning/2026-08-21-gate2-v0.7-round4-corrections.md`](reasoning/2026-08-21-gate2-v0.7-round4-corrections.md).

[`sources/reviews/gate2-v0.7-round5.review.json`](sources/reviews/gate2-v0.7-round5.review.json)
then bound Gate 2 `cdd07515…` and failed with two blockers, four major findings,
and two minor findings. D22/v0.8 addressed the `AT-CI-3` blocker by giving
Gate 1 the same active-grade CI-applicability qualifier already intended by
lint-format's Evidence-only CI design; D23/v0.9 then closed a second gap the
round-5 review didn't itself catch — `AT-SHAPE-6`'s all-115 wording was never
scoped to D21's release boundary. Because the Gate 1 and Gate 2 bytes have
changed repeatedly since, the round-5 receipt is void for v0.11. v0.11 resolves
five of its six carried findings: Evidence/CI consistency, remediation rollback,
recovery-registration refusal, the report-status enum, and stale version
references. Its traceability-target finding remains open: 48 rows still do not
name real executable targets.

[`sources/reviews/gate2-v0.9-round6.review.json`](sources/reviews/gate2-v0.9-round6.review.json)
then reviewed `df4b8ec7…` and failed with one blocker, one major finding, and
one minor finding. v0.10 (`69c38149…`) corrects all three in candidate text:
Slice 2's unauthored-leaf red state no longer deadlocks the lint-format release
test suite, freeze happens once through §17.1 rather than again after Slice 15,
and `AT-PRESENCE-2` now tests only enforceable recovery preconditions and
declared-class disclosure. v0.11 supersedes those bytes with the further
round-5 corrections above; a fresh review is still required.

### Round 3 history — all four findings resolved in candidate v0.6

[`sources/reviews/gate2-v0.5-round3.review.json`](sources/reviews/gate2-v0.5-round3.review.json)
was bound to `c0333c36…`, the technical-spec bytes as they stood through
2026-08-19. That receipt is now **void** — not because it was wrong, but
because the bytes it reviewed have changed to fix the exact contradictions it
caught. This is the mechanism working: an edit that resolves a finding changes
the digest and voids the receipt that found it. As of the 2026-08-21 v0.6
re-trace, **all four round-3 findings are resolved in candidate text**.

| Severity | Where | The contradiction | Status |
|---|---|---|---|
| ~~blocker~~ | §6.6 / §10 / AD-10 vs §7.6 | Two incompatible answers for the same failure. §6.6/§10/AD-10 said a failed apply rolls everything back; §7.6 and `AT-INSTALL-1` say applied writes stay in place and the install resumes. The lint-format vertical-slice probe confirmed the running code did the rollback thing and produced no manifest at all. | **Resolved 2026-08-20.** §6.6, §10, and AD-10 now state the manifest-and-resume model as the only failure behavior; the rejected-approaches list names the rollback branch explicitly. `rig/lib/apply.js` implements the `.rig/install-manifest.jsonl` record-before-mutate/resume mechanics for the write path apply already exercises. See [`reasoning/2026-08-20-resolve-at-install-1.md`](reasoning/2026-08-20-resolve-at-install-1.md). |
| ~~major~~ | AD-30 / §8.4 vs D19 | D20 recovery credentials are described as "hardware-backed" without qualification, when D19 established that no SSHSIG key type proves hardware presence. Gate 2 discloses this limitation for the other two signers and not for this one. `AT-PRESENCE-2` also has no test for an agent registering a fraudulent recovery key while holding a valid credential. | **Resolved 2026-08-21.** §1/§8.4/AD-30 now give recovery credentials the declared-and-disclosed class treatment (D19); v0.10 narrows the `AT-PRESENCE-2` row to what automation can prove: pre-loss registration, fingerprint/namespace distinctness, receipt validity, exhaustion, side effects, and declared-class disclosure. |
| ~~major~~ | §1 / `AT-BASE-2` vs §11.1 / AD-26 | §1 says the policy is evaluated "wherever a verified host surface exists", while §11.1 bans `verified` as host/axis vocabulary and `AT-CLAIM-1` greps for it. The two senses are never disambiguated. | **Resolved 2026-08-21.** §1 and §11.1 record the three-way split: the banned host/axis *tier* badge, the control/tool evidence status, and Gate 1 `AT-BASE-2`'s "verified enforcement surface" (a host capability, expressed internally as `emitted`/`gap`/`unsupported`, never a user-facing per-host claim). AD-26 amended. |
| ~~minor~~ | §8.8 vs `AT-SECRET-1` | Enabling model-assisted triage is supposed to let matched content reach the agent, but no channel is described through which it could, so the case has no mechanism to test. | **Resolved 2026-08-21.** §8.2/§8.8 add the single default-closed `secrets.model_assisted_triage` field: while true the pipeline attaches a bounded redacted `matched_content` field to the agent-visible triage view, dropped on deactivation. The `AT-SECRET-1` §13 test row tests exactly this. |

Full text of the original findings is in the void receipt. All four are now
resolved in candidate text.

### Older receipts, all void

| Receipt | Bound to | Verdict |
|---|---|---|
| [`gate2-v0.4-round1`](sources/reviews/gate2-v0.4-round1.review.json) | `2028f911…` (superseded) | fail, 2 findings |
| [`gate2-v0.4-round2`](sources/reviews/gate2-v0.4-round2.review.json) | `31a430e6…` (superseded) | fail, 4 findings |
| [`gate2-v0.5-round3`](sources/reviews/gate2-v0.5-round3.review.json) | `c0333c36…` (superseded) | fail, 4 findings, 1 unresolved |
| [`gate2-v0.7-round5`](sources/reviews/gate2-v0.7-round5.review.json) | `cdd07515…` (superseded by v0.8, then v0.9) | fail, 8 findings |
| [`gate2-v0.9-round6`](sources/reviews/gate2-v0.9-round6.review.json) | `df4b8ec7…` (superseded by v0.10) | fail, 3 findings |

Round 2 is the review that produced [policy-signer recovery](topics/policy-signer-recovery.md) —
it found a recovery ceremony in Gate 2 with no Gate 1 requirement behind it, and
the intent owner chose to grill the requirement rather than strip the capability.

---

## Ordered next steps

**Done 2026-08-21:** the Gate 2 re-trace (Stage C's design task) — `AT-LF-*`
traced into §13 at exact 68-case equality, the D21 release boundary applied to
§12.3/§17.2, the P→C→E grade ladder and lint-format vertical mechanisms added,
and all three remaining round-3 findings resolved in candidate text (v0.6,
`645e5536…`), the two accepted round-4 findings corrected (v0.7, `cdd07515…`),
and the round-5 `AT-CI-3` contradiction clarified through D22/v0.8
(`0f62d984…`). **Also done:** D23, a Gate 1 amendment closing the
`AT-SHAPE-6`-vs-release-boundary gap for this release only, **and its retrace
into Gate 2 (v0.9, `df4b8ec7…`)** — §5.6, §12.3, §17.2, AD-24, and the
`AT-SHAPE-6` §13 row express the one-release scoping as checkable acceptance
criteria, not just prose. **Also done:** v0.10 (`69c38149…`) addresses the
round-6 candidate-review findings without changing Gate 1, and v0.11
(`94ba0f80…`) clears five carried round-5 defects.

**Superseded by D24.** The single-leaf path below is no longer the release plan.
The current ordered path is [the MVP roadmap](specs/mvp-roadmap.md); its eight
steps, verify commands, and traps are the authority for what happens next.

In short:

1. **Repair the record.** Done 2026-08-21 — D24, the two record defects, the
   roadmap, and the hubs they touch.
2. **Freeze the completed oracle gate.** The verifier, `npm run test:code`
   split, 68 static targets, and stable manifest are complete. The owner must
   now perform the live-human signature before production implementation. The
   all-115 content target remains red until step 5. See [the specification gate](topics/specification-gate.md).
3. **Wire all 55 swallowed skills and ship a real install path** (`install.sh`,
   `5.0.0`). First step producing something a stranger can hold.
4. **Context-aware onboarding** — mechanical host detection only, write into
   existing trees only, family selection explicit and trimmable.
5. **Author all 115 leaves at Policy grade**, in family batches, each fragment
   declaring its grade and that it is untailored baseline practice.
6. **Prove the all-115 target green** without changing the signed oracle.
7. **Release** — verify the existing signature, MIT notice/provenance, fresh
   review, full evidence, and `v5.0.0`.
8. **After beta,** promote leaves Policy → Context → Evidence on evidence of
   use, under the ordinary gate with owner review restored.

The D24/one-gate amendment and MIT ruling are complete. One owner act remains:
the live-human signature over both Gate 1 files and the completed test manifest.
The sign/verify mechanism must cover that manifest before the ceremony is armed.
See [gate signing](topics/gate1-signing.md).

The general "evaluate only what a release ships" mechanism D23 deferred remains
deferred; D24 retires the exception for this release by making all 115 leaves
release-blocking.

The technical spec's remaining round-5/round-6 findings are ordinary working-spec
design the code adapts around; they no longer block implementation.

---

## What exists in the code today

| Thing | State |
|---|---|
| `scripts/check-advanced-spec.js` — the specification gate | **Does not exist.** Slice 1 builds it. |
| `npm run test:code` | **Does not exist.** `npm test` has no spec gate and runs code tests unconditionally. |
| `install.sh` | **Does not exist.** No delivery path. |
| `.github/workflows/publish.yml` | **Deleted 2026-08-20** by the cleanup pass. The package remains private, so inherited npm publishing stays rejected. |
| `package.json` version | **`4.8.4`**, private. Gate 2 §12.4 requires `5.0.0`. |
| `scripts/review-receipt.js` | **Exists and works.** |
| 115 catalogue leaves | **1 authored** (`development.code-quality.lint-format`, proposed as the first production leaf by `GA-15`/`AD-31`, but not yet permitted by frozen Gate 1). The other 114 leaves still contain 428 `TODO(Slice 10)` files. See the [roadmap](specs/lint-format-roadmap.md) and [grilling audit](reasoning/2026-08-20-lint-format-production-grilling-audit.md). |
| `tests/advanced-*.test.js` | **20 files, all green.** `advanced-lint-format.test.js` and `advanced-apply.test.js` assert real behavior (rejects placeholder content, exercises the real formatter/linter, exercises apply's manifest/resume). The rest are still calibrated to pass against placeholder content — see [traps](index/traps.md). |
| 55 swallowed skills + plumbing | **Vendored, 0 wired.** `rig/catalog/skills` contains 55 `SKILL.md` packages, matching the upstream release; the earlier 56 count was an inventory error. No reference from `rig/lib`, `rig/manifest.json`, `rig/bootstrap.sh`, `scripts`, `tests`, or `package.json`, so they are not installable. Exact upstream MIT provenance and notice are restored and the owner approved distribution with notice/provenance and no endorsement claim. Roadmap step 3 wires them. |

The committed suite passing tells you nothing about specification health, and
will not until Slice 1 lands. See [traps](index/traps.md).

---

## The eight locked design decisions

Settled one at a time with the intent owner and expensive to obtain. Do not
silently re-open them; each is recorded at length in Gate 2's `AD-` table and its
rejected-approaches list.

| # | Decision | Topic |
|---|---|---|
| 1 | Claim status is per `{host, axis}`, cross-checked against evidence in both directions. No file enumerates advertised hosts. *(Since narrowed by the 2026-08-17 amendment, which removed the tier entirely.)* | [host and CI coverage](topics/host-and-ci-coverage.md) |
| 2 | Signer interface is SSHSIG verified by `ssh-keygen -Y verify`. The required property is a key no agent can operate without a live human act, with the class disclosed. | [Gate 1 signing](topics/gate1-signing.md) |
| 3 | Repository identity for user-global writes is a generated ID under `git rev-parse --git-path rig/`, never committed. | [user-global writes](topics/user-global-writes.md) |
| 4 | `npm test` keeps the spec gate first and short-circuiting, with no exemption input. `npm run test:code` is the daily signal. | [the specification gate](topics/specification-gate.md) |
| 5 | Review independence is a fresh session and a digest-bound receipt written by the wrapper, not the agent. | [review receipts](topics/review-receipts.md) |
| 6 | Gate 1 integrity is non-git — a signature over the digest. No branch protection, no upstream comparison. | [Gate 1 signing](topics/gate1-signing.md) |
| 7 | Distribution: the install stub fetches a released tag by name. No fingerprint pin. Never `curl \| sh`. | [distribution and release](topics/distribution-and-release.md) |
| 8 | Catalogue authoring: all 115 leaves one at a time, single context. Not parallel, not templated. **Suspended for this release by D24** — all 115 authored in one pass at Policy grade, with the grade declared on every fragment. Returns at roadmap step 8. | [the authored-service gate](topics/authored-service-gate.md) |

---

## Known documentation debt

- **`specs/roadmap.md`, `specs/sow.md`, and `specs/tasklist.md` were removed**
  by the 2026-08-20 cleanup pass. They were subordinate pre-refactor documents
  with stale acceptance counts, retired host-tier vocabulary, and superseded
  delegated-edit mechanics.
- **`benchmarks/` is future-use test support.** It is not referenced by CI,
  README, or docs; only `tests/correctness.test.js` and `tests/behavior.test.js`
  require its modules. The cleanup ruling kept it in place.
- **`rig/catalog/services/**` still holds 428 `TODO(Slice 10)` placeholder
  fragments** (of 808 files, 216 KB `catalog.json`). Expected pre-Slice-10 per
  the "1 of 115 authored" row above; the noise is not a defect. Recorded as
  [cleanup punch list](#cleanup-punch-list) item 8.
- **Gate 1 and preserved sources contain relative links to the pre-wiki layout.**
  They were not edited during the move, deliberately, so their source history
  and Gate 1 digests stay intact. Gate 2's editable candidate links were
  corrected in v0.10.
  See [the path map](index/path-map.md) for the translation.

---

## Cleanup punch list

Queued 2026-08-20 from a branch-wide cleanup survey, then executed in the same
day's cleanup pass. Full findings and the reasoning behind each ruling are in
[`reasoning/2026-08-20-cleanup-survey-decisions.md`](reasoning/2026-08-20-cleanup-survey-decisions.md).

Do not silently reopen a ruling below. If new information changes one, file a
new reasoning trace before acting.

| # | Item | Outcome |
|---|---|---|
| 1 | `AGENTS.md` and `GEMINI.md` are byte-identical, no drift guard. | **Keep both.** Intentional multi-host serving; not a defect. |
| 2 | `.github/workflows/publish.yml`. | **Deleted.** Wiki already flagged; also broken (private package). |
| 3 | ~30 exports in `rig/lib/*.js` with zero external callers. | **Deferred.** Speculative surface from the two landing commits (`3e3feeb`, `8dcaa49`), not a runtime concern. Remove opportunistically when a file is next touched, or as one mechanical sweep. Full symbol list in the reasoning trace. |
| 4 | 6 command files copied across `.agents/workflows/`, `.opencode/command/`, `commands/*.toml`. | **Keep all three.** Intentional multi-host serving; not a defect. |
| 5 | `__init__.py` at repo root (Hermes plugin). | **Documented as first-class** in `CLAUDE.md`'s architecture section. Do not move the file; do not drop the `.venv`/pandas step from `npm test`. See [`reasoning/2026-08-20-hermes-first-class.md`](reasoning/2026-08-20-hermes-first-class.md). |
| 6 | `tests/basic-guard-{chain,floor,scanner}.test.js` reimplement `initRepo`/`git`. | **Moved shared shims** into `tests/helpers/basic-install.js`. |
| 7 | `rig/bootstrap.sh` duplicates `rig/manifest.json`'s install list. | **Cleaned up.** The bootstrap now installs through `rig/lib/payload.js`, so `rig/manifest.json` is the one payload list. |
| 8 | 428 `TODO(Slice 10)` catalogue placeholders. | **Keep as TODO.** Status now recorded above under "Known documentation debt". |
| 9 | Two unrelated uninstallers (`scripts/uninstall.js` legacy, `rig/lib/uninstall.js` current). | **Deleted the legacy `scripts/uninstall.js`.** |
| 10 | `benchmarks/` not referenced by CI, README, or docs. | **Kept.** Documented above under "Known documentation debt". |
| 11 | `wiki/specs/{roadmap,sow,tasklist}.md` are pre-refactor and self-flag stale. | **Removed all three.** |
| 12 | `docs/pr-reviews/` is empty. | **Keep for future use.** |

Low-value items surfaced in the survey (long `apply.js`, growing
`check-rule-copies.js` list, tiny `receipt.js`, unmapped hidden install-target
roots) are handled at the discretion of whoever next touches those files.
