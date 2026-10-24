---
date: 2026-10-23
source: agent
status: current
topics: review-receipts, what-rig-is, testing-strategy
checked: 2026-10-23
owner: rig-product-design
summary: Survey of seven open-source agent harnesses against Rig's needs: what to extract per capability, two licence blockers, and why Harness2 cannot be pointed at this machine.
---

# Open-source agent-harness survey, and the review-receipt repair

Owner directive 2026-10-23: stop designing proprietary infrastructure where
credible open-source solutions exist; research the state of the art, fork and
adapt the best. Primary starting point named: Google Research Harness².

Research was read-only by policy. Nothing from any clone was executed,
installed, or given network access: the clones hold untrusted third-party code
and the machine holds the owner's credentials and private repositories, which
the directive itself forbids exposing. Test quality was assessed by reading test
files and CI configuration.

Clones (shallow, `~/rig-harness-research/clones`, outside the repo, never
committed): harness2, meta-harness, dspy, mem0, claude-mem, open-code-review,
deepseek-harness.

## Existence and licence screen

All thirteen named repositories resolve and are actively maintained. Two are
blocked before evaluation:

- `volcengine/OpenViking` — **AGPL-3.0**. Copyleft is disqualifying for a corpus
  that installs into other people's repositories.
- `NousResearch/hermes-agent-self-evolution` — **no licence** (all rights
  reserved, cannot be forked) and the only one stale (last push 2026-06-17).

## Verdict per subsystem

| Candidate | Verdict | Deciding reason |
|---|---|---|
| harness2 | patterns only | no regression gate; `ok` on total improver failure; secrets forwarded to agents |
| meta-harness | reject | proposer gets write access to its own evaluator; ~$500/iteration |
| dspy | reject | optimizes prompts against a numeric metric; hundreds of calls per cycle |
| mem0 | reject | unbounded store + paid similarity retrieval; decay is platform-only |
| claude-mem | patterns only | bounded always-read context block is the right idea; per-tool-use LLM write cost is not |
| open-code-review | patterns only | has the deterministic cross-round finding matcher we need; Go, `internal/`, needs a paid key |
| deepseek-harness | patterns only | owns the agent loop; adopting it contradicts Rig's position |

## Why Harness² is not the foundation

The flagship candidate is a research artifact. The disqualifying findings, all
from source:

1. **No regression gate.** The selection pool is exactly the `k` candidate
   finals; the base harness is excluded, "no abstention by construction"
   (`core/selection.py:93-111`). The loop structurally cannot conclude that no
   change was better. An LLM selector picks a winner with the harnesses hidden,
   and the judge runs offline afterwards and never feeds back
   (`core/judge.py:15-18`).
2. **It can report a fabricated pass.** `ModeResult.ok` is
   `bool(finals) and not errors` (`core/recursion.py:73`), and nothing in that
   module ever appends to `errors`. If every improver call fails, every stage
   falls back to the base tree, the mode still reports `ok`, and
   base-equivalent harnesses are selected and judged as if improved. This is
   precisely the class of defect the owner's "no fabricated passes" rule exists
   to prevent.
3. **Its guardrails are editable by the thing they guard.** `guardrails.md` is
   on the improver's editable surface, and Codex hooks run improver-authored
   shell commands with hook trust bypassed (`substrate/codex.py:167`).
4. **Secret exposure.** The proposer forwards `os.environ` to the agent
   subprocess minus five Anthropic variables (`core/proposer.py:46-52,106`).
   Every other credential — GitHub token, cloud keys, SSH agent variables —
   reaches an agent that has shell and network access. Improver sessions run
   with permission checks disabled.
5. **It does not solve the transfer problem.** The library is namespaced per
   benchmark/executor/k/seed/tag and "each sweep starts every domain empty"
   (`core/library.py:23-24`); `retain()` deletes entries outside the current
   task stream. There is no path to carry a library into another repository —
   which is the owner's "kaput, everything's gone" requirement.
6. **It drops negative results.** `library.add` stores nothing unless cue,
   lesson and evidence are all present (`core/library.py:120-121`), and
   distillation returns empty on `NO_ENTRY`. A `hurt` or `confounded` result
   survives only in the run directory. The same amnesia defect as ours, one
   layer up.
7. **Licence landmine.** The bundled Tencent WorkBuddy runner carries a custom
   licence stating it "IS NOT INTENDED FOR USE WITHIN THE EUROPEAN UNION".
   Vendoring the repo or wheel would carry that territorial restriction into
   every repository Rig installs into. Vendoring only `harness2/core` avoids it.
8. Operationally: Python-only, no library API for non-benchmark callers, CLI
   closed over three benchmarks, requires Vertex AI, Linux, Docker, Bun,
   `gcloud`, Pandoc, Poppler. One test file, five cases, no CI. The demo's
   selector reads the answer out of the task's own `ledger.csv`.

