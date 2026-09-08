---
date: 2026-09-05
source: agent
topics: agent-working-conventions, the-overhaul, the-catalogue
decisions:
status: current
supersedes:
tags: interdependency, trap
summary: Measurements against the intent owner's proposed overhaul (kill the tier system, rename vendored files, make the wiki an active reference) — the wiki-maintenance pass grew the wiki by +2,334 lines net, the navigation layer is now ~500K on its own, Tier 1 is 17 files/76K against a 128-file rename blast radius, and rig/catalog/skills ships LICENSE.upstream and UPSTREAM.md so a mass rename is a licensing decision rather than a cleanup.
---

# Overhaul scope — measurements

Office-hours session, 2026-09-05. The intent owner proposed a three-part
overhaul: (1) make the wiki an active routed reference rather than a passive
dump, (2) remove the tier system, (3) rename every vendored file to `rig`.
They asked whether that is the correct shape before committing. These are the
measurements taken against that question. No code was written.

## M1 — the wiki-maintenance pass grew the wiki

PR #146 (`wiki-2026-09-04-overhaul-and-maintenance`, merged `e5f62c63`) is
**68 files changed, +2,470 / -136**. Net **+2,334 lines**. A pass whose stated
purpose was overhaul and maintenance added roughly seventeen lines for every
one it removed.

This is direct empirical support for the root cause filed in
`2026-09-04-structural-workflow-fix-design.md`: the write path is mandatory,
the read path is advisory. The maintenance skill has an add path and no delete
budget, so applying it correctly still grows the corpus.

## M2 — the navigation layer is itself a corpus

| Directory | Size |
|---|---|
| `wiki/` total | 3.7M |
| `wiki/reasoning/` (194 traces) | 1.4M |
| `wiki/tickets/` | 472K |
| `wiki/sources/` | 392K |
| `wiki/topics/` (26 hubs) | 284K |
| `wiki/archive/` | 272K |
| `wiki/gate2/` | 256K |
| `wiki/index/` | 212K |
| `wiki/gate1/` | 200K |
| `wiki/specs/` | 168K |

Reasoning is only 38% of the wiki. The *map* — `topics/` plus `index/` — is
**~496K**, and individual map pages have outgrown the things they index:

- `wiki/index/decisions.md` — **55,724 bytes** (~14k tokens)
- `wiki/topics/onboarding-flow.md` — **36,775 bytes**, **65 outbound links**
- `wiki/topics/trust-and-failure-boundaries.md` — 26,607 bytes
- `wiki/topics/testing-strategy.md` — 21,267 bytes

Orientation cost before reading a single trace: `agent-primer.md` (2,978) +
`Home.md` (7,233) + `status.md` (8,455) + `index/decisions.md` (55,724) +
`glossary.md` (11,898) = **86,288 bytes ≈ 21k tokens**. Add one topic hub and
it clears 27k tokens with zero primary source read.

**Trap.** A hub carrying 65 links is not a bounded reference; it is a second
unbounded read. "Trim the wiki and route through references" cannot be
satisfied by improving the map, because the map is subject to the same
asymmetry that produced the traces. M1 is what that looks like when attempted.

## M3 — Tier 1 is 0.6% of the mass and 128 files of blast radius

`rig/tier-1/` is **17 files, 76K**: `routing.md`, 7 skill payloads, 2 rules,
5 adapters, an allowed-signers example.

Against `rig/` at 12M, Tier 1 is roughly **0.6%** of the code mass. But
`tier-1` / `tier 1` is referenced in **128 files** outside `wiki/reasoning/` —
7 root docs (`README.md`, `README.es.md`, `README.ko.md`, `AGENTS.md`,
`GEMINI.md`, `CLAUDE.md`, `.windsurf/rules/rig.md`), 9 test files,
`.agents/` and `.claude/` skill copies, `wiki/glossary.md`,
`wiki/agent-primer.md`, `wiki/status.md`, and ~30 tickets.

So removing the tier system is a 128-file rename over 0.6% of the mass. Its
value is truth-in-labeling — "Tier 1" names the markdown-only doctrine the
intent owner retired at grilling B2, and `CLAUDE.md` still asserts that
doctrine twice — not context reduction. It should ride along with a change
that is already touching the manifest and the root docs, not be sequenced as
an overhaul in its own right.

## M4 — the vendored rename is a licensing decision

`rig/catalog/` is 11M of the 12M under `rig/`:

| Path | Size |
|---|---|
| `rig/catalog/skills/` | 6.9M |
| `rig/catalog/services/` | 3.1M |
| `rig/catalog/plumbing/` | 1.1M |
| `rig/catalog/baseline/` | 36K |

`rig/catalog/skills/` ships `LICENSE.upstream` and `UPSTREAM.md` at its root,
and `rig/catalog/plumbing/lib/diagram-render/THIRD-PARTY-LICENSES.md` exists.
The tree declares its own provenance.

Renaming those files to `rig-*` would therefore not be a cleanup. It would
re-badge 6.9M of third-party skills as first-party while retaining the
maintenance burden and discarding the ability to pull upstream fixes, against
files that carry an explicit upstream license. It also inverts the direction
filed in `2026-09-04-finished-product-design.md` finding 4 (*reference, do not
vendor*). Noted for the record: the repo ships
`rig/catalog/services/product-security/license-compliance/attribution` while
this rename was under consideration.

## M5 — the ratio

Differentiated product surface (Tier 1 skills + the signing gate) is on the
order of **76K**. Read surface carried in the repository is **~15M**
(`rig/` 12M + `wiki/` 3.7M). Roughly **200:1**.

Every mechanism-level fix to context burn is fighting that ratio. Deletion
moves the ratio; navigation does not.

## Status of the two 2026-09-04 designs

Neither has shipped. `scripts/mistakes.js` and
`scripts/check-mistakes-ledger.js` do not exist. `wiki/mistakes/` holds
`README.md` and `guarantee-sharding.md` only. `rig/catalog/` is untouched at
11M. Zero open PRs. Trace count moved 185 → 194 since the diagnosis was filed.

## Handed back

Four shapes for the overhaul were put to the intent owner: bounded query plus
deletion with the tier rename riding along; wiki-only first; the overhaul as
originally described; or map-layer caps first as the cheapest measurable win.
Decision pending — no implementation begun.
