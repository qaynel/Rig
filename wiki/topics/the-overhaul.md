# QA and production closeout

This page points to the current closeout record. September's overhaul work is
history; it is not a live set of open product decisions. The settled direction
remains one central corpus with agent-led, repository-aware onboarding. See
[What Rig is](what-rig-is.md) and [Onboarding flow](onboarding-flow.md).

## Current release checkpoint

The [follow-up implementation checkpoint](../reasoning/2026-10-18-qa-closeout-followup-progress.md)
records the in-flight bounded fixes and focused migration replacement checks.
Integrated verification and the final-byte delivery sequence remain pending.
The [migration integration checkpoint](../reasoning/2026-10-18-qa-closeout-followup-migration-integration.md)
and [platform verification checkpoint](../reasoning/2026-10-18-qa-closeout-followup-platform-verification.md)
record the projected-file protection fix, 49 passing macOS migration checks,
and three passing Linux boundary checks. The final npm gate remains pending.
The [candidate-preparation checkpoint](../reasoning/2026-10-18-qa-closeout-followup-candidate-prep.md)
records the report-only audits and installed skills README test correction.

The [fix-verification checkpoint](../reasoning/2026-10-18-qa-closeout-fix-verification.md)
checks the eight-item remediation. Its [bounded follow-up](../specs/close-everything/qa-prod-closeout-followup.md)
retains only incomplete criteria: migration safety/recovery, documented helper
paths, empty-selection output safety, current authorities and maintained checks.
Approval remains withheld; verified fixes are not reopened.

The repository-wide review has one active fixing-agent handoff:
[QA prod closeout findings and criteria](../specs/close-everything/qa-prod-closeout-review.md).
Eight grouped findings cover migration identity/replay, optional helper delivery,
service deselection, upstream receipts, malformed global removal, health issue
reporting and current guidance. Earlier review items are reconciled there;
production-only promotion/tag evidence is separated from QA merge checks.
The [consolidated verdict](../reasoning/2026-10-18-qa-closeout-consolidated-verdict.md)
records coverage, passing samples and the remaining final-candidate sequence.

The release candidate is `6.0.0`. Follow the ordered
[deployment policy](../../rig/corpus/standards/change-management.md) and the
[closeout task list](../specs/close-everything/task-list.md); old green results
do not carry across a change to the candidate bytes.

