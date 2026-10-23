---
date: 2026-10-13
source: review
topics: the-overhaul
decisions:
status: current
supersedes:
tags: review, plan-amendment, pending-owner-input
summary: Independent review found 12 plan defects and produced amendments to ten subplans; all six owner decisions and final handoff are recorded in the review-complete trace.
---

# Close-everything plan review

Verdict: amend before implementation. Review covers spec/scope, correctness,
architecture and test evidence; three independent report-only reviewers supplied
fresh passes and the primary reviewer verified the shared evidence. No planned
product behavior has been implemented.

## Findings, ordered by severity

1. **High — expected-red verification stops before test cases.** Master
   00:116–125 assumes failures can be managed as frozen cases. `package.json`
   starts with the signed verifier; `scripts/check-advanced-spec.js:149–153`
   deep-compares its scripts against the frozen snapshot and :136 pins 95
   acceptance IDs. Deleting the rule-copy script and adding test commands
   invalidates plumbing before the Node cases execute. Proposed amendment:
   enumerate verifier/script/coverage and behavioral changes in the owner
   bundle; exercise candidate artifacts in an isolated advisory runner while
   keeping the real full gate fail-closed. Preserve the owner's one final sign.

2. **High — scripts are promised confinement the runner does not provide.**
   03:88–93 claims target-only writes/no network through spawn-guarded.
   `rig/lib/spawn-guarded.js:133–140,175–185` manages lifetime, not filesystem
   confinement. A temporary fixture wrote a sibling outside the target with
   exit 0. Proposed amendment: enforced network/filesystem isolation, read-only
   input, staged artifacts, validated approved paths and journal-only target
   writes; missing isolation refuses. Approval alone is not containment.

3. **High — the existing undo path cannot restore replaced configuration.**
   05:17–18,36–37 promises restoration through the current journal.
   `rig/lib/lifecycle.js:52–69` excludes ordinary project configuration, and
   :432–440 removes files without restoring their preimage. Replacing a TOML
   configuration then uninstalling reproduced best_effort with NEW bytes kept
   and the preimage removed. Proposed amendment: typed approved replacement
   reversal; preserve backups on conflicts/interruption and scope shared files
   to approved sections. Broadening deletion authority is not restoration.

4. **High — upgrade retains stale approval/applied state.** 03:80–83 removes
   journaled files then reprojects without migrating onboarding state.
   `rig/lib/onboarding-state.js:121–122` writes state outside that journal;
   `rig/lib/onboarding.js:682–686` returns immediately for applied/checked state.
   Proposed amendment: carry selections forward, invalidate byte-bound old
   approvals/check results and require a new proposal; exercise already-checked
   v5 fixtures, edited files, interruption and retry before claiming migration.

5. **High — service schema drops the built grade/slice contract.** 04:39–42
   replaces grade fragments and named slices with one grade field and check.
   `rig/lib/catalog.js:51–66,83–88` requires strictly growing cumulative grade
   sets; frozen `tests/advanced-oracle.test.js:98–115` proves grade preservation
   and dependency-only slice pulls. Proposed amendment: preserve stable IDs,
   ownership, cumulative checks, named slices and dependency edges in JSON;
   exercise every grade and slice resolution. The owner said freeze as built.

6. **High — tracker agreement and closure form a circular release dependency.**
   01:30–38 changes local status now but closes GitHub issues at ship; 08:28–31
   requires live equality, while 10:17,28–30 requires coherence/PR green before
   closure. Closure also precedes QA delivery despite the stated close bar.
   Proposed amendment: distinct open/ready-for-QA/delivered/redesign dispositions,
   an explicit candidate transition check, and final live agreement after QA
   receives the commit. Verified previously shipped fixes can reconcile now.

7. **High — pre-tag E2E has no defined public installer input.** 06:26–28 uses a
   packed checkout, but `install.sh:96–126` accepts tags and downloads tag URLs;
   it accepts neither a local archive nor candidate SHA. 08 requires pre-tag
   E2E while 10 omits actual tag/release publication. Proposed amendment:
   candidate artifact transport through the same installer path, SHA/archive
   digest binding, tag/release steps and a public tagged-download smoke test.

