# Handoff — Tier 2 Advanced, 2026-07-28

For the next agent picking this up on another machine. Read this, then
`spec/business-spec.md` → `acceptance.md` → `spec/technical-spec.md`.

Route through `rig/tier-1/routing.md` first, as `CLAUDE.md` requires. The work
below sits at the **Gate 2 → freeze** boundary, so `rig-product-design` owns it
until Gate 2 freezes, and `rig-implementation` takes over after.

---

## 1. Where the project actually is

Gate 1 was re-grilled on 2026-07-28 and is frozen at **52 cases** (was 45). The
lifecycle revision `D11`-`D18` added removal, install-failure, report-disclosure,
and secret-handling behavior that Gate 1 had never stated, and fixed one defect
in `D10`. Read the 2026-07-28 revision note in both Gate 1 files first; the
rationale and the rejected alternatives are in the `GA-12` log entry.

Gate 2 (`spec/technical-spec.md`) is **reopened by that revision**. It is v0.3,
written against the 45-case set, and its header pins the two superseded Gate 1
digests. It is not a candidate for freeze in that state — it must be rewritten
against the 52-case set before anything else. No implementation may begin
against it.

Freeze blockers, in order:

1. **Gate 2 rewritten against the 52-case set**, with the traceability table
   matching all 52 IDs exactly and the Gate 1 digests in its header re-pinned to
   the values in §3.
2. **A clean fresh-model review at that new digest.** Every existing receipt is
   void — see §4. This is the blocker most likely to be misread as done.
3. **The intent owner's Gate 1 signature over the Gate 1 message.** Not yet
   produced. Exact commands in §5.

Everything else on the old blocker list moved to §16.2 as *release* blockers,
because a freeze condition that depends on implementation output deadlocks the
project: Gate 2 could not freeze until the work it authorises was finished, and
that work could not start until it froze. v0.2 had that shape. Do not merge the
two lists back together.

## 2. The eight locked design decisions

These were settled one at a time with the intent owner and were expensive to
obtain. Do not silently re-open them; they are recorded at length in the Gate 2
`AD-` table and rejected-approaches list.

| # | Decision |
|---|---|
| 1 | **Claim status** is a declared `status` field per `{host, axis}`, cross-checked against its evidence bundle **in both directions**. No file anywhere enumerates the advertised hosts. |
| 2 | **Signer interface** is SSHSIG verified by `ssh-keygen -Y verify`. D19 removed the FIDO-only type check and downgrade ceremony: the required property is a key no agent on the intent owner's machine can operate without a live human act, with the declared key class disclosed. |
| 3 | **Repository identity** for user-global writes is a generated ID stored clone-locally under `git rev-parse --git-path rig/`, never committed. |
| 4 | **Gate cadence:** `npm test` keeps the spec gate first and short-circuiting with no exemption input; `npm run test:code` is the daily signal. |
| 5 | **Different-model proof:** a wrapper writes model/digest/timestamp into review receipts; the agent supplies findings only. |
| 6 | **Gate 1 integrity is non-git** — SSHSIG signature over the Gate 1 digest message. No branch protection, no upstream comparison, no "reviewed commit". |
| 7 | **Distribution:** install stub fetches a released tag by name. No fingerprint pin — the stub and source share an origin, so a pin defeats nothing. Never `curl \| sh`. |
| 8 | **Catalogue authoring:** all 115 leaves one at a time, single context. Not parallel, not templated. |

## 3. Current digests

| File | SHA-256 |
|---|---|
| `spec/business-spec.md` | `604e80bd7eac9a6e24827d8a6ca2b7214015185b08832df734dfb43e8b8040a2` |
| `acceptance.md` | `ee9f80b907a0b948f669011c0f3e51d1a91c4c4f7f876123a5986e23f6ce3ff1` |
| `spec/technical-spec.md` | `75bfc8a09ffac829b04f6b97cdc660cbfb0d32fe441f319bf90eb36f3e5d146c` |

