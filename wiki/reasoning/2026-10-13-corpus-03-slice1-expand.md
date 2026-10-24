---
date: 2026-10-13
source: agent
topics: onboarding-flow, graft-mechanics
decisions:
status: historical
supersedes:
tags: corpus, projection, interdependency
summary: Subplan 03 slice 1 (Expand) — rig/corpus/ now exists with one pure project(corpus, host, selection) and a projector per served host; a golden v5 inventory proves it reproduces the v5 installer bytes for 26 configurations with zero intended differences; frozen pins decided what stays where.
---

# 03 central corpus — slice 1: Expand

Written at the end of the slice, per the three-minute cadence.

## Done

- `rig/corpus/` holds the canonical copies: skills (`skills/<name>/SKILL.md`,
  onboarding playbook), `rules/`, `routing.md`, `allowed-signers.example.md`,
  host `projections/` (one pure module per served host plus the adapter text),
  antigravity `workflows/`, `upstream/gstack.json` (pinned revision, archive
  and tar digests, licence, provenance), `standards/` stub, and `corpus.json`
  (the descriptor: skill order, adapter paths, external sources).
- `rig/lib/project.js` is pure: `project(corpus, host, selection)` and
  `projectAll`. `rig/lib/corpus.js` is the only loader that reads the disk.
- Parity: `tests/fixtures/v5-install-golden.json` is the v5 installer's output
  captured at b7f72117 for 13 host configurations in default and active
  delivery. `tests/corpus-projection.test.js` asserts project() reproduces it
  (the intended-differences file is empty and a stale exemption fails the
  test). Purity is asserted two ways: a static scan of the projectors for I/O
  and network modules, and a run with the fs functions trapped.
- `scripts/project-repo.js` regenerates this repo's twins (Claude/Codex skill
  dirs, Antigravity workflows, six rule copies) from the corpus; `--check` is
  green today. It is also the first production caller of project()/corpus.js,
  which keeps `runtime-caller-graph` green.

## Rulings (implementation level; none changes a North star)

1. **Services and the vendored shelf stay at `rig/catalog/**` for now.** The
   signed oracle pins their source paths and bytes: AT-PB-1 hashes
   `rig/catalog.json` plus `rig/catalog/services/**`; AT-PB-3 and the licence
   check read `rig/catalog/skills/**`. Moving them turns frozen cases red and
   collides with subplan 04's merges. `corpus.json` records them as
   `external_sources` with the reason; the relocation goes into the 03
   candidate-amendment bundle.
2. **`skills/rig/SKILL.md` is the single copy of the implementation skill.**
   Plugin hosts load it from that path, and the corpus descriptor points at it
   instead of duplicating it (a duplicate would violate the no-twin rule).
3. **Generated twins remain checked in** (native skill dirs, workflows, six
   rule copies) because host agents read them on a fresh clone. They are
   reproducible from the corpus and guarded by `project-repo --check`; the
   hand-authored sources move.
4. **Red-first note.** The projection modules were drafted before the parity
   test; red was shown by removing the seam (module not found) and by a
   mutation (one projector path changed: 4 configurations fail).

## In flight / next

Slice 2 (Migrate): payload.js and onboarding.js call project(); trim the host
copy rows from `rig/manifest.json`; fix the stale markdown-only line once;
MCP descriptor/write-path equivalence; remove `materializeSelectedHosts`
(frozen AT-HOST-5 calls it, so it goes into the amendment bundle).
