---
date: 2026-10-20
source: intent owner
topics: gate1-signing, user-presence-approvals, review-receipts
decisions:
status: current
supersedes:
tags: trust, signing, north-star
summary: Owner locks one trust root — the Gate 1 key signs, approves and recovers everything; every other signer mechanism is deleted.
---

Owner decision: one trust root.

The key that signs the Gate 1 lock is the only signing key Rig uses. It is the
only key that signs, approves or recovers anything.

Do:
- Verify everything that needs a signature (plan approvals, policy, receipts)
  against the Gate 1 key.
- Delete every other signer mechanism: the separate policy-signer setup and
  recovery registration, the trust-on-first-use fallback, trust.json, and
  .rig/allowed-signers as an independent trust list.
- Remove the matching CLI actions, docs, and tests.
- Keep the Gate 1 sign and verify flow as it is.

This replaces the earlier recommendation to defer a pinned root. Nothing is
deferred: there is one root, and it is the Gate 1 key.

Record this as a North star item in CLAUDE.md and in the wiki in the same
change. Rerun all final-byte evidence on the new commit, since this is a code
change.
