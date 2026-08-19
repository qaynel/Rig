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
| `project-dev-docs/current/sow.md` | [`wiki/specs/sow.md`](../specs/sow.md) |
| `project-dev-docs/current/tasklist.md` | [`wiki/specs/tasklist.md`](../specs/tasklist.md) |
| `project-dev-docs/roadmap.md` | [`wiki/specs/roadmap.md`](../specs/roadmap.md) |
| `project-dev-docs/current/reference/*` | [`wiki/sources/reference/`](../sources/reference/) |
| `project-dev-docs/current/reviews/*` | [`wiki/sources/reviews/`](../sources/reviews/) |
| `project-dev-docs/archive/grilling/*` | [`wiki/sources/logs/`](../sources/logs/) |
| `project-dev-docs/archive/foundational/` | [`wiki/sources/superseded/foundational/`](../sources/superseded/foundational/) |
| `project-dev-docs/archive/tier-1-design-docs/` | [`wiki/sources/superseded/tier-1-design-docs/`](../sources/superseded/tier-1-design-docs/) |
| `project-dev-docs/archive/deprecated-tier-taxonomy/` | [`wiki/sources/superseded/deprecated-tier-taxonomy/`](../sources/superseded/deprecated-tier-taxonomy/) |

## Why some links inside the documents are broken

**Gate 1, Gate 2, and preserved sources were not edited during the move.** Their
relative links still point at the old layout, so a few of them do not resolve.

This is deliberate, and it is the correct trade.

- **Gate 1 is frozen and digest-pinned.** `business-spec.md` and `acceptance.md`
  hash to `5f26ce2b…` and `9ec0ac94…`, and those values are pinned in Gate 2's
  header, in the live round-3 review receipt, and in the message the intent owner
  must sign. Editing one character to fix a link would change the digest, void
  the receipt, and invalidate the pending signature ceremony. A broken relative
  link costs a reader one lookup on this page; a changed digest costs the project
  a review cycle.
- **Gate 2 is a candidate with a live review bound to its exact bytes.** The same
  logic applies: `c0333c36…` is what round 3 reviewed, and editing the file voids
  that receipt.
- **Decision logs, captured references, review receipts, and superseded designs
  are source records.** Old paths inside them are evidence of what the record
  said at the time, so the wiki does not rewrite those paths after the fact.

Digests were verified byte-identical immediately after the move.

**When each becomes editable:** Gate 2's links can be corrected during the next
revision that fixes the round-3 findings, since that edit changes the digest
anyway. Gate 1's links can only be corrected by a genuine return to grilling —
which means they will likely stay as they are, and this page is the answer.

## Paths inside Gate 2 that name artifacts

Gate 2 §1 and §13 refer to two files that do not exist yet:

| Named in Gate 2 as | Should be created at |
|---|---|
| `project-dev-docs/current/gate1.sig` | `wiki/gate1/gate1.sig` |
| `project-dev-docs/current/gate1.allowed-signers` | `wiki/gate1/gate1.allowed-signers` |

Slice 1 builds the verifier that reads them. Whoever writes it should take the
paths from this table, not from Gate 2's prose — and correct that prose in the
same revision that resolves the round-3 findings.

## Things outside the wiki that referenced the old path

Updated in the same change: the three root READMEs, `AGENTS.md`, `CLAUDE.md`,
`GEMINI.md`, the six byte-checked host rule copies, current code/test source
comments, the secret-hygiene test's Gate 1 path, and current subordinate specs.

Nothing in `scripts/` or `package.json` hardcodes the old paths.
