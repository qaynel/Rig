# Path map

`project-dev-docs/` became `wiki/` on 2026-08-19. Every file moved with
`git mv`, so history follows each one.

## Where everything went

| Was | Now |
|---|---|
| `project-dev-docs/README.md` | [`wiki/Home.md`](../Home.md) *(rewritten)* |
| `project-dev-docs/current/handoff.md` | [`wiki/status.md`](../status.md) *(rewritten)* |
| `project-dev-docs/current/spec/business-spec.md` | [`wiki/gate1/business-spec.md`](../gate1/business-spec.md) |
| `project-dev-docs/current/acceptance.md` | [`wiki/gate1/acceptance.md`](../gate1/acceptance.md) |
| `project-dev-docs/current/spec/technical-spec.md` | [`wiki/gate2/technical-spec.md`](../gate2/technical-spec.md) |
| `project-dev-docs/current/spec/product-spec.md` | [`wiki/specs/product-spec.md`](../specs/product-spec.md) |
| `project-dev-docs/current/spec/host-coverage-spec.md` | [`wiki/specs/host-coverage-spec.md`](../specs/host-coverage-spec.md) |
| `project-dev-docs/current/sow.md` | Removed 2026-08-20 by cleanup ruling |
| `project-dev-docs/current/tasklist.md` | Removed 2026-08-20 by cleanup ruling |
| `project-dev-docs/roadmap.md` | Removed 2026-08-20 by cleanup ruling |
| `project-dev-docs/current/reference/*` | [`wiki/sources/reference/`](../sources/reference/) |
| `project-dev-docs/current/reviews/*` | [`wiki/sources/reviews/`](../sources/reviews/) |
| `project-dev-docs/archive/grilling/*` | [`wiki/sources/logs/`](../sources/logs/) |
| `project-dev-docs/archive/foundational/` | [`wiki/sources/superseded/foundational/`](../sources/superseded/foundational/) |
| `project-dev-docs/archive/tier-1-design-docs/` | [`wiki/sources/superseded/tier-1-design-docs/`](../sources/superseded/tier-1-design-docs/) |
| `project-dev-docs/archive/deprecated-tier-taxonomy/` | [`wiki/archive/deprecated-tier-taxonomy/`](../archive/deprecated-tier-taxonomy/) |

## Why some links inside the documents are broken

**Gate 1 and preserved sources were not edited during the move.** Their relative
links still point at the old layout, so a few of them do not resolve. Gate 2 and
editable subordinate docs were corrected when their bytes next moved.

This is deliberate, and it is the correct trade.

- **Gate 1 is frozen and digest-pinned.** `business-spec.md` and `acceptance.md`
  currently hash to `07afa02f…` and `1d9b7a4…`, and those values are pinned in
  Gate 2's header. Editing one character to fix a link would change the digest
  and require a real return to grilling.
- **Gate 2 is editable while candidate.** Its old layout links were corrected in
  v0.10 while the candidate digest was already moving for round-6 findings.
- **Decision logs, captured references, review receipts, and superseded designs
  are source records.** Old paths inside them are evidence of what the record
  said at the time, so the wiki does not rewrite those paths after the fact.

Digests were verified byte-identical immediately after the move; Gate 2 has
moved since as part of normal candidate revision.

**When each becomes editable:** Gate 1's links can only be corrected by a
genuine return to grilling. Preserved sources stay as written.

## Paths inside Gate 2 that name artifacts

Gate 2 now names the current signer-artifact paths directly:
`wiki/gate1/gate1.sig` and `wiki/gate1/gate1.allowed-signers`.
The legacy `project-dev-docs/current/` signer artifacts are not valid trust
roots and must not be recreated.

## Things outside the wiki that referenced the old path

Updated in the same change: the three root READMEs, `AGENTS.md`, `CLAUDE.md`,
`GEMINI.md`, the six byte-checked host rule copies, current code/test source
comments, the secret-hygiene test's Gate 1 path, current subordinate specs, and
the editable `docs/superpowers/` spec-gate plan.

Nothing in `scripts/` or `package.json` hardcodes the old paths.
