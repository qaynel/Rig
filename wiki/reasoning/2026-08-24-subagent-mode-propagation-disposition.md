---
date: 2026-08-24
source: agent
topics: host-and-ci-coverage
decisions:
status: historical
---

# RIG-106 — per-host subagent lifecycle event research

Ticket: RIG-106, "Propagate Rig mode to subagents on every host that supports
them." The ticket's own solution doc (`wiki/tickets/RIG-106.md`) requires the
real work to be evidence-first: research whether each of the 19
`SUPPORTED_HOSTS` actually exposes a subagent lifecycle hook event before
wiring anything, because inventing an unfired event is dead config and
violates host-coverage-spec §4 "no speculative config."

Researched via vendor documentation (WebFetch/WebSearch), 2026-08-24. For each
host: does a subagent lifecycle hook event exist, and if so, can it inject
context/instructions into the new subagent (not merely observe or gate it)?
Loading the active Rig mode requires injection, not observation.

## Confirmed: hook exists and injects context — wireable

- **claude** — `SubagentStart` hook, `hookSpecificOutput.additionalContext`.
  Already wired (`hooks/claude-codex-hooks.json`, `hooks/rig-subagent.js`).
  https://docs.anthropic.com/en/docs/claude-code/hooks
- **codex / vscode-codex** — `SubagentStart`/`SubagentStop` are 2 of Codex's 10
  lifecycle hook events; `hookSpecificOutput.additionalContext` is documented
  as "added as extra developer context for the subagent." Already wired —
  Codex shares `claude-codex-hooks.json` and `PLUGIN_DATA` already routes
  `rig-runtime.js` into the Codex branch.
  https://developers.openai.com/codex/hooks
- **copilot / copilot-cli** — `subagentStart` fires for both the CLI and cloud
  agent surfaces. Per the hooks reference: "Optional — cannot block creation,
  but `additionalContext` is prepended to the subagent's prompt" — the
  identical top-level `{ additionalContext }` shape as `sessionStart`, not the
  `hookSpecificOutput` wrapper Claude uses. **This was the ticket's named gap
  and is now wired**: `hooks/copilot-hooks.json` gained a `subagentStart`
  entry invoking `rig-subagent.js`; `hooks/rig-runtime.js`'s `isCopilot`
  branch of `writeHookOutput` now treats `'SubagentStart'` the same as
  `'SessionStart'` (previously only `SessionStart` was injectable, so a
  `subagentStart` hook firing under the old code would have silently emitted
  `{}`). Covered by `tests/hooks.test.js`.
  https://docs.github.com/en/copilot/reference/hooks-reference

## Confirmed: subagent hook exists, but structurally cannot inject context — N/A

A hook that fires on subagent start but can only observe or gate (not inject)
cannot fulfill "loads the active Rig mode." These are a distinct disposition
from "no subagent concept" — the vendor has subagents and a hook for them, but
the hook's response schema has no context field.

- **cursor** — `subagentStart` hook exists (`cursor.com/docs/hooks`), but its
  response schema is `{ permission: "allow"|"deny", user_message? }` only —
  gating, not injection. `"ask"` is explicitly unsupported and treated as
  `"deny"`. No `additionalContext`-equivalent field.
- **codewhale** — `subagent_spawn` is 1 of 11 documented hook events
  (`docs/HOOKS.md`), fires in the TUI runtime a committed `.codewhale/hooks.toml`
  can reach, but is explicitly classified **observer-only**: "Codewhale ignores
  the hook's result: stdout is discarded... nothing about the turn, the tool
  result, the sub-agent, or the error changes because of it." The steering
  allowlist (`message_submit`, `tool_call_before`, `shell_env`) excludes
  subagent events entirely.

## Confirmed: no subagent-specific hook event at all — N/A

