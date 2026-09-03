# Gate signing

## What it is

Once armed, gate integrity is an SSHSIG signature over the exact combined digests
of the **oracle** — the business spec, the acceptance file, and the testing
infrastructure that checks it — verified against a listed signer identity. Under
the one-gate model (2026-08-21) the signature covers the tests too, not only
intent and acceptance, because the tests are part of the frozen shell the code
adapts to. The intent owner attests that the key requires a live human act; the
artifact cannot prove its own key class. A locked oracle changes only by the key
holder re-signing — a quick act, never a full return to grilling. [D10/D17/D19](../gate1/business-spec.md) · [escape hatch](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md)

## Why it is this way

Repository process cannot protect intent from an agent that can modify the
repository and git state. A non-git signature moves the authority outside that
boundary. D19 corrected an impossible claim: SSH signature verification proves
identity, not hardware presence, so key-class assurance is explicitly the
owner's responsibility. [Advanced grilling GA-11](../sources/logs/advanced-grilling.md#ga-11--gate-1-integrity-mechanism-2026-07-26)

## What binds it

The revision sequence is `D5 → D10 → D17 → D19`; `AD-28` puts verification
first in the specification gate. `AT-GATE-2` and the Gate 1 integrity cases make
missing, malformed, stale, or non-verifying signatures fail once armed.
[Decision index](../index/decisions.md) [Acceptance index](../index/acceptance-cases.md)

`scripts/approve-gate1.js` is the local ceremony helper. It reads one
machine-local environment variable, `RIG_GATE1_SIGNING_KEY`, from the process or
from `.credentials/gate1.env`. A changed manifest or any re-sign first refuses,
prints the old/new manifested digest lines and the digest of the exact proposed
combined oracle, and requires that value back through
`--confirm-digest-delta`; no frozen byte or signature is written before that
confirmation. It then writes the canonical oracle message, invokes
`ssh-keygen -Y sign` in namespace `rig-gate1`, and only after a successful
signature writes `gate1.allowed-signers` and `gate1.sig`. `.credentials/` is
the one directory for local secret/env files; it is gitignored except for
tracked `*.example` files, so `.credentials/gate1.env.example` shows the
expected setting and the real `.credentials/gate1.env` (key path, not private
key material) never leaves the machine.

Changing a frozen test is a rare exception, not an ordinary edit. Before any
oracle byte changes, the requester copies and fills
[`unfreeze-request.template.md`](../gate1/unfreeze-request.template.md): the
test, proposed change, and proof that the assertion was wrong, the specification
changed, or a human is recording their rationale without an agent. The request
records evidence; the refreshed SSH signature is the key holder's authorization.
A tokenless human follows the same template and local-key command rather than
needing an agent or a separate recovery path. [2026-08-30 handoff](../reasoning/2026-08-30-development-process-handoff.md)

## What was rejected

