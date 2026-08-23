# Timeline

How the design moved. Useful when a document's date matters more than its
content — a doc written before 2026-08-17 still believes in the host tier, and
one written before 2026-07-24 still believes in installable tiers.

---

## 2026-07-16 — Foundational grilling begins

`G1`–`G11` settle what Rig is: a curated blend with superpowers × gstack as the
primary axis, shipped as its own harness rather than a fork. Tier 1 is the MVP —
a markdown-only bootstrap with one shared `routing.md` and one-line host
pointers. The materializer is deferred entirely to Tier 2. The project gets its
name (`G10a`).

## 2026-07-21 — Advanced grilling opens

`GA-1` narrows Advanced to capabilities B (harness security), C (testing
pipeline), and D (spec→test→code), host-agnostic. The local-model runtime and the
repo-scoped memory store go to Tier 3. `GA-2` locks the brain fork to **B1** —
Rig authors config, the host agent executes it. No Rig runtime, no model key.

Later the same day, `GA-9` dissolves the fixed tier stack into a two-axis
à-la-carte catalogue driven by a repo-scan recommendation lens.

## 2026-07-23–24 — The catalogue takes shape

`GA-9g` deprecates tier naming completely: there is no installable Basic, mid, or
Advanced. The catalogue *is* the product. `GA-9i` separates the two securities —
agent-tech safety as an always-on baseline, product security as a selectable
family. `GA-9k` settles the grain at four levels: **family → group → service →
grade**. `GA-9k`–`9n` enumerate all four families and 115 leaves.

`GA-8` authors the first acceptance set at property level. **Gate 1 freezes at 16
cases** on user sign-off.

## 2026-07-25 — GA-10, the audit re-grill

The frozen Gate 2, later SOW rulings, a placeholder catalogue, and
green-but-incomplete tests are found mutually inconsistent. Eleven rulings
establish `technical-spec.md` as sole Gate-2 authority, make all 115 leaves
production commitments, and require one honest outcome per service.
**Set moves to 38.**

## 2026-07-26 — Three revisions in one day

**`D1`–`D9`, the claim/build split.** A readiness audit finds the intent
unshippable: it made release conditional on first-wire evidence for 19 hosts and
six CI providers, requiring licensed vendor products no implementation effort can
substitute for. The resolution separates what Rig *builds* from what Rig
*claims*. **Set moves to 45.**

**`D10`, Gate 1 integrity.** Gate 2 design work finds the `D5` process control
doesn't fit how this repository is used. `GA-11` withdraws branch protection and
upstream comparison; the replacement is a signature over Gate 1's digest that
does not run through git at all. Mechanism change only — set stays 45.

## 2026-07-28 — GA-12, the lifecycle re-grill

A sweep for *unstated* behavior rather than wrong behavior. The finding: Gate 1
described in detail how Rig arrives in a repository and said almost nothing about
how it leaves, how it fails, or what it does with what it finds.

Eight rulings become `D11`–`D18`: uninstall, install resume, session-scoped
delegation, no invariant tier, local-only findings, deterministic secret
detection, gate arming, and migration excluded. One is a defect fix — `D17`
closes the hole that let a context delete `gate1.sig` and proceed under a warning.
**Set moves to 52.**

## 2026-08-13 — D19, the presence floor corrected

Gate 2 design work goes to satisfy `D10`'s presence floor and finds it
unsatisfiable. No SSH signature attests hardware presence: `ssh-keygen` records
authenticator attestation only at key generation, verification has no option that
consults it, and the allowed-signers grammar cannot express a touch requirement.

`D19` restates the floor as a property of the *key* rather than a claim about the
artifact, and makes the intent owner the one who attests it. A correction of a
false requirement, not a relaxation. Set stays 52.

Gate 2 v0.3 is rewritten against the 52-case set. The roadmap is checked against
the files on this date — and has not been updated since.

## 2026-08-17 — The host-tier amendment

The executable-specification-gate design finds that Rig ships one configuration
for every host and has never observed enforcement fire on any of them, while the
verified/unverified tier from `D1`/`D2`/`D3` drew a distinction the product never
implemented.