The first two are pinned in the Gate 2 header and **no longer match** — Gate 2
still carries the 2026-07-27 values. That is expected: Gate 2 is reopened, and
re-pinning is part of rewriting it, not a separate errand. Do not re-pin the
header while leaving the body written against 45 cases; a matching digest over
stale content is worse than a visibly stale one.

## 4. Review state — read this carefully

`reviews/` holds two receipts. **Neither is valid for the current file.**

| Receipt | Bound to | Result |
|---|---|---|
| `gate2-v0.3-round1-6279bf02.review.json` | `6279bf02` (stale) | pass — 3 minor, 0 blockers |
| `gate2-v0.3-round2.review.json` | `d8b7ba8d` (stale) | pass — 2 minor, 0 blockers |

Round 3 was started against the then-current bytes and **was killed before
writing a receipt**. Gate 2 has therefore never been reviewed in its present
form, and its present form is itself now superseded by the 2026-07-28 Gate 1
revision. Both receipts and the abandoned round 3 are historical only.

Do not treat any existing pass as covering the file you will produce. Review
after the Gate 2 rewrite, not before:

```sh
node scripts/review-receipt.js \
  --target project-dev-docs/current/spec/technical-spec.md \
  --gate1 project-dev-docs/current/spec/business-spec.md,project-dev-docs/current/acceptance.md \
  --model claude-opus-4-8 \
  --out project-dev-docs/current/reviews/gate2-v0.3-round3.review.json
```

It takes several minutes; run it in the background. The wrapper starts a fresh
non-interactive reviewer session and binds its receipt to the reviewed bytes.

## 5. The Gate 1 signature (intent owner only)

This cannot be delegated to an agent — that is the entire point of D10. The
intent owner signs with a key that no agent on their machine can operate without
a live human act. D19 records that OpenSSH verification proves only the signature
and listed key, not hardware presence, so the key class is attested and disclosed
beside the signer identity.

```sh
printf 'rig-gate1-freeze-v1\nbusiness-spec.md %s\nacceptance.md %s\n' \
  "$(shasum -a 256 project-dev-docs/current/spec/business-spec.md | cut -d' ' -f1)" \
  "$(shasum -a 256 project-dev-docs/current/acceptance.md   | cut -d' ' -f1)" \
  > /tmp/gate1.msg

PUBKEY=/path/to/public-key.pub
PRINCIPAL=vaibhav
{
  printf '# key class attested by the intent owner: Secure Enclave, biometric per signature\n'
  printf '%s namespaces="rig-gate1" %s\n' "$PRINCIPAL" "$(awk '{print $1" "$2}' "$PUBKEY")"
} > project-dev-docs/current/gate1.allowed-signers

ssh-keygen -Y sign -f "$PUBKEY" -n rig-gate1 /tmp/gate1.msg
mv /tmp/gate1.msg.sig project-dev-docs/current/gate1.sig
```

Verify:

```sh
ssh-keygen -Y verify -f project-dev-docs/current/gate1.allowed-signers \
  -I "$PRINCIPAL" -n rig-gate1 \
  -s project-dev-docs/current/gate1.sig < /tmp/gate1.msg
```

The signers file must use OpenSSH's actual allowed-signers grammar:
`namespaces="rig-gate1"` before the key type. Do not put `verify-required` or
`no-touch-required` there; they are not valid allowed-signers options. A readable
ordinary on-disk key does **not** satisfy this case: an agent could read it and
re-sign its own Gate 1 edits, which is the one attack D10 exists to stop.

## 6. Ordered next steps

1. **Rewrite Gate 2 against the 52-case set.** The 2026-07-28 revision adds a
   removal path with an install manifest, managed-block markers, and
   pre-modification copies; resumable partial installs; local-only findings with
   no artifact upload and no detail in CI logs; deterministic secret detection
   with opt-in model triage; session-scoped delegation with nothing persisted;
   and an armed/unarmed specification gate. The manifest and markers are now
   load-bearing at install time, not only at uninstall — `AT-SHAPE-1` requires
   them at the moment of every write.
