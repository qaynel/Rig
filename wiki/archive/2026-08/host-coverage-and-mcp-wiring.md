---
date: 2026-08-31
source: agent
topics: host-and-ci-coverage, user-global-writes, drift-and-secret-controls, review-receipts
status: historical
summary: Archived August 2026 reasoning on host coverage, MCP table unification, and the per-host subagent-hook research — 7 traces compacted.
---

# Host coverage and MCP wiring

Compacted on 2026-10-17 from 7 August 2026 reasoning traces. Bodies live in
git history; every decision, rejection, trap and verbatim owner ruling the
sources carried is reproduced below.

## What this theme settled

Hermes is **first-class**: documented in `CLAUDE.md`'s architecture section,
`__init__.py` stays where it is, and the `.venv` + pandas step stays in
`npm test`.

`RIG-104` collapsed two independently-maintained MCP disposition tables into
one derived source, `rig/lib/mcp-hosts.js`, with exactly two named overrides.
Where the two tables disagreed, the **tested, shipped shape was treated as
ground truth** and the unused registry metadata was corrected, not the other
way round — because `contractFor` never read `mcp_key`, so the registry had
silently drifted from reality. A `pi` renderer that contradicted its own
`unsupported` disposition was deleted outright. Every http-transport MCP entry
is now evaluated through the same `evaluateAction` engine as shell and web, so
MCP is never an enforcement bypass.

