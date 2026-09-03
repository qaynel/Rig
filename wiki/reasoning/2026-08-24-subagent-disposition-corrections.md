---
date: 2026-08-24
source: review
topics: host-and-ci-coverage
decisions:
status: historical
---

# RIG-106 — corrections to the subagent lifecycle disposition

External review of
[reasoning/2026-08-24-subagent-mode-propagation-disposition.md](2026-08-24-subagent-mode-propagation-disposition.md)
against primary sources, cross-checked here before applying. Four corrections
confirmed; the rest of the original trace holds as written (three-way split —
Copilot in, Cursor gate-only, Gemini/Antigravity/Devin/Windsurf no event —
survives unchanged).

## 1. Copilot — real caveat on the confirmed "yes"

`subagentStart`/`subagentStop` do not fire for the built-in `general-purpose`
agent. Confirmed verbatim against `docs.github.com/en/copilot/reference/hooks-reference`:
"The built-in `general-purpose` agent does not emit `subagentStart` or
`subagentStop`" — only the other built-in YAML-based agents (`explore`,
`task`, `code-review`, `rubber-duck`, `research`, `security-review`) and
user-defined custom agents emit them. `general-purpose` is the default agent
type in many setups, so Rig's Copilot wiring (`hooks/copilot-hooks.json` +
`hooks/rig-runtime.js`, landed this ticket) injects the active mode for named
and custom subagents but has no vendor-provided hook to reach a
general-purpose subagent. There is nothing Rig's graft can do about this — the
event simply never fires for that agent type — so this is a documented
limitation, not a bug to fix.

## 2. Hermes — bucket move, not a "no mechanism" host

The original trace filed Hermes under "no hook mechanism at all," alongside
pi/swival/generic, on the strength of `host-capabilities.js`'s
`shell_hook: 'unsupported'` entry. That entry is about the *repo-scoped*
committable-hooks axis (accurate — Hermes hooks are user-global YAML) but
doesn't settle whether a subagent-lifecycle event exists at all. It does:
Hermes has a real, config-file-based hook system
(`~/.hermes/config.yaml`, no Python required, 26 valid events) including
`subagent_start`/`subagent_stop`, confirmed at
`hermes-agent.nousresearch.com/docs/user-guide/features/hooks`. But per that
same page: "Return value: Ignored. This is an observer hook only; returning a
value does not block or mutate the child agent run" — and `subagent_start`
fires inside `_build_child_agent()`, after the child agent object already
exists. Same shape as Cursor and CodeWhale: hook fires, cannot inject.
**Hermes moves from "no mechanism" to the observer-only bucket.**

## 3. Pi — soften "no hook mechanism" to "no native mechanism"

Pi's core ships no hooks (four tools, nothing else) — that part of the
original trace is accurate. But hooks are available as an installable
first-party-pattern extension, `@vahor/pi-hooks`
(`pi install npm:@vahor/pi-hooks`, configured via `.pi/hooks.json`), confirmed
at `pi.dev/packages/@vahor/pi-hooks`: 30 documented events (`session_start`,
`before_agent_start`, `agent_start`, `agent_end`, `tool_execution_*`, etc.) —
**none subagent-scoped**, despite Pi having first-class subagents. The
disposition conclusion (N/A — no subagent event reachable) is unchanged, but
the reason is more precise: it's not that Pi has no hook mechanism at all, but
that neither Pi's core nor its one documented hook extension expose a
subagent-scoped event. Whether Rig would ever graft a third-party npm
dependency to reach Pi's hook layer at all (for any event) is a separate,
unasked question — out of scope here since the answer (no subagent event)
would be the same either way.

## 4. Kiro — resolved, not unresolved

The original trace correctly found the docs ambiguous as of 2026-08-24's
research pass. `kiro.dev/docs/hooks/` and `kiro.dev/docs/hooks/types/` were
re-checked and the `AgentSpawn` trigger now documents its payload precisely:
`{ "hook_event_name": "agentSpawn", "cwd": "...", "session_id": "..." }` —
confirmed by direct search of the current page content. No
`parent_session_id`, `agent_id`, or `subagent_type` field exists. Combined
with the unchanged description "Runs when the agent is first activated. No
tool context is provided," this reads as **per-session activation, not
per-subagent-spawn** — the CLI's main-agent equivalent of `SessionStart`, not
a subagent lifecycle hook at all. **Kiro moves from ❔ unresolved to a
resolved N/A** (no subagent-scoped event), with one caveat: an open vendor bug
report, "Kiro CLI Bug - AgentSpawn Hook Retries on Every Tool Call"
(`kirodotdev/Kiro#7138`), suggests the CLI's actual firing behavior may not
match its documented per-session description. That's a bug report, not
documentation, so it doesn't reopen the disposition — but if Rig ever depends
on Kiro's subagent behavior, a first-wire test (not another docs read) is the
only way to be certain the CLI doesn't also fire `AgentSpawn` per
sub-invocation.

## Net effect on the wiring decision

None of the four corrections change what got wired: Claude, Codex/vscode-codex,
and Copilot/Copilot CLI remain the only hosts with a confirmed
context-injecting subagent hook, and the Copilot wiring already landed is
unaffected — it correctly does nothing when Copilot's active agent type is
`general-purpose`, which is the documented vendor behavior, not a gap in the
graft.
