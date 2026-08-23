# Services and reports

## What it is

Every selected service has exactly one honest disposition: executable first,
otherwise service-specific convention or a predicate-backed surfaceless result.
The runner iterates selected-service receipts so a missing binding cannot vanish.
Reports persist failures, vacuous results, and coverage gaps; routine passes are
omitted. [Gate 2 §9](../gate2/technical-spec.md#9-runnable-services-and-reports)

The report schema also preserves six abnormal non-passing outcomes as distinct
states: timeout, cancellation, missing dependency, signal termination, partial
output, and command not found. Evidence assurance comes from rerunnable local
evidence; its separately approved CI graft is a repository enforcement surface,
not a prerequisite that makes the local grade unreachable.
[v0.11 correction](../reasoning/2026-08-21-gate2-v0.11-carried-review-corrections.md)

## Why it is this way

The earlier implementation treated non-empty placeholders and no-op bindings as
success. The current contract requires observed launch/result evidence and names
missing or malformed behavior as a nonzero coverage gap. Reports remain local,
redacted, and failure-centric so CI output cannot become a secret map.
[Advanced grilling GA-10](../sources/logs/advanced-grilling.md#ga-10--re-grill-after-implementation-audit-2026-07-25)

## What binds it

`D4`, `D15`, `AD-15`, and `AD-16` define disposition and reporting. `GA-24`
permits user-approved partial lint-format coverage without a whole-repository
claim. `AT-SHAPE-5`, `AT-REPORT-1`, and per-service cases require honest
execution, vacuity, gaps, redaction, and no uploaded artifacts.
[Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Generic success bindings, silent skips, marker-only hooks, advisory-only CI,
fake executable stubs, and committed/uploaded finding detail were rejected as
false green or disclosure paths. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen outcome rules: [Gate 1 §2 and acceptance](../gate1/business-spec.md)
- Binding and report schemas: [Gate 2 §9](../gate2/technical-spec.md#9-runnable-services-and-reports)
- Testing vision: [captured reference](../sources/reference/testing-pipeline-vision.raw.md)
- Partial lint-format coverage ruling: [reasoning trace](../reasoning/2026-08-20-lint-format-partial-coverage.md)

## What is still open

**Resolved.** The service runner is built and all 115 leaves are authored at
the Policy grade with zero placeholders; the unchanged signed acceptance target
passes across all of them. [Gate 2 §14](../gate2/technical-spec.md#14-ordered-tracer-bullet-slices)
[Status](../status.md)

The rest of this section records the specific behavior contract lint-format —
the one leaf built out past Policy grade — must keep meeting.

For lint-format, a partial install reports each excluded component as an
unprotected coverage gap and cannot claim whole-repository support. Covered
components retain their own exact level and evidence; one covered component
does not mask another component's gap.

A read-only check that mutates the working tree is a failure, not a pass with a
side effect (`GA-27`). Rig detects the mutation, halts before any further
planned command runs, fails the check, and reports the exact changed paths with
before/after evidence. It does not auto-restore the pre-check state — that can
clobber concurrent user work and erase the forensic record of a misbehaving
tool — and it does not let the check continue.
[reasoning trace](../reasoning/2026-08-21-lint-format-read-only-guarantee.md)

Lint-format checks are diff-scoped by default (`GA-28`): ordinary runs inspect
only each component's changed files. The user may ask for a wider scope —
whole-repository or another explicit selection — but Rig never silently widens
it. Every scope respects the component's own ignore rules and runs in its
working directory, so Rig never grades generated or vendored files the
repository told its tools to skip. This carries the per-service run-scope
precedent (`GA-4c`) into lint-format's interactive default; the whole-scope
enforcement run belongs to the CI-behavior decision.
[reasoning trace](../reasoning/2026-08-21-lint-format-check-scope.md)

Autofix is a distinct mutating action, never folded into a read-only check
(`GA-29`). Rig runs it only when the user explicitly invokes a specific fix
command under its own separate approval, offers it for both formatting and safe
lint fixes, and re-verifies by re-running the read-only check rather than
assuming success. Resulting changes land as ordinary uncommitted working-tree
edits the user owns; Rig never commits them or claims ownership of the source.
[reasoning trace](../reasoning/2026-08-21-lint-format-autofix.md)

The Evidence level enforces lint-format in CI, running whole-scope at the gate
— the enforcement counterpart to the diff-scoped interactive default above
(`GA-30`). Rig integrates additively into verified existing CI rather than
taking the pipeline over; when no CI exists or the provider is unsupported, Rig
proposes a pipeline as an explicit, separately approved, user-chosen-provider
plan. A pipeline Rig does not understand is preserved and reported, never
silently edited or replaced.
[reasoning trace](../reasoning/2026-08-21-lint-format-ci-behavior.md)

Lint-format output is failure-centric, local, and redacted (`GA-32`). Reports
stay on the producing host, keep failures, vacuous runs, and coverage gaps, and
omit routine passes; CI emits only verdict, counts, and rule identities, never
source snippets or artifacts. Redaction covers secrets, PII, and any other
host-rooted sensitive data, stripped on the producing host before output leaves
it. Reports do not dump raw tool output — they explain each finding to the user
as a clear, actionable item: what is going wrong and what to do about it. Secret
content reaches the agent only on explicit opt-in.
[reasoning trace](../reasoning/2026-08-21-lint-format-output-privacy.md)

Not every check reaches a clean pass or fail, and each messy ending is its own
truthful state (`GA-33`). Timeout, user cancellation, missing dependency,
signalled/killed process, partial output, and command-not-found each resolve to
a distinct, reported, non-passing result — never collapsed into "pass," never
silently swallowed. A generic "failed" is rejected for losing the actionable
cause, and treating inconclusive ends as non-blocking is rejected as false
green. A check that could not reach a verdict states exactly why.
[reasoning trace](../reasoning/2026-08-21-lint-format-failure-semantics.md)

Lint-format lifecycle follows the frozen install-manifest and removal contract
(`GA-34`): a repeated install is an idempotent resume that claims no protection
until complete, and removal reverses exactly what Rig's manifest recorded it
created — generated CI, configuration, and managed blocks — touching nothing
else. Source fixes the user invoked through autofix are the user's own edits
and always survive uninstall.
[reasoning trace](../reasoning/2026-08-21-lint-format-lifecycle.md)

The claim the whole leaf is measured against — when Rig may say lint-format is
"production-supported" — is evidence-backed and per component (`GA-35`). A single
component is supported only when Rig genuinely built at least the minimum Policy
level for it, discovered and bound its commands, and produced a real check
result — not a placeholder or fake-green — under plan-bound consent (`GA-25`).
The whole repository is supported only when every discovered, non-excluded
component clears that same bar; any user-approved exclusion (`GA-24`) suppresses
the whole-repository claim while the covered components stay truthfully
supported in their own right, so one covered component never masks another's
gap. Claiming whole-repository support just because the leaf installed somewhere,
and refusing to ever claim support at all, are both rejected — the first lets
install success masquerade as coverage, the second discards the customer-facing
promise the leaf exists to earn.
[reasoning trace](../reasoning/2026-08-21-lint-format-support-claim.md)
