# QA closeout — remaining acceptance work after fixes

Reviewed 2026-10-18 against the uncommitted implementation on HEAD
`082d8467504d51aeda4ad955e78ee33c67ba548a`.
**Changes required; no binding receipt or PR approval.** This is the active
fixing-agent delta to [the original eight-group criteria](qa-prod-closeout-review.md).
It does not add unrelated scope. Fix these as one batch, then verify the fix delta
and the unchanged delivery checklist. Historical evidence stays historical.

## C1 — High: temporary-file deletion still loses user data

At `rig/lib/migrate.js:131–133`, Python validates an opened inode, then unlinks
its mutable filename. Replacing that entry after validation deletes the
replacement. The primary independently reproduced `status: migrated` with both
the substituted temporary pathname and the sole original user pathname absent.
The user file had mode `0640`. Existing probes swap before the helper starts,
which does not exercise this remaining window.

Acceptance:

- [ ] A replacement after the last validation and immediately before actual
  deletion retains its exact bytes and mode. Migration must not report success
  after deleting user data. Another pathname check before unlink is insufficient.
- [ ] Cover normal and resumed cleanup at the actual mutation boundary in an
  editable regression. Safe retention with a named recovery state is acceptable
  where cleanup cannot guarantee ownership; it must retain resumability.
- [ ] Keep the already-correct publication, FIFO refusal, hardlink preservation,
  ancestor-swap and inventory/uninstall behavior green.

Reproduce: `node .context/verify-closeout/safety-unlink-boundary.cjs` (exit 1).
This injects a deterministic competing rename at the existing Python unlink
instruction inside a disposable repository; it changes no source files.
Primary log: `.context/verify-closeout/primary-unlink-boundary.log`.

## C1 — High: legitimate interrupted publication fails macOS recovery

`rig/lib/migrate.js:90–94` uses native `fclonefileat` on macOS. The clone has a
different inode from the temporary file, but resume requires equal inodes at
`:708`. The maintained test at `tests/migrate-v5.test.js:271` returns `refused`
instead of `migrated`. The primary independently reran that exact test.

Acceptance:

- [ ] A process interrupted immediately after successful final-record
  publication resumes successfully on macOS and Linux, with the correct
  transaction bytes and no unrelated-file mutation.
- [ ] Recognize owned publication leftovers according to the actual platform
  publication mechanism. Do not weaken the replacement-preservation criterion
  or discard a valid transaction to hide the failure.
- [ ] Run the existing regression below on both platforms; retain the actual
  unlink-boundary adversarial check above. Linux was not executed in this
  local macOS review; validate the hardlink publication/recovery path there.

Reproduce:

```sh
node --test --test-name-pattern='migration resume cleans the temporary hard link left after publication' tests/migrate-v5.test.js
```

Primary log: `.context/verify-closeout/primary-macos-resume.log` (one failure).

## C3 — Medium: documented optional-helper command still points elsewhere

`rig/catalog/skills/review/code-and-pull-request/review/design-checklist.md:12`
and companion `SKILL.md:1300` invoke
`~/.claude/skills/rig/bin/rig-diff-scope`. The newly installed approved helper
is `.rig/plumbing/bin/rig-diff-scope` (`rig/lib/onboarding.js:404`). A verified
fixture installation retains the obsolete command. Modes now preserve `0755`,
the actual installed shared helper executes, and mode drift is detected.

Acceptance:

- [ ] Adapt every affected documented invocation through the existing approved
  upstream patch/projection mechanism to resolve the actual installed helper.
  Keep pinned digests, metadata and any generated copies coherent.
- [ ] From an approved disposable install, execute the command taken from the
  installed guidance and assert useful helper output; no pre-existing global
  helper may satisfy the test accidentally.
- [ ] Maintain an editable installed-entrypoint test that asserts executable
  mode and detection of post-install mode drift. Receipt metadata alone does
  not prove the installed command works. Keep default optional-tree staging zero.

Evidence: `.context/verify-closeout/runtime-expanded-probe.log` and
`.context/verify-closeout/runtime-expanded-probe.cjs`.

