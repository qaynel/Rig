---
date: 2026-10-20
source: agent
topics: gate1-signing, review-receipts
decisions:
status: historical
supersedes:
tags: trust, progress
summary: Progress trace for the one-trust-root change and the failed-binding-review fixes (started 16:10 IST).
---

16:13 IST — started. State: owner applied and signed the Gate 1 amendment (tree
carries the signed bytes uncommitted); the authorized binding review failed
(12 findings, handoff in specs/close-everything). Owner then locked one trust
root. Plan: (1) trust-root module reading the installer-owned copy of the
Gate 1 key at .rig/trust/gate1.allowed-signers, shipped from
wiki/gate1/gate1.allowed-signers; (2) route plan approval, lint-format plan and
setup approval, and policy activation through it; (3) delete policy signer
setup/recovery registration/recovery, trust.json, TOFU, .rig/allowed-signers,
CLI actions, docs, tests; (4) frozen cases that exercise the deleted
mechanisms (AT-PRESENCE-2 and the fixtures writing .rig/allowed-signers) cannot
be edited by an agent: prepare them as an owner amendment; (5) then work the
handoff findings; (6) rerun final-byte evidence.

16:31 IST — done: rig/lib/trust-root.js (installed Gate 1 key at
.rig/trust/gate1.allowed-signers, shipped from rig/corpus/trust/); plan
approval, lint-format plan and setup approval, and policy activation route
through it; policy signer setup/registration/recovery, trust.json, TOFU,
.rig/allowed-signers, CLI actions, allowed-signers.example.md and
tests/policy-recovery-registration.test.js deleted; editable tests updated and
tests/trust-root.test.js added (5/5). The frozen oracle goes red on exactly six
cases (AT-LF-14/20/24, AT-PRESENCE-1/2, AT-SECRET-1) because their fixtures
write the retired signer lists and AT-PRESENCE-2 certifies the retired recovery
ceremony; an agent may not edit those, so the amendment is prepared in
.context/trust-root-candidate (91/91 oracle+gate+Path B pass, 16 files / 95
cases) with the D29 prose (business-spec revision note + bullets, AT-PRESENCE-2)
and the technical design rewritten (editable). In flight: docs, CLAUDE.md north
star 13, wiki hubs, owner patch; then the handoff findings, then final-byte
evidence.

16:40 IST — handoff findings 1–3 and 2 implemented: enforcement.js evaluates
through effectiveStatus (both schemas, global/section/leaf switches, four
protected categories); policy.loadActivePolicy reads only the activated bundle
and its Gate 1 signed receipt (named policy_active_* refusals, shipped default
only before the first activation); renderer decision is labelled advisory and
fails to a named deny; policy evaluate CLI is the real hook entrypoint;
policy status names git pre-commit as integrated and shell/web/mcp as available
but not integrated (North star 12). tests/policy-active-bundle.test.js 10/10 and
mutation-checked. Next: finding 4 (catalogue filler), 5 (autofix approval), 6–12
written responses and docs.

18:07 IST — finding 4 (catalogue filler): 114 services now carry hand-authored,
service-specific ceilings and min/mid/max reasons; a pruner removed any
non-machine sentence shared by more than three services, exempting the sentences
the authorship gate requires (Policy grade, Binding checks, Disposition,
Acceptance target, Declared predicates). authorshipReport() reports 0 failures;
advanced-catalogue 10/10, catalogue-installed 13/13. The DNS ceiling was
reworded to keep the phrase the installed test pins. Finding 5 (autofix):
runAutofix now needs a real SSHSIG plan approval over planAutofix (exact fix +
verify argv, network, limits, target), single use, verify command required
before mutation and actually run; halts report not_run, never skipped.
guarantee-coverage 40/40 including new AT-LF-12r regressions. Frozen AT-LF-12
still passes `{verified:true}` — owner amendment. Next: owner amendment for
AT-LF-12, findings 6-12, evidence docs, final-byte reruns.

18:40 IST — finding 9 shipping boundaries: tests/shipping-boundaries.test.js
(4/4). Three real defects found and fixed, not papered over: (1) an interrupted
apply still let `policy status` and run reports imply protection — now
lifecycle.installState() withholds every surface (`withheld_install_incomplete`)
and stamps reports `install: incomplete`; (2) reports/rig/ was stageable by a
blanket `git add` — writeReport now adds it to the clone-local exclude file;
(3) a failing CI check printed the command's raw stderr (a seeded secret reached
the log) — the installed check.js now prints service + check id only in CI.
Migration: an untouched v5 `.rig/network-policy.json` is refreshed to the shipped
categories (user edits kept; tests/migrate-v5.test.js). The v5 parity fixture
names the retired example file, the new trust root, and the two policy files.
Frozen delta rebuilt by .context/build-owner-batch.py into one patch (AT-LF-12,
AT-BASE-2/5 on shipped + real actions, AT-LF-8 observable wording, D24 heading,
host-scope note, catalogue pin, duplicate assertion); mirror 87/87, unsigned
verifier 16 files / 95 cases; mutation checks fail AT-BASE-2/5 and AT-LF-12.
Next: wiki index, final-byte full runs, commit locally, exact-commit E2E.

19:30 IST — final-byte runs on 2170cf87: live test:code 1158/1169 (red only on the
8 frozen cases the owner batch changes + the unsigned-verifier check), Pi 15/15,
MCP 6/6, exact-commit offline E2E pass (provisional false). Wiki budget fixed by
folding D29 into the D20 row. Nothing pushed; binding review not run (counter 3).
Owner next: apply+sign the batch, then explicit authorization for one review.