The tier is removed outright. Every host emits through one uniform path, proven
the same way — by automated tests that the correct bytes land in the correct
paths, never by a human exercising a host. Four cases are deleted.
**Set moves to 48.** Gate 2 v0.4 is rewritten.

## 2026-08-19 — Two amendments, and a failing review

**`GA-13` / `D8` corrected.** A different model cannot be established from a
self-declared authoring-model label. The requirement becomes a fresh session,
report-only operation, and an exact-digest receipt. Model identity is no longer a
release condition. Set stays 48.

**`GA-14` / `D20`, policy-signer recovery.** The round-2 review finds Gate 2 had
built a full recovery ceremony for the policy signer with no Gate 1 requirement
behind it — exactly the kind of lever the `D5`→`D10`→`D17`→`D19` sequence spent
four revisions keeping out of an agent's reach. The intent owner grills the
requirement rather than stripping the capability. **Set moves to 49.**

Gate 2 v0.5 is written against it, reviewed at its exact bytes — and **fails**,
with `AT-INSTALL-1` unresolved.

**The wiki is built.** `project-dev-docs/` becomes `wiki/`.

## 2026-08-20 — Vertical-slice probe, and AT-INSTALL-1 resolved

The intent owner's first attempt at authoring the full catalogue at once is
retrospected and abandoned mid-flight; the agreed test becomes one real leaf
first. `development.code-quality.lint-format` is authored end to end, and its
third acceptance probe — a deliberate mid-apply interrupt — forces the
round-3 blocker out of the spec and into running code: a failed apply rolled
back the already-applied writes and left no manifest. `rig/lib/apply.js` had
never implemented §7.6's manifest at all.

The blocker is resolved: §6.6, §10, and `AD-10` are edited to state the
manifest-and-resume model as apply's only failure behavior, and
`rig/lib/apply.js` gets the `.rig/install-manifest.jsonl` record-before-mutate
and resume mechanics. Gate 2's digest changes; the round-3 receipt is void.
Three round-3 findings remain open at this point.

## 2026-08-21 — D21 re-freeze, and the Gate 2 re-trace

The intent owner amends frozen Gate 1 (**D21**): `development.code-quality.lint-format`
becomes the single release-blocking leaf, the other 114 stay commitments that
block only their own future support, and nineteen `AT-LF-*` cases land. **The
set moves to 68.**

`rig-product-design` then re-traces Gate 2 to it (**v0.6**): `AT-LF-1`–`AT-LF-19`
into §13 at exact 68-case equality, the Policy → Context → Evidence grade ladder
mapped onto `minimal/mid/maximal` (`AD-32`) with the lint-format vertical
mechanisms (`AD-33`, `AD-34`), the §12.3/§17.2 release boundary narrowed to the
one leaf, and **all three remaining round-3 findings resolved** (recovery class
per D19, the "verified enforcement surface" disambiguation, the
model-assisted-triage channel).

Round 4 then reviews the exact `645e5536…` bytes and **fails**: one blocker finds
that the short-circuit wording can make Context and Evidence no-ops after a
clean Policy pass, and one major finding exposes conflicting rules for
lower-grade lint-format in an existing Rig CI job. Both return narrowly to
product design. The minor finding names residual implementation-test risk but
no current text defect. Gate 2 stays a candidate; see [status](../status.md).
[Re-trace trace](../reasoning/2026-08-21-gate2-lint-format-retrace.md)
[Round-4 receipt](../sources/reviews/gate2-v0.6-round4.review.json)