Worth taking as patterns, rewritten in JS: the library entry schema
(`cue / lesson / evidence / confidence`), the distillation vocabulary
(`helped / hurt / no observed effect / confounded`) **with negatives also
persisted**, the grader-verdict tripwire that keeps oracle output out of agent
context, and fingerprint-plus-completion-marker resume.

## Memory: build it, do not adopt it

Both memory candidates are unbounded stores with similarity retrieval, which is
the exact architecture our own diagnosis rejected. mem0's decay is refused in
OSS (`mem0/memory/notices.py:134`) and its default write path makes roughly
three paid API calls per `add`. claude-mem never evicts observations and calls
an LLM once per tool use on the owner's own plan — it would worsen the
usage-limit deaths it is meant to fix.

What claude-mem gets right and we should copy: a hard-capped, deterministic,
always-injected session-start context block (`ContextBudget.ts:9`,
`CONTEXT_OUTPUT_LIMIT = 10_000`, with `fitContextToBudget` dropping whole items
in a fixed order), and its `work_state` checkpoint list. That is the shape of
the ledger, and on a plain Rig-owned file it needs no daemon.

## Recursive improvement: our need is smaller than the field's

Both recursive-improvement candidates tune an artifact against a scalar score
with hundreds to thousands of model calls per cycle. The owner has explicitly
refused numeric targets ("the moment a metric becomes a target, the harness will
optimize for the metric"), which is the Goodhart setup both projects require by
construction. meta-harness additionally runs its proposer with permission checks
disabled in the directory holding its own evaluator, data and config; its README
concedes this is "operational isolation, not access control".

Our actual requirement — notice that a finding recurs and convert it into a
deterministic check, gated by the human signature — needs no model calls to do
the counting. Build it.

## Implemented: the review-receipt repair (RIG-124.2)

`scripts/review-receipt.js` is not in the Gate 1 frozen manifest (16 files;
neither it nor `tests/release-blockers.test.js` appears), so both were editable.

**Defect 1, finding-class amnesia — fixed.** A `${out}.history.json` ledger,
keyed per author-context, records each finding by `category|evidence` with the
round numbers it fired in. It is a separate file from `.attempts.json` on
purpose: the cap is cleared on a passing verdict, and history must survive that,
because a finding that was fixed is exactly the one worth re-checking. Prior
rounds are injected into the next reviewer's prompt as a PRIOR ROUNDS block with
an explicit instruction not to treat the list as a quota. Findings reaching two
rounds are printed as due to graduate into an automated check.

The key is per finding, not per category: with only seven categories a
category-level counter would hit the threshold on nearly every failing release
and the signal would be worthless. Prior art for the key shape is
open-code-review's `internal/session/compare.go` `findingKey` (Apache-2.0),
which normalizes whitespace and omits line numbers so line drift still matches;
cited in the source comment. A `evidence` field was added to the reviewer's JSON
schema to make the key stable — the receipt validator does not constrain finding
shape, so this is compatible. Duplicates inside one round collapse, and absence
is never recorded as resolution.

**Defect 2, provider failures charged to the owner — fixed, narrowly.** A
provider failure now refunds the optimistically-written attempt to its prior
value rather than deleting the file, so genuine earlier failures stay counted.
Scope was deliberately limited to provider failures because
`tests/release-blockers.test.js` already asserts that a timed-out reviewer
**must** count toward the cap (RIG-124.1, a deliberate fix for attempts being
silently dropped). The owner's directive says provider failures, not timeouts.

**Known weakness in this fix, left open as an owner decision.** Classification
is by regex over reviewer output. open-code-review classifies only from HTTP
status and error type, which is strictly better — but `claude -p` and
`codex exec` expose no HTTP status, so that is unavailable to us. The stronger
design, recommended for a follow-up: define "ran" by positive evidence (exit 0,
parseable JSON, valid verdict, verdicts array) and treat everything else as
infrastructure, replacing the timeout-charging rationale with a bound of three
consecutive uncharged infrastructure results. That reverses the tested
RIG-124.1 decision and is therefore the owner's call, not an agent's.

**Evidence.** `tests/release-blockers.test.js` 46/46 pass, including four new
RIG-124.2 cases; `tests/spawn-guard-allowlist.test.js` 6/6. The full `npm test`
gate has not been run on this change. Nothing is committed.

`AT-HD-7` in `tests/onboarding-hardening.test.js` remains independently red
(7 pass, 1 fail) and predates this work; tracked separately per the directive.

## Next

Owner decisions outstanding: the stronger "positive evidence of a run" rule
above, and the ledger design in
[the design doc](../specs/ai-sdlc-harness/design.md). No commits, no pushes, no
external reviews, no paid API calls were made.
