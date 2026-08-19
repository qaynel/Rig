# Status — checked 2026-08-19

Where the project actually is. Every line below was checked against the files on
this date, not copied from another document.

Time-sensitive by design. When it goes stale, rewrite it — do not add a revision
note. Permanent things belong in [`topics/`](topics/); dated things belong in
[`reasoning/`](reasoning/).

---

## The one-line version

Gate 1 is finished and frozen at **49 acceptance cases**. Gate 2 has been
rewritten to match, has been reviewed at its exact current bytes, and **the
review failed**. Fixing those findings is the next job. No code may be written
until Gate 2 freezes.

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
| `gate2/technical-spec.md` | `c0333c368613574e5010e69641ed284da35556a37ea575c0b40b0abe2edce2a6` |

Both Gate 1 digests **match** the pins in the Gate 2 header. Gate 2 is written
against the right bytes. Re-check at any time:

```sh
shasum -a 256 wiki/gate1/business-spec.md wiki/gate1/acceptance.md wiki/gate2/technical-spec.md
```

Traceability is also correct: Gate 2's table covers exactly the 49 live case IDs,
no more and no fewer. See [acceptance cases](index/acceptance-cases.md).

---

## The blocker: round 3 failed

[`sources/reviews/gate2-v0.5-round3.review.json`](sources/reviews/gate2-v0.5-round3.review.json)
is bound to `c0333c36…` — **the current technical-spec bytes**. It is a live
receipt, not a historical one, and its verdict is **fail** with `AT-INSTALL-1`
unresolved.

This is the single most misreadable fact in the project. Earlier receipts were
void because they were bound to superseded bytes. This one is not void. It is a
current, valid review that says the current document is wrong.

| Severity | Where | The contradiction |
|---|---|---|
| **blocker** | §6.6 / §10 vs §7.6 | Two incompatible answers for the same failure. §6.6 says a failed apply rolls everything back; §7.6 and `AT-INSTALL-1` say applied writes stay in place and the install resumes. Permission denial mid-apply hits both. Slice 12's own test cannot pass against §6.6 as written. |
| major | AD-30 / §8.4 vs D19 | D20 recovery credentials are described as "hardware-backed" without qualification, when D19 established that no SSHSIG key type proves hardware presence. Gate 2 discloses this limitation for the other two signers and not for this one. `AT-PRESENCE-2` also has no test for an agent registering a fraudulent recovery key while holding a valid credential. |
| major | §1 / `AT-BASE-2` vs §11.1 / AD-26 | §1 says the policy is evaluated "wherever a verified host surface exists", while §11.1 bans `verified` as host/axis vocabulary and `AT-CLAIM-1` greps for it. The two senses are never disambiguated. |
| minor | §8.8 vs `AT-SECRET-1` | Enabling model-assisted triage is supposed to let matched content reach the agent, but no channel is described through which it could, so the case has no mechanism to test. |

Full text in the receipt. Fixing these edits Gate 2, which changes its digest,
which voids this receipt — that is the mechanism working, not a problem.

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

1. **Resolve the four round-3 findings** in Gate 2. The blocker needs a real
   ruling on where rollback ends and resume begins — it is not a wording fix.
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
| `.github/workflows/publish.yml` | **Still present.** Must be deleted before a release can be tagged. |
| `package.json` version | **`4.8.4`**, private. Gate 2 §12.4 requires `5.0.0`. |
| `scripts/review-receipt.js` | **Exists and works.** |
| 115 catalogue leaves | **0 authored.** 432 files still contain `TODO(Slice 10)`. |
| `tests/advanced-*.test.js` | **19 files, all green, all worthless.** Calibrated to pass against placeholder content. |

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

- **[`specs/roadmap.md`](specs/roadmap.md) is stale.** Checked 2026-08-13. It
  says 52 checks (now 49), describes the verified/emitted host tier that the
  2026-08-17 amendment removed, and pins superseded digests. Its plain-language
  stage structure is still sound; its facts are not.
- **[`specs/sow.md`](specs/sow.md) and [`specs/tasklist.md`](specs/tasklist.md)
  are stale.** Written for D10 and the delegated-edit ruling, not for D11–D20.
  They describe no removal path, no install manifest, and the old delegated-edit
  persistence. Subordinate documents, so they cannot override Gate 2 — but the
  specification gate checks for contradictions, so they must be brought forward
  when Gate 2 freezes, not before.
- **Gate 1 and Gate 2 contain relative links to the pre-wiki layout.** Neither
  file was edited during the move, deliberately, so their digests still verify.
  See [the path map](index/path-map.md) for the translation.