`rig-product-design` then corrects both accepted findings (**v0.7**,
`cdd07515…`): the §5.7/`AD-32` short-circuit is rewritten so only a lower-grade
*failure* stops early while a clean lower-grade pass runs through to the selected
grade, and repository-CI applicability is made grade-aware in §8.9/§11.2/§11.3 so
lint-format participates in CI only at Evidence. Neither Gate 1 file changes and
the trace stays exact 68. Round 5 reviews v0.7 and fails; D22/v0.8
(`0f62d984…`) resolves the `AT-CI-3` contradiction by adding the active-grade
CI-applicability qualifier to Gate 1 and the Gate 2 trace row. D23/v0.9
(`df4b8ec7…`) scopes `AT-SHAPE-6`'s release evaluation to lint-format alone.
Round 6 reviews v0.9 and fails; v0.10 (`69c38149…`) corrects the Slice 2
release-test scoping, freeze timing, and recovery-test claim issues. The
round-5 and round-6 receipts are both void for v0.10; the remaining round-5
findings still need product-design resolution before freeze.
[Correction trace](../reasoning/2026-08-21-gate2-v0.7-round4-corrections.md)
[D22 trace](../reasoning/2026-08-21-evidence-only-lint-format-ci.md)
[D23 trace](../reasoning/2026-08-21-gate2-v0.9-at-shape-6-retrace.md)
[Round-6 correction trace](../reasoning/2026-08-21-gate2-v0.10-round6-corrections.md)

## 2026-08-21 — the gate collapses to one, the suite is swallowed, and D24 turns the release broad

Three things land the same day, in this order.

**The two gates become one.** The oracle — intent, acceptance, and testing
infrastructure — is frozen under a single signature before code. The technical
spec is checked for presence, never locked; the code adapts to it. Implementation
is no longer blocked by a second freeze, only by the signature.
[intent](../reasoning/2026-08-21-one-gate-streamlining-intent.md) ·
[escape hatch](../reasoning/2026-08-21-one-gate-escape-hatch-resolved.md)

**Commit `ff7cea5` swallows the upstream skill suite.** 55 skills plus `bin`/`lib`
plumbing are vendored into `rig/catalog/skills` and `rig/catalog/plumbing`,
renamed so no filename or reference carries the upstream name. The commit touches
**zero wiki files**, and nothing in the installer, manifest, bootstrap, scripts,
tests, or `package.json` references the result. The catalogue now has two shelves
and only one of them is governed. The suite also carries no upstream `LICENSE` or
`NOTICE`, inside an MIT repository — an unresolved release blocker of legal
rather than technical character.

Later the same day, the vendored `1.60.1.0` version was traced to upstream
commit `7c9df1c…` and its MIT copyright and permission notice was restored with
a record of the local modifications. That removes the unknown-licence defect;
the intent owner subsequently approved releasing the modified partial
distribution with the notice and provenance in every installed copy and no
upstream-endorsement claim.

**D24 turns the release from vertical to broad-and-shallow.** In office hours the
intent owner rules that the MVP is built in one pass at agent discretion: all 115
leaves authored at the **Policy** rung, every fragment declaring its grade and
declaring that it is untailored baseline practice. This suspends locked decision
8 (one at a time, single context, never templated) for this release only, and
supersedes D21's single-leaf release boundary. The safety baseline is untouched:
a missing binding is still a named, nonzero coverage gap.

The owner was offered a cheaper middle path — author five leaves, confirm the
bar, then bulk-author the remaining 110 — and declined it in favour of full
agent discretion, on a stated time crunch and a preference for real beta
feedback over a demonstrated property on release one.

Recorded rather than left implicit: under D24 the agent authors the content
**and** sets the bar it is judged against, so **this release does not demonstrate
the property Rig exists to prove.** It is reversible one leaf at a time by
promotion under the ordinary gate, which is roadmap step 8. If D24 completes,
D23's one-release exception is retired by the approved Gate 1 amendment.
[ruling](../reasoning/2026-08-21-mvp-agent-discretion-build.md) ·
[owner approval](../reasoning/2026-08-21-d24-owner-approval.md) ·
[roadmap](../specs/mvp-roadmap.md)

---

## The technical design's own version history (v0.1–v0.16)

Moved here from the design document itself, which now just points here — the
step-by-step version bumps are a changelog, not a live design decision.