`RIG-101` expanded `rig-mcp` wiring from 4 to 11 hosts, cross-checking every
new host's shape against the registry rather than hand-writing from web
research alone — which would have reintroduced a third disagreeing table the
day after RIG-104 removed the second. Two disagreements surfaced; the low-stakes
one (Devin's filename) was wired per the tested shape and flagged, and the
structural one (whether OpenClaw has a repo-committed config concept at all) was
left **deliberately un-wired and recorded as open** rather than silently guessed.

`RIG-106` established, host by host with citations, that only Claude,
Codex/vscode-codex and Copilot/Copilot CLI expose a subagent lifecycle event
capable of *context injection*. The disposition distinguishes three kinds of
"no": a hook that fires but can only observe or gate; a general hook mechanism
with no subagent-scoped event; and no hook mechanism at all. An external review
then corrected four of the entries without changing what got wired.

The owner also approved an optional global MCP install for OpenClaw during
installation, gated on an explicit warning that it is global rather than
repository context.

## Source traces

### 2026-08-20-hermes-first-class.md
- **Summary:** Hermes is first-class — document it in CLAUDE.md's architecture section; do not deprecate, move, or drop its test step.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's resolution of the open question left by the cleanup survey's item 5.
- **Verbatim rulings / rejections / traps:** "Hermes is first-class. Document it in `CLAUDE.md`'s architecture section as part of cleanup punch list item 5; do not deprecate, do not move `__init__.py`, do not drop the `.venv` + pandas step from `npm test`."

### 2026-08-23-triage-disclosure-and-pr-review.md
- **Summary:** Owner approves the triage-disclosure option and asks the PR to match the independent review to the à-la-carte branch implementation.
- **Decisions:** AD-35, AD-36
- **Status:** historical
- **What it recorded:** The owner's ruling, filed verbatim.
- **Verbatim rulings / rejections / traps:** "Option it looks good for question one yeah yeah I want to. I want this PR to match the independent review to match the implementation of à la carte branch."

### 2026-08-24-openclaw-global-mcp-opt-in-request.md
- **Summary:** Owner approves an optional global MCP install for OpenClaw during installation, gated on an explicit global-context warning.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The owner's instruction, filed verbatim including its spoken-transcript form.
- **Verbatim rulings / rejections / traps:** "Yeah, write up an MCP for the open clock global file. Also, I mean if the user wants it, they can mean if the user wants it in the during installation if the user wants it, we can install it on the global context also if needed, so do that so yeah I mean when setting up the if if the user selects clone and the and the MCP thing and all comes up then we can give them an option that just want them saying that kid this would be on the global context in order a rap context not a repository context. It would be a global context with that warning. I think we can install it globally if they use their wishes so"

### 2026-08-24-rig-104-mcp-unification.md
- **Summary:** RIG-104 — two independently-maintained MCP disposition tables unified into one derived table, with the tested shape treated as ground truth.
- **Decisions:** none (ticket RIG-104)
- **Status:** historical
- **What it recorded:** What was actually wrong: `host-capabilities.js`'s researched `REGISTRY` was consumed only by the catalogue path, which writes axis descriptors and never a real host MCP file, while `renderers.js`'s hand-maintained `HOST_TIER`/`HOST_FILES` was consumed by the only code path that writes a real MCP config. They disagreed in three concrete user-visible ways: `pi` was Tier A in `renderers.js` despite the registry correctly recording `unsupported`; OpenClaw's key/path diverged the other direction; and `codewhale` is a documented unresolved project-vs-global conflict where Rig already ships a `DEEPSEEK_MCP_CONFIG` env-var redirect. The fix: `rig/lib/mcp-hosts.js` derived from `REGISTRY` with two named overrides (`antigravity: autoWrite: false` per owner-approved RIG-105; `codewhale: autoWrite: true, file: '.codewhale/mcp.json'`). A shared `setAtPath`/`mergeMcpEntry` replaced 11 near-duplicate closures. Network-policy parity. Then the same-day owner pushback that got `copilot-cli` wired too.
- **Verbatim rulings / rejections / traps:** Ground-truth rule: "Fixed by correcting `REGISTRY`, not the shipped shape — the tested behavior is the ground truth." Drift cause: "The registry's metadata was unused by any code (`contractFor` never reads `mcp_key`), so it had silently drifted from reality." On codewhale: "a real, already-tested override, not a bug. Kept as-is, now made an explicit, documented override in the single-source table rather than a silent divergence." Gate design: "a host can be eligible without a shipped renderer yet, e.g. `copilot-cli`, and it still correctly falls through to an advisory note instead of silently doing nothing." Enforcement parity: "MCP is never an enforcement bypass… The decision is recorded on the install receipt; it does not block config emission, since writing config is not the guarded action — the runtime hook fired when an agent actually calls the tool is." Owner pushback verbatim in effect: "`copilot-cli` is not one of the §3.1 ❔ unresolved-conflict hosts… No real reason to leave a serviceable, cited, non-conflicted host on the sidelines." Deliberate non-fix: the `SUPPORTED_TRANSPORTS` list "is mechanically redundant with `Object.keys(RENDERERS)`, but collapsing it means `variants.js` importing back from `renderers.js`, a cycle; left as its own small table rather than introducing that coupling for one line."

### 2026-08-24-rig-101-host-expansion-openclaw-conflict.md
- **Summary:** RIG-101 — rig-mcp wiring expanded from 4 to 11 hosts, cross-checked against REGISTRY; openclaw left deliberately un-wired on an unresolved repo-vs-global conflict.
- **Decisions:** none (ticket RIG-101)
- **Status:** (no status field)
- **What it recorded:** Why the expansion happened then, and that the user asked for a prompt to hand to a separate web-research agent rather than have the shapes guessed from memory. The concurrent-landing complication with RIG-104 in the same working directory. What matched (6 of 7 newly-wired hosts agreed exactly, each named with its path and key) and what did not. Devin's filename disagreement, wired per the tested shape and flagged. OpenClaw's structural conflict, left open. What the next step on openclaw actually is.
- **Verbatim rulings / rejections / traps:** On avoiding a third table: "Rather than hand-write 7 new files from the web research alone — which would have reintroduced exactly the 'two disagreeing tables' anti-pattern RIG-104 just fixed, this time a third table — every new host's shape was cross-checked against REGISTRY before being committed." On Swival: "REGISTRY already uses the JSON path, so that was kept rather than introducing a second config format for one host." On OpenClaw: "Both sources are credible… Guessing which is current risks either writing a file OpenClaw will never read (if global-only is right) or leaving a real gap open (if repo-scope is right). Rather than pick one, `openclaw` was left un-wired in this repo, and the conflict itself was recorded… as open, unresolved work — not silently dropped and not silently guessed." Next step: "The next step on openclaw isn't more doc research (both sides already cite official-looking sources) — it's an actual install-and-check against a real OpenClaw instance, or asking someone who runs one. Until then, no `rig-mcp` config is written for it, matching the existing `pi`/`generic`/owner-excluded pattern of recording an intentional non-emission rather than a silent gap."

### 2026-08-24-subagent-mode-propagation-disposition.md
- **Summary:** RIG-106 — per-host subagent lifecycle research; only Claude, Codex/vscode-codex and Copilot/Copilot CLI have a confirmed context-injecting subagent hook.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** The evidence-first requirement (inventing an unfired event is dead config and violates "no speculative config"). Four dispositions with per-host citations: hook exists and injects context (claude, codex/vscode-codex, copilot/copilot-cli — the last newly wired this change); hook exists but structurally cannot inject (cursor, codewhale); no subagent-specific event at all (gemini, antigravity, devin, windsurf, opencode, openclaw, cline, kiro); and no subagent concept and no hook mechanism (pi, hermes, swival, generic). The Copilot wiring that landed and the pre-existing bug it exposed.
- **Verbatim rulings / rejections / traps:** The requirement: "Loading the active Rig mode requires injection, not observation." On the second bucket: "A hook that fires on subagent start but can only observe or gate (not inject) cannot fulfill 'loads the active Rig mode.' These are a distinct disposition from 'no subagent concept' — the vendor has subagents and a hook for them, but the hook's response schema has no context field." Codewhale, quoted from its docs: "Codewhale ignores the hook's result: stdout is discarded... nothing about the turn, the tool result, the sub-agent, or the error changes because of it." Copilot bug found and fixed: "previously only `SessionStart` was injectable, so a `subagentStart` hook firing under the old code would have silently emitted `{}`." On openclaw: "Wiring a plugin is a different, heavier distribution mechanism than the markdown/HOOK.md graft Rig ships today, so this stays N/A for Rig's current graft, not a false 'vendor has no subagents.'" On kiro: "Left unresolved rather than wired on a guess — matches the ❔ convention already used elsewhere in host-coverage-spec §3.1 for genuinely ambiguous vendor behavior." Outcome: "Every other host in the 19-host roster is N/A, each for a specifically evidenced reason rather than a blanket 'unsupported.'"

### 2026-08-24-subagent-disposition-corrections.md
- **Summary:** External review of the RIG-106 disposition against primary sources — four corrections confirmed; none changes what got wired.
- **Decisions:** none
- **Status:** historical
- **What it recorded:** (1) Copilot's `subagentStart`/`subagentStop` do not fire for the built-in `general-purpose` agent, which is the default in many setups — a documented limitation, not a bug to fix. (2) Hermes moves from "no mechanism" to the observer-only bucket: it has a real config-file hook system with 26 valid events including `subagent_start`, but the return value is ignored and the hook fires after the child agent object already exists. (3) Pi's "no hook mechanism" softens to "no native mechanism": hooks exist as an installable first-party-pattern extension with 30 events, none subagent-scoped. (4) Kiro moves from ❔ unresolved to a resolved N/A, with one caveat about an open vendor bug report.
- **Verbatim rulings / rejections / traps:** Copilot, quoted verbatim from the vendor docs: "The built-in `general-purpose` agent does not emit `subagentStart` or `subagentStop`". And the conclusion: "There is nothing Rig's graft can do about this — the event simply never fires for that agent type — so this is a documented limitation, not a bug to fix." Hermes, quoted from its docs: "Return value: Ignored. This is an observer hook only; returning a value does not block or mutate the child agent run." Pi's refined reason: "it's not that Pi has no hook mechanism at all, but that neither Pi's core nor its one documented hook extension expose a subagent-scoped event." Kiro's caveat: "an open vendor bug report, 'Kiro CLI Bug - AgentSpawn Hook Retries on Every Tool Call' (`kirodotdev/Kiro#7138`), suggests the CLI's actual firing behavior may not match its documented per-session description. That's a bug report, not documentation, so it doesn't reopen the disposition — but if Rig ever depends on Kiro's subagent behavior, a first-wire test (not another docs read) is the only way to be certain." Net effect: "None of the four corrections change what got wired… it correctly does nothing when Copilot's active agent type is `general-purpose`, which is the documented vendor behavior, not a gap in the graft."