8. **High — final review/full-gate evidence becomes stale.** 10:15–27 reviews
   before owner-applied oracle changes/signature, then runs tests before version
   and changelog updates. `rig/lib/release-evidence.js:19–28` includes these
   bytes in the implementation digest; :46–76 checks matching receipts.
   Proposed amendment: metadata/docs first, preliminary reviews, owner bundle
   and signature, then wrapper-authored review receipt and final verification
   of the actual PR head. Changes afterward require fresh evidence.

9. **High — service fixtures can pass while installed wiring is missing.**
   04:54–61 tests checks at fixtures, without the installed approval/binding
   flow. 06:33 needs only green check. `rig/lib/checks.js:161–173` loops selected
   bindings and can execute none for an empty selection. Proposed amendment:
   parameterized installed selection→proposal→approval→apply→check proofs,
   asserting binding IDs and nonzero check counts. Missing tools are named
   non-passes; good/bad fixtures discriminate domain behavior.

10. **Medium — standards confuse title references with executed proof.** 07:32
    calls the traceability guard proving-test enforcement.
    `scripts/check-ticket-traceability.js:178–193` accepts manual reasons or a
    title substring. A comment-only file passed a temporary fixture check.
    Proposed amendment: label reference hygiene accurately, require actual
    executed green evidence, and reject comment-only/skipped/failing evidence.

11. **Medium — warning deletion hides the diagnostic.** 02:59–63 says installed
    CI already turns undeclared network state into a warning. The current
    `rig/catalog/baseline/check.js:63–68` ignores successful results' network
    diagnostic. Proposed amendment: add one visible installed CLI/CI warning
    before deleting the runner's console warning.

12. **Medium — coherence checks reject required historical wording.** 08:32–37
    requires every version string to equal package.json and bans markdown-only;
    09:12 requires v5 upgrade instructions and owner rules explicitly retire
    the old doctrine. Proposed amendment: validate current-release assertions,
    allowing migration references and explicit retirement statements. Ordinary
    uninstall also writes `reports/rig/last-uninstall.json` at lifecycle:468–475;
    exact-roundtrip tests need scoped evidence output/cleanup and a full file
    baseline, preserving user reports rather than broadly purging them.

## Evidence and limits

Live read-only GitHub audit: 61 issues, 17 open; every open issue maps to the
master ledger. Issues 78–80 are closed as COMPLETED despite the plan to reopen.
This verifies inventory/state, not every historical completion claim. Existing
install/hygiene regression files passed 13/13. No full product-suite run or
release/install certification is claimed. Plan changes are proposed only.

## Owner answers received, verbatim

Third-party delivery: “Fetch during onboarding”. Full message:
[owner fetch trace](2026-10-13-close-everything-review-owner-fetch.md).

Corpus location: “One new root (recommended)”. Full message:
[owner root trace](2026-10-13-close-everything-review-owner-corpus-root.md).

Tier terminology: “Remove wording; keep compatible flag (recommended)”. Full
message: [owner tier trace](2026-10-13-close-everything-review-owner-tier.md).

These answers are recorded in the North star, topic hub and decision index,
and reflected in the proposed plan diff. The fetch choice replaces the plan's
pinned-vendoring recommendation; licence, provenance, integrity and required
browse fixes still need to reach fetched content.

## Still open

- External tools: the available-tool/gap versus approved-install question is
  currently pending with the owner. Detection-only remains a recommendation,
  not an agreed delivery policy.
- Duplicate services: ask whether merges are permitted. Preserve 115 IDs until
  answered; approved merges need compatibility mappings and a written reason.
- QA promotion: ask for a concrete promotion bar. Recommend a healthy run on
  the exact QA commit plus one real external-repository install; schedules run
  from the default branch, so QA needs explicit-ref manual validation.

No settled North star was re-opened. No extra owner product question is needed
for the verified implementation defects: the existing security, preservation,
contract and evidence promises already require their correction.

## Handoff and validation

Proposed amended files and a unified diff are under
`.context/close-everything-review/`. The diff preserves master/subplan structure
and passes `git apply --check`; it has not been applied. No code, tests, signed
artifacts or external tracker states were changed. Owner-choice recording and
review filing update wiki/instruction records only. Existing workspace edits
remain intact. There is no push, commit, PR, upstream message or release.

Run the wiki index generator and budget checks after filing this report.
The proposed fixes require implementation and their own runnable evidence;
13 existing install cases do not certify the future product.