v0.1 was frozen 2026-07-24 and withdrawn by the 2026-07-25 re-grill. v0.2
absorbed 2026-07-26 rulings but was superseded the same day. v0.3 was
rewritten against `D1`–`D19` at 52 cases. v0.4 was rewritten against the
2026-08-17 host-tier amendment at 48 cases and removed every trace of the
verified/unverified tier from Rig's output and data. v0.5 adds `D20`'s bounded
policy-signer recovery path and rewrites the traceability set to 49 cases. v0.6
traces `D21`'s nineteen `AT-LF-*` lint-format cases (49→68), narrows the
release boundary to the single `development.code-quality.lint-format` leaf,
adds the Policy → Context → Evidence grade ladder with the lint-format
vertical mechanisms, and resolves the three round-3 findings. v0.7 corrects two
accepted round-4 consistency findings: only a lower-grade *failure* stops early
while a clean lower-grade pass runs through to the selected grade, and
repository-CI applicability becomes grade-aware so lint-format participates in
CI only at the Evidence grade. v0.8 incorporates `D22`'s matching clarification
in `AT-CI-3`, preserving the 68-case set while updating the signed digests.
v0.9 incorporates `D23`, Gate 1's one-release exception to `AT-SHAPE-6`: that
case's full-content evaluation applies to `development.code-quality.lint-format`
alone for this release, not all 115 leaves, leaving the 68-case set and every
other case unchanged.

v0.10 resolves the round-6 candidate-review findings without changing Gate 1:
the other 114 leaves' "red" state is defined as unauthored status and a
future-support blocker rather than a release-scoped test failure. v0.11
resolves four remaining round-5 mechanism findings: it separates the per-run
Evidence verdict from the separately approved CI graft, adds
remediation-specific terminal journal states, fails recovery registration
closed when user verification cannot be requested, and includes the six
abnormal outcomes in the report enum. v0.12 retraces D24 and the one-gate
amendment: all 115 Policy leaves, the 55 vendored skills, detected-host-only
onboarding, named-tag `5.0.0` distribution with MIT notice/provenance, and the
v2 signed oracle message that includes the testing-infrastructure manifest. It
removes every Gate-2 freeze condition; fresh review remains release evidence.

v0.13 closed the 2026-08-23 production review findings without changing the
signed oracle: all repository mutation paths share symlink-aware containment;
the JSONL install journal carries preimage/desired digests, incomplete/complete
state, crash reconciliation, and reverse removal; the payload installs 55
neutral skills plus the catalogue and safety runtime in a bare repository;
Policy packs name owned scope, applicability, disposition, and non-generic
checks; all six CI adapters have additive first-wire tests; review production
and validation share one strict schema; the root installer is POSIX `sh`. v0.14
preserves Tier 1's static-only boundary by gating those runtime files to the
root tagged-release entry point. v0.15 resolves the remaining owner choice: a
policy proposal that turns on model-assisted secret triage carries irreversible
third-party disclosure, and activation requires a verified approval bound to
that disclosure digest; the final review receipt also binds a deterministic
digest of the complete PR implementation worktree, excluding review receipts
themselves.

v0.16 closes the first implementation-bound review findings that do not change
the signed intent: one-use approvals persist consumption; activation and
recovery verify repository-, sequence-, receipt-, and nonce-bound SSHSIG
challenges; recovery commits its receipt before invalidating prior trust state;
the shipping CLI exposes uninstall and recovery; teardown restores chained
hooks, removes attributed global entries, lists purge targets before deletion,
and preserves the user-owned policy. Host support no longer uses the withdrawn
verified/unverified tier as registry data: every host instead carries six
axis-specific vendor contracts. Every Policy leaf now carries a distinct
acceptance target and pass/fail evidence contract.

---

## Reading a document by its date

| If it was written before | It still believes |
|---|---|
| 2026-07-23 | There are installable Basic / mid / Advanced tiers. |
| 2026-07-26 | Gate 1 is protected by branch protection and reviewed commits. |
| 2026-07-28 | Rig has no uninstall path, and delegation is persisted. |
| 2026-08-13 | The signature itself proves hardware presence. |
| 2026-08-17 | Hosts are split into verified and unverified. |
| 2026-08-19 | The case count is 48 or 52, and review requires a different model. |
| 2026-08-21 | There are two gates, lint-format ships alone as the one release-blocking leaf, and the catalogue holds only the 115 service leaves. |
| 2026-08-23 | The policy/control mechanisms, the action evaluator, one-use approvals, sanitation/remediation, and the service runner are still candidate design, not implemented — and the oracle signature is pending rather than already armed. |
