# Status — checked 2026-08-21 (Gate 2 v0.10 round-6 corrections)

Where the project actually is. Every line below was checked against the files on
this date, not copied from another document.

Time-sensitive by design. When it goes stale, rewrite it — do not add a revision
note. Permanent things belong in [`topics/`](topics/); dated things belong in
[`reasoning/`](reasoning/).

---

## The one-line version

Gate 1 is re-frozen at **68 acceptance cases** (2026-08-21, D21): the intent
owner approved the Stage A draft
([acceptance-authoring handoff](specs/lint-format-grilling-handoff.md)), and
Stage B has landed — `AT-LF-1`–`AT-LF-19` are now written into
[`gate1/acceptance.md`](gate1/acceptance.md) §7H and
[`index/acceptance-cases.md`](index/acceptance-cases.md), and
[`gate1/business-spec.md`](gate1/business-spec.md) now records the lint-format
vertical release boundary: `development.code-quality.lint-format` is the only
leaf release-blocking for this release, the other 114 remain commitments that
block their own future support and the complete-catalogue claim, not this
release. D22 (2026-08-21, later the same day) clarifies `AT-CI-3` without
changing the case count: CI runs selected executable services only when they are
repo-CI-applicable at their active grade, so lint-format remains CI-enforced only
at Evidence.

**D23 (2026-08-21, later the same day) closes a gap D21 left standing.**
`AT-SHAPE-6` still literally required the specification gate to review *all*
115 catalogue leaves and fail on TODO/filler content, with no reference to
D21's release boundary — so a literal transcription into `npm test`'s
first-run gate would have stayed red forever on the 114 leaves D21 already
said don't block this release. D23 is a **named, one-release-only exception**:
`AT-SHAPE-6` is evaluated against `development.code-quality.lint-format` alone
for this release; the other 114 leaves are excluded from this one pass,
unchanged, with no new marker required of them. It is explicitly not a
standing scoping rule — the intent owner deferred the general "evaluate only
what ships" mechanism to its own future grilling pass, and `AT-SHAPE-6`
reverts to all 115 leaves next release absent a further amendment. See the D23
revision notes in [`gate1/business-spec.md`](gate1/business-spec.md) and
[`gate1/acceptance.md`](gate1/acceptance.md).

**The Gate 1 signature is now stale against the new digest** (below) and needs
the intent owner's re-signature. D23 changes the ID set's *evaluation scope*
only — the count stays at **68**.

**Gate 2 has now been retraced against D23 and corrected through v0.10
(2026-08-21).** `§5.6`, the
`§12.3`/`§17.2` placeholder-check ordering, `AD-24`, and the `AT-SHAPE-6` row
in `§13` all now state the same one-release scoping D23 froze in Gate 1:
`AT-SHAPE-6`'s full-content evaluation applies to
`development.code-quality.lint-format` alone this release, expressed as a
real, checkable acceptance-criteria row rather than prose — the other 114
leaves' current placeholder state does not fail it this pass, and the scoping
expires next release absent a further Gate 1 amendment. `D22`'s `AT-CI-3`
narrowing was checked against Gate 1 and found already consistent in both
files — no change needed there. See
[the reasoning trace](reasoning/2026-08-21-gate2-v0.9-at-shape-6-retrace.md).
Round 6 reviewed v0.9 and failed with three findings; v0.10 addresses them by
making Slice 2's unauthored-leaf red state a status/future-support blocker
rather than a lint-format release `npm test` failure, aligning freeze authority
with §17.1 instead of Slice 15, and narrowing `AT-PRESENCE-2` to recovery
properties automation can actually prove. A fresh v0.10 review has not been
run.

**Gate 2 has now been re-traced (v0.6, 2026-08-21).** `rig-product-design`
traced `AT-LF-1`–`AT-LF-19` into §13 (exact set equality at 68), added the
Policy → Context → Evidence grade ladder and the lint-format vertical mechanisms
(§5.7, §5.8, §9.4, §11.3), narrowed the §12.3/§17.2 release boundary to the
single lint-format leaf (D21), and **resolved all three remaining round-3
findings** in candidate text (recovery credential class per D19, the
"verified enforcement surface" disambiguation, and the model-assisted-triage
channel). See
[`reasoning/2026-08-21-gate2-lint-format-retrace.md`](reasoning/2026-08-21-gate2-lint-format-retrace.md).
Gate 2 is **still a candidate**. Round 4 reviewed the v0.6 digest (`645e5536…`)
and failed with one blocker, one major finding, and one minor residual risk.
v0.7 (`cdd07515…`) corrected both accepted round-4 findings: the §5.7/AD-32
grade short-circuit and grade-aware repository-CI applicability. Round 5 then
reviewed v0.7 and failed with two blockers, four major findings, and two minor
findings. **v0.8 (`0f62d984…`) incorporates D22 to address the `AT-CI-3`
lint-format CI contradiction only**: Gate 1 and Gate 2 now both say selected
executable services run in CI only when repo-CI-applicable at their active grade.
The other round-5 findings remain open until separately resolved. The intent
owner's Gate 1 signature remains independently required before freeze. See
[`reasoning/2026-08-21-gate2-v0.7-round4-corrections.md`](reasoning/2026-08-21-gate2-v0.7-round4-corrections.md)
and
[`reasoning/2026-08-21-evidence-only-lint-format-ci.md`](reasoning/2026-08-21-evidence-only-lint-format-ci.md).