Hosts below have a general hook mechanism (so they are not "no subagent
concept" in the trivial sense of lacking hooks), but no event fires
specifically on subagent start with any response schema:

- **gemini** (Gemini CLI) — has subagents (`docs/core/subagents.md`) and a
  10-event hook system (`SessionStart`, `SessionEnd`, `BeforeAgent`,
  `AfterAgent`, `BeforeModel`, `AfterModel`, `BeforeToolSelection`,
  `BeforeTool`, `AfterTool`, `PreCompress`, `Notification`) — none scoped to a
  subagent. https://geminicli.com/docs/hooks/
- **antigravity** — has subagents (`invoke_subagent`/`manage_subagents` tools)
  and 5 hook events (`PreToolUse`, `PostToolUse`, `PreInvocation`,
  `PostInvocation`, `Stop`) — none subagent-scoped.
  https://antigravity.google/docs/hooks/
- **devin** (Devin CLI) — has subagent tools (`run_subagent`, `read_subagent`)
  and 8 hook events (`PreToolUse`, `PostToolUse`, `PermissionRequest`,
  `UserPromptSubmit`, `Stop`, `PostCompaction`, `SessionStart`, `SessionEnd`) —
  explicitly no `SubagentStart`/`SubagentStop`, unlike Claude Code's
  vocabulary it otherwise mirrors. https://docs.devin.ai/cli/extensibility/hooks/lifecycle-hooks
- **windsurf** (Devin Desktop, ex-Windsurf) — 12 Cascade hook events
  (`pre_read_code`, `post_read_code`, `pre_write_code`, `post_write_code`,
  `pre_run_command`, `post_run_command`, `pre_mcp_tool_use`,
  `post_mcp_tool_use`, `pre_user_prompt`, `post_cascade_response`,
  `post_cascade_response_with_transcript`, `post_setup_worktree`) — none
  subagent-scoped. https://docs.devin.ai/desktop/cascade/hooks
- **opencode** — has subagents via the Task tool (primary/subagent modes) but
  the plugin hook API (`tool.execute.before/after`, `session.idle`, etc.) has
  no subagent-spawn hook; a feature request for one is open and unresolved
  (`anomalyco/opencode#20387`). Confirms absence, not a maybe.
- **openclaw** — `subagent_spawned`/`subagent_spawning`/`subagent_ended` exist
  only in the **plugin hooks** catalog (in-process extension points that
  require writing an OpenClaw plugin). The operator-installed `HOOK.md`
  mechanism Rig actually grafts (`docs.openclaw.ai/automation/hooks`) exposes
  only `command:*`, `session:*`, `agent:bootstrap`, `gateway:*`, `message:*` —
  no subagent event, and the docs say explicitly "core emits nothing else."
  Wiring a plugin is a different, heavier distribution mechanism than the
  markdown/HOOK.md graft Rig ships today, so this stays N/A for Rig's current
  graft, not a false "vendor has no subagents."
- **cline** — subagent-capable lifecycle hooks (`beforeRun`, `afterRun`,
  `beforeModel`, `afterModel`, `beforeTool`, `afterTool`, `onEvent`,
  `SubagentStart`/`SubagentStop` with `agent_id`/`agent_type`) exist only in
  the **Cline SDK** (`@cline/agents`, for building a custom agent runtime), not
  in the repo-committed `.cline/hooks/` config surface `host-capabilities.js`
  already grafts. `docs.cline.bot/customization/hooks` points elsewhere for
  event specifics and does not document a subagent event for that surface.
- **kiro** — has custom subagents (`kiro.dev/changelog/ide/0-9/`) and a
  CLI-only `AgentSpawn` trigger ("runs when the agent is first activated"),
  but the docs never state whether `AgentSpawn` fires once per session or once
  per subagent, and describe no context-injection response for it. Left
  unresolved rather than wired on a guess — matches the ❔ convention already
  used elsewhere in host-coverage-spec §3.1 for genuinely ambiguous vendor
  behavior (e.g. codewhale's skills path).

## No subagent concept and no hook mechanism at all — N/A trivially

Already recorded in `rig/lib/host-capabilities.js` as `shell_hook:
'unsupported'` for every axis, so no new research was needed to rule out a
subagent-specific hook: **pi** (extensions only, no hook file), **hermes**
(hooks are user-global YAML, not a lifecycle-hook system), **swival**
(startup/exit + command-middleware only, no edit-time gate), **generic** (no
vendor, no hooks).

## Outcome

Only Claude, Codex/vscode-codex (already wired), and Copilot/Copilot CLI
(newly wired this change) have a confirmed subagent lifecycle event capable of
context injection. Every other host in the 19-host roster is N/A, each for a
specifically evidenced reason rather than a blanket "unsupported." This
satisfies RIG-106's second acceptance bullet ("hosts with no subagent concept
are explicitly recorded as N/A") with per-host evidence instead of an inferred
gap, and closes the first bullet by wiring the one host — Copilot — that the
ticket named as the concrete drop.
