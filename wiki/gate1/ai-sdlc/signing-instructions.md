---
status: current
checked: 2026-10-24
owner: rig-grilling
---

# Signing the AI-SDLC contract

One ceremony, one key, four commands. You do not need to know how the signer
works. Everything below runs from the repository root.

## 1. What you are signing

30 files: the requirements and acceptance criteria, the proving-test manifest,
the customer journeys, the traceability validator, and all 24 test files that
prove the criteria. The exact list and digests are in
[`contract.manifest`](contract.manifest).

| Protected | Why |
|---|---|
| `wiki/specs/ai-sdlc-harness/15-gate1-contract.md` | 84 requirements and their primary acceptance criteria |
| `wiki/specs/ai-sdlc-harness/16-test-manifest.md` | the 30 fixtures and each proving test's home |
| `wiki/specs/ai-sdlc-harness/17-customer-lifecycle.md` | the 20 journeys the criteria roll up to |
| `rig/catalog/baseline/check-traceability.js` | the validator that enforces the one-to-one mapping |
| `tests/traceability-invariant.test.js`, `tests/ai-sdlc/*` | the proving tests and their shared harness |

**Not protected, deliberately:** the technical design
(`18-system-interactions.md`), the architecture, the work packages and the
reuse plan. Those stay editable, which is what lets implementation proceed
without re-signing.

The ceremony signs this exact message:

```
rig-ai-sdlc-freeze-v1
contract.manifest 7b521ba3d4e8d335897bc47dcb8ce4f4f86b34621489d53123b48f3ab452bf06
```

Its SHA-256 is `2b2dc1287194224cfbbfeeb7c432997068fd699e5ed9c4462aaaa610ab03f56c`.
If a protected byte changes before you sign, the ceremony refuses and prints the
new digest to confirm; that is the intended behaviour, not a fault.

## 2. Check the graph and the baseline first

```sh
node scripts/check-traceability.js
```

Expected: `84 requirements, 84 primary criteria, 84 proving tests, 30 fixtures,
20 journeys, 11 packages — graph complete`. The ceremony runs this itself and
refuses before producing any signature if it is red.

```sh
env -u GITHUB_TOKEN -u GH_TOKEN npm test
```

Expected: the complete local repository gate is green. Removing the optional
tracker credentials keeps this pre-signing check bound to repository bytes;
the live 6.0 release tracker has already advanced beyond this workspace's
candidate declarations and is checked separately at its release boundary.

```sh
node --test tests/ai-sdlc/*.test.js
```

Expected without hardware/archive evidence: **88 tests, 14 pass, 74 fail.** Of
the failures, 71 are the preimplementation red for capabilities that do not
exist yet and three name the missing hardware or public-archive evidence. This
lane is outside `npm test` by construction.

## 3. Sign

```sh
node scripts/approve-gate1.js lock --programme ai-sdlc
```

This reads your key from `RIG_GATE1_SIGNING_KEY`, or from `.context/gate1.env`
if you keep it there — the same configuration the 6.0.0 oracle already uses. No
new key, no new signer, no new trust root.

**Security-key interaction.** If `RIG_GATE1_SIGNING_KEY` points at a
hardware-backed `sk-ssh-ed25519@openssh.com` key, `ssh-keygen` will prompt for
your touch or PIN once. On macOS with Secretive, the agent socket is selected
automatically. If you sign with a software key, there is no prompt.

If the command prints `contract digest confirmation required`, a protected byte
changed since this page was written. Read the printed delta, and if it is what
you intend, rerun with the exact digest it gives you:

```sh
node scripts/approve-gate1.js lock --programme ai-sdlc --confirm-digest-delta <printed-digest>
```

## 4. Verify

```sh
node scripts/approve-gate1.js status --programme ai-sdlc
```

Expected: `ai-sdlc contract protected: principal=gate1-owner`.

Then confirm the 6.0.0 oracle is still intact and unchanged:

```sh
node scripts/approve-gate1.js status
```

Expected: `Gate 1 protected: principal=gate1-owner fingerprint=SHA256:…` followed
by `Oracle verified: 16 files, 95 acceptance cases`. The new ceremony writes
only `wiki/gate1/ai-sdlc/`; it never touches `wiki/gate1/gate1.sig`,
`testing-infrastructure.manifest`, `business-spec.md` or `acceptance.md`.

## 5. If it fails

| Symptom | Meaning and fix |
|---|---|
| `set RIG_GATE1_SIGNING_KEY` | The key is not configured. Copy `.credentials/gate1.env.example` to `.context/gate1.env` and point it at your key. |
| `RIG_GATE1_SIGNING_KEY does not exist: <path>` | The path is wrong, or a removable security key is not plugged in. Nothing was signed and no second signer was enrolled. |
| `the configured signing key is not the enrolled Gate 1 key` | You are signing with a different key. Rig has one trust root; use the enrolled key or re-run the 6.0.0 ceremony first. Do not add a second signer. |
| `traceability graph is incomplete` | A requirement, criterion, test, journey or package mapping is broken. The message lists the exact IDs. Fix them and start again; nothing was signed. |
| `contract digest confirmation required` | Protected bytes changed. Read the delta, then rerun with the printed digest. |
| `ai-sdlc contract signature does not verify` | The manifest or signature was edited after signing. Re-run step 3; the previous signature is void. |
| `changed protected file: <path>` | Someone edited a protected file after signing. Revert it, or amend the whole protected set by re-signing. |

Nothing in this ceremony is destructive to the 6.0.0 track. If anything goes
wrong, delete `wiki/gate1/ai-sdlc/ai-sdlc.sig` and start from step 2.

## 6. After you sign

Signing authorises the design and implementation phase, not the implementation
itself. The coordinator handoff — `COORDINATOR.md`, the execution order, the
integration and CI plan, and one self-contained brief per work package — is
prepared only after the signature exists and only on your word to begin.
