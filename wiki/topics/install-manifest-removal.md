# Install manifest and removal

## What it is

The install manifest records every Rig write, its ownership class, preimage or
hash evidence, and whether the install is complete. An interrupted install
resumes from that record; removal deletes Rig-owned files and managed regions
while preserving all later user edits it cannot prove it owns. [Gate 2 §7.6](../gate2/technical-spec.md#76-install-manifest-resume-and-removal)

## Why it is this way

Removal is part of the product, not cleanup left to the user. A manifest makes
ownership explicit from the first write. Best-effort removal is safer than
snapshot restoration because returning a file to its old bytes would discard
legitimate work added after installation. [Gate 1 D11/D14](../gate1/business-spec.md)

## What binds it

`D11` defines complete removal, `D14` defines resume and truthful partial state,
and `AD-10` requires receipt-last transaction ordering. `AT-INSTALL-*` and
`AT-REMOVE-*` are the frozen lifecycle cases. [Decision index](../index/decisions.md)
[Acceptance index](../index/acceptance-cases.md)

## What was rejected

Snapshot restore, destructive rollback as a second teardown system, deletion of
user-owned files, and claiming partially applied controls are active were
rejected because they risk data loss or fabricate protection. [Rejected approaches](../index/rejected.md)

## Authorities and sources

- Frozen lifecycle intent: [Gate 1 §2](../gate1/business-spec.md)
- Manifest, resume, and removal: [Gate 2 §7.6](../gate2/technical-spec.md#76-install-manifest-resume-and-removal)
- Original lifecycle rulings: [advanced grilling GA-12](../sources/logs/advanced-grilling.md#ga-12--the-lifecycle-re-grill-2026-07-28)

## What is still open

**Resolved 2026-08-20.** The round-3 blocker was exactly this boundary: Gate 2
§6.6 said failed apply rolls everything back, while §7.6 and `AT-INSTALL-1`
preserve completed writes for resume. §6.6, §10, and `AD-10` now state the
manifest-and-resume model as the apply's only failure behavior, and
`rig/lib/apply.js` implements the `.rig/install-manifest.jsonl`
record-before-mutate/resume mechanics for the writes apply performs.
[Reasoning trace](../reasoning/2026-08-20-resolve-at-install-1.md) ·
[Status](../status.md#the-blocker-round-3-failed--one-finding-now-resolved-in-candidate-text)

Still unbuilt: preimage content-addressed storage and the reverse-walk
removal/uninstall path this page describes above. Both are Slice 12's job.
Three other round-3 findings and a fresh review still block the Gate 2
freeze — this resolves only the blocker, not the candidate as a whole.
