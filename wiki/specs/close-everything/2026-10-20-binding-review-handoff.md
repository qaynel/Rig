# October 20 binding review — findings and acceptance criteria

The owner authorized **one** `--force-rereview` attempt. The designated
`claude-opus-5` reviewer returned **fail**: four blocker, five major and three
minor findings; `AT-HOST-1` and `AT-BASE-2` were unresolved. The wrapper exited
1 and wrote **no passing receipt**. The same author context now has three
recorded failures. Do not reset it or retry without further owner authorization.

The candidate remained unchanged throughout the attempt: HEAD
`3b1e74e687ec85fcb50ba16a3b07cd289d207d8a`, worktree digest
`9846c0832ab652ea894741bdefd2001d75a688ee0e30e1b2936e8b3310d3e000`,
2,660 publishable files. The tree included the signed, uncommitted amendment.
This handoff and the result trace were added after the failed review.

The [raw reviewer findings](../../sources/reviews/2026-10-20-qa-binding-rereview.failed.review.json)
are preserved unchanged. They are reviewer claims, not a wrapper-authored
receipt or independently reproduced findings. The criteria below separate
implementation work from written responses and owner-only frozen amendments.
The prior C1–C8 fixes are not reopened by this report.

## 1. Blocker — policy schema and enforcement disagree

**Reviewer anchor:** `rig/lib/policy.js:13–22`,
`rig/lib/enforcement.js:18–31`, `rig/catalog/baseline/network-policy.json`.
Status understands legacy/current controls, while evaluation reads different
keys and ignores global switches.

Acceptance criteria:

- Trace the shipped default and supported legacy/current documents through
  validation, activation, status and actual action evaluation. Use one agreed
  interpretation of switches and leaf IDs at their shared seam.
- Global policy/enforcement disable and individual shell, web, MCP and drift
  switches produce the contractually required action result and matching
  protection status; exact-copy and semantic drift can be selected separately.
- Exercise the four declared protected network categories. Reject malformed
  and unknown inputs at the boundary with named diagnostics.
- Maintain regressions using the shipped document and a valid current-schema
  document, including enabled, globally disabled and individually disabled
  cases. Update design and guidance to the behavior proved.

## 2. Blocker — mechanical denial claimed without integrated hooks

**Reviewer anchor:** `rig/lib/renderers.js:215–229`,
`tests/advanced-oracle.test.js:545`, `AT-BASE-2`, `AT-HOST-2`.
The reviewer reports an advisory renderer caller rather than a wired runtime
denial path, and a category outside the declared category set.

Acceptance criteria:

- Resolve this finding **against locked North star decision 12**: supported
  hooks Rig does not install remain `available but not integrated`. This is
  not authorization to build new hooks for all hosts.
- Identify every surface that actually claims mechanical enforcement. For
  each such claim, demonstrate the real entrypoint denies an unapproved
  protected action and permits the corresponding valid approval. A direct
  call to a decision helper is insufficient proof of an integrated surface.
- For unintegrated surfaces, emit the agreed named gap and setup guidance;
  do not claim protection or classify vendor-supported hooks as unsupported.
- Reconcile business text, acceptance expectations, technical design and
  installed output with those bounds. If frozen text still contradicts the
  locked owner decision, prepare one batched owner amendment; do not edit it
  as an agent. Close `AT-BASE-2` only with evidence or a signed clarification.

## 3. Blocker — renderer reads candidate policy rather than active bundle

**Reviewer anchor:** `rig/lib/renderers.js:205–213`, `AT-BASE-4`.
The reviewer reports direct reads of `.rig/network-policy.json` and silent
fallback to defaults on parse/read errors.

Acceptance criteria:

- Any security decision uses the fully validated active policy bundle and its
  approval binding. Merely editing the candidate cannot change permissions.
- Missing, malformed, stale or invalid active evidence refuses the protected
  operation with a named reason; it never silently grants fallback authority.
- If the renderer output is advisory only, label that clearly and remove
  claims that it enforces permissions. Keep decision and activation semantics
  consistent with item 1.
- Maintain a real-entrypoint regression: activate A, edit candidate B, prove A
  remains authoritative, then activate approved B and prove the change. Cover
  corrupt candidate and corrupt/missing active evidence separately.

## 4. Blocker — repeated catalogue filler

**Reviewer anchor:** `rig/corpus/services/**/{minimal.md,slices/*.md}`,
`AT-SHAPE-6`; the reviewer estimates 452 of 926 fragments are templated.
Examples include attribution and refactoring floor slices with the same
sentence and interpolated identifiers.

Acceptance criteria:

- Inventory the affected fragments and perform one complete semantic pass of
  the 115 service identities. Record concrete dispositions and evidence;
  counts or whole-body uniqueness do not establish meaningful authorship.
- Each retained fragment supplies service-specific guidance or a concrete
  contract, failure condition and action. Replacing identifiers or synonyms
  in a repeated paragraph does not satisfy the criterion.
- Preserve honest Policy-only evidence limits. Do not invent executable
  integrations to make documentation appear stronger.
- Keep installed good/bad/grade discrimination green and regenerate derived
  artifacts. Corpus-pin changes go into the single owner amendment batch.

## 5. Major — autofix accepts a boolean and may skip re-verification

**Reviewer anchor:** `rig/lib/lint-format.js:790–816`, `AT-LF-12`.

Acceptance criteria:

- A caller-supplied `{ verified: true }` cannot authorize mutation. Validate
  the actual approval and bind it to the exact fix command, target and relevant
  inputs through the existing approval mechanism.
- Reject missing, mismatched, altered and replayed approvals before spawning
  the mutating command.
