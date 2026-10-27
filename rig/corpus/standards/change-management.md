# Change management — the deployment policy

One fixed sequence takes a change from a green test run to a published
release. The steps are ordered, no step may be skipped or reordered, and
evidence from one set of bytes never counts for another. This is the policy the
owner should never have to restate: if a release is in motion, this document is
the checklist.

## Lifecycle boundaries

Feature branches enter `qa-prod` on ordinary builds, unit/integration tests,
security and applicable regressions. Existing oracle verification is read-only;
it does not require another signature for each candidate. No public release,
published archive digest or interactive authentication gates this transition.
The full release sequence below applies to production promotion/publication.

Before publication, exact-QA health and clean-install checks may download the
exact source commit and compare its complete tree against the checkout. This
proves candidate readiness, not authenticated public-release installation.
After authenticated publication, verify the actual release asset against its
independently trusted SHA-256 and run offline installation on those bytes.
These post-publication checks cannot be prerequisites for their own publication.
Their failures block certification/closeout and invoke recovery.

Routine CI evidence is verified through the existing CI provider and exact
repository, workflow and commit identity. Local worker evidence is provisional;
production certification requires one integration batch signed by the existing
Gate 1 root. Actual release publication separately requires a real signature,
even if the everyday sign-off mode allows acknowledgements. No new trust root
or routine-QA signing ceremony is introduced.

It sits on top of the delivery SOP (`delivery-sop.md`, how the work gets done)
and the AI development standards (`ai-sdlc.md`, what counts as evidence).

## Enforced when the check ships

- **The release gate runs the sequence in order and stops at the first unmet
  step.** `node scripts/check-deployment-gate.js --receipt <path>` proves, in
  this order: the signed oracle verifies, the working tree is clean, the
  full repository gate actually passes without changing publishable files,
  review receipt covers the frozen acceptance cases and binds to the current
  implementation, technical design and catalogue, the changelog names the current version,
  and the tracker/coherence gate passes. It prints the whole checklist with the
  first failure named, and exits non-zero. An enforced installation wires it
  into the workflow that promotes a candidate; Rig wires it into
  `.github/workflows/release-eligibility.yml`, which already refuses to run
  against anything but the exact QA head.

## The sequence

### 1. Candidate freeze

The task list is closed: every box is `[x]`, or is an owner-only (🔒) box with
its exact input prepared. The working tree is clean and every change is
committed. Generated files are regenerated, not hand-edited.

**Why the tree must be clean:** the implementation digest hashes every
publishable file, tracked and untracked alike. An uncommitted file means the
reviewed bytes are not the pushed bytes.

### 2. The signed oracle verifies

`node scripts/check-advanced-spec.js`. Agents never edit frozen tests and never
sign. If the candidate needs a frozen file changed, the change is filed as a
candidate amendment and the sequence pauses here until the owner re-signs — one
batched signature, not one per change.

### 3. The full repository gate is green on the final bytes

`npm test`, run once, against the exact bytes that will be pushed. A green run
from an earlier tree is not evidence. The fast focused test command belongs to
the inner loop and never substitutes for this.

The deployment checker executes `npm test` itself and rejects a run that changes
publishable files. A receipt path alone never proves that tests ran. Promotion
also repeats the gate in the exact-QA health workflow.

### 4. A review receipt binds to those exact bytes

`node scripts/review-receipt.js` with no `--interim`, started fresh. The
reviewer contributes findings only; the wrapper authors the digests and the
timestamp, so a receipt cannot be back-dated or re-pointed. A receipt whose
`implementation_digest` does not match the current tree is stale and does not
count. Every finding is fixed or answered in writing before the sequence
continues.

The authorized release operator passes the wrapper's output unchanged. Receipt
validation checks current bindings and coverage; it does not authenticate the
producer. Workflow-dispatch permissions and receipt custody remain operational
controls, not assurances provided by JSON fields.

Write the receipt outside the tree it binds, or into an ignored path. The
implementation digest hashes every publishable file, so a receipt committed —
or left untracked — inside the repository changes the very bytes it claims to
describe.

Before a binding attempt, finish deterministic checks, consolidate all known
findings, optionally obtain independent nonbinding reviews, freeze the candidate
and establish green relevant CI. One comprehensive binding review examines the
complete candidate. Fix every finding in one batch with relevant regressions.
Re-review targets that batch, the remediation and its interactions while still
returning every required acceptance verdict. Serious new defects are recorded
and fixed; unchanged findings need new evidence to reopen.

No automatic review/fix loop runs. Persist the exact reviewed candidate, complete
report, finding batch and attempt history; a pass or interim check never resets
that history. Provider errors, malformed output and timeouts do not consume a
completed-verdict attempt. The existing authorization cap escalates unresolved
work to the owner; an explicit additional attempt does not erase history or
authorize another retry. Success requires every mandatory finding resolved and
all required checks green. The PR159 owner authorization permits exactly one
additional binding attempt, only after the candidate is ready.

### 5. Docs, trackers and version agree

`node scripts/check-versions.js` and `node scripts/check-coherence.js`. The
changelog carries an entry for the version being released. Trackers describe
the state actually being shipped.

### 5a. Documentation is current

Any feature, behaviour change, or architectural change visible to users updates
`docs/` in the same change set. A release that adds, changes, or removes
user-facing behaviour without a corresponding docs update does not pass this
step. The changelog entry names the docs files updated.

This step is a human check: confirm that `docs/install.md`, `docs/vision.md`,
and `docs/architecture.md` reflect the current release. The deployment checker
does not automate this step; a future amendment will add the script check.

### 6. Push, one PR, required checks green on the exact head

One branch, one PR to the QA branch. Required status checks — including the
frozen-oracle pin — must be *required*, not merely reporting, on the QA branch
as well as production. A check that reports without blocking is not a gate.

### 7. QA promotion on exact-SHA automated evidence

Promotion runs against the exact QA head commit and nothing else: an automated
health run plus a real-download clean install of that exact candidate source.
This prepublication download is distinct from the authenticated release asset.
No manual
outside-the-repository install step gates the promotion.

### 8. Tag, release, then close

Publish the tag and the release. Only then run the post-publication
tagged-download smoke test and the documented install flow, because both
resolve the published tag. Tracker closures happen here — after QA promotion
and the tag — so no task stays open against a closed issue.

### 9. On any red step

Fix forward. Then re-enter the sequence at step 3, because the bytes changed:
a new full gate run and an exact-byte receipt from the controlled remediation
review. Never carry evidence across a code change or silently reset attempts.

## What this policy refuses

- Evidence from a different tree than the one being shipped.
- A receipt, a gate run, or a health run that an agent reports without having
  executed it in that session.
- A reordered sequence: tagging before promotion, closing trackers before the
  tag, promoting on a reporting-only check.
- An agent performing an owner-only step. Those are prepared and handed over
  with the exact command, never executed on the owner's behalf.