## C4 — Medium: empty reselection skips approved output preimages

`rig/lib/service-catalogue.js:128–134` checks output preimages and ownership
only by iterating service bindings. An empty selection skips every check,
then `:152` still writes `.rig/service-bindings.json`. The primary reproduced:
prepare/propose empty selection, sign approval, edit the existing binding
file, apply/check. User bytes are replaced with `{}` and phase is `checked`.
The edit happens after approval, so it was not an approved replacement.

Acceptance:

- [ ] Freeze and validate the shared binding-file output preimage and Rig
  ownership independently of service count, including zero selected services.
- [ ] An edit after approval produces a named stale-output/ownership conflict
  and preserves the edited bytes/mode; no silent overwrite or checked result.
- [ ] Keep clean owned nonempty-to-empty reselection clearing active checks.
  Retain smaller selections, dependencies, edited-guidance warnings, safe
  apply/retry and uninstall preservation.
- [ ] Add the public post-approval-edit regression to editable tests.

Reproduce: `node .context/verify-closeout/service-reselection-after-approval-probe.cjs`
(exit 1). Evidence: matching `.log` in the same directory.

## C8 — Medium: current catalogue authorities still claim unsigned amendments

`wiki/topics/authored-service-gate.md:4–9` says the generic-baseline assertion
and active corpus pin await unsigned amendments.
`wiki/topics/catalogue-contract.md:13` repeats that status. The verified
signed oracle already rejects generic-baseline text and pins the active corpus.
The installed README, managed-section semantics and source-archive distinction
are corrected. Keep those fixes.

Acceptance:

- [ ] Correct these remaining live assertions against the actual signed oracle.
  Historical candidate traces may remain linked and explicitly historical.
  Preserve frozen artifacts and immutable reasoning bodies.
- [ ] Add the previously requested editable disposable-install consistency
  check for the shipped README, plus the current authority assertions. Assert
  behavior/facts that would catch the retired claims, not just file existence.
- [ ] Regenerate indexes and size hints; oracle, docs, index and budget checks pass.

## C7 — acceptance test completion; no remaining demonstrated behavior defect

The actual reporter passes independent mocked success, failure, retry/PATCH,
pagination, cancellation, invalid-status and HTTP-error checks. The maintained
entrypoint test only checks success and first failure/POST. The original
criterion explicitly requested an entrypoint retry regression.

- [ ] Extend the existing maintained entrypoint test with a matching existing
  issue. Assert PATCH to its issue URL and no duplicate POST. Preserve the
  current no-write success behavior. Reuse the existing test seam.

Scratch evidence: `.context/verify-closeout/scope-health-check.cjs` and `.json`.
No live GitHub issue was created or modified.

## Verified dispositions and final verification

C2 replay conflict handling, C5 receipt integrity and C6 malformed global
configuration are resolved in this pass. C6 has 34 relevant maintained passes
and 11 additional malformed-shape probes. Original runtime repros pass;
focused upstream/onboarding/shelf/catalogue suites pass 16/16. Smaller service
reselection preserves edited obsolete guidance, warns and stops the removed
check. These findings are not reopened by this follow-up.

Before report edits, signed oracle verification passes 16 files / 95 cases;
wiki index, budget, size hints and whitespace pass. The externally started
full npm process is still active; this review did not obtain its final output.
The independently reproduced maintained macOS regression is red, so a green
final gate cannot be claimed. No second full suite was started by this review.
Report/wiki changes are part of the next candidate; evidence must bind its bytes.

After this batch, run the affected editable suites, finish docs/generated
files, freeze/commit one complete candidate and renew the original final-byte
full gate, exact-commit archive E2E and real-npm MCP retry evidence. Then follow
the preserved owner-designated receipt and exact PR-head checks/independent
approval sequence. Production-only promotion/tag/closure remains later.
Do not consume a binding receipt attempt during fixes or reset its state.
The retained state is one prior failure for the existing author context.

No implementation/frozen edits, commit, push, GitHub approval, binding review
attempt or merge occurred during this verification. It is an advisory fixing
handoff, not an approval named by a report heading.
