# Traps

Things that have already cost this project time. Every one was discovered the
hard way. Read this before believing anything looks fine.

Named, checkable anti-patterns now live in a separate directory,
[`mistakes/`](../mistakes/) — start there when you're about to do something
structurally similar to a mistake already on record, and use this page for
the chronological "what happened" account. The two overlap: "the oracle is
green at a seam the product does not use" and "a validator that returns
`failures: []` as a literal" below are the same family as
[guarantee sharding](../mistakes/guarantee-sharding.md).

---

## The oracle is green at a seam the product does not use

Discovered 2026-08-22, in the release review. `tests/advanced-oracle.test.js`
loads behavior with `require(path.join(__dirname,'..','rig','lib',file))[name]`.
That is a direct module load, so a case goes green as soon as the named export
exists and behaves — whether or not any shipped code path ever calls it.

It did. All ten modules the oracle added — `skills`, `release-evidence`,
`policy`, `enforcement`, `lifecycle`, `global-writes`, `git-dispatch`,
`secret-history`, `graft`, `lint-format` — have zero production callers.
`materialize.js`, `cli-advanced.js`, `payload.js`, `bootstrap.sh`, and
`manifest.json` reference none of them. 68/68 was true and told you nothing
about the product.

Check it the cheap way before believing a green oracle:

```sh
grep -rn "require(" rig/lib/*.js rig/materialize.js scripts/*.js \
  | grep -E "policy|enforcement|lifecycle|global-writes|git-dispatch" \
  | grep -v "^rig/lib/"
```

This is the successor to the trap below, not a replacement for it. The old
version was "the suite asserts inventory, not behavior." This one is "the suite
asserts behavior, at a seam nothing reaches."

## A validator that returns `failures: []` as a literal