- Require a valid verification check before mutation. After the fix, execute
  that check and report its actual result; omission cannot yield success with
  `verification: 'skipped'`.
- Maintain public-path regressions for rejection, valid approved fix,
  re-verification failure and missing verifier. Reconcile the technical
  design's acknowledged gap with the frozen observable requirement.

## 6. Major — signed document still says ratification pending

**Reviewer anchor:** D24 revision heading in `wiki/gate1/business-spec.md`.

Acceptance criteria:

- Record a written resolution that the verified owner signature ratifies the
  exact signed amendment; the stale heading does not annul that signature.
- Correct live status and runbook claims that still describe this verified
  amendment as awaiting signature.
- If the frozen heading is corrected, include it in the next complete
  owner-reviewed amendment and re-signing batch. Agents do not edit or sign
  frozen documents, and no standalone signing ceremony is needed merely to
  remove this heading if the written resolution suffices.

## 7. Major — host acceptance and business promises diverge

**Reviewer anchor:** amended `AT-HOST-1` versus business-spec sections 2–3.

Acceptance criteria:

- Apply the existing locked owner decision: distinguish real emitted bytes,
  vendor-supported but unintegrated axes, and evidence-backed unsupported axes.
  Do not turn this review into a new all-host integration requirement.
- Supply a written reconciliation of the old universal-emission wording with
  that decision, and prepare any necessary frozen clarification in the same
  owner amendment batch as item 2.
- Check real installed artifacts against the declared per-axis state for all
  supported adapters; prove collisions and repeats preserve user content.
- Resolve `AT-HOST-1` with a coherent signed contract and byte-landing/gap
  evidence. This is the same host-scope correction as item 2, not a new feature.

## 8. Major — baseline oracle does not exercise its promised behavior

**Reviewer anchor:** `tests/advanced-oracle.test.js:36–54,215–275,568–579`.

Acceptance criteria:

- Use shipped and valid current policy documents; assert valid fixtures are
  accepted before testing added-key rejection.
- Exercise real restricted actions before/after global and leaf disable,
  matching item 1, rather than checking status labels alone.
- Use all four declared protected categories, with valid approval and denial
  cases at the claimed enforcement seam; apply the gap boundary in item 2.
- Demonstrate the cases fail when each claimed behavior is broken. Prepare
  frozen test changes for owner review/signing; maintain editable regressions
  first without weakening the signed oracle.

## 9. Major — install, reporting and receipt cases miss shipping boundaries

**Reviewer anchor:** `AT-INSTALL-1`, `AT-REPORT-1`, `AT-GATE-3` in
`tests/advanced-oracle.test.js` and `tests/advanced-spec-gate.test.js`.

Acceptance criteria:

- Interrupt actual installation at a real write boundary, then run resume
  through the public path. While incomplete, install output, policy status and
  run reports must withhold protection claims; successful recovery must prove
  final outputs without clobbering unrelated data.
- Verify local reports are ignored and absent from CI artifact-upload output
  across the supported providers. Run/capture a failing CI command with seeded
  detail and prove that secret detail stays out of the disclosed log/output.
- Exercise the receipt producer/validator contract with implementation digest
  and PR base. Reject same-context, stale spec/catalogue/implementation/base,
  missing/extra/duplicate/failing verdicts and nonempty unresolved cases;
  accept one complete current receipt. Reuse existing maintained tests where
  they already prove a boundary rather than duplicate them.
- Prepare any frozen case changes in the single owner amendment batch and
  show each test detects its corresponding failure.

## 10. Minor — acceptance text names an internal function signature

**Reviewer anchor:** `AT-LF-8` names
`createGradeReviewRequest({ target, changed, commands })`.

Acceptance criteria / written response:

- Preserve the observable requirement: review evidence binds to the target,
  changes and commands and rejects contradictions or mismatched evidence.
- Put private API traceability in the editable design. An owner-approved
  wording cleanup can join the next amendment batch; this alone does not
  require code changes or a separate signing/review cycle.

## 11. Minor — uninstall fixture uses a second manifest representation

**Reviewer anchor:** `AT-UNINSTALL-1` at
`tests/advanced-oracle.test.js:961` versus the append-only journal contract.

Acceptance criteria / written response:

- Trace whether the JSON fixture is a supported compatibility input or only a
  stale test representation. Do not delete a supported migration path merely
  because two formats exist.
- Exercise the shipping authoritative journal through the public uninstall
  path, including missing/corrupt evidence and outside-edit preservation.
- If the old shape is intentional compatibility, document its bounded reader
  and conversion behavior. Otherwise replace the obsolete fixture in the
  owner amendment batch. No additional journal authority is introduced.

## 12. Minor — duplicate assertion

**Reviewer anchor:** `tests/advanced-oracle.test.js:209,211`.

Acceptance criteria / written response:

- Record as harmless redundancy, suppressed by the review skill. No behavior
  changes or new test are needed, and it does not block approval.
- Optional deduplication may join an already-required owner amendment; do not
  trigger a new signing or binding-review cycle for this item alone.

## Finite closeout sequence

Fix or answer these findings against existing owner decisions. Batch every
necessary frozen change into one owner-reviewed amendment. Preserve the three
recorded failures. Freeze and commit the complete candidate, verify its signed
oracle, run the exact-byte full gate and required install evidence, then obtain
explicit authorization before another binding attempt. A future passing receipt
does not replace exact-head QA checks or eligible independent PR approval.

This review performed no implementation fixes, signing, commit, push, GitHub
review, approval or merge. It did not run `npm test` and does not claim the
older local logs establish a green gate on the reviewed bytes.
