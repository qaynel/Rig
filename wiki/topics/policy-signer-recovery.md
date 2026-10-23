# Policy-signer recovery (retired: one trust root)

**Retired 2026-10-20.** The owner locked [one trust root](../reasoning/2026-10-20-one-trust-root-owner-decision.md):
the key that signs the Gate 1 lock is the only key Rig verifies, and the only
key that signs, approves, or recovers anything. The separate policy-signer
setup, recovery registration, rotation, and recovery ceremony described by D20
no longer exist in Rig, nor do trust-on-first-use, `trust.json`, and a
repository-local allowed-signers list. D20 is withdrawn by D29 in the proposed
Gate 1 amendment; until the owner re-signs that amendment the frozen text still
describes D20 and `AT-PRESENCE-2` still names it.

## What it is now

Plan approvals, lint-format plan and setup approvals, and policy activation all
verify against `.rig/trust/gate1.allowed-signers`, the installer-shipped copy of
the Gate 1 public key. The file holds exactly one key. An approval signed by any
other key or under any other identity is refused with no side effect, and a
signer list or trust record planted elsewhere in a repository changes nothing.
If the Gate 1 key is lost, Rig offers no recovery.

## Why it is this way

Every extra signer mechanism is an extra way to approve. A first-signer
fallback, a repository-writable list, and a recovery ceremony each let someone
other than the Gate 1 key holder become the approver. One root removes those
questions instead of hardening each one.

## What binds it

North star decision 13 in `CLAUDE.md`; `AD-30` in Gate 2 §8.4 as rewritten;
`rig/lib/trust-root.js`; `tests/trust-root.test.js`. The owner amendment that
rewrites `AT-PRESENCE-2` and withdraws D20 is prepared under
[candidate amendments](../specs/close-everything/candidate-amendments/one-trust-root-owner.patch).

## What was rejected

Deferring a pinned root and recording trust-on-first-use as a product limit was
the earlier recommendation; the owner replaced it. Recovery by pre-registered
hardware credential (the D20 design, GA-14) is withdrawn with it.
[Rejected approaches](../index/rejected.md) · [Advanced grilling GA-14](../sources/logs/advanced-grilling.md#ga-14--policy-signer-recovery-2026-08-19) (historical)
