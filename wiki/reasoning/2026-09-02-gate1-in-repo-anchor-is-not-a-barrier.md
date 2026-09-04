---
date: 2026-09-02
source: agent
topics: gate1-signing
decisions:
status: historical
supersedes:
tags: trap, security, interdependency
summary: Owner asked whether an agent can just add itself to the signers list and bypass the gate. Yes — and worse, replacing the file wholesale leaves exactly one principal, so the proposed single-principal fix never fires. No in-repo check can constrain an actor who writes the whole repo; the anchor must move outside the agent's write scope (CI secret + required check, or owner-signed commits).
---

# The in-repo pin is a deterrent, and this project already rejects deterrents

Follows `2026-09-02-gate1-human-presence-what-is-checkable.md`. The owner asked
the question that breaks the design:

> Can't an agent just add itself to the allowed signers list and still bypass the
> human gate keeping?

Yes. And the sharper version — *replace* rather than *add* — defeats the fix
specified one turn earlier.

## Demonstrated (reproduced, not argued)

With the proposed single-principal rule in mind, the agent does **not** append.
It overwrites `gate1.allowed-signers` with one line carrying its own key, keeping
the principal name `gate1-owner`, rewrites `acceptance.md`, and re-signs:

```
owner armed  : SHA256:zXN62edy7RYuuP9rt6EFWRWTM0SkK+5ucyplfCQomHs
after replace: SHA256:dB+80gdj/vaRedNqVmy1ddGqye/71Ju61SL9S7tp5Y0 | principals: 1
acceptance now: # acceptance: REWRITTEN by the agent
```

Verifier output: `Gate 1 protected: principal=gate1-owner`. Exactly one
principal, so the single-principal check never fires. The **only** observable
difference anywhere is the fingerprint string.

## Why no in-repo fix exists

This is a trust-anchor bootstrapping problem, not a bug. Every input the verifier
consults — the signers file, the signature, the manifest, the verifier's own
source — lives in the repository. An actor with write access to the repository
can rewrite all of them consistently. Adding more in-repo checks adds more files
the same actor rewrites in the same commit. **The anchor must live somewhere the
agent cannot write, or there is no barrier.**

## The project's own standard already condemns this

`wiki/index/rejected.md` rejects "an unsigned digest pinned in Gate 2" with:

> Forces a visible multi-file edit, so it is an audit trail and a deterrent. It
> is not a barrier, and this product does not describe deterrents as protection.

The in-repo signature pin is in exactly that category. The previous turn's
framing — "the defence is that the fingerprint changes, which is a conspicuous
diff" — is a description of a deterrent. It was filed as a residual weakness in
the handoff; by the project's own rule it should have been filed as the headline
defect. Correcting that here.

## Current state of the anchors (checked, all absent)

- `.github/workflows/*.yml` contains **no** reference to `check-advanced-spec`,
  `gate1`, or any fingerprint comparison. CI does not verify the pin.
- `git log --show-signature -1` on `HEAD` reports `N` — commits are unsigned, so
  there is no commit-level human anchor either.
- Nothing outside the repo records the expected fingerprint in a form any
  automated check consults. The wiki copies are for human comparison only.

So today the entire barrier is "a human notices a one-line diff."

## Options

**A — CI-side fingerprint pin (recommended).** Store the expected fingerprint as
a repository secret; a CI step asserts the verified fingerprint equals it, and
that job is a *required* status check under branch protection. The agent cannot
read or write repository secrets, and cannot neutralise the check by editing the
workflow, because a required check that never reports blocks the merge rather
than passing it. Cost: one workflow step, one secret, one branch-protection rule;
the owner updates the secret when rotating keys. Converts deterrent into barrier
at the merge boundary, which is the boundary that actually matters — tampering
only counts if it reaches the trusted branch.

**B — Require owner-signed commits on the protected branch.** GitHub enforces
that commits touching the branch carry the owner's verified signature. The agent
cannot forge it. This also delivers, at the merge boundary, the human-presence
property the owner wanted from FIDO — and unlike `verify-required` it does not
retire the current key. Cost: branch-protection config plus the owner signing
commits. Strong complement to A rather than an alternative.

**C — Deny the agent write access to the frozen paths locally.** A harness-level
permission rule refusing writes under `wiki/gate1/` and to the manifested files.
Cheap defence in depth for the local agent, but it is configuration the same
operator can relax, so it is not the anchor — it is a seatbelt.

**D — Accept it as a deterrent and say so.** Zero cost, but it contradicts the
rejected-index rule quoted above, and it would mean the gate's central claim
("an agent cannot move its own goalpost") is false as written.

## Consequence for the in-flight work

The two red tests remain worth landing — the single-principal rule closes the
*append* variant and turns a silent pass into a loud failure. But they must not
be described as closing the forgery. Neither the tests nor any verifier change
can, and the handoff has been corrected to lead with that rather than bury it.

## Status

Awaiting owner choice among A–D. Nothing about this is blocking the two red
tests, which can land independently.