Branch protection, upstream comparison, a repository-stored private key, TTY
confirmation, artifact claims of hardware presence, and a recovery path for the
Gate 1 signer were rejected. Gate 1 deliberately has no recovery mechanism.
[Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- How to sign, per platform: [signing instructions](../gate1/signing-instructions.md)
  — macOS, Windows, Debian, Fedora, Arch; key rotation (including the
  `GATE1_FINGERPRINT` secret step); troubleshooting.
- Frozen integrity rules: [Gate 1](../gate1/business-spec.md)
- Verification mechanism: [Gate 2 AD-28 and §10](../gate2/technical-spec.md#10-trust-safety-and-failure-boundaries)
- Owner ceremony sequencing: [status](../status.md#ordered-next-steps)

## Standing

The Path B amendment is **signed** (2026-09-01). Its business spec, 83-case
acceptance set, verifier, and expanded testing manifest are covered by the
current `gate1.sig`. The prior 73-case signature was superseded by the
re-sign that incorporated the Path B cases and the updated testing manifest.

No agent may run or simulate the approval helper. Any future oracle change
requires the same local key-holder ceremony.
[Path B acceptance oracle](../reasoning/2026-08-31-path-b-acceptance-oracle.md) ·
[Status](../status.md)

Commit `5694fd7b` rotated the signing key from a plain file-based key to a
Secretive-backed one (macOS Secure Enclave), and the owner confirmed that
rotation was theirs. When it came to actually re-signing, though, the owner
chose to keep the original file-based key rather than complete the switch —
the allowed-signers file carries that original key, not the Secretive one.
[Rotation authorization](../reasoning/2026-09-02-gate1-key-rotation-authorized.md) ·
[Key retained, not rotated](../reasoning/2026-09-02-gate1-key-rotation-not-adopted.md)

**Update (2026-09-02, rotation adopted):** the gate1 owner intentionally
changed the active signing key. The current key and its verification
fingerprint live in `wiki/gate1/gate1.allowed-signers` and are printed by
every `node scripts/check-advanced-spec.js` run — that pair is the complete
public record of which key is authoritative. Key custody and operational
access detail are kept outside this repository, in a private,
access-controlled system, not here.
[Rotation adopted](../reasoning/2026-09-02-gate1-key-rotation-adopted.md)

**Update (2026-09-02, later same day):** the stale "awaiting signature"
wording in both `acceptance.md` and `business-spec.md` is fixed (both
headers, plus `acceptance.md`'s §7 lead-in), and the oracle has been
re-signed under the original key — `node scripts/check-advanced-spec.js`
verifies clean again. Two unfreeze requests still await the human
authorization block:
`2026-09-01-path-b-approval-receipts.md` and
`2026-09-02-check-advanced-spec-83-cases.md`.
[Closeout gate trace](../reasoning/2026-09-02-path-b-branch-closeout-gate.md) ·
[wording-fix trace](../reasoning/2026-09-02-gate1-wording-fix-and-signing-instructions.md)

**Known defect (2026-09-02, grill turns 3–4 — superseded framing below):** the
ceremony's final `gate1.allowed-signers` write is an unconditional principal-line
template, so every re-sign silently deleted the human comment lines in the file.
That framing was **overtaken by a more serious finding**: `verifySignature` loops
over *every* principal in the file and passes on the first that verifies, so an
agent can append its own key line, move the oracle goalpost, re-sign with a key
it just generated, and the check reports "Gate 1 protected" with the owner's line
still in place. Reproduced end to end. The comment defect is a symptom of the
same mistake — treating a one-key pin as a hand-maintained register.

**Resolved this change:** the file is now a single generated pin line, comments
removed (the oracle still verifies without a re-sign, confirming it is outside
the freeze digest). Provenance lives here, in "Standing", below.

**Anchor chosen and built (2026-09-02, turn 6):** the owner chose the CI-side
anchor. `.github/workflows/gate1-pin.yml` runs
`.github/scripts/verify-gate1-pin.sh` — a checker that uses **no repository
code**, only `sha256sum`/`ssh-keygen`/`awk` — from the *base branch* under
`pull_request_target`, against a fingerprint held in a repository secret. Six
forgery attempts were run at it: the control passes and all five real attacks are
blocked, including the whole-file replacement that defeats the single-principal
fix and a fully self-consistent re-arm that the repo's own verifier accepts.
**Armed on production (2026-09-02):** the `GATE1_FINGERPRINT` repository secret
now holds the current owner-key fingerprint, `gate1-pin` is a strict required
GitHub Actions check, and production requires a pull request with administrator
enforcement and no direct, force-push, or deletion bypass. The trusted workflow
and checker were first bootstrapped to production, then a disposable
`pull_request_target` probe passed with the candidate's own checker altered;
the trusted base-branch checker and external pin are live at the merge boundary.
Local verification remains forgeable by a repository writer, by design: the CI
anchor, not the local result, is the enforcement authority. A
repository-administrator credential can still alter the secret or rule and is
outside the git-writer threat model.
[implementation and attack results](../reasoning/2026-09-02-gate1-ci-pin-anchor-implemented.md)
· [armed and verified](../reasoning/2026-09-02-gate1-ci-pin-anchor-armed.md)

**Finding that forced it (2026-09-02, turn 5):** the pin is a deterrent,
not a barrier, and the single-principal fix does not change that. An agent that
*replaces* the signers file with its own key (keeping the principal name) leaves
exactly one principal, so the fix never fires; it re-signs the rewritten oracle
and the check reports `Gate 1 protected: principal=gate1-owner`, with only the
fingerprint differing. Reproduced. No in-repo check can close this — every input
the verifier reads is repo-writable — and CI does not currently compare the
fingerprint, nor are commits signed. This project's own rejected index says an
audit trail "is not a barrier, and this product does not describe deterrents as
protection"; by that standard the gate's central claim does not hold until the
anchor moves outside the agent's write scope. Options and costs in the trace
below; **owner decision, open.**

**Still open (handed off):** the verifier must require *exactly one* principal —
structurally, not by name, because frozen `AT-GATE-2` signs as `owner` — and the
ceremony must refuse a foreign principal line. Two red tests carry this in
`tests/gate1-approval-script.test.js`. The verifier is itself a frozen manifest
file, so that half needs the unfreeze ceremony; the ceremony guard does not.
A passphrase-protected key proves nothing checkable (signatures are
byte-identical with and without one); only a FIDO `sk-` key plus
`verify-required` on the pin line enforces real human presence, and adopting it
would retire the current Ubuntu key.
[Comment-preservation grill](../reasoning/2026-09-02-gate1-allowed-signers-comment-preservation-grill.md)
· [turn 2: remove-list pushback](../reasoning/2026-09-02-gate1-allowed-signers-remove-list-pushback.md)
· [turn 3: demonstrated multi-principal forgery](../reasoning/2026-09-02-gate1-multi-principal-forgery.md)
· [turn 4: what "a human must sign" can be checked](../reasoning/2026-09-02-gate1-human-presence-what-is-checkable.md)
· [turn 5: the in-repo anchor is not a barrier](../reasoning/2026-09-02-gate1-in-repo-anchor-is-not-a-barrier.md)
· [handoff](../handoffs/2026-09-02-gate1-single-principal-pin.md)

Turn 2: the owner asked to drop the allowed-signers list and accept any
human-generated key. Rejected — `ssh-keygen -Y verify` needs a named key, and a
repo-writing agent can generate its own key and self-sign, so an unpinned gate
is forgeable by the agent it constrains. Narrowed instead to making
`gate1.allowed-signers` a purely generated one-line file with provenance kept
only in this hub. Awaiting owner confirmation; nothing signed or committed.

<!-- Reviewed 2026-09-02 during wiki-maintenance step 6; synced to the
     branch-closeout gate trace. -->

## Onboarding hardening amendment awaiting signature (2026-09-03)

The next oracle amendment is prepared at 95 active cases: eight concrete
onboarding hardening failures plus four recurrence-prevention themes. Both new
test files are in the stable manifest, the acceptance and traceability ID sets
match, and the tests deliberately remain red until implementation. The current
signature must remain stale; only the intent owner runs the approval ceremony.
[Prevention-oracle trace](../reasoning/2026-09-03-onboarding-hardening-prevention-oracle.md)

### Review blocked the 2026-09-03 signature (2026-09-03)

An independent report-only review of the prepared 95-case amendment found three
cases that cannot go green under their own technical spec (`AT-HD-3`'s fixture
mutates a path the bounded inventory harness never scans; `AT-HD-4` asserts
projection paths without the mandatory `rig-` prefix; `AT-HD-6`'s expected-error
regex does not match the error the harness actually raises), plus a
spec-versus-test contradiction on whether a broken verifier may record a hard
failure instead of throwing. Because a signed oracle can only be corrected
through an unfreeze request, the ceremony waits until the oracle bytes can pass.
[Oracle review trace](../reasoning/2026-09-03-onboarding-hardening-oracle-review.md)

### Oracle corrected under an unfreeze request; owner re-sign pending (2026-09-03)

The intent owner supplied an itemized correction for every review finding.
All eight corrections are applied to the two AT-HD-* test files plus
`tests/helpers/path-b.js` and `tests/advanced-oracle.test.js` (both also
frozen, both carrying pre-existing version-authority defects the hardening
work is meant to close). `node scripts/check-advanced-spec.js` correctly
reports the manifest digests as changed — the corrected bytes are unsigned by
design. The dated
[unfreeze request](../gate1/unfreeze-requests/2026-09-03-onboarding-hardening-oracle-corrections.md)
records the authorization and evidence trail; no SSH signing identity is
available in the environment that made these corrections, so the owner must
run `node scripts/approve-gate1.js` on a machine holding the gate1 signing
key before Phase 1 (production) implementation may begin.
[Phase 0 corrections trace](../reasoning/2026-09-03-onboarding-hardening-phase0-corrections.md)

### Oracle re-signed; CI trace-title drift fixed (2026-09-03)

The owner ran the re-sign ceremony on the Secretive-backed key; the corrected
95-case oracle (Phase 0) is now signed and `node scripts/check-advanced-spec.js`
reports the manifest clean. A follow-up
[code review](../reasoning/2026-09-03-code-review-and-trace-fixes.md) found
four `wiki/gate2/technical-spec.md` trace-row titles had drifted from the
Phase 0-corrected test titles (would have failed `verifyCoverage`'s exact-regex
check post re-sign) and fixed them in the same pass. Phase 1 (production
implementation of the AT-HD-* findings) is unblocked and in progress.
