---
date: 2026-09-01
source: agent
topics: user-presence-approvals, trust-and-failure-boundaries
decisions:
status: current
supersedes:
tags: trap, interdependency
summary: Onboarding apply now re-verifies an SSHSIG approval receipt against a repository-owned allowed-signers file; the self-asserted `verified: true` Boolean is gone, and landing it needs a Gate 1 unfreeze for two frozen test fixtures.
---

# Path B hardening, Issue 1 — approval receipts must be authenticated

## The problem

`rig/lib/onboarding.js` treated `receipt.approval.verified === true` as evidence
that a human had approved the proposal. That Boolean is supplied by the same
caller that supplies the rest of the request. Anyone who could reach `apply`
could write `{ schema_version: 1, kind: 'plan-approval', plan_digest: <the
current digest>, approval: { method: 'external-sshsig', verified: true } }` and
the onboarding would project skills and graft into repository-owned files.

Everything else in the apply path was already bound tightly — the receipt had to
carry the current proposal digest, the catalogue digest had to still match, the
revision had to be current. All of that binds the approval to *this* proposal.
None of it establishes that a *person* produced the approval. The receipt was a
container with no contents.

Rig already solved the same problem once, for policy activation
(`rig/lib/policy.js`, `docs/advanced/operator.md`: "A JSON `verified: true`
assertion is not accepted"). Onboarding was the odd one out.

## What was reused rather than invented

`rig/lib/policy.js` exports `verifySshsig({ allowedSigners, identity,
namespace, message, signature })`. It shells out to `ssh-keygen -Y verify`
against an OpenSSH allowed-signers file and returns `{ method, identity,
declared_class, fingerprint }` or throws. No new crypto, no new dependency, no
new file format — onboarding calls the same function policy activation does.

`policy.js` has no dependency on `onboarding.js`, so the new require introduces
no cycle.

## The chosen namespace and message

```
namespace: rig-plan-approval
message:   rig-plan-approval\ndigest=<proposal digest>\n
```

Two separate bindings, deliberately. The namespace stops a signature made for
`rig-policy-activation` (the only other SSHSIG namespace Rig uses) from being
replayed as a plan approval — `ssh-keygen -Y verify` refuses a namespace
mismatch outright. The digest inside the message stops a signature made for one
proposal from being relabelled onto another: `approvalRecord` re-derives the
message from `state.proposal.digest`, never from anything in the receipt, so
editing `plan_digest` on a valid receipt cannot make it verify.

The allowed-signers file lives at `.rig/allowed-signers`, repository-owned. The
installer never writes it. It ships `.rig/allowed-signers.example.md` instead —
markdown, because Tier 1 installs are markdown-only end to end and
`tests/rig-bootstrap.test.js` enforces exactly that. The doc deliberately avoids
a single-backticked `.rig/...` reference to the live file, because the same test
asserts every backticked `.rig/` path in a Tier 1 body exists after install.

## The refusal paths

`apply` now refuses, before any mutation and before the unresolved-decision
gate, when:

1. the receipt is malformed, or its `plan_digest` is not the current proposal
   digest — unchanged;
2. `approval.method` is `host-native`. No host ships an attestation this process
   can re-verify, so the path hard-refuses rather than trusting an opaque blob.
   It stays in the accepted method list so the refusal names the real gap
   ("no configured verifier") instead of reading like a schema typo;
3. `.rig/allowed-signers` is missing. Absent verifier means no approval, not
   automatic approval. This is the one that would have been easy to get
   backwards;
4. the signature does not verify — wrong namespace, wrong digest, unlisted
   identity, absent signature.

On success the stored trust envelope is `{ proposal_digest, method: 'external-sshsig',
identity, fingerprint, receipt_digest }`. `verified` is gone from it entirely;
`identity` and `fingerprint` come from the verifier's return value, not from the
receipt, so state records who actually signed rather than who the receipt
claimed.

## The interdependency this exposed

`tests/helpers/path-b.js` is in the signed Gate 1 manifest
(`wiki/gate1/testing-infrastructure.manifest`). Its `approval(planDigest)`
factory *constructs* the exact forgery this change rejects, and every positive
apply/check case in the frozen Path B suite goes through it. The hardening plan
assumed only Task 6 would touch frozen bytes; it does not hold for Task 1.

There is no way around it. The frozen tests call the frozen helper, and the
helper cannot produce a real signature without knowing the target directory it
must write `.rig/allowed-signers` into. Every alternative considered was worse:
a target-less module-global in the helper is racy; a require-time patch from
`hermetic-git-env.js` is the RIG-137 anti-pattern (test-shaped machinery
weakening production trust) in a new costume; and a production-side escape hatch
for "no allowed-signers" is the vulnerability again.

So the new signing helper lives in `tests/helpers/path-b-approval.js` — new,
unfrozen surface — and the frozen diff is held to six lines: the helper imports
`signApproval`, `applyAndCheck` uses it and returns the receipt as
`approvalReceipt`, and the idempotent-re-apply case replays that same receipt
rather than minting a second key (a second key would append a second
allowed-signers line and break that case's byte-identical-tree assertion). No
frozen assertion is relaxed. The fabricated `approval()` factory stays, because
the negative cases still need a plausible fake to hand `apply`.

The request is filed at
`wiki/gate1/unfreeze-requests/2026-09-01-path-b-approval-receipts.md` with the
computed `--confirm-digest-delta`. Per the hardening plan, only the human key
holder runs `scripts/approve-gate1.js`; this work stops at the request.

## State at the time of writing

`node --test tests/*.test.js` reports 654 tests, 653 passing. The single failure
is the oracle-verification case asserting that the Gate 1 signature still
covers the manifest — precisely the condition the unfreeze request exists to
resolve. Nothing is committed until it is.
