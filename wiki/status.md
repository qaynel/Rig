# Status — checked 2026-08-21

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
release. This resolves the conflict this section previously described. **The
Gate 1 signature is now stale against the new digest** (below) and needs the
intent owner's re-signature (Stage B step 6) before Stage C hands the frozen,
signed intent to `rig-product-design` to re-trace `AT-LF-*` into Gate 2 §13.

Gate 2's round-3 review still failed on four findings; the blocker
(rollback vs. resume) is resolved — see
[`reasoning/2026-08-20-resolve-at-install-1.md`](reasoning/2026-08-20-resolve-at-install-1.md).
Three major/minor findings remain open, and a fresh round-4 review has not
been run; it must in any case wait for Gate 2's re-trace against the new
68-case set. See the
[lint-format production grilling audit](reasoning/2026-08-20-lint-format-production-grilling-audit.md).

---

## Gate standing

| | State |
|---|---|
| **Gate 1** — [`gate1/business-spec.md`](gate1/business-spec.md) + [`gate1/acceptance.md`](gate1/acceptance.md) | **Frozen**, 68 cases. Last amended 2026-08-21 by D21. |
| **Gate 2** — [`gate2/technical-spec.md`](gate2/technical-spec.md) | **Candidate v0.5. Not frozen.** Still written against the prior 49-case set; `AT-LF-*` is not yet traced into §13. Implementation may not begin. |
| **Gate 1 signature** | **Unarmed, and now stale against the new digest below.** Neither `gate1.sig` nor `gate1.allowed-signers` exists anywhere in the repository. Whenever the signer identity is armed, it must be signed at the current digest, not the pre-D21 one. |

### Current digests

| File | SHA-256 |
|---|---|
| `gate1/business-spec.md` | `5175be10ee35f0e9207883b15d0c5f12e82340d8ce93c7852b68e4579d91d545` |
| `gate1/acceptance.md` | `ffd493030c85b802e9445a918be0f6683dc02dd345c474d521a3cfed308af45b` |
| `gate2/technical-spec.md` | `5f4edd7adaf74f901d5f10216c9858b3c3544807baee4a46097e0bd74b182760` |

Both Gate 1 digests **changed on 2026-08-21** when D21 added `AT-LF-1`–
`AT-LF-19` and the lint-format release-boundary revision (see above). They no
longer match the pins in Gate 2's header, which is expected and is Gate 2's
job to re-trace, not this amendment's.

The Gate 2 digest changed from `c0333c36…` on 2026-08-20 when §6.6, §10, and
AD-10 were edited to resolve the round-3 blocker finding (see below), and then
changed again when `AD-24`/`AD-31` staged catalogue production vertically around
lint-format first. Re-check at any time:

```sh
shasum -a 256 wiki/gate1/business-spec.md wiki/gate1/acceptance.md wiki/gate2/technical-spec.md
```

Traceability is now **stale**: Gate 2's table covers only the prior 49 IDs and
does not yet trace `AT-LF-1`–`AT-LF-19`. Re-tracing to 68 is `rig-product-design`'s
job under the re-frozen Gate 1. See [acceptance cases](index/acceptance-cases.md).

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

1. **The intent owner re-signs Gate 1 at the new digest.** Stage A and Stage B
   of the [acceptance-authoring handoff](specs/lint-format-grilling-handoff.md)
   are done: D21 landed, expanding the frozen set to 68 cases. What remains is
   Stage B step 6 — a physical signature act only the intent owner can perform,
   over the digests recorded above. See [Gate 1 signing](topics/gate1-signing.md).
2. **Hand the frozen intent to `rig-product-design` (Stage C).** Re-trace
   `AT-LF-1`–`AT-LF-19` into Gate 2 §13, amend Gate 2 for the D21 release
   boundary, and re-freeze against the current 68-case digest.
3. **Resolve the remaining three round-3 findings** in Gate 2. The blocker
   (rollback vs. resume) is done — see above. AD-30/§8.4 vs D19,
   §1/`AT-BASE-2` vs §11.1/AD-26, and §8.8 vs `AT-SECRET-1` are still open.
4. **Re-review** at the final digest after Gate 1 and Gate 2 agree:
   ```sh
   node scripts/review-receipt.js \
     --target wiki/gate2/technical-spec.md \
     --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
     --out wiki/sources/reviews/gate2-v0.5-round4.review.json
   ```
   Takes several minutes; run it in the background. The wrapper starts a fresh
   non-interactive reviewer and binds the receipt to the reviewed bytes itself.
5. **Mark Gate 2 `FROZEN`** and pin the reviewed digest.
6. **Slice 1** — build `scripts/check-advanced-spec.js` and wire it ahead of the
   code tests. See [the specification gate](topics/specification-gate.md).
7. **Execute the approved lint-format production path** — build the authored-service gate
   enough to evaluate this exact leaf, complete the §7.6 manifest/resume/removal
   contract for its write path, add distribution/released-tag install proof, and
   produce a fresh exact-digest leaf review before claiming support.
   See [the lint-format roadmap](specs/lint-format-roadmap.md).

Steps 1 and 2 require the intent owner and `rig-product-design` respectively.
The other steps are agent work only after the governing gate permits them.

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
