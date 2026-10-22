---
date: 2026-10-21
source: review
topics: review-receipts, the-overhaul
decisions:
status: current
supersedes: 2026-10-21-code-mode-binding-review-start
tags: review, verification, codex, code-mode
summary: The single authorized Codex review ran with working code mode and failed with four blockers and fourteen major findings; no receipt, preserved counter ten.
---

16:21 IST — the single owner-authorized binding review completed with exit 1.
The existing wrapper launched Codex 6.1 Sol in a fresh ephemeral read-only
session with code_mode_host enabled. The code-mode host process and actual
read-only repository inspection commands were observed while it ran; the
previous disabled-host failure did not recur.

The reviewer returned fail, four blocker findings, fourteen major findings,
no minor findings and no unresolved IDs. The wrapper rejected that report and
wrote no passing receipt. The existing author context and attempt path were
retained; the counter rose from nine to ten. No retry, interim run, fallback
model, signing, commit, push, approval or merge occurred.

The complete wrapper-exposed findings are retained verbatim as JSON in
`wiki/sources/reviews/v6.0.0-2026-10-21-code-mode.failed.review.json`.
That file is a rejected report, not a wrapper-authored passing receipt. The
wrapper logs expose findings and unresolved IDs on rejection, not the full
per-case verdict array. These are reviewer claims; this session did not
independently reproduce each finding or apply product fixes.

The reviewer reports four blocking issues: the legacy public apply path
accepts caller-asserted approval; remediation accepts caller-computed consent
without transaction/rescan guarantees; execution consent is detached from
actual task dispatch; and task isolation does not confine filesystem access.
The remaining findings concern empty executable checks becoming green,
network defaults, scope/selection dispatch, read-only mutation checks,
declaration-only service checks, baseline dispatch, staged-byte scanning,
policy/approval atomicity and replay, CI preservation and verification,
output redaction, journal parsing and weight, cumulative checks and coverage
journaling, history-scanner evidence, and global JSON byte preservation.

The exact command was:

```sh
node scripts/review-receipt.js \
  --target wiki/gate2/technical-spec.md \
  --gate1 wiki/gate1/business-spec.md,wiki/gate1/acceptance.md \
  --implementation-root . --base origin/qa-prod \
  --reviewer codex --model gpt-6.1-sol \
  --author-context v6.0.0-qa-readiness-2026-10-17 \
  --force-rereview --out .context/qa-readiness-final-review.json
```

HEAD was `a30755fd0e3cf961eabe80579ede407fd4773008`; the local
`origin/qa-prod` resolved to `051a819c93bc6aed805a2895458bff84621e8070`.
The 2,690-file implementation digest was
`5ec6c0d5295025be0744faa1ee15c0149286145fc3ccce59a5271b664c9bf96e`
at launch, during the review and after exit, before filing this outcome.
Candidate bytes were held unchanged while the review ran; ignored progress
evidence was written under `.context/` so it could not change the digest.

The launcher fix is one argument: --disable code_mode_host became --enable
code_mode_host. Before launch, seven focused wrapper/digest regression checks
passed, the signed oracle verified 16 files and 95 cases, the wrapper syntax
check passed, and the wiki was rebuilt and within its budget. No protected
oracle file changed. No full npm test run or new full-gate certification is
claimed; nothing is being pushed.

Ignored evidence:

- `.context/2026-10-21-code-mode-binding-review-candidate.json`
- `.context/2026-10-21-code-mode-binding-review-checkpoint.json`
- `.context/2026-10-21-code-mode-binding-review.log`
- `.context/2026-10-21-code-mode-binding-review-result.json`

Approval remains withheld. Any further binding attempt requires fresh owner
authorization; this authorization has been consumed exactly once.
