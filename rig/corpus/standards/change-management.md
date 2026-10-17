# Change management — the deployment policy

One fixed sequence takes a change from a green test run to a published
release. The steps are ordered, no step may be skipped or reordered, and
evidence from one set of bytes never counts for another. This is the policy the
owner should never have to restate: if a release is in motion, this document is
the checklist.

It sits on top of the delivery SOP (`delivery-sop.md`, how the work gets done)
and the AI development standards (`ai-sdlc.md`, what counts as evidence).

## Enforced when the check ships

- **The release gate runs the sequence in order and stops at the first unmet
  step.** `node scripts/check-deployment-gate.js --receipt <path>` proves, in
  this order: the signed oracle verifies, the working tree is clean, the review
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

A failing verdict is real signal. The re-review cap exists so a `fail` is
reported rather than retried; a second consecutive fail stops the release and
goes to the owner.

### 5. Docs, trackers and version agree

`node scripts/check-versions.js` and `node scripts/check-coherence.js`. The
changelog carries an entry for the version being released. Trackers describe
the state actually being shipped.

### 6. Push, one PR, required checks green on the exact head

One branch, one PR to the QA branch. Required status checks — including the
frozen-oracle pin — must be *required*, not merely reporting, on the QA branch
as well as production. A check that reports without blocking is not a gate.

### 7. QA promotion on exact-SHA automated evidence

Promotion runs against the exact QA head commit and nothing else: an automated
health run plus a real-download clean install. No manual
outside-the-repository install step gates the promotion.

### 8. Tag, release, then close

Publish the tag and the release. Only then run the post-publication
tagged-download smoke test and the documented install flow, because both
resolve the published tag. Tracker closures happen here — after QA promotion
and the tag — so no task stays open against a closed issue.

### 9. On any red step

Fix forward. Then re-enter the sequence at step 3, because the bytes changed:
a new full gate run, a new receipt. Never carry evidence across a code change.

## What this policy refuses

- Evidence from a different tree than the one being shipped.
- A receipt, a gate run, or a health run that an agent reports without having
  executed it in that session.
- A reordered sequence: tagging before promotion, closing trackers before the
  tag, promoting on a reporting-only check.
- An agent performing an owner-only step. Those are prepared and handed over
  with the exact command, never executed on the owner's behalf.
