# Invariants

Propositions that must always hold, no matter which host, CI provider, grade,
or version combination the code runs against. Each is stated positively and
carries what it protects against and how to check it against a candidate build.

**Invariants vs [traps](traps.md).** A trap is reactive — a specific miss that
already cost this project time. An invariant is proactive — a property that
must never be false, whether or not it has been violated yet. Every trap
should map to at least one invariant; every closed defect either matches an
existing invariant (cite it as evidence the invariant holds on the fixed
bytes) or adds a new one.

**How this list is maintained.** Every ticket close writes one line here:
either the invariant that was violated (restated positively) or a citation of
an existing invariant now proven again on the fixed bytes. Never delete an
invariant — if superseded, mark it and link the successor; the old entry
stays as evidence that the class was recognized.

Ranked most-severe (data-loss / crash / silent-drift) first.

---

## I-1. No installer mutation escapes the containment guard

Every payload write goes through the shared realpath-aware containment guard
before touching disk — lifecycle, payload, coverage, remediation, apply, and
CI paths. Ancestor symlinks resolving outside the target repository fail
before mutation.

**Protects against:** an installer or uninstaller writing to or deleting from
outside the target repository via symlink escape. Round-1 finding.

**How to check:** grep for `fs.writeFile`, `fs.mkdir`, `fs.rm`, `fs.unlink`,
`fs.rename` under `rig/lib/*.js`, `rig/materialize.js`, `rig/lib/ci-*.js`,
`scripts/*.js`. Every call site must reach the containment guard or be an
in-memory fixture. A new call site without that gate is a violation.

## I-2. Uninstall reverses only what this install ID wrote

`.rig/install-manifest.jsonl` is the single authority for what this install
put on disk. Uninstall reads it and removes exactly those records — no
inference-based deletion of "this looks like ours," no wildcards, no cleanup
of adjacent bytes the manifest does not name. Old-format installs without a
manifest are quarantined for a user decision, not swept.

**Protects against:** [[RIG-127]] 127.12 — over-broad deletion on old-format
installs, where uninstall assumes install-shape rather than reading the receipt.

**How to check:** grep for deletion calls (`fs.rm`, `fs.unlink`,
`removeFromFile`, `removeBlock`) in `rig/lib/uninstall.js`,
`rig/lib/lifecycle.js`, and `rig/lib/global-writes.js`. Each call must be
gated by a manifest record naming its target for this install ID.

## I-3. Uninstall degrades gracefully on unreadable state

Uninstall never crashes on malformed, corrupted, or partially-written files
it encounters — global config, user policy, journal entries, manifest records.
Unreadable state is reported, journaled as `failed`, and skipped. The process
finishes cleanly with a machine-readable record of what was reversed and what
was not.

**Protects against:** [[RIG-127]] 127.11 — uninstall crashes partway through
on corrupted global config, leaving the user with a half-torn install and no
diagnostic.

**How to check:** every `JSON.parse` / `TOML.parse` / `JSON5.parse` under
`rig/lib/uninstall.js` and its callees is wrapped in a try/catch that reports
and continues. Fuzz uninstall with (a) truncated JSON, (b) invalid JSON5,
(c) empty file, (d) missing file, (e) file permissioned `000`. All five
finish with exit 0 and a non-empty removal report.

## I-4. A partially-applied control never reports as enabled

