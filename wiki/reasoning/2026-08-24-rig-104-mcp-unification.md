---
ticket: RIG-104
---

# RIG-104 — unifying the legacy renderers.js MCP path with the catalogue materializer

## What was actually wrong

Two independent tables encoded MCP disposition:

- `rig/lib/host-capabilities.js` `REGISTRY` — the researched source (`mcp_config.scope`,
  `surfaces.mcp`, `surfaces.mcp_key`), consumed only by the catalogue/à-la-carte
  descriptor path (`materializeHostAdapters`, `materializeSelectedHosts`), which
  writes `.rig/host-contracts/**` axis descriptors, never a real host MCP file.
- `rig/lib/renderers.js` `HOST_TIER`/`HOST_FILES` — a second, hand-maintained
  table, consumed by the legacy Basic path (`renderMcp`, via `materialize.js`),
  which is the *only* code path that ever writes a real host MCP config file.

They disagreed in three concrete, user-visible ways:

1. **pi** was Tier A in `renderers.js` (wrote `.omp/mcp.json`) despite
   `REGISTRY` correctly recording `mcp_config.scope: 'unsupported'` — the exact
   bug RIG-103 named, and the one AT-HOST-5's frozen test (`tests/advanced-oracle.test.js`)
   already covered for the catalogue path but not the legacy path.
2. **OpenClaw's key/path** diverged the other direction: `REGISTRY` said bare
   `openclaw.json` with a flat `mcpServers` key; the shipped, tested renderer
   (plus `credentials.js`'s `OPENCLAW_CONFIG_PATH` wiring note) used
   `.openclaw/openclaw.json` with servers nested under `mcp.servers`. The
   registry's metadata was unused by any code (`contractFor` never reads
   `mcp_key`), so it had silently drifted from reality. Fixed by correcting
   `REGISTRY`, not the shipped shape — the tested behavior is the ground truth.
3. **codewhale** is a documented, unresolved project-vs-global conflict
   (host-coverage-spec §3.1 ❔). `REGISTRY` says `user_global`
   (`~/.deepseek/mcp.json`), but Rig already ships a `DEEPSEEK_MCP_CONFIG`
   env-var redirect pointing the CLI at a repo-local `.codewhale/mcp.json`
   instead — a real, already-tested override, not a bug. Kept as-is, now made
   an explicit, documented override in the single-source table rather than a
   silent divergence, pending RIG-110's resolution of the underlying conflict.

## The fix

`rig/lib/mcp-hosts.js` (new) derives one `MCP_HOSTS` table from `REGISTRY`,
with exactly two named overrides:
- `antigravity`: `autoWrite: false` — repo-capable per research, but RIG-105
  (owner-approved 2026-08-24) keeps it a manual step + verification, never an
  auto-write.
- `codewhale`: `autoWrite: true`, `file: '.codewhale/mcp.json'` — the shipped
  `DEEPSEEK_MCP_CONFIG` redirect above.

`renderers.js` now imports this table for disposition/file/key instead of
maintaining its own; `renderMcp`'s auto-write gate is
`MCP_HOSTS[host].autoWrite && RENDERERS[host]` (disposition-eligible *and*
implemented — a host can be eligible without a shipped renderer yet, e.g.
`copilot-cli`, and it still correctly falls through to an advisory note
instead of silently doing nothing). A shared `setAtPath`/`mergeMcpEntry`
places every JSON-shaped host's entry at its governing dotted key
(`mcpServers`, `servers`, `mcp`, or OpenClaw's `mcp.servers`), replacing 11
near-duplicate `jsonFile(...)` closures with one function — proven idempotent
and preservation-safe per shape by `tests/basic-mcp-merge.test.js`. `pi`'s
renderer is deleted outright; its disposition gate now falls through to the
same "preserve + migration guidance" path AT-HOST-5 already specified,
covered end-to-end (not just via `direct-require`) by a new
`tests/basic-renderers.test.js` case.

Network policy parity (host-coverage-spec §3.2 "MCP is never an enforcement
bypass"): every http-transport MCP entry is now evaluated through the exact
same `evaluateAction` engine used for shell/web (`rig/lib/enforcement.js`),
against the exact same active `.rig/network-policy.json` (or the shipped
baseline default when none exists yet). The decision is recorded on the
install receipt (`receipt.networkPolicy`); it does not block config emission,
since writing config is not the guarded action — the runtime hook fired when
an agent actually calls the tool is (that wiring is RIG-106/107/109/110
territory, out of this ticket's "contained" scope). A new test proves parity:
same policy, same decision as an equivalent shell action; disabling the `mcp`
enforcement surface disables it the same way `web`/`shell` would.

## copilot-cli wired too (2026-08-24, same day, owner pushback)

Initially left `copilot-cli` note-only — it had never had a renderer, and
wiring it meant trusting `REGISTRY`'s citation for a shape `renderers.js`
had never exercised. Owner pushback: `copilot-cli` is not one of the §3.1
❔ unresolved-conflict hosts (unlike codewhale/hermes/swival/antigravity-CLI);
`host-coverage-spec` names it confidently — ✅ `repo`, `.github/mcp.json`,
key `mcpServers`, citation
`https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers`
— and it uses the same plain "else mcpServers" shape as claude/gemini/devin,
not a bespoke one. No real reason to leave a serviceable, cited, non-conflicted
host on the sidelines. Added `renderCopilotCli` (generic entry, same as
claude/pi's old shape) to `RENDERERS`, and `copilot-cli: ['stdio', 'http']` to
`rig/lib/variants.js`'s `SUPPORTED_TRANSPORTS` (a fourth, previously
undiscovered per-host hardcoded list — every existing renderer already
handles both transports, so this list is mechanically redundant with
`Object.keys(RENDERERS)`, but collapsing it means `variants.js` importing back
from `renderers.js`, a cycle; left as its own small table rather than
introducing that coupling for one line). Covered by the same
`TP-C4.3`/`TP-C4.8` disposition tests and the `basic-mcp-merge` idempotency
suite as every other Tier-A host.