2. Run the review (§4) against the rewritten file. Triage findings; amend Gate 2
   if warranted, which changes the digest and voids the receipt — that is the
   mechanism working.
3. Intent owner signs (§5).
4. Mark Gate 2 `FROZEN` and pin the reviewed digest.
5. **Slice 1** — `scripts/check-advanced-spec.js`: Gate 1 signature check first,
   then authority, traceability set equality at **52**, placeholder rejection,
   receipt validation. Wire ahead of the code tests in `npm test`; add
   `npm run test:code`. The signature check implements `D17`: signer identity
   present means a missing or non-verifying signature **fails**; no signer
   identity means run and report Gate 1 unprotected. Do not write the earlier
   behavior where a missing signature merely warns — that was the defect this
   revision closed.
6. Transcribe all 52 cases into substantive tests. See the warning in §7 about
   the existing test files.
7. Slices 2–14 per Gate 2 §13, re-derived against the rewritten Gate 2.

## 7. Traps discovered the hard way

- **The default branch is `prod`.** `origin/main` does not exist. Conductor's
  workspace metadata says `main` and is wrong. Nothing may reference
  `main`/`master`.
- **`node --test <missing-file>` prints "Could not find" and exits 0.** A
  traceability row naming a deleted test file reads as green. Gate 2 §12 and §9
  now require stat-ing every named target; implement that, do not trust exit
  codes.
- **The committed suite is green and means nothing.** 238 pass, and
  `advanced-catalogue`/`advanced-services` pass 6/6, while 432 files still
  contain `TODO(Slice 10)`. The tests assert inventory and non-emptiness, and a
  file containing the literal text `TODO` is non-empty. Those 19
  `tests/advanced-*.test.js` files are **calibrated to pass against placeholder
  content** — they are not a foundation to extend, and a meaningful rewrite must
  make most of them fail first.
- **`npm test` has no spec gate yet.** Until Slice 1 lands, green tells you
  nothing about specification health.
- **Commit `8dcaa49` is mislabelled.** Titled "Implement Advanced a-la-carte
  catalogue and delivery CLI", it actually contains the 432 placeholders and the
  implementation built against the withdrawn design. Do not read it as delivered
  work.
- **`sow.md` and `tasklist.md` are stale.** They were updated for `D10` and the
  delegated-edit ruling, not for `D11`-`D18`. They describe no removal path, no
  install manifest, and the old delegated-edit persistence. They are subordinate
  documents and cannot override Gate 2, but the specification gate checks for
  contradictions — bring them forward when Gate 2 is rewritten, not before.
- **`rg` is not installed** in this workspace; use `grep -RIn`.
- **Concurrent sessions have edited these files.** Re-read before editing and
  check digests after; a session on another machine amended Gate 1 and Gate 2
  while this one had uncommitted changes. It merged cleanly, but verify rather
  than assume.

## 8. The sequencing question is closed

The previous handoff asked the intent owner to confirm whether the
delegated-policy-edit ruling was the last Gate 1 revision before freeze. It was
not. A deliberate sweep for unstated behavior on 2026-07-28 produced seven
questions and eight rulings (`GA-12`), all answered in one session by the intent
owner.

That sweep is complete and nothing from it is left open. The queue it worked
through was: repo-side uninstall and its restore semantics; delegation
revocation; user-editable invariant clauses; install atomicity; report location
and disclosure; secret content reaching the model; and the missing-signature
behavior of the gate. No item was deferred.

The honest expectation to set: this closes the *known* gaps in stated intent. It
does not promise that Gate 2 design work will surface none — D10 itself came out
of Gate 2 design. If one appears, it returns here rather than being absorbed,
and that is the pipeline working rather than a failure of this freeze.
