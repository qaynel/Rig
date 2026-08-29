---
ticket: RIG-101
---

# RIG-101 — expanding rig-mcp wiring from 4 to 11 hosts, and the openclaw conflict

## Why this happened now

RIG-101 landed with 4 wired hosts (opencode, claude, codex plugin, gemini) and
a "deliberately not done" list of 8 hosts with no existing adapter file in
this repo (cursor, kiro, devin, swival, openclaw, copilot, copilot-cli,
vscode-codex). The user asked to expand coverage, then — rather than have me
guess vendor schemas from memory — asked for a prompt to hand to a separate
web-research agent, to be pointed at each host's official docs. That research
came back as a 12-host report (the 8 above, plus windsurf/cline/hermes/
codewhale re-checked for scope changes), each entry citing a specific official
URL and, where relevant, a doc "as of" date.

## The concurrent-landing complication

Mid-session, ticket RIG-104 landed in this same working directory (a different
agent, same repo checkout): it unified two previously-disagreeing MCP schema
tables (`rig/lib/renderers.js`'s hand-maintained `HOST_TIER`/`HOST_FILES` vs.
`rig/lib/host-capabilities.js`'s researched `REGISTRY`) into one source of
truth, `rig/lib/mcp-hosts.js`. That system covers a different surface than
RIG-101 (it's the *installer's* renderer for writing MCP config into a target
repo Rig is installed into; RIG-101 is Rig's own source repo declaring its own
`rig-mcp` server in its own adapter manifests) — but it now holds tested,
shipped, cross-referenced knowledge of the exact same 8 hosts' schemas.

Rather than hand-write 7 new files from the web research alone — which would
have reintroduced exactly the "two disagreeing tables" anti-pattern RIG-104
just fixed, this time a third table — every new host's shape was cross-checked
against REGISTRY before being committed.

## What matched, what didn't

6 of 7 newly-wired hosts agreed exactly between the fresh web research and
REGISTRY: cursor (`.cursor/mcp.json`, `mcpServers`), kiro
(`.kiro/settings/mcp.json`, `mcpServers`), copilot VS Code (`.vscode/mcp.json`,
`servers`), copilot-cli (`.github/mcp.json`, `mcpServers`, `type: "local"`),
codex CLI + IDE extension (`.codex/config.toml`, `[mcp_servers]`, confirmed
same file shared by both surfaces). Swival's research recommended TOML
(`swival.toml`) as the *preferred* format but confirmed JSON
(`.swival/mcp.json`) also works and merges; REGISTRY already uses the JSON
path, so that was kept rather than introducing a second config format for one
host.

Two disagreements surfaced:

1. **Devin CLI's config filename.** REGISTRY (and the wiki's prior research)
   says `.devin/config.json`. The fresh web research says the file moved to
   `.devin/mcp_config.json` in a cited v3000.3/"Local 3.6" release, with
   `.devin/mcp_config.local.json` as a separate gitignored personal variant.
   Low stakes — same directory, same key, both repo-scoped, only the filename
   in question — so wired as-is per REGISTRY (the already-tested, shipped
   shape) rather than blocking on it. Flagged for a future spot-check.

2. **OpenClaw's scope — repo vs. global.** This is not a filename detail, it's
   a fork in whether a repo-committed file is even a valid concept for this
   host. REGISTRY says `mcp: 'repo'`, `.openclaw/openclaw.json`,
   `mcp.servers` key — and RIG-104's own commit message explicitly calls this
   the *tested, shipped shape*, corrected during that same ticket from a
   previously-wrong bare-filename assumption, with test coverage in
   `tests/basic-renderers.test.js` (`TP-C4.3`/`TP-C4.5`/`TP-C4.5b`). The fresh
   web research instead describes OpenClaw as a single-user personal Gateway
   assistant (WhatsApp/Telegram/Discord/Control UI) with **one global** config
   file at `~/.openclaw/openclaw.json` and explicitly no per-repo committed
   file concept — citing docs.openclaw.ai/gateway/configuration-reference.

   Both sources are credible: REGISTRY's shape is tested against something
   (unclear if that was the real product or an earlier doc pass); the web
   research is dated and cites a specific official page. Guessing which is
   current risks either writing a file OpenClaw will never read (if global-only
   is right) or leaving a real gap open (if repo-scope is right). Rather than
   pick one, `openclaw` was left un-wired in this repo, and the conflict itself
   was recorded in `host-coverage-spec §3.2.1` and `wiki/tickets/RIG-101.md` as
   open, unresolved work — not silently dropped and not silently guessed.

## What this means going forward

The next step on openclaw isn't more doc research (both sides already cite
official-looking sources) — it's an actual install-and-check against a real
OpenClaw instance, or asking someone who runs one. Until then, no `rig-mcp`
config is written for it, matching the existing `pi`/`generic`/owner-excluded
pattern of recording an intentional non-emission rather than a silent gap.
