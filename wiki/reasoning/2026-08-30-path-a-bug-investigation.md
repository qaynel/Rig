---
date: 2026-08-30
source: agent
topics: onboarding-flow, graft-mechanics
decisions:
status: historical
supersedes:
tags: trap, interdependency
summary: Path A investigation — confirms the eval's 5.8 MB dump was a --with-runtime artifact; measures the real default install at 209 files / 8.3 MB unignored; finds two new verified correctness bugs (a dangling `.rig/skills/implementation/SKILL.md` reference and a `rig`→`rig-rig` name collision) beyond the two previously-known phantom-text traps; specs the missing measurement instrument.
---

# Path A bug investigation — default install, phantom text, unignored payload, missing rubric

*Filed by an agent per the Path A investigation prompt in
[[2026-08-30-office-hours-path-a-path-b-scoping]]. Report-only: no fixes
applied, no install run against a real target repo — all reproduction below
used disposable `mktemp -d` targets, inspected then deleted. Scope was
`rig/bootstrap.sh`, `rig/lib/payload.js`, `rig/manifest.json`, installed
markdown under `rig/tier-1/`, and the vendored skill catalog under
`rig/catalog/skills/`.*

## 0. Confirming the eval-framing correction

`rig/lib/payload.js:95-99`:

```js
const filter = (srcAbs) => {
  if (isLitter(srcAbs)) return false;
  if (activeDelivery) return true;
  return srcAbs.endsWith('.md'); // default install = markdown only
};
```

`activeDelivery` is only ever `true` when `bootstrap.sh` is run with
`--with-runtime` or `--openclaw-mcp` (`rig/bootstrap.sh:10-11,40,45`, threaded
through as `ACTIVE_DELIVERY`). Confirmed against `rig/manifest.json`: every
entry that lands non-markdown content — `rig/catalog/plumbing` (line 56),
`rig/bin/rig` (line 62), `.rig/runtime/**` (lines 63-71, including the whole
`rig/lib` tree as `.ts`/`.js`) — carries `"gate": "active_delivery"`. None of
that reaches a default install. The +12/100 adaptation eval scored a
`--with-runtime` install; the default product is markdown-only, exactly as
the office-hours scoping trace already concluded. This section reproduces
that conclusion from the manifest rather than re-deriving it — logged here so
the rest of this trace has its own evidence chain.

## 1. What the default install actually writes (measured, not estimated)

Ran `sh rig/bootstrap.sh --hosts claude --target "$(mktemp -d)"` (disposable
dir, deleted after inspection — not a real repo). Result:

- **209 files, 8.3 MB**, zero bytes gated behind `active_delivery`.
- No `.gitignore` anywhere in the tree or written by the installer (`grep -rn
  gitignore rig/lib/*.js rig/bootstrap.sh` — no hits). `git init && git add
  -A && git status --short | wc -l` on the installed tree reports all 209
  paths as `A` — every file is untracked-but-unignored.
- Breakdown: `.rig/` (4.2 MB, 99 files: `routing.md`, `rules/rig.md`,
  `rules/communication.md`, `install-manifest.jsonl`, and the ~64 vendored
  skills at `.rig/skills/{name}` from `install_vendored_skills` with
  `host: "neutral"`, `manifest.json:44`) and `.claude/` (4.1 MB, 105 files:
  the same ~64 vendored skills again at `.claude/skills/rig-{name}` per
  `manifest.json:45`, plus the 7 Tier-1-owned skills at
  `.claude/skills/rig-{grilling,product-design,implementation,execution,tdd,debugging,code-review}`,
  `manifest.json:14-20`).

