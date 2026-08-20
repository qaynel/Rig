# Status — checked 2026-08-20

Where the project actually is. Every line below was checked against the files on
this date, not copied from another document.

Time-sensitive by design. When it goes stale, rewrite it — do not add a revision
note. Permanent things belong in [`topics/`](topics/); dated things belong in
[`reasoning/`](reasoning/).

---

## The one-line version

Gate 1 is finished and frozen at **49 acceptance cases**. Gate 2's round-3
review failed on four findings; the deliberate lint-format vertical-slice probe
(intent owner-agreed, see [`reasoning/2026-08-19-lint-format-vertical-slice.md`](reasoning/2026-08-19-lint-format-vertical-slice.md))
confirmed the blocker finding live in the running code, and it is now resolved
in both Gate 2's candidate text and `rig/lib/apply.js` — see
[`reasoning/2026-08-20-resolve-at-install-1.md`](reasoning/2026-08-20-resolve-at-install-1.md).
Three major/minor findings from round 3 remain open, and a fresh round-4
review has not been run. No further code may be written until Gate 2 freezes.

---

## Gate standing

| | State |
|---|---|
| **Gate 1** — [`gate1/business-spec.md`](gate1/business-spec.md) + [`gate1/acceptance.md`](gate1/acceptance.md) | **Frozen**, 49 cases. Last amended 2026-08-19 by D20. |
| **Gate 2** — [`gate2/technical-spec.md`](gate2/technical-spec.md) | **Candidate v0.5. Not frozen.** Written against the current 49-case set. Implementation may not begin. |
| **Gate 1 signature** | **Unarmed.** Neither `gate1.sig` nor `gate1.allowed-signers` exists anywhere in the repository. |

### Current digests

| File | SHA-256 |
|---|---|
| `gate1/business-spec.md` | `5f26ce2b9438ac5c11efafe07b0612647fd64d8b5c4d3ab4fa2342a1bf7d5da0` |
| `gate1/acceptance.md` | `9ec0ac94238063b808e1b01bdc2c5b142d2b7c9410cb5d0ef2663d9baa4a86f7` |
| `gate2/technical-spec.md` | `4926f253673e7daee73a4e8a76576a47620d618fa68832a943ec02683cbcdcc3` |

The Gate 2 digest changed from `c0333c36…` on 2026-08-20 when §6.6, §10, and
AD-10 were edited to resolve the round-3 blocker finding (see below). Both
Gate 1 digests still **match** the pins in the Gate 2 header — this edit did
not touch Gate 1. Re-check at any time:

```sh
shasum -a 256 wiki/gate1/business-spec.md wiki/gate1/acceptance.md wiki/gate2/technical-spec.md
```

Traceability is also correct: Gate 2's table covers exactly the 49 live case IDs,
no more and no fewer. See [acceptance cases](index/acceptance-cases.md).

---

## The blocker: round 3 failed — one finding now resolved in candidate text

[`sources/reviews/gate2-v0.5-round3.review.json`](sources/reviews/gate2-v0.5-round3.review.json)
was bound to `c0333c36…`, the technical-spec bytes as they stood through
2026-08-19. That receipt is now **void** — not because it was wrong, but
because the bytes it reviewed have changed (§6.6, §10, AD-10) to fix the exact
contradiction it caught. This is the mechanism working: an edit that resolves
a finding changes the digest and voids the receipt that found it.

| Severity | Where | The contradiction | Status |
|---|---|---|---|
| ~~blocker~~ | §6.6 / §10 / AD-10 vs §7.6 | Two incompatible answers for the same failure. §6.6/§10/AD-10 said a failed apply rolls everything back; §7.6 and `AT-INSTALL-1` say applied writes stay in place and the install resumes. The lint-format vertical-slice probe confirmed the running code did the rollback thing and produced no manifest at all. | **Resolved 2026-08-20.** §6.6, §10, and AD-10 now state the manifest-and-resume model as the only failure behavior; the rejected-approaches list names the rollback branch explicitly. `rig/lib/apply.js` implements the `.rig/install-manifest.jsonl` record-before-mutate/resume mechanics for the write path apply already exercises. See [`reasoning/2026-08-20-resolve-at-install-1.md`](reasoning/2026-08-20-resolve-at-install-1.md). |
| major | AD-30 / §8.4 vs D19 | D20 recovery credentials are described as "hardware-backed" without qualification, when D19 established that no SSHSIG key type proves hardware presence. Gate 2 discloses this limitation for the other two signers and not for this one. `AT-PRESENCE-2` also has no test for an agent registering a fraudulent recovery key while holding a valid credential. | Open. |
| major | §1 / `AT-BASE-2` vs §11.1 / AD-26 | §1 says the policy is evaluated "wherever a verified host surface exists", while §11.1 bans `verified` as host/axis vocabulary and `AT-CLAIM-1` greps for it. The two senses are never disambiguated. | Open. |
| minor | §8.8 vs `AT-SECRET-1` | Enabling model-assisted triage is supposed to let matched content reach the agent, but no channel is described through which it could, so the case has no mechanism to test. | Open. |

Full text of the original finding is in the void receipt. Three findings
remain open; Gate 2 cannot freeze until all four are resolved and a fresh
review passes at the final bytes.

### Older receipts, both void

| Receipt | Bound to | Verdict |
|---|---|---|
| [`gate2-v0.4-round1`](sources/reviews/gate2-v0.4-round1.review.json) | `2028f911…` (superseded) | fail, 2 findings |
| [`gate2-v0.4-round2`](sources/reviews/gate2-v0.4-round2.review.json) | `31a430e6…` (superseded) | fail, 4 findings |

Round 2 is the review that produced [policy-signer recovery](topics/policy-signer-recovery.md) —
it found a recovery ceremony in Gate 2 with no Gate 1 requirement behind it, and
the intent owner chose to grill the requirement rather than strip the capability.

---

## Ordered next steps

1. **Resolve the remaining three round-3 findings** in Gate 2. The blocker
   (rollback vs. resume) is done — see above. AD-30/§8.4 vs D19,
   §1/`AT-BASE-2` vs §11.1/AD-26, and §8.8 vs `AT-SECRET-1` are still open.
2. **Re-review** at the new digest:
   ```sh
   node scripts/review-receipt.js \
     --target wiki/gate2/technical-spec.md \
     --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
     --out wiki/sources/reviews/gate2-v0.5-round4.review.json
   ```
   Takes several minutes; run it in the background. The wrapper starts a fresh
   non-interactive reviewer and binds the receipt to the reviewed bytes itself.
3. **The intent owner signs Gate 1.** Cannot be delegated — that is the entire
   point of D10. See [Gate 1 signing](topics/gate1-signing.md) for the ceremony.
4. **Mark Gate 2 `FROZEN`** and pin the reviewed digest.
5. **Slice 1** — build `scripts/check-advanced-spec.js` and wire it ahead of the
   code tests. See [the specification gate](topics/specification-gate.md).
6. **Slices 2–15** per Gate 2 §14. See [the delivery plan](topics/delivery-plan.md).

Steps 1, 2, 4, 5 are agent work. **Step 3 is the intent owner's alone.**

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
| 115 catalogue leaves | **1 authored** (`development.code-quality.lint-format`, the vertical-slice probe — current state and ordered path to production tracked in [its own roadmap](specs/lint-format-roadmap.md)). 428 files still contain `TODO(Slice 10)`. |
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
- **Gate 1 and Gate 2 contain relative links to the pre-wiki layout.** Neither
  file was edited during the move, deliberately, so their digests still verify.
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