While `install-manifest.jsonl`'s header records `complete: false`, `policy
status`, the install line, and every run report state that the install is
incomplete and no control is active. This includes the safety baseline —
partial baseline = zero baseline for reporting purposes.

**Protects against:** [D14](decisions.md) — an install that fails midway and
then reports itself armed, which is worse than no install at all.

**How to check:** grep for `complete` under `rig/lib/lifecycle.js` and
`rig/bin/*.js`. Every reporter consults the header before printing an
"enabled" state.

## I-5. Every installed instruction bundle has a named owner

No duplicate instruction bundle, mirror, or copy ships without an entry in
`rig/manifest.json` naming it and one authoritative source under `rig/`. A
bundle without an owner is a drift risk — it will diverge silently.

**Protects against:** `rig/mcp-runtime/` — the currently-unowned duplicate
that predates the six merged tickets and has already drifted from the
canonical instructions.

**How to check:** enumerate every `.md` file installed by `rig/lib/payload.js`.
Each traces to exactly one canonical source. A second copy of the same
content is either (a) a rendered adapter with a declared renderer or (b) a
violation.

## I-6. Payload writes never lose user bytes on parse failure

Every merge writer (`mergeMcpEntry`, hook merger, instruction pointer append,
future adapters) fail-closes on invalid JSON / JSON5 / TOML / primitive at
the dotted target path. The user's file is left byte-identical and the
failure is journaled with the parse error and the intended write.

**Protects against:** silent clobber of a hand-edited config file on a
formatting hiccup — round-2 production finding.

**How to check:** `tests/repo-mcp-write-safety.test.js` and its siblings
cover all four failure modes for every merge writer. A merge writer without
a matching safety test is a violation.

## I-7. No host tree is created that the user did not select

Host discovery uses only bounded repo-relative markers. A bare repo with no
host marker receives the neutral payload only — no `.claude/`, no `.agents/`,
no `.codex/`, no fabricated host trees. Explicit `--hosts` / `RIG_HOSTS`
overrides remain exact; duplicate IDs collapse, unknown IDs fail.

**Protects against:** the round-1 finding where the installer inferred hosts
from absent trees.

**How to check:** `tests/context-aware-onboarding.test.js` bare-repo case
must pass on every commit.

## I-8. MCP dispositions are derived, not duplicated

`rig/lib/mcp-hosts.js` is the single source for
`{ disposition, autoWrite, file, key, descriptor }` per host. The writer
(`renderers.js`) and the shipped host-contract (`contractFor`) both read
from it. No parallel table lives in a test fixture, doc, or ad-hoc constant
that could drift.

**Protects against:** the divergence between `renderers.js` and `contractFor`
that RIG-103/104/128/134.1 closed.

**How to check:**

```sh
grep -RnE "disposition:\s*['\"]|autoWrite:\s*(true|false)" rig/
```

Every hit must be either inside `mcp-hosts.js` or a read from it.

## I-9. Verification functions read the artifact they claim to check

`validate*`, `verify*`, and `*Report` functions never return `failures: []`,
`return true`, or `status: 'verified'` as a literal without a filesystem or
input read that could produce a different result.

**Protects against:**
[the closed-loop validator trap](traps.md#a-validator-that-returns-failures--as-a-literal) —
`authorshipReport` and `contractFor` that could not fail for any input.

**How to check:**

```sh
grep -RnE "failures:\s*\[\]|return\s+true|status:\s*['\"]verified['\"]" \
  rig/lib/*.js rig/materialize.js scripts/*.js \
  | grep -E "validate|verify|Report"
```

Every hit must be reachable only after a real input read.

## I-10. The oracle asserts against reachable code

Every module the frozen oracle imports has at least one production caller
under `rig/materialize.js`, `rig/lib/*.js`, `rig/bin/*.js`, or
`rig/bootstrap.sh`. A module reachable only from tests is not a shipped
capability, regardless of what the oracle claims.

**Protects against:**
[oracle green at a seam the product does not use](traps.md#the-oracle-is-green-at-a-seam-the-product-does-not-use) —
68/68 green against ten modules the product never called.

**How to check:** the reachability grep in the traps entry, extended to
whatever set of modules the oracle currently imports.

## I-11. No fabricated pass at Policy grade

A missing or malformed leaf binding is a named, nonzero coverage gap. No
generic success command, no silent skip, no `process.exit(0)` when the bound
target was not actually run.

**Protects against:** the D24 failure mode where "Policy = baseline practice"
degrades into "any string containing the word baseline passes."

**How to check:** every leaf's check script fails-closed when its bound
target file is missing/empty/malformed. `tests/advanced-lint-format.test.js`
is the worked example.

## I-12. Named-file test targets are stat-checked before trust

`node --test <missing-file>` exits 0. Any traceability that runs a named
test target must stat the file first and assert the runner reported at
least one executed case.

**Protects against:**
[missing-file green](traps.md#node-test-missing-file-exits-0) — a deleted
test file reading as green.

**How to check:** Gate 2 §13 and §10 acceptance. Any new runner adds its
own stat-check before it lands.

## I-13. CI adapters render provider-visible checks with no secret upload

Every CI adapter (GitHub Actions, GitLab CI, CircleCI, Jenkins, Buildkite,
Azure Pipelines) renders a check that runs `.rig/bin/check.js --scope repo`,
requests no repository secrets, and does not upload local finding detail.
Repeated apply is byte-stable.

**Protects against:** a CI integration that leaks finding contents or
secrets into a third-party log.

**How to check:** the first-wire matrix in the CI-adapter test file. Every
adapter must appear.

## I-14. Named-tag distribution is explicit

`v5.0.0` and every subsequent tag is cut and published as an explicit owner
operation, never as an implicit side effect of code changes. Package version
bumps do not tag; tags do not auto-publish.

**Protects against:** an accidental tag on a commit that never went through
the release ceremony.

**How to check:** no `npm publish` or `git tag` call under `scripts/*`,
`rig/bin/*`, or any workflow's default trigger. The publish path requires
a manually-dispatched workflow gated on the owner's key.

## I-15. Historical review receipts are void for current bytes

Any review receipt whose `target_digest` does not match the live gate files
is void and cannot count toward the release ceremony. The gate's freshness
check runs before the ceremony can be marked complete.

**Protects against:**
[live-looking void receipt](traps.md#a-live-review-receipt-can-look-like-a-stale-one) —
the round-3 receipt that flipped live-then-void, easy to skim wrong.

**How to check:** the release wrapper compares every cited receipt's
`target_digest` against the current file digest before proceeding.

## I-16. A reviewer attempt that does not cleanly finish still counts toward the cap

A killed, timed-out, or otherwise non-returning reviewer subprocess spawn
inside `scripts/review-receipt.js` increments the same-`author-context`
re-review counter exactly as a parsed `fail` verdict would. The cap must fail
closed (count it) on every non-clean outcome, not only on an outcome the
process lived long enough to write.

**Protects against:** [[RIG-124]].1 — the failure count is persisted only
after the reviewer spawn returns, so a spawn killed by its own `TIMEOUT_MS`
exits the process before the write and silently grants an extra, uncounted
retry. Found investigating a red RIG-120 gate run;
[[2026-08-26-rig124-cap-lost-update]].

**How to check:** force the reviewer spawn in
`tests/release-blockers.test.js` to hang past a short test-supplied timeout
and assert the following same-context call is still capped.

---

## Adding a new invariant

Every ticket close either:

1. **Matches** an existing invariant (`I-N`) — cite it on the ticket as
   evidence the invariant is holding on the fixed bytes, and add a
   *checked at* row pointing to the ticket.
2. **Adds** a new invariant — one positive statement, one line each of
   *Protects against* (which trap/ticket motivated it) and *How to check*
   (executable when possible).

Never remove an invariant. If superseded, mark it and link the successor;
the old entry stays as evidence that the class was noticed.
