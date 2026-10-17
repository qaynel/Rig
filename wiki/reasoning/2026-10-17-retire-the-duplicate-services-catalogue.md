---
date: 2026-10-17
source: agent
topics: [the-catalogue, delivery-plan, central-corpus]
decisions: [retire rig/catalog.json and rig/catalog/services in favour of rig/corpus]
status: done
summary: The v6.0.0 tree shipped two full 115-service catalogues. The pre-corpus one under rig/catalog is now deleted; rig/corpus/catalogue.json is the only one.
---

# Retiring the duplicate services catalogue

North star 7 moved the canonical corpus to `rig/corpus/`, and the signed oracle
pins it: AT-PB-1 digests `rig/corpus/catalogue.json` plus its 1,035 service
fragments and AT-SHAPE-6 now asserts no fragment reads as generic baseline
policy. What the migration never did was remove what it replaced. Until today
the branch carried both catalogues:

- `rig/catalog.json` — 115 services, fragments under `catalog/services/`
- `rig/corpus/catalogue.json` — the same 115 services, fragments under
  `corpus/services/`

Every one of the 805 files in `rig/catalog/services/` existed at the identical
relative path under `rig/corpus/services/`, and every one differed in content:
the old copy is the untailored draft whose wording the oracle now rejects. Both
were listed in `rig/manifest.json` as `active_delivery` copies, so every
installed repository received 3.1 MB of superseded guidance in
`.rig/runtime/rig/catalog/services/` that nothing in `rig/lib/` ever read.

Done: deleted `rig/catalog.json` and `rig/catalog/services/` (806 files), with
their two manifest entries. Repointed the five tests and two scripts that still
loaded the old catalogue — `advanced-catalogue`, `advanced-services`,
`advanced-lint-format`, `advanced-resolve`, `advanced-acceptance`,
`author-policy-catalogue.js` and `review-receipt.js`'s `--catalogue` default —
at `rig/corpus/catalogue.json`, and dropped the two retired install paths from
`release-blockers`. Nothing frozen was touched: the gate-1 manifest's own
`path-b-catalog` already reads the corpus path.

One product fix fell out of it. `catalogueDigest` in `rig/lib/release-evidence.js`
resolved fragment paths against `path.dirname(catalogPath)`, which was `rig/`
only because the old catalogue sat at `rig/catalog.json`. The corpus catalogue
lives one level deeper, so the digest looked for `rig/corpus/corpus/services/…`
and threw `ENOENT` the moment `review-receipt.js` ran. It now resolves against
the parent of the catalogue's directory. This is why T-10.5 could not have
produced a receipt before today regardless of who fired it.

In flight: the full gate on the reduced tree.

Next: the T-10.5 receipt against these bytes, then the PR's required checks.

## What was looked at and deliberately kept

- `rig/catalog/skills/` (304 files) is not a duplicate. It is the pinned
  reference the upstream shelf fetch is verified against (`upstream-shelf`,
  `upstream-onboarding`) and the input `scripts/build-skill-catalog.js` digests
  into the shipped `.rig/catalog.json`.
- `rig/catalog/plumbing/` is named by `rig/corpus/corpus.json` and allowlisted
  in `rig/spawn-guard-allowlist.json`.
- `rig-mcp/` and `rig/mcp-runtime/` hold two byte-identical files
  (`index.js`, `instructions.js`). Merging them means changing the
  `npm test --prefix rig-mcp` entrypoint, and `package.json` scripts are pinned
  by the signed `wiki/gate1/package-scripts.json`. Same blocker as T-6.6.
- The 68 other byte-identical tracked pairs are the host projections of the
  corpus, which `corpus-contract` proves reproducible.
