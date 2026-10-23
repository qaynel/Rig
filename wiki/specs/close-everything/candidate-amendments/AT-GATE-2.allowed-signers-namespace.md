# Candidate amendment — restrict Gate 1 allowed-signer namespace

**Status: CANDIDATE, unsigned.** `scripts/check-advanced-spec.js`, its
manifest digest, and the frozen Gate 1 test remain unchanged until the owner
applies this amendment and re-signs the oracle.

The current verifier runs `ssh-keygen -Y verify` with `-n rig-gate1`, but an
allowed-signers entry without a `namespaces=` option matches signatures in
every namespace. Require the selected principal's allowed-signers entry to
contain exactly `namespaces="rig-gate1"` before invoking `ssh-keygen`. Reject
missing, wrong, wildcard, or broader namespace lists. Keep the existing
single-principal and key checks.

The signed Gate 1 checker test should cover all three cases:

1. `namespaces="rig-gate1"` accepts a valid oracle signature.
2. No `namespaces=` option is rejected before signature verification.
3. A different or broader namespace restriction is rejected.

The independent, currently passing probe at
`allowed-signers-namespace-probe.candidate.test.js` demonstrates the present gap:
the verifier accepts a valid `rig-gate1` signature when the key entry has no
namespace restriction. It is not part of the frozen oracle manifest.
