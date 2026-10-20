# QA closeout — acceptance evidence per blocker

Prepared 2026-10-20 for the owner and the independent reviewer. This is the
evidence index for the blockers in
[the follow-up](qa-prod-closeout-followup.md) and the failed binding review. It
is not a receipt, a signature, or an approval. The owner signs the oracle and
authorizes any further review attempt; no agent did either.

How to read it: each blocker names the acceptance criterion, the maintained
test that exercises it at the real boundary, and the command that reproduces
the result. Logs live under `.context/` (ignored) and are bound to the exact
candidate commit by the final-byte runs listed at the end.

## Blockers that need only the owner's signature

The frozen Gate 1 text and tests still describe the pre-6.0.0 contract (version
5.0.0, 55 staged skills, the retired generic-baseline sentence, plan-digest
consent). Product behavior follows the recorded owner decisions instead, so the
live gate is red on exactly eight frozen cases until the amendment is signed:
`AT-LF-7`, `AT-LF-8`, `AT-LF-9`, `AT-LF-13`, `AT-LF-14`, `AT-LF-20`,
`AT-LF-24` and the active-corpus pin in `AT-PB-1`.

| Evidence | Result |
| --- | --- |
| `binding-review-owner.patch` applies to the live frozen files | `git apply --check` passes |
| Amended oracle, run in an isolated mirror with the patch bytes | 74/74 oracle cases, gate tests and Path B install/catalogue: 91/91 |
| Unsigned verifier on the amended bytes | 16 manifest files, 95 acceptance cases, all digests match |
| Every pre-existing acceptance title | Unchanged and in the original order; no accepted ID dropped |
| Active corpus pin | 1,042 files, `759b7cc73baa241fb47a79cbd270244bc9d4229272ccb4973261d324bf2456f5` |

Reproduce the mirror run:

```sh
node --test .context/2026-10-20-owner-candidate/tests/advanced-oracle.test.js \
  .context/2026-10-20-owner-candidate/tests/advanced-spec-gate.test.js \
  .context/2026-10-20-owner-candidate/tests/path-b-catalog.test.js \
  .context/2026-10-20-owner-candidate/tests/path-b-install.test.js
```

## Follow-up groups C1–C8

| Group | Acceptance | Maintained evidence |
| --- | --- | --- |
| C1 | Replacement after last validation survives; macOS and Linux resume | `tests/migrate-v5.test.js` 49/49, including both post-validation substitution cases and the interrupted-publication resume |
| C2 | Replay conflict handling | `migration replay refuses edits…` cases in the same file |
| C3 | Installed guidance resolves the installed helper; mode drift detected | `approved installed review guidance runs its installed helper and detects mode drift`, `tests/upstream-shelf.test.js` |
| C4 | Empty reselection freezes the binding-file preimage | `empty service reselection refuses a post-approval binding-file edit`, `tests/catalogue-installed.test.js` |
| C5 | Upstream receipt bound to applied evidence | `tests/upstream-onboarding.test.js` |
| C6 | Malformed global configuration refused | `tests/global-mcp-writes.test.js` |
| C7 | Reporter PATCHes a matching issue; no duplicate POST | `tests/health-workflow.test.js` |
| C8 | Current authorities match the signed oracle | `tests/catalogue-documentation-policy.test.js`, wiki checks |

## Binding-review findings

| Finding | Resolution | Evidence |
| --- | --- | --- |
| Frozen prose versus signed tests (AT-SHAPE-6, DIST-1, PB-3/6) | Owner amendment prepared; signature pending | Mirror run above |
| Authored catalogue; executable versus convention declarations | All 115 identities declare their catalogue disposition; repeated cue blocks removed (0 remain); installed good/bad/grade matrix | `tests/catalogue-installed.test.js` (installed matrix: 115/115 services discriminate configuration across every grade); `tests/advanced-catalogue.test.js` |
| Policy status reported protected when disabled | Empty, switch-disabled, legacy network-disabled and malformed-category policies report unprotected with named reasons | `tests/advanced-baseline.test.js`, `tests/release-blockers.test.js`; `.context/binding-delta-runtime-probes.cjs` now reports `protected: false` for the legacy and malformed probes |
| Host contract proofs were self-generated | Supported hooks Rig does not install are reported as available but not integrated; shared adapter no longer overwrites user files at five paths | `tests/advanced-hosts.test.js`, `tests/host-contract-parity.test.js`; candidate AT-HOST-1 inspects landed bytes for all 19 writers |
| Plan digest used as consent identity | Per-approval nonce bound by SSHSIG; replay refused | Candidate AT-LF-20 |
| Context violations passed Evidence; later commands ran after a mutation | A failing or contradictory review halts before Evidence; a mutating command stops the run with changed-path evidence | `tests/lint-grade-receipts.test.js`; candidate AT-LF-7/8/9 |
| No signer setup or recovery registration ceremony | Signed setup, hardware-class recovery credential registration, rotation and recovery with a reverified chain; public CLI actions added today | `tests/policy-recovery-registration.test.js` 7/7; candidate AT-PRESENCE-2 |
| Uninstall verification trusted caller records | Public `verification` verdict from journaled preimages versus actual bytes | `tests/install-uninstall-roundtrip.test.js`, `tests/basic-uninstall*.test.js` |
| Thin frozen stand-ins (AT-P1, AT-P4, AT-GATE-2) | Candidate cases drive real install, 19 marker-driven hosts, six executed CI commands, wrong-namespace SSHSIG and a code sentinel | Mirror run above |

Defects found and fixed during this closeout, none of them bypassed:

- Migration dropped the new `pinned_adapter` projection, so a migrated tree
  lacked the Cursor and `.agents` rule files a fresh install writes.
- The `signer-challenge`, `signer-setup`, `recovery-key` and `recovery-register`
  policy actions were implemented in the library but not reachable from the CLI.
- The uninstall verification listed one row per recorded path and overflowed
  the child-process buffer on a runtime install; it now reports counts plus only
  the paths that need attention.
- A literal security-key class name tripped the repository secret scan.

## Honest limits

- Security-key recovery is proven against a synthetic authenticator protocol
  checked by the real OpenSSH verifier. No physical touch is claimed.
- The first signer of a repository with no signer list is trusted on first use,
  and plan approvals verify against the repository-local `.rig/allowed-signers`.
  Both roots live in files a writer to the repository can change, exactly as the
  earlier policy signer list did. An out-of-band pinned root is a product
  decision for the owner, not something this candidate claims.
- A superseded signer vouches only for the one activation receipt recorded in
  its signed rotation or recovery event; security-key approvals must carry the
  signed user-verification flag, which Rig checks itself because
  `ssh-keygen -Y verify` cannot require it.
- Local CI-command proof does not prove a remote provider run.
- The remaining shared sentence in 86 service identities is a disposition line,
  not guidance; reviewers may still ask for more service-specific wording.

## Owner-only steps

See the [owner runbook](owner-runbook.md): apply and sign the amendment,
renew the full gate, authorize one more binding review attempt, push, make
`gate1-pin` required, merge, prove the QA commit, promote, tag and close.
