# AT-LF-20 nonce-bound approval candidate

Owner-review artifact only. It does not modify the signed Gate 1 test file or
authorize a binding review. Apply [the patch](AT-LF-20-nonce-approval.patch)
only after approving and re-signing the frozen oracle.

The runtime contract this patch targets is:

- `createPlanApprovalChallenge(plan)` returns a random 256-bit `approval_id`
  and a message signing both that ID and `plan_digest` in the
  `rig-plan-approval` namespace.
- `executePlan(plan, receipt)` accepts only a schema-v1 `plan-approval`
  receipt whose SSHSIG verifies against the target's `.rig/allowed-signers`.
- First use of a verified receipt executes; exact receipt replay is refused;
  a separately challenged and signed receipt for the same unchanged plan can
  execute.
- The caller's plan digest is recomputed at execution. No caller-set `used`
  flag or `verified` boolean substitutes for signature verification.

The candidate patch also updates AT-LF-14 and AT-LF-24 call sites, which
previously supplied digest-only objects and would fail before reaching their
drift or boundary assertions. It leaves AT-LF-7/8/9 out of scope pending the
owner's Context/Evidence runtime API and result shape.

The independent probe at
[`AT-LF-20-nonce-approval.probe.candidate.js`](AT-LF-20-nonce-approval.probe.candidate.js)
lives outside `tests/` so it cannot silently change the signed test oracle.
After owner approval and Gate 1 re-signing, run:

```sh
node wiki/specs/close-everything/candidate-amendments/AT-LF-20-nonce-approval.probe.candidate.js
```

It generates only a disposable Ed25519 key and temporary repository, first
proves the red case (a digest-only caller object is refused), then proves the
green cases (exact-receipt replay refusal and fresh-receipt acceptance), and
removes its temporary files. The expected code/test compatibility point is the newly
exported `createPlanApprovalChallenge` API; the legacy digest-only approval
producer must not be passed into `executePlan`.
