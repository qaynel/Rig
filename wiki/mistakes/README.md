# Mistakes

One file per named anti-pattern this project must not repeat, each anchored
to the concrete example that proves it happened. This is not
[`index/traps.md`](../index/traps.md): traps is a dated, chronological log of
things that cost time — narrative, in the order discovered. A mistake file is
the opposite shape: no date-ordering, no narrative, just the pattern, the
exact bad example, and how to check for it before it ships again. Read this
directory when you are about to do something structurally similar to a named
mistake, not when you are catching up on project history.

## Rule

A mistake file exists to be checked against, not read once. Every entry has:

- **The pattern** — one sentence, generalized past the specific code.
- **The exact example** — real file paths, line numbers, branch names, or
  commit hashes from this repository. Not a hypothetical. If you cannot point
  to the actual bytes, it is not ready to file here.
- **Why it passed anyway** — what made this look done when it was not.
- **The check** — a concrete question or command that would have caught it,
  phrased so it can be asked *before* the same shape of work ships again.

Like topics, mistake files are synthesis and may be rewritten as understanding
sharpens. Unlike topics, they are not required to cite a reasoning trace for
every edit — but the *first* filing should, so the discovery is recoverable.
See [`reasoning/README.md`](../reasoning/README.md).

## Index

| Mistake | Pattern |
|---|---|
| [Guarantee sharding](guarantee-sharding.md) | Splitting one cross-cutting guarantee into independently-tested branches whose acceptance tests each prove only their own slice, never the seams between them. |

## Adding an entry

File the discovery as a reasoning trace first, then write the mistake file
citing it, then link the mistake file from every topic hub it corrects or
warns, then add a row to the index above. Same order as any other wiki
change: trace, then synthesis, then indexes.
