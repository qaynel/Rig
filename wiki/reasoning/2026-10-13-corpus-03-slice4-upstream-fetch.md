---
date: 2026-10-13
source: agent
topics: onboarding-flow, distribution-and-release
decisions:
status: current
supersedes:
tags: corpus, upstream, interdependency
summary: Subplan 03 slice 4 — pinned third-party fetch at onboarding: staging download, tar-digest verify, strict tar extraction, base-digest check, RIG-135 patches applied to fetched bytes and checked against pinned results, named gaps, journaled receipt that check enforces; whole-shelf replacement deferred with a recorded gap.
---

# 03 central corpus — slice 4: third-party fetch

## Done

- `rig/corpus/upstream/gstack.json`: repository, revision `7c9df1c5…`, archive
  URL, tar digest (taken from two independent real downloads), licence digest,
  rename table, per-file base and final digests, the three RIG-135 patches with
  digests and order. Patches live in `rig/corpus/upstream/patches/`.
- `rig/lib/upstream-fetch.js` (+ `tar-read.js`, `patch-apply.js`): licence check
  first; download to a staging dir; gunzip and compare the tar digest before
  reading any entry; strict extraction (regular files only; symlink, hard link,
  device, absolute and `..` paths refused); per-file base digest after the
  namespace rename; patches verified by digest then applied exactly; results
  compared to pinned digests. Every failure is a named gap with guidance:
  `upstream-unavailable`, `digest-mismatch`, `archive-invalid`,
  `patch-base-mismatch`, `patch-tampered`, `patch-failed`,
  `patch-result-mismatch`, `licence-missing`.
- Verified against the real pinned archive (once, manually): patching the
  renamed upstream reproduces the shipped `browser-skill-commands.ts`,
  `xvfb.ts`, `cookie-import-browser.ts` and `process-tree.ts` byte for byte.
- Onboarding: optional `upstream_fetch` proposal key `[{id, tar_sha256}]`, bound
  into the signed digest and required to equal the installed pin. Apply fetches
  (child process, so the sync handler keeps its shape) only after approval and
  preflights, refuses the whole apply on any gap with nothing written, writes
  `.rig/fetched/<id>/…` plus `receipt.json` through the journal, and `check`
  fails if a fetched file or the receipt changes. `RIG_UPSTREAM_MIRROR_<ID>`
  redirects the URL (https or file://); the digest check is unchanged.
- Tests: `tests/upstream-fetch.test.js` (11) and `tests/upstream-onboarding.test.js`
  (5) use a committed 18 KB subset fixture and file:// mirrors; no network.
  Mutation: disabling the digest check turns three tests red.

## Rulings

1. Whole-shelf replacement is not done: 83 of 298 shelf files carry Rig-authored
   changes not derivable from upstream, and AT-PB-3 pins the staged shelf. Gap
   and pending amendment recorded in `candidate-amendments/03-central-corpus.md` A2.
2. Patch copies under `rig/corpus/upstream/patches/` duplicate the wiki
   candidate-amendment patch files; the wiki copies are immutable provenance and
   the slice 6 uniqueness test excludes `wiki/`.
3. The tar digest, not the gzip digest, is authoritative (gzip bytes can vary
   between mirrors with the same content).
