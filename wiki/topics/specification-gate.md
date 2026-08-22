# The specification gate

## What it is

The oracle verifier is the first, short-circuiting check in `npm test`. It
must verify the oracle's signature integrity, that every acceptance criterion
traces to a real test in the signed testing infrastructure, and every manifested
file still has its signed digest before code tests run.
Under the one-gate model (2026-08-21) it no longer checks for a separate frozen
Gate 2 authority or Gate 1↔Gate 2 traceability; the technical spec is checked
for presence, not frozen, so it cannot gate `npm test`. [AD-18/AD-28](../gate2/technical-spec.md#2-final-mechanism-decisions)

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

`scripts/check-advanced-spec.js`, the stable manifest, and `npm run test:code`
do not exist. Slice 1 builds them and all 68 substantive targets, then the owner
signs before implementation. D24 retires D23: `AT-SHAPE-6` evaluates all 115
leaves, and its product target is expected to be red until implementation
authors them. [v0.12 retrace](../reasoning/2026-08-22-gate2-v0.12-d24-retrace.md) ·
[Status](../status.md#what-exists-in-the-code-today)
