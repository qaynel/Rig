# Handoff — Tier 2 Advanced, 2026-07-27

For the next agent picking this up on another machine. Read this, then
`spec/business-spec.md` → `acceptance.md` → `spec/technical-spec.md`.

Route through `rig/tier-1/routing.md` first, as `CLAUDE.md` requires. The work
below sits at the **Gate 2 → freeze** boundary, so `rig-product-design` owns it
until Gate 2 freezes, and `rig-implementation` takes over after.

---

## 1. Where the project actually is

Gate 1 is frozen at **45 cases**. Gate 2 (`spec/technical-spec.md`) is at
**v0.3 CANDIDATE — not frozen, not currently reviewed**. No implementation may
begin against a candidate.

Two freeze blockers remain, and only two. Both are in §16.1:

1. **A clean fresh-model review at the current digest.** There is none right
   now — see §4 below. This is the blocker most likely to be misread as done.
2. **The intent owner's FIDO signature over the Gate 1 message.** Not yet
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
| 2 | **Signer interface** is SSHSIG verified by `ssh-keygen -Y verify`. FIDO floor by default; ordinary keys only via a one-time FIDO-authorized downgrade ceremony, disclosed in status forever after. |
| 3 | **Repository identity** for user-global writes is a generated ID stored clone-locally under `git rev-parse --git-path rig/`, never committed. |
| 4 | **Gate cadence:** `npm test` keeps the spec gate first and short-circuiting with no exemption input; `npm run test:code` is the daily signal. |
| 5 | **Different-model proof:** a wrapper writes model/digest/timestamp into review receipts; the agent supplies findings only. |
| 6 | **Gate 1 integrity is non-git** — FIDO signature over the digest. No branch protection, no upstream comparison, no "reviewed commit". |
| 7 | **Distribution:** install stub fetches a released tag by name. No fingerprint pin — the stub and source share an origin, so a pin defeats nothing. Never `curl \| sh`. |
| 8 | **Catalogue authoring:** all 115 leaves one at a time, single context. Not parallel, not templated. |

## 3. Current digests

| File | SHA-256 |
|---|---|
| `spec/business-spec.md` | `960f7722e8b4bd6d962f547ba0266f7d21bbbed4a37c262b6f9d827a7fd93214` |
| `acceptance.md` | `995897aa8ccd88a7ede2255eecafb08e9451328ad087c0e096472798e780eb01` |
| `spec/technical-spec.md` | `75bfc8a09ffac829b04f6b97cdc660cbfb0d32fe441f319bf90eb36f3e5d146c` |

The first two are pinned in the Gate 2 header and **currently match**. If you
change Gate 1, re-pin them or the gate is incoherent.

## 4. Review state — read this carefully

`reviews/` holds two receipts. **Neither is valid for the current file.**

| Receipt | Bound to | Result |
|---|---|---|
| `gate2-v0.3-round1-6279bf02.review.json` | `6279bf02` (stale) | pass — 3 minor, 0 blockers |
| `gate2-v0.3-round2.review.json` | `d8b7ba8d` (stale) | pass — 2 minor, 0 blockers |

Round 3 was started against the current bytes and **was killed before writing a
receipt**. Gate 2 has therefore never been reviewed in its present form, which
includes the §16 freeze/release split, the delegated-policy-edit mechanism, and
the missing-test-target rule.

Do not treat the round 2 pass as covering the current file. Re-run:

```sh
node scripts/review-receipt.js \
  --target project-dev-docs/current/spec/technical-spec.md \
  --gate1 project-dev-docs/current/spec/business-spec.md,project-dev-docs/current/acceptance.md \
  --model claude-opus-4-8 \
  --out project-dev-docs/current/reviews/gate2-v0.3-round3.review.json
```

It takes several minutes; run it in the background. The wrapper refuses to run
if `--model` matches the authoring model declared in the Gate 2 header.

## 5. The FIDO signature (intent owner only)

This cannot be delegated to an agent — that is the entire point of D10. The
intent owner runs it on a machine with their hardware key attached.

```sh
printf 'rig-gate1-freeze-v1\nbusiness-spec.md %s\nacceptance.md %s\n' \
  "$(shasum -a 256 project-dev-docs/current/spec/business-spec.md | cut -d' ' -f1)" \
  "$(shasum -a 256 project-dev-docs/current/acceptance.md   | cut -d' ' -f1)" \
  > /tmp/gate1.msg

ssh-keygen -Y sign -f ~/.ssh/id_ed25519_sk -n rig-gate1 /tmp/gate1.msg
mv /tmp/gate1.msg.sig project-dev-docs/current/gate1.sig
```

`gate1.allowed-signers` holds the public identity, options before keytype:

```
<principal> verify-required sk-ssh-ed25519@openssh.com AAAA...
```

Verify:

```sh
ssh-keygen -Y verify -f project-dev-docs/current/gate1.allowed-signers \
  -I <principal> -n rig-gate1 \
  -s project-dev-docs/current/gate1.sig < /tmp/gate1.msg
```

The key must be a FIDO type (`sk-*`) without `no-touch-required`. An ordinary
on-disk key does **not** satisfy this case: an agent could read it and re-sign
its own Gate 1 edits, which is the one attack D10 exists to stop.

## 6. Ordered next steps

1. Re-run the review (§4). Triage findings; amend Gate 2 if warranted, which
   changes the digest and voids the receipt — that is the mechanism working.
2. Intent owner signs (§5).
3. Mark Gate 2 `FROZEN` and pin the reviewed digest.
4. **Slice 1** — `scripts/check-advanced-spec.js`: Gate 1 signature check first,
   then authority, traceability set equality at 45, placeholder rejection,
   receipt validation. Wire ahead of the code tests in `npm test`; add
   `npm run test:code`.
5. Transcribe all 45 cases into substantive tests. See the warning in §7 about
   the existing test files.
6. Slices 2–14 per Gate 2 §13.

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
- **`rg` is not installed** in this workspace; use `grep -RIn`.
- **Concurrent sessions have edited these files.** Re-read before editing and
  check digests after; a session on another machine amended Gate 1 and Gate 2
  while this one had uncommitted changes. It merged cleanly, but verify rather
  than assume.

## 8. Open question for the intent owner

Gate 1 has been revised four times in two days: D1–D9, D10, and the
delegated-policy-edit ruling. Every revision voids the pins and every review
receipt. Freezing while revisions are still landing simply re-opens the gate.

**Confirm the delegated-policy-edit ruling is the last one before freeze**, or
expect another review cycle. This is a sequencing decision, not a product one,
and it is the cheapest thing on this page to get wrong.