The owner re-signed the package-scripts amendment on 2026-10-17.
`node scripts/check-advanced-spec.js` verifies 16 files and 95 acceptance cases.
The full gate and fresh review receipt are now being renewed on the final
candidate bytes.
The [owner's answers](../reasoning/2026-10-17-change-management-policy-and-doc-deduplication.md)
record this approval sequence.

After the signed oracle verifies, the remaining release steps are:

1. Run `npm test` and create a fresh review receipt against the same final
   bytes.
2. Deliver the candidate through the existing QA PR with `gate1-pin` required,
   then run automated health and real-download clean-install checks against the
   exact QA commit.
3. Promote and tag the verified commit. Close fixed and redesign issues only
   after QA promotion and the tag, with the recorded disposition.

The policy is the operational checklist; the task list holds per-item evidence
and owner-only actions. Do not use the earlier October 14 closure traces as
evidence for the present candidate: they document earlier bytes and runs.

## September workstream record

The 2026-09 workstream diagnosed a costly delivery loop, product-positioning
questions, and an unbounded wiki read path. Its evidence and rejected approaches
remain in the [structural workflow design](../reasoning/2026-09-04-structural-workflow-fix-design.md),
[grilling answers](../reasoning/2026-09-04-structural-workflow-fix-grilling.md),
[closed-loop design](../reasoning/2026-09-02-closed-loop-workflow-and-context-realignment.md),
and [finished-product design](../reasoning/2026-09-04-finished-product-design.md).
These are historical sources, not open decisions for the 6.0.0 closeout.

## Current-session evidence

The [Review Received request](../reasoning/2026-10-17-review-received-request.md)
started the final report-only review. Its
[findings](../reasoning/2026-10-17-review-received-findings.md) withhold approval:
migration can overwrite an outside file, upgrades skip MCP setup, eligibility
omits macOS proof and successful named checks lose network warnings. The PR
head also has failing wiki-index CI; local corrections remain uncommitted.
The [delivery result](../reasoning/2026-10-17-review-received-delivery.md)
records 39 focused passes and HTTP 403 on review/comment publication; no PR
approval was submitted.
The [acceptance handoff](../specs/close-everything/review-received-resolution.md)
defines observable resolution checks and the final approval checklist for all
four findings; its [owner request](../reasoning/2026-10-17-review-received-acceptance-handoff.md)
does not mark any finding fixed.
The [resolution progress trace](../reasoning/2026-10-17-review-received-resolution-progress.md)
records red-green fixes for network diagnostic preservation and exact-SHA
Linux/macOS eligibility; migration and upgrade finalization remain in flight.
The [resolution findings trace](../reasoning/2026-10-17-review-received-resolution-findings.md)
records focused red-green regressions for all four findings and the remaining
exact-candidate and owner-controlled evidence.
The [verification trace](../reasoning/2026-10-17-review-received-resolution-verification.md)
records current focused-suite results, independent re-review, and remaining
final-candidate and owner-only gates.
The [full-gate trace](../reasoning/2026-10-17-review-received-resolution-full-gate.md)
records a green full local gate after fixing the fresh-install MCP regression;
exact candidate and QA evidence remain outstanding.

The [owner request](../reasoning/2026-10-17-qa-readiness-owner-request.md) resumes
the approved closeout. Evidence: [inventory](../reasoning/2026-10-17-qa-readiness-inventory.md),
[gate and compaction repairs](../reasoning/2026-10-17-qa-readiness-gate-and-compaction.md),
[verification start](../reasoning/2026-10-17-qa-readiness-verification-start.md),
and [independent review corrections](../reasoning/2026-10-17-qa-readiness-review-corrections.md).
The [owner signing reply](../reasoning/2026-10-17-qa-readiness-owner-signed.md)
and [verified signed candidate](../reasoning/2026-10-17-qa-readiness-signed-candidate.md)
supersede the earlier signing blocker. Earlier passing results do not establish
readiness for the current bytes.

The [full-gate/network reproduction](../reasoning/2026-10-17-qa-readiness-network-reproduction.md)
records the first signed run's five failures and the verified-mirror retry.
No release is claimed from the earlier focused passes.

The [scoped-removal design](../reasoning/2026-10-17-qa-readiness-scoped-removal-design.md)
records a green full gate followed by a real exact-SHA uninstall preservation
failure, and the minimal correction that preserves the signed purge behavior.

The [removal checkpoint](../reasoning/2026-10-17-qa-readiness-scoped-removal-checkpoint.md)
records focused and provisional E2E passes and the candidate-freeze coordination.

The [health and docs checkpoint](../reasoning/2026-10-17-qa-readiness-health-and-docs.md)
records corrected lockfile commands, runner setup and final instruction alignment.

The [owner confirmation](../reasoning/2026-10-17-qa-readiness-concurrent-docs.md)
identifies concurrent documentation work; final evidence waits for its write freeze.

The [shipped-dependency audit](../reasoning/2026-10-17-qa-readiness-shipped-dependencies.md)
records the stale installed MCP lock and the correction to health coverage.

The [latest checks checkpoint](../reasoning/2026-10-17-qa-readiness-checks-await-docs.md)
records a green advisory full gate, clean shipped dependencies and the docs handoff wait.

The [final documentation review](../reasoning/2026-10-17-final-documentation-review.md)
withholds merge approval pending factual documentation corrections and final-byte evidence.

The [documentation overhaul](../reasoning/2026-10-17-documentation-overhaul.md)
records the original audience-focused rewrite. The
[review corrections](../reasoning/2026-10-17-documentation-review-corrections.md)
address its nine factual and metadata findings. The completed local verification
is recorded below; merge approval still needs exact-candidate delivery evidence.

The [documentation verification checkpoint](../reasoning/2026-10-17-documentation-review-verification.md)
records passing focused checks and the full-suite run in progress. Release
requirements remain unchanged.

The [suite-wait checkpoint](../reasoning/2026-10-17-documentation-review-waiting-for-suite.md)
records the still-running catalogue and upstream verification at 11:41 UTC.

The [verified-mirror checkpoint](../reasoning/2026-10-17-documentation-review-verified-mirror.md)
records interruption of the direct-download test run and a full retry using
rehashed pinned upstream bytes through the supported mirror path.

The [completed documentation verification](../reasoning/2026-10-17-documentation-review-resolved.md)
records all nine findings resolved and the full suite green: 1074 main passes,
two skips, 15 secret tests, 15 Pi-extension tests and six MCP tests. The run uses
the supported digest-verified pinned upstream mirror. Candidate freeze/commit,
exact-SHA install evidence, the reserved final receipt and pushed-head checks
remain before merge.

The [late review resolution trace](../reasoning/2026-10-17-review-received-resolution-late-findings.md)
records the follow-up migration, MCP retry, and exact-SHA verification fixes,
with final-byte and QA delivery evidence still pending.

The [renewed review checkpoint](../reasoning/2026-10-18-review-received-renewed-review-start.md) records the uncommitted fix handoff and ongoing independent verification.

The [repository-wide closeout request](../reasoning/2026-10-18-qa-closeout-review-request.md) asks for one consolidated set of findings and verifiable criteria for the fixing agent.

The [broad review checkpoint](../reasoning/2026-10-18-qa-closeout-review-progress.md) records coverage, grouped reproductions and the distinction between QA merge and production-only evidence.

The [managed-section correction](../reasoning/2026-10-18-qa-closeout-managed-section-correction.md) retracts a proposed code finding because the signed contract intentionally removes edited managed bodies; live documentation must match that behavior.

The [temp-type boundary check](../reasoning/2026-10-18-qa-closeout-temp-type-check.md) adds a bounded FIFO-refusal criterion to the existing migration finding; the consolidated list remains eight groups.
