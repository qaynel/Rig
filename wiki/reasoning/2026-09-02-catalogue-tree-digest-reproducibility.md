---
date: 2026-09-02
source: agent
topics: onboarding-flow, testing-strategy
decisions:
status: current
supersedes:
tags: trap, verification
summary: The skill-shelf tree_digest folds nine mode bits (fs.statSync().mode & 0o777) into a value it calls reproducible; only the executable bit is git-tracked, so a checkout under a group-writable umask moves every row's digest and turns npm test red on a fresh clone and stale on approved proposals. The catalogue --check gate cannot catch it because it regenerates and string-compares inside one process on one machine, where the umask cancels. Preventive rule: every hash input must be git-tracked state or explicitly canonicalized, and a reproducibility check must vary the environment (or hold one input constant while varying another) or it proves nothing.
---

# The catalogue tree digest depends on the checkout machine, and nothing could catch it

## What leaks

`skillTreeDigest` (`rig/lib/skill-catalog.js:180`) builds a per-file record of
`{ path, mode, sha256 }` for every file under a skill's source directory and
hashes the canonical list. The `mode` field is `fs.statSync(file).mode & 0o777`
— nine permission bits.

Git versions exactly one of those bits: owner-execute (`100644` vs `100755`).
The other eight are written by the checking-out machine's `umask` at checkout
time. `umask 022` yields `644`; `umask 002` (common on shared Linux build
boxes, corporate base images, some Docker images) yields `664`. So
`tree_digest` is a function of `(file content, checkout umask)`, not
`(file content)`. Byte-identical files under a different umask produce a
different digest for every one of the 63 catalogue rows.

The comment three lines above the function asserts the opposite: "Walk order
and mode bits are fixed so the value is reproducible." Walk order genuinely is
normalized — `readdirSync(...).sort(...)` at `:184`. "Mode bits are fixed" was
an assumption that was never re-derived; they follow the environment.

## Blast radius

- **`npm test` on a fresh clone.** `scripts/check-versions.js` shells to
  `build-skill-catalog.js --check`, which regenerates the catalogue in memory
  and string-compares it to the committed `rig/catalog/skills/catalog.json`
  (`build-skill-catalog.js:27`). Under a group-writable umask every row's
  `tree_digest` differs → the check reports the file stale → exit 1, before the
  Node suite runs.
- **The remedy the error prints makes it worse.** Running
  `node scripts/build-skill-catalog.js` in that checkout exits 0 and writes a
  63-insertion / 63-deletion diff of umask-polluted digests. Committing that
  moves the failure onto every `umask 022` machine, CI included.
- **Approved proposals go stale on re-clone.** `rig/lib/onboarding.js:362`
  refuses an approved proposal with `stale proposal: catalogue tree_digest for
  skill "<id>" has changed` when a bound digest moved. A proposal approved on
  one machine and applied after a re-clone is refused with no real byte
  movement — the byte-binding `AT-PB-5` requires, firing on an environment
  difference rather than a content change.

Not affected: the published `release.skills_digest`. `skillsDigest`
(`skill-catalog.js:361`) is computed over the frozen twelve-key row identity
and excludes `tree_digest` by design (`AT-PB-3`), so release identity does not
move.

## Why nothing caught it — five compounding reasons

1. **Dev and CI share a umask.** The authoring machine and GitHub's
   `ubuntu-latest` runner both default to `022`, so `mode` was identical
   everywhere the code actually ran. The bug is invisible unless a checkout
   happens under a different umask. It surfaced only because the deploy review
   did `git worktree add --detach HEAD` on a `umask 002` machine.
2. **The gate compares regen-vs-committed inside one process on one machine.**
   `build-skill-catalog.js --check` computes both sides in the same run, so the
   umask cancels out of the comparison. That check is *structurally* unable to
   detect machine-dependence — it never compares across environments. It only
   trips when the committed file was generated under a different umask than the
   current checkout, i.e. the cross-machine re-clone case, not the local
   edit-test loop.
3. **No test isolates the digest against a permission-only change.** Nothing
   writes identical bytes with two different `chmod`s and asserts the digest is
   equal. That missing test is exactly the review's proof, run by hand
   (`mode 644 -> …c0c` vs `mode 664 -> …115c`).
4. **The comment asserted the property instead of enforcing it.** "Mode bits
   are fixed so the value is reproducible" read as a guarantee; it was an
   assumption. A comment is not a check.
5. **`tree_digest` sits in a deliberately under-scrutinized spot.** It was
   added days earlier during Path B hardening (Issue 2, byte-binding) and
   consciously kept *out* of the twelve-key projection that Gate 1 signed, to
   avoid a re-sign. So it is not pinned by any exact-bytes acceptance case —
   only covered indirectly by the catalogue *file* digest every proposal binds.
   New code, near a gate, in the one region explicitly carved out of the
   heavily-reviewed signed path.

## The fix

Mirror git's own two-state model — the only permission state git actually
tracks:

```js
mode: (fs.statSync(file).mode & 0o111) ? 0o755 : 0o644,
```

"Does this file have any execute bit?" → normalize to `755`, else `644`. After
that, every input to the digest is either git-tracked state or explicitly
canonicalized (walk order, relative paths, `node_modules` exclusion, canonical
serialization already are). Then regenerate `catalog.json` from a `umask 022`
shell so the committed digests are the portable ones, and correct the comment.

**Landed 2026-09-02.** The one-line `mode` change and the comment rewrite are
in `rig/lib/skill-catalog.js`. Regenerating `catalog.json` under `umask 022`
produced no diff — the committed file was already umask-022-clean and the fix
keeps non-exec files at `644`, so every digest is byte-identical to what was
committed; the change is a portability guarantee, not a value migration. The
catching test rule below is satisfied by `tests/skill-tree-digest-reproducible.test.js`
(non-frozen, auto-discovered by the `tests/*.test.js` glob, no Gate-1 re-sign —
same precedent as `tests/wiki-maintenance-lint.test.js`): it holds bytes
constant, varies `chmod` across `644 / 664 / 666`, and asserts `tree_digest`
does not move, then flips the exec bit and asserts it does. Red without the
fix, green with it.

## Preventive rule

Two rules, both generalizable past this bug:

- **Every input to a content hash must be git-tracked state or explicitly
  canonicalized.** Raw `stat` fields (mode beyond the exec bit, mtime, uid/gid,
  inode), locale-dependent sorts, `Date.now()`, absolute paths, and filesystem
  read order are environment, not content. If it is not something `git
  ls-files -s` or `git cat-file` would reproduce identically on every checkout,
  it does not belong in the digest without normalization.
- **A reproducibility check that runs on one machine at a time proves
  nothing.** The catching test must either compare two environments' output, or
  hold one input constant (bytes) while varying another (permissions, locale,
  TZ) and assert the digest does not move. A same-process regenerate-and-string-
  compare is a self-consistency check, not a reproducibility check.

This is the same family as the `AT-HOME-1` fixture-prerequisite trap
([[2026-08-31-rig-154-fresh-checkout-npm-test-design]]): a gate that is green
in the dev/CI environment and red on a fresh clone because an environmental
assumption was never made explicit.