Same review, same day. `catalog.authorshipReport()` and
`host-capabilities.validateRegistryContracts()` both ended in a hardcoded empty
failures array. Neither read the artifact it claimed to check —
`authorshipReport` never opened a fragment file, and `contractFor` synthesized
every contract field as a constant. The acceptance cases resting on them
(`AT-P6`, and `AT-SHAPE-6`'s failures assertion) could not fail for any input.

Corrected 2026-08-23 without a re-sign: `authorshipReport` opens each fragment
and records missing/empty/malformed/undeclared-grade files; `contractFor` reads
declared contract fields, so a host that omits them fails. `failures: []` is
now a computed result. The signed assertion is unchanged; its meaning is "no
defects found."

The disposition closed loop is still there: `checks.validateDisposition`
accepts any reason containing `service-specific`, and `authorshipReport` still
builds the string `service-specific <kind> for <id>`. File inspection is what
makes the authorship gate fail for the right reason.

Grep for `failures: []`, `return true`, and `status: 'verified'` as literal
returns in anything named `validate*`, `verify*`, or `*Report`. A verification
function that never touches a filesystem or an input is asserting, not checking.

## The suite is green and means nothing

This was true of all 19 `tests/advanced-*.test.js` files as of 2026-08-19: 238
tests passed, `advanced-catalogue` and `advanced-services` passed 6/6, and 432
files still contained `TODO(Slice 10)`. Most of those files assert inventory
and non-emptiness, and a file containing the literal text `TODO` is
non-empty — calibrated to pass against placeholder content, not a foundation
to extend.

One leaf has since broken this pattern on purpose:
`advanced-lint-format.test.js` was rewritten to reject `TODO`/placeholder
content and exercise the real formatter/linter/CI-fix commands, and
`advanced-apply.test.js` exercises apply's real manifest/resume mechanics
(see [status](../status.md)). The other 18 files and 428 remaining
`TODO(Slice 10)` fragments are still exactly this trap. A green suite still
tells you nothing until a given file is checked against this list.

## `node --test <missing-file>` exits 0

It prints `Could not find` and returns success. A traceability row naming a
deleted test file therefore reads as green.

Gate 2 §13 and §10 require stat-ing every named target and asserting each
actually reported results. **Implement that; do not trust exit codes.**

## `npm test` has no specification gate

Until Slice 1 lands, green tells you nothing about specification health. The gate
that is supposed to run first and short-circuit the code tests does not exist —
`scripts/check-advanced-spec.js` has never been written.

## The default branch is `prod`

`origin/main` does not exist. Conductor's workspace metadata says `main` and is
wrong. Nothing may reference `main` or `master` — not a workflow, not a CI
config, not a release script.

D10 removed the branch dependency from Gate 1 integrity, but the branch name
still governs CI configuration and release tagging.

## Commit `8dcaa49` is mislabelled

Titled "Implement Advanced a-la-carte catalogue and delivery CLI". It actually
contains the 432 placeholders and an implementation built against a design that
was subsequently withdrawn. Do not read it as delivered work.

## The legacy uninstaller was not a head start

`scripts/uninstall.js` was leftover from an older, unrelated plugin and was
deleted in the 2026-08-20 cleanup pass. If a branch resurrects it, do not reuse
it for D11 uninstall work; the current path is `rig/lib/uninstall.js`.

## A live review receipt can look like a stale one

Through 2026-08-20, `gate2-v0.5-round3` in [`sources/reviews/`](../sources/reviews/)
was bound to the **current** technical-spec digest with verdict fail, while the
other two receipts there were void — bound to superseded bytes. It is easy to
skim the void/live split by which receipt is oldest and get it backwards; the
habit of treating receipts as historical was correct for the first two and
wrong for the third. (Editing Gate 2 to resolve round-3's blocker finding has
since voided round-3 too — see [status](../status.md) — so as of this writing
all three are void. The lesson still applies to whatever the next live receipt
is.) Always compare `target_digest` against the live file before concluding
anything.

## A matching digest over stale content is worse than a stale one

If Gate 2's header is re-pinned to current Gate 1 digests while its body is still
written against an older case set, the document *looks* current and is not. Do
not re-pin ahead of rewriting.

## Concurrent sessions edit these files

A session on another machine has amended Gate 1 and Gate 2 while another had
uncommitted changes. It merged cleanly, but re-read before editing and re-check
digests after. Do not assume the bytes you loaded are still the bytes on disk.

## `rg` is not installed

Use `grep -RIn`.

## Freeze blockers and release blockers are different lists

Conflating them deadlocks the project: Gate 2 cannot freeze until the work it
authorises is finished, and that work cannot start until it freezes. Version 0.2
had exactly that shape.

Gate 2 §17.1 lists freeze blockers — properties of the *document*, checkable
against the specification alone. §17.2 lists release blockers — properties of the
*built product*. **Do not merge them back together.**

## Bun's spawn API cannot be group-killed the way Node's can

Discovered 2026-08-26, triaging [[RIG-135]]'s `pending-triage` sites. The
ticket's proposed `spawn-guarded.js` helper generalizes the pattern in
`scripts/review-receipt.js`: `detached: true` + `process.kill(-pid, sig)`.
That pattern is Node-specific and does not port to `Bun.spawn`/
`Bun.spawnSync` unchanged. Verified against Bun's own docs, not assumed:
`Bun.spawn` only calls `setsid()` (putting the child in its own
session/process group) when `detached: true` is explicitly passed, and Bun's
`Subprocess#kill()` does not currently accept a negative pid —
[oven-sh/bun#15791](https://github.com/oven-sh/bun/issues/15791) tracks this
as a `RangeError`. A file that spawns via `Bun.spawn` and calls
`proc.kill(-proc.pid, sig)` expecting group-kill semantics will throw, not
silently no-op — but a file that never tries the negative-pid form (most of
them, today) will look identically broken to the already-known
direct-pid-kill bug, and an implementer porting these sites to the Node-
shaped helper without checking this first will discover the gap only at
runtime. Before wiring any Bun-runtime call site to `rig/lib/spawn-guarded.js`,
confirm whether the fix path is (a) shim the call through `node:child_process`
(Bun supports it) so the existing helper applies unchanged, or (b) call the
OS `kill(2)` syscall on the negative pid directly rather than through
`Subprocess#kill()`. Affects `rig/catalog/skills/browse/src/browser-skill-commands.ts`,
`xvfb.ts`, and `cookie-import-browser.ts` — see [[RIG-135]]'s "Bun-native
process spawns" section.

## A ticket can cite a reasoning trace that was never committed

Four tickets (RIG-125, RIG-130, RIG-132, RIG-133) landed via a single commit
already containing `[[...]]` links to eight reasoning documents from the
session that produced them. Those documents were never `git add`ed in that
session — only captured transiently in tool checkpoint snapshots — and were
gone by the time the tickets were committed elsewhere. The tickets read as
complete and well-sourced; the citations are dead. Before trusting a `[[...]]`
citation on a freshly-landed ticket, confirm the target file exists on disk,
not just that the ticket prose reads as if it does. See
[[2026-08-26-rig125-130-132-133-reinvestigation]].

## A dead citation can hide behind an ordinary markdown link, not just `[[...]]`

The first pass at [[2026-08-26-rig125-130-132-133-reinvestigation]] grepped only
for `[[...]]` wiki-links and missed two dead sources in RIG-132 cited as
`[text](../sources/reference/foo.raw.md)` — plain markdown links to files that
also don't exist. When auditing citations for a ticket, grep both link forms;
checking one and concluding "citations verified" is a false clean bill. See
[[2026-08-26-rig125-130-132-133-committed-evidence-reevaluation]] Finding A.

## A ticket's own headline number can silently disagree with its own breakdown

RIG-132 states "~124 addressable claim anchors (79 numbered sections, 37 `AD-`,
68 `AT-`, 19 `D`)" — the parenthetical sums to 203, not 124. The "~7,600 pairs"
that follows is consistent with 124 (`C(124,2)=7,626`), not with 203
(`C(203,2)=20,503`), so the two halves of the same sentence contradict each
other. Nothing about this required the missing citations to catch — arithmetic
in a ticket is exactly as checkable as code, and is not checked by default just
because it reads confidently. See
[[2026-08-26-rig125-130-132-133-committed-evidence-reevaluation]] Finding D.

## A partially applied control must never report as enabled

While an install's manifest header says `complete: false`, `policy status`, the
install line, and every run report must state the install is incomplete and
report no control as enabled, installed, or protecting anything. An incomplete
baseline that reports itself active is the exact failure D14 exists to prevent.