---

## Gate standing

| | State |
|---|---|
| **Gate 1** — [`gate1/business-spec.md`](gate1/business-spec.md) + [`gate1/acceptance.md`](gate1/acceptance.md) | **Frozen**, 68 cases. Last amended 2026-08-21 by D23, which narrows only `AT-SHAPE-6`'s evaluation scope for this release. |
| **Gate 2** — [`gate2/technical-spec.md`](gate2/technical-spec.md) | **Candidate v0.10. Not frozen.** v0.10 keeps v0.9's D23 retrace and corrects the round-6 review findings around Slice 2 release scoping, freeze timing, and recovery-test claims. Round 5's six remaining findings are still open. Implementation may not begin. |
| **Gate 1 signature** | **Unarmed, and now stale against the new digest below.** Neither `gate1.sig` nor `gate1.allowed-signers` exists anywhere in the repository. Whenever the signer identity is armed, it must be signed at the current digest, not the pre-D23 one. |

### Current digests

| File | SHA-256 |
|---|---|
| `gate1/business-spec.md` | `07afa02f157f34fde0c95c11417d03874e4b7626137eaee2b223c602b8ed52ff` |
| `gate1/acceptance.md` | `1d9b7a4eca76e3b375be85fea5d532c6194df8ef280770db12e47070126c4489` |
| `gate2/technical-spec.md` | `69c381499e33988add3073ecbac90769cc4ab8730ba585491fe4a98607300be6` |

Both Gate 1 digests changed on 2026-08-21 by D23's `AT-SHAPE-6` exception, and
**Gate 2's header now pins these exact Gate 1 digests** (v0.10), so the header
pins and the candidate bytes agree again.

The Gate 2 digest is `69c38149…` as of the 2026-08-21 v0.10 round-6
correction (it was `df4b8ec7…` at v0.9, `0f62d984…` at v0.8, `cdd07515…` at
v0.7, `645e5536…` at v0.6, and `5f4edd7a…` at v0.5). Re-check at any time:

```sh
shasum -a 256 wiki/gate1/business-spec.md wiki/gate1/acceptance.md wiki/gate2/technical-spec.md
```

Traceability is now **current**: Gate 2 §13 traces exactly the 68-case set,
and the `AT-SHAPE-6` row, AD-24, and §12.3/§17.2 all match D23's one-release
scoping (verified 2026-08-21). See [acceptance cases](index/acceptance-cases.md).

---

## Resolved: the vertical-release conflict with frozen Gate 1

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

## Review state: v0.10 is not reviewed

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
changed three times since, the round-5 receipt is void for v0.10; its six remaining
findings (evidence-gate consistency, traceability rows not pointing at real
tests, rollback behavior, recovery-credential verification, status reporting,
and stale version references) are still unresolved design work, untouched by
either correction.

[`sources/reviews/gate2-v0.9-round6.review.json`](sources/reviews/gate2-v0.9-round6.review.json)
then reviewed `df4b8ec7…` and failed with one blocker, one major finding, and
one minor finding. v0.10 (`69c38149…`) corrects all three in candidate text:
Slice 2's unauthored-leaf red state no longer deadlocks the lint-format release
test suite, freeze happens once through §17.1 rather than again after Slice 15,
and `AT-PRESENCE-2` now tests only enforceable recovery preconditions and
declared-class disclosure. This voids the round-6 receipt for the new bytes; a
fresh review is still required.

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
round-6 candidate-review findings without changing Gate 1.

1. **Resolve the remaining round-5 findings.** Six findings from the round-5
   review are still open and untouched by the D22 or D23 corrections: evidence-
   gate consistency, traceability rows not pointing at real tests, rollback
   behavior, recovery-credential verification, status reporting, and stale
   version references. These need product-design resolution before a clean
   review is plausible.
2. **The intent owner signs Gate 1 at the current digest.** Stage B step 6 — a
   physical signature act only the intent owner can perform, over the Gate 1
   digests recorded above. See [Gate 1 signing](topics/gate1-signing.md).
3. **Run a fresh exact-digest review after the remaining corrections.** The
   next receipt must bind the then-current Gate 1 and Gate 2 digests and pass
   cleanly. Feed the sealed reviewer only Gate 1, Gate 2, and its fixed
   adversarial prompt.
4. **Mark Gate 2 `FROZEN`** and pin the passing reviewed digest once the review
   and Gate 1 signature both exist.
5. **Slice 1** — build `scripts/check-advanced-spec.js` and wire it ahead of the
   code tests, implementing D23's exception exactly as scoped (lint-format
   only, this release). See [the specification gate](topics/specification-gate.md).
6. **Execute the approved lint-format production path** — build the authored-service gate
   enough to evaluate this exact leaf, complete the §7.6 manifest/resume/removal
   contract for its write path, add distribution/released-tag install proof, and
   produce a fresh exact-digest leaf review before claiming support.
   See [the lint-format roadmap](specs/lint-format-roadmap.md).
7. **Before the next leaf ships,** return to grilling to define the general
   "evaluate only what a release ships" mechanism D23 deliberately deferred —
   D23 itself expires at the next release.

Step 1 requires product-design resolution of the round-5 findings; step 2
requires the intent owner. Implementation remains blocked until the governing
gate freezes.

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
| 8 | Catalogue authoring: all 115 leaves one at a time, single context. Not parallel, not templated. | [the authored-service gate](topics/authored-service-gate.md) |

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
