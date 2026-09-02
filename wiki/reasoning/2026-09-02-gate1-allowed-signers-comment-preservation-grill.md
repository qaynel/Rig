---
date: 2026-09-02
source: agent
topics: gate1-signing
decisions:
status: current
supersedes:
tags: trap
summary: Grill for the fix to approve-gate1.js clobbering human comment lines in gate1.allowed-signers on every re-sign; tests are red, three low-risk defaults proposed, awaiting owner sign-off.
---

# Grill — `approve-gate1.js` eats comments in `gate1.allowed-signers`

## Trigger

QA/prod deploy review of the Path B branch (see
`2026-09-02-path-b-qa-prod-deploy-review.md`) flagged this as borderline /
signature-adjacent. Grilled because the failure sits in the Gate 1 signing
ceremony and "what correct means" was not settled.

## Problem

`approveGate1()` ends with an unconditional template write:

```js
fs.writeFileSync(
  path.join(root, 'wiki/gate1/gate1.allowed-signers'),
  `${PRINCIPAL} namespaces="${NAMESPACE}" ${publicKey}\n`,
);
```

The file currently carries a five-line `# key-class:` provenance block recording
that the Secure-Enclave key rotation (`5694fd7b`) was authorized but not adopted.
`refreshManifest` sets `rearming = true` whenever `gate1.sig` exists, so **every**
`node scripts/approve-gate1.js` run is a re-sign, and every re-sign silently
deletes that block. The comment already vanished once — that is why the review
caught it.

## Desired outcome

Running the approval helper preserves human-authored comment lines in
`gate1.allowed-signers` verbatim and in order, still writes exactly one current
principal line (the key just signed with, not a stale one), and the resulting
oracle still verifies with `node scripts/check-advanced-spec.js`.

## Users and rules

- Only the Gate 1 key holder runs this. They annotate `gate1.allowed-signers`
  with key provenance (hardware vs file-based, rotation history).
- `gate1.allowed-signers` is **not** in the oracle freeze digest.
  `proposedOracleMessage` / `oracleMessage` cover only `business-spec.md`,
  `acceptance.md`, and `testing-infrastructure.manifest`. So changing how the
  file is written moves no signed value; the fix and its tests need no re-sign.
- Signature verification (`ssh-keygen -Y verify -f gate1.allowed-signers`)
  tolerates `#` comment and blank lines, and `signerPrincipals()` already
  filters them (`check-advanced-spec.js:55,61`). Preserving comments is
  verification-safe — established by reading the verifier, not assumed.

## In scope

- The final `writeFileSync` of `gate1.allowed-signers` in `approveGate1()`.
- A regression test (added to `tests/gate1-approval-script.test.js`).

## Out of scope

- The oracle freeze digest, `oracleMessage`, `refreshManifest`, the signing
  call, Secretive-agent handling — untouched.
- Any `.allowed-signers` format change beyond comment/blank-line preservation.
- Migrating the key-class note out of the file (considered and rejected below).

## Acceptance examples (observable)

1. **Comment preserved across re-sign.** Given `gate1.allowed-signers` with a
   `# key-class: ...` block (and a trailing blank line) above the `gate1-owner`
   line, after `approveGate1()` every original `#` line and the blank line are
   still present, in order, and the oracle verifies (exit 0).
2. **Principal line refreshed, not duplicated.** After `approveGate1()` the file
   has exactly one non-comment / non-blank line, and it is
   `gate1-owner namespaces="rig-gate1" <current public key>`.
3. **Key rotation replaces the stale principal line.** Given an existing file
   whose principal line carries key A plus a comment block, running with signing
   key B yields a principal line for key B, no trace of key A, and the comment
   block intact.
4. **No comments is still fine.** A file with only the principal line produces
   the same single principal line; no regression for the comment-free case.
5. **Fresh arm.** With no prior `gate1.allowed-signers`, the helper creates it
   with just the principal line and the oracle verifies.

## Testing infrastructure

Two tests appended to `tests/gate1-approval-script.test.js`, reusing its
`tempRoot()` / `makeKey()` harness:

- `re-signing preserves human comment lines in gate1.allowed-signers` — covers
  examples 1–3.
- `an unexpected non-owner principal line is not silently dropped` — covers
  decision D2 below.

Both are **red** against current code (`node --test
tests/gate1-approval-script.test.js` → `# pass 6 # fail 2`). Examples 4–5 already
hold and stay green (existing "signs the canonical oracle message" test plus the
comment-free path).

## Technical specification

Not a Path B capability — a script bug fix — so no `rig-product-design`
technical spec is required. The load-bearing design facts are the two established
above (file not in freeze digest; verifier tolerates comments).

## Open decisions blocking the freeze

- **D1 — preservation rule.** Proposed default: keep every line that is not a
  principal line (`#` comments *and* blank lines) in original order, then append
  exactly one fresh principal line last. Alternative: leading comment block only.
  Reversible, low-risk → take the default.
- **D2 — foreign principal line.** If `gate1.allowed-signers` contains a
  non-`gate1-owner` principal line, proposed default: **fail loudly** and write
  nothing, rather than silently preserve or silently drop it. The script only
  ever manages one principal. Reversible, low-risk → take the default.
- **D3 — test shape.** Proposed default: integration tests in the existing
  approval-script harness (above). Alternative: extract a pure
  `mergeAllowedSigners(existingText, principalLine)` helper and unit-test it.
  The integration form already works and matches the file's conventions → take
  the default; extract the helper only if the fix gets awkward inline.

## Rejected

- **Treat `gate1.allowed-signers` as purely generated; move the key-class note
  to a reasoning trace.** Rejected: the annotation describes the exact key in
  that file; separating them means the next person re-adds it by habit and the
  clobber risk returns.
- **Only rewrite when the public key changed.** Reasonable, but strictly more
  logic than D1 for the same observable outcome; folded into "append one fresh
  principal line" which is correct whether or not the key moved.

## Status

Awaiting owner sign-off on D1–D3 (all proposed as defaults). No implementation
written. `#3` from the same review (gitignore `.superpowers/`, untrack
`task-1-report.md`) is done in this change.
