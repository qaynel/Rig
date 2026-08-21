# The specification gate

## What it is

The specification gate is the first, short-circuiting check in `npm test`. It
must verify Gate 1 integrity, exact Gate 1/Gate 2 traceability, one sole Gate 2
authority, current review evidence, and the existence and real result output of
every named executable target before code tests run. [Gate 2 AD-18/AD-28](../gate2/technical-spec.md#2-final-mechanism-decisions)

## Why it is this way

The current suite can be green while placeholder catalogue content remains, and
`node --test` may return success for a missing target. Ordering is therefore a
product requirement: code tests cannot mask a broken or incomplete oracle.
[Acceptance AT-GATE-2](../gate1/acceptance.md#0-ordered-completion-gates)
[Known traps](../index/traps.md)

## What binds it

`AD-18` requires an executable transcription of Gate 1; `AD-28` fixes signature
verification and test ordering. Gate 2 §13 defines the exact traceability table,
and Slice 1 owns the first implementation. [Gate 2 §13–14](../gate2/technical-spec.md#13-acceptance-traceability)

## What was rejected

An exemption flag, an advisory check, trusting runner exit codes alone, and
allowing the implementer to revise Gate 1 were rejected because each permits a
false green result. [Gate 2 §2.1](../gate2/technical-spec.md#21-rejected-approaches)

## Authorities and sources

- Frozen ordering: [Gate 1 acceptance](../gate1/acceptance.md)
- Mechanism and traceability: [Gate 2 §13](../gate2/technical-spec.md#13-acceptance-traceability)
- Planned first slice: [Gate 2 Slice 1](../gate2/technical-spec.md#slice-1---specification-authority-and-complete-executable-oracle)

## What is still open

`scripts/check-advanced-spec.js` and `npm run test:code` do not exist. Slice 1
cannot begin until Gate 2 passes review and freezes. [Status](../status.md#what-exists-in-the-code-today)

When Slice 1 is built, it must implement `AT-SHAPE-6` under D23's one-release
exception: full-content evaluation applies to
`development.code-quality.lint-format` alone for this release, not all 115
leaves. This is a dated, named carve-out, not the gate's standing behavior —
see [the authored-service gate](authored-service-gate.md#what-is-still-open)
and [the reasoning trace](../reasoning/2026-08-21-at-shape-6-one-release-exception.md).
Gate 2 v0.10 carries the same release scoping into the code-test layer: Slice 2
may assert the other 114 leaves are red/unauthored as status, but that expected
state is not a failing `npm test` exit for the lint-format-only release. See
[the round-6 correction trace](../reasoning/2026-08-21-gate2-v0.10-round6-corrections.md).