This corrects [[topics/onboarding-flow]]'s current "kilobytes of markdown,
not megabytes of code" estimate for the default install — the number is
megabytes, not because non-markdown lands (it doesn't), but because the
vendored skill catalog is installed **twice**: once unprefixed under
`.rig/skills/` (the instruction-only fallback location, written
unconditionally by the `host: "neutral"` entry regardless of which hosts are
actually selected) and once again, renamed, under `.claude/skills/rig-*`
(the native-discovery location for Claude). Every companion doc a skill
ships beside `SKILL.md` — `README.md`, `ARCHITECTURE.md`, `ETHOS.md`,
`DESIGN.md`, `AGENTS.md`, `CLAUDE.md`, `USING_brain_WITH_rig.md` for `_core`
alone — passes the `.md`-only filter and is duplicated along with it. None of
this requires `--with-runtime`; it is the byte cost of the markdown-only
product itself.

## 2. Phantom convention text in installed markdown

Verified `rig/tier-1/routing.md:5-8`:

> Read this file before acting. Apply `.rig/rules/rig.md` to every coding
> task and `.rig/rules/communication.md` to every message you send the user,
> then choose the smallest set of skills whose trigger matches the work. In
> this source checkout, use `rig/tier-1/rules/rig.md` and
> `rig/tier-1/rules/communication.md` instead.

`payload.js`'s copy op for this file (`copyOp`, used via `manifest.json:4`)
does no templating — confirmed by diffing an installed copy against the
source: byte-identical. So every installed `.rig/routing.md`, in every
target repo, carries the literal clause "In this source checkout, use
`rig/tier-1/...` instead" — a branch that is **never true post-install**,
not just situationally irrelevant: an installed copy is by definition not
"this source checkout" (that phrase only ever resolves inside the Rig
monorepo itself, where the file is read from `rig/tier-1/routing.md`
directly and never copied). Same pattern at `routing.md:30`, describing
`rig/tier-1/skills/<name>/SKILL.md` and `skills/rig/SKILL.md` as the
"source checkout" alternative. What a stranger repo's agent does on hitting
this: most capable agents recognize `rig/tier-1/...` doesn't exist in their
tree, silently fall through to the `.rig/...` branch (which mostly does
exist — see §3 for where it doesn't), and lose nothing but a beat of
confusion. A literal-instruction-following instruction-only host (cursor,
kiro — no judgment to route around dead text) has no such fallback
reasoning available; it just carries dead prose forward as "context."

`routing.md:22-25`, in the full-cadence branch of the Task-weight section:

> Everything else uses the full cadence: read this file, read the wiki, read
> each chosen skill completely, and file a dated reasoning trace then
> regenerate `wiki/status.md` at least every three minutes of active work,
> per `CLAUDE.md`. `(RIG-124)`

Three phantom assertions in one sentence: a `wiki/` the target does not have
(nothing in `rig/manifest.json` creates one), a cadence the target's
`CLAUDE.md` does not document (the only `CLAUDE.md` mutation for a Claude
host is the one-line `ensure_line` pointer at `manifest.json:28` — verified
by installing into an empty target and reading the resulting `CLAUDE.md`:
exactly the pointer line, nothing else), and `(RIG-124)`, an internal Rig
decision-ticket ID meaningless outside this repo. The same dangling
`(RIG-124)` citation reappears at `rig/tier-1/skills/tdd/SKILL.md:31`, inside
the installed TDD skill. Notably, `rig/tier-1/rules/communication.md:32-38`
— itself installed into every target — bans exactly this class of bare
internal identifier from the agent's *user-facing* output ("No internal
identifiers anywhere... decision codes (`D24`, `AD-28`)... no file,
directory, wiki, or symbol paths"). The payload doesn't hold its own
authored content to the rule it hands the installed agent. What an agent
does on hitting `routing.md:22-25`: on the letter of the instruction, either
invents an unrequested `wiki/` + `status.md` cadence in a repo that never
asked for one (clutter, unbounded by anything that tells the agent when to
stop), or stalls looking for a cadence "per `CLAUDE.md`" that isn't there
(confusion, wasted turns). The already-installed `rig-grilling` skill hedges
correctly here — `rig/tier-1/skills/grilling/SKILL.md:15`: "Check the
existing record first — the wiki, **or a README, reasoning traces,
`CLAUDE.md`, or whatever markdown exists**" — proving the hedge is a known,
already-used pattern in this same payload; `routing.md`'s full-cadence
sentence just doesn't use it.

`rig/tier-1/rules/communication.md:39-40`'s own path example
(`wiki/topics/x.md`) was checked and is **not** a defect: it appears inside a
"banned in first-pass output" list illustrating what *not* to say, self-
referencing Rig's own path style as the example of an internal path — it
does not assert the target has a wiki. No action item.

## 3. Two verified correctness bugs beyond the known phantom-text traps

These were not in the investigation prompt's hint list; both were found by
actually running the installer and checking the resulting tree, not just by
reading source.

### 3a. `.rig/rules/rig.md` points at a file the common install never writes

`rig/tier-1/rules/rig.md` (installed unconditionally — `host: "neutral"`, no
gate, `manifest.json:5`) reads in full:

```
# Rig Implementation Rule

For every coding task, read and follow `.rig/skills/implementation/SKILL.md`. ...
```

But the copy op that writes `.rig/skills/implementation/SKILL.md`
(`manifest.json:9`, `skills/rig/SKILL.md` → `.rig/skills/implementation/SKILL.md`)
carries `"gate": "instruction_only_selected"` — it only fires when the
selected host set includes one of `cursor, windsurf, cline, kiro, gemini,
copilot, antigravity` (`rig/lib/payload.js:11-13`, `INSTRUCTION_ONLY`).
Reproduced directly: `sh rig/bootstrap.sh --hosts claude --target
<disposable-tmp-dir>` then `ls .rig/skills/implementation` → `No such file or
directory`. `claude` and `codex` are the two `PAYLOAD_HOSTS` not in
`INSTRUCTION_ONLY`, so a Claude-only or Codex-only install — plausibly the
single most common shape, and exactly what this workspace is — installs a
rule that is "always active" per its own last paragraph and whose one
concrete instruction points at a path that was never written.

This is not hypothetical self-correction territory either way: the file
this rule names is only ever real for hosts that need it least. Instruction-
only hosts (no native skill-name dispatch, so they *need* the raw file path
to find the implementation skill at all) are exactly the hosts for which the
gate fires and the file exists. Native-discovery hosts (Claude, Codex — who
can route around a missing path by invoking the skill by name, e.g.
`rig-implementation`, the way this very investigation did for
`rig-debugging`) are exactly the hosts for which the file is missing. The
bug is partially self-mitigating for a sophisticated native-host agent and
not mitigated at all for the literal-text-following case the rule is written
for.

The same dangling path was checked against this repo's own dev/source-
checkout reading of `rig/tier-1/rules/rig.md` (used directly, unmodified, per
`routing.md`'s "in this source checkout, use `rig/tier-1/rules/rig.md`...
instead" clause) — confirmed no `.rig/` directory exists in this checkout at
all, so the same hardcoded `.rig/skills/implementation/SKILL.md` reference is
equally wrong for source-checkout use, where the correct path per
`routing.md:29-31` is `skills/rig/SKILL.md`. `rules/rig.md` never picked up
the source-checkout-vs-installed conditional pattern that `routing.md`
otherwise applies consistently to every other cross-reference in the same
payload.

### 3b. The vendored `rig` switchboard installs as `rig-rig`, not `rig`

`rig/tier-1/routing.md:100-102` ("Fallback to the router"):

> If a request does not match any Tier 1 skill above and the user has not
> named a specific vendored skill, invoke the vendored `rig` router (the
> `/rig` switchboard shipped from the swallowed suite)...

The vendored skill this refers to is `rig/catalog/skills/_core`, whose
`SKILL.md` frontmatter declares `name: rig` (`rig/catalog/skills/_core/SKILL.md:2`,
`description: Router for the rig skill suite. (rig)`). `rig/lib/skills.js`'s
`listVendoredSkills()` does not exclude `_core` (only `LICENSE.upstream`,
`UPSTREAM.md`, `README.md` are `RESERVED`, `skills.js:7`), so it is installed
like any other vendored skill. For Claude/Codex/Antigravity hosts,
`installVendoredSkillsOp` (`payload.js:91-113`) applies
`rewrite_name_prefix: "rig-"` uniformly (`manifest.json:45-46`) —
`finalName = ${prefix}${skill.name}` at `payload.js:94` — so the skill
declaring `name: rig` becomes `rig-rig`, installed at
`.claude/skills/rig-rig/SKILL.md` with its frontmatter `name:` line rewritten
to `rig-rig` too (`rewriteSkillName`, `payload.js:84-89`). Reproduced
directly: `sh rig/bootstrap.sh --hosts claude --target <tmp>` then
`cat .claude/skills/rig-rig/SKILL.md` → `name: rig-rig`. There is no
installed skill addressable as plain `rig` for a Claude/Codex/Antigravity
host — `routing.md`'s own fallback instruction names a skill that, for the
hosts with native by-name dispatch, does not exist under that name. (The
`.rig/skills/rig/SKILL.md` copy, from the `host: "neutral"` entry at
`manifest.json:44`, does carry the correct unprefixed name — but that path is
the instruction-only fallback location, not where Claude's native skill
discovery looks.) The same collision produces `rig-rig-upgrade` for the
vendored `rig-upgrade` skill — ugly but still unique, since only `_core`'s
declared name exactly equals the prefix.

## 4. Payload lands unignored — design call

Confirmed in §1 with a real measurement: no `.gitignore` is written by
`payload.js` or `bootstrap.sh` (grepped both for `gitignore` — no hits), and
a default Claude-only install lands 209 files / 8.3 MB, 100% untracked and
unignored.

Two coherent designs, not a third option:

- **Gitignore it (tool-cache model).** Treat `.rig/` and the
  `.claude/skills/rig-*`, `.agents/skills/rig-*` trees as regenerable local
  tooling — never committed, re-synced by rerunning `bootstrap.sh`, the way a
  `node_modules` or a language server cache is handled. Diffs in the target
  repo stay clean; nothing about the Rig payload shows up in code review.
  Cost: the routing convention is invisible to a teammate who doesn't run
  bootstrap themselves, and to any CI job or host that reads config only from
  the committed tree.
- **Commit it (vendored-config model).** Treat the payload as authored,
  reviewable repo content, versioned like any other checked-in convention
  (`.eslintrc`, `.github/workflows/`). Cost: every Rig version bump shows as a
  multi-hundred-file diff in every downstream repo, and the two-copy
  duplication from §1 (`.rig/skills/*` + `.claude/skills/rig-*`) becomes
  permanent repo bloat instead of a one-time write.

Recommendation: gitignore, as the default. Tier 1 describes itself in this
repo's own `CLAUDE.md` as something that "installs a curated markdown-only
agent workflow" — re-derivable at any time by rerunning `bootstrap.sh`
against the pinned release, not repo-authored content a human wrote and
should review byte-by-byte. This does not by itself resolve the duplication
in §1; gitignoring both copies is a workaround for their size, not a fix for
why there are two.

## 5. No measurement instrument — what a frozen one needs

No rubric file, fixed axis list, weight scheme, pinned model, or clean-
checkout procedure exists anywhere in the repo — confirmed by the absence of
any such file alongside [[2026-08-30-adaptation-eval-claude-task-master]],
which is explicitly one holistic Sonnet pass, self-reported ±5. No score is
proposed here; this section specs the instrument, not a re-run.

A frozen instrument needs:

- **Fixed axes with weights**, drawn from the existing eval's own dimensions
  since they already proved discriminating: config preserved (no clobber/data
  loss — binary-ish, should dominate the weight since it's correctness, not
  taste), breakage/dangling-reference count (exactly what §2-3 above measured
  mechanically, without a model call — phantom paths, dead conditionals,
  broken cross-references), signal-vs-noise (relevant-skill count and byte
  weight against total installed), net capability added, reversibility
  (uninstall round-trip leaves the tree as found). Breakage-count and
  config-preservation should be weighted above taste-driven axes like net
  capability, because both are checkable by script, not model judgment.
- **A pinned model and fixed prompt template** (or a documented sampling
  temperature) so repeat runs are comparable instead of one-off "holistic
  passes."
- **A clean-checkout procedure**: fresh clone/copy of the target, not a
  working tree with uncommitted state, one documented `bootstrap.sh`
  invocation logged alongside the score, `git status`/`git diff` captured as
  raw evidence the way [[2026-08-30-adaptation-eval-claude-task-master]]
  already does.
- **Running the default install**, not `--with-runtime` — §0-1 above is the
  evidence that the two produce materially different results and conflating
  them is exactly what produced the +12 mislabeling this trace's own
  investigation prompt asked to confirm.

The breakage-count axis is cheap to make partly mechanical right now: every
item in §2-3 (dead "source checkout" conditionals, the `wiki/status.md`
cadence, `(RIG-124)`, the `.rig/skills/implementation/SKILL.md` dangling
path, the `rig-rig` collision) is `grep`/tree-diff-detectable without a model
call at all — a pre-eval lint pass could catch regressions on this axis
before any Sonnet pass runs.

## 6. Ranked work-item list

| # | File:line | Defect | Fix approach | Effort | Kind | Design decision embedded? | Bug vs polish |
|---|---|---|---|---|---|---|---|
| 1 | `rig/lib/payload.js` (no `.gitignore` write); `rig/manifest.json` | Default install lands 209 files / 8.3 MB, 100% unignored, in every target repo | Add a payload entry that writes/merges a `.gitignore` block for `.rig/` and the host-specific `rig-*` skill dirs | S | installer-code | **Yes** — gitignore (tool-cache) vs commit (vendored-config); recommend gitignore, see §4 | correctness-adjacent (product-hygiene bug; not a crash, but produces unreviewable diffs on first use) |
| 2 | `rig/lib/payload.js:94` (`finalName = ${prefix}${skill.name}`); `rig/catalog/skills/_core/SKILL.md:2` (`name: rig`); `rig/tier-1/routing.md:101` | The vendored `rig` switchboard installs as `rig-rig` for Claude/Codex/Antigravity, so `routing.md`'s own fallback instruction names a skill that doesn't exist under that name for native-dispatch hosts | Exempt `_core` from the generic prefix (install at `.claude/skills/rig`), or update `routing.md`'s fallback text to say `rig-rig` | S | installer-code | Yes — the blanket per-host prefix rule wasn't written with the self-named "rig" skill in mind | correctness bug (verified by direct repro, not inferred) |
| 3 | `rig/tier-1/rules/rig.md` (whole file); `rig/manifest.json:9` (gate) | "Always active" implementation rule hardcodes `.rig/skills/implementation/SKILL.md`, which the gate (`instruction_only_selected`) never writes for a Claude-only or Codex-only install — the majority-shape install | Either drop the gate on the tier-1 skill copies (mirror how vendored skills always land at `.rig/skills/{name}`), or template `rules/rig.md`'s path per the same source-checkout/installed split `routing.md` already uses for every other cross-reference | M | mixed (manifest.json gate logic + markdown wording, needs a regression test) | No — this is an omission, not an intentional tradeoff | correctness bug (verified by direct repro) |
| 4 | `rig/tier-1/routing.md:22-25` | Full-cadence branch asserts a `wiki/`, a `status.md` regeneration cadence, and "per `CLAUDE.md`" — none of which exist in a target repo; carries a dangling internal ID `(RIG-124)` | Rewrite to hedge the way `rig/tier-1/skills/grilling/SKILL.md:15` already does ("the wiki, or a README, reasoning traces, `CLAUDE.md`, or whatever markdown exists"); drop or footnote the internal decision ID | S | pure-markdown | No | polish (confusing, not breaking — no file is dereferenced, just an instruction an agent may over- or under-apply) |
| 5 | `rig/tier-1/routing.md:5-8`, `:30` | "In this source checkout, use `rig/tier-1/...` instead" is always-false dead-branch text once installed, in every copy, permanently | Split into two payload variants at copy time (source-checkout doc vs installed doc), or drop the clause entirely from the installed copy since the installed reader never needs it | S–M | pure-markdown (M if templated at copy-time instead of hand-forked) | No | polish |
| 6 | `rig/tier-1/skills/tdd/SKILL.md:31` | Same dangling `(RIG-124)` internal ID, and it violates `rig/tier-1/rules/communication.md:32-38`'s own ban on bare internal identifiers in agent output, from inside the same payload | Drop the citation or move it to a code comment in the Rig source that never ships | S | pure-markdown | No | polish |
| 7 | *(no code yet — process gap)* | No frozen rubric: fixed axes/weights, pinned model, clean-checkout procedure, default-install requirement | Write the instrument per §5 before the next eval run; make the breakage-count axis mechanical (grep/tree-diff) so items 4-6's class of defect is caught pre-model-call | M | process/tooling, not installer-code | Yes — axis selection and weighting is a judgment call for the intent owner to confirm, not silently pick | not a bug — measurement-infrastructure gap blocking any future re-baseline |

Items 2 and 3 are the highest-confidence, highest-severity findings in this
investigation: both are functional breakage in the shipped default product,
both were confirmed by actually running `bootstrap.sh` rather than reading
code, and neither was named in the investigation prompt's own hint list.
Item 1 is highest-impact by reach (every install, every repo) but is a
hygiene/trust problem rather than a broken reference. Items 4-6 are the
already-known phantom-text traps, now with exact evidence and a concrete fix
shape rather than a description. Item 7 blocks Path A's own stated goal (a
frozen, repeatable eval) and should land before any re-score is attempted.

## What this trace settles

- The eval-framing correction from [[2026-08-30-office-hours-path-a-path-b-scoping]]
  is confirmed against the manifest and reproduced directly, not just read
  from source: default installs are markdown-only, full stop.
- [[topics/onboarding-flow]]'s "kilobytes, not megabytes" estimate for the
  default install was too optimistic — measured at 209 files / 8.3 MB, driven
  by the double-vendoring of the skill catalog (`.rig/skills/*` +
  `.claude/skills/rig-*`), not by any non-markdown content.
- Two new correctness bugs (dangling `.rig/skills/implementation/SKILL.md`
  reference; `rig`→`rig-rig` name collision) are added to the record, found
  only by running the installer against disposable targets and inspecting the
  result — neither is visible from reading `routing.md` or `manifest.json`
  in isolation.
- No score is invented for the missing rubric; §5 specs what one needs before
  Path A's "re-baseline" step can mean anything.
