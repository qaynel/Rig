<figure>
<img width="1012" height="506" alt="image" src="https://github.com/user-attachments/assets/c647015e-6538-43de-8c26-6d6358c89729" />
<figcaption>
  Photo by <a href="https://unsplash.com/@luandmario?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Maria Lupan</a> on <a href="https://unsplash.com/photos/red-and-black-metal-tower-during-sunset-hy97yy3e03A?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Unsplash</a>
</figcaption>
</figure>

---
Rig is a curated, host-agnostic toolbox for coding agents. It ships two
delivery surfaces:

1. **Markdown bootstrap (Tier 1)** — one shared router, an always-on Ponytail
   implementation rule, and focused skills for intent, design, execution, TDD,
   debugging, and code review. No processes, API keys, or dependencies.
2. **À-la-carte catalogue** — let the user pick engineering capabilities as
   `family → group → service → grade` (Development · Testing · Infrastructure ·
   Product-Security). Fixed Basic / mid / Advanced install packages are
   retired; the catalogue is the product.

> **Beta note:** The mandatory agent-technology safety baseline is included.
> Catalogue services beyond their declared Policy assurance remain opt-in.

## Install the markdown bootstrap

From this checkout:

```sh
sh rig/bootstrap.sh --target /path/to/repository
```

By default the local bootstrap is markdown-only: every skill's `SKILL.md`
lands, but its code and the `.rig/plumbing` tree are left out. Add
`--with-runtime` to install those too:

```sh
sh rig/bootstrap.sh --target /path/to/repository --with-runtime
```

The root `install.sh` resolves a named release, downloads it before execution,
and always invokes the bootstrap with `--with-runtime`, so the active catalogue
and safety runtime are included:

```sh
sh install.sh --version v5.0.0 --target /path/to/repository
```

Interactively it prompts for the bootstrap tier; automation can be explicit:

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

Without `--hosts`, Rig mechanically detects existing host configuration from
the 19-host registry and installs no absent host tree. Narrow or override that
selection explicitly with a comma-separated list:

```sh
sh rig/bootstrap.sh --tier 1 --target /path/to/repository --hosts antigravity,codex
# or: RIG_HOSTS=antigravity,codex sh rig/bootstrap.sh --tier 1 --target /path/to/repository
```

Bootstrap requires `node` on `PATH`. Its output names each detected or explicit
host and records every payload write in `.rig/install-manifest.jsonl`.

Tier 1 installs the same instruction set for these host entrypoints:

- Claude Code gets project skills in `.claude/skills/` and a router pointer in
  `CLAUDE.md`.
- Codex gets native project skills in `.agents/skills/` plus the always-on
  router pointer in `AGENTS.md`.
- Antigravity co-reads that same `.agents/` skills/rules tree, plus `GEMINI.md`
  (Antigravity-specific overrides win over `AGENTS.md`) and slash-command
  workflows under `.agents/workflows/`.
- OpenCode, CodeWhale, Swival, and other `AGENTS.md` readers get a root pointer.
- Gemini CLI gets a `GEMINI.md` pointer.
- Cursor, Windsurf, Cline, GitHub Copilot, Kiro, and `.agents/rules` readers get
  their native project instruction files.

Every adapter reads `.rig/routing.md`. Claude and Codex also discover the same
seven skills natively from their host directories. Existing host entrypoints
are preserved.

Those native skill trees are committed in this repository at `.claude/skills/`
and `.agents/skills/`; the bootstrap copies them unchanged into target repos.

| Host | Installed entrypoint |
|---|---|
| Claude Code | `CLAUDE.md`, `.claude/skills/rig-*/SKILL.md` |
| Cursor | `.cursor/rules/rig.mdc` |
| Windsurf | `.windsurf/rules/rig.md` |
| Cline | `.clinerules/rig.md` |
| GitHub Copilot editor/CLI | `.github/copilot-instructions.md`, `AGENTS.md` |
| Codex / VS Code Codex | `AGENTS.md`, `.agents/skills/rig-*/SKILL.md` |
| Gemini CLI | `GEMINI.md` |
| Antigravity | `AGENTS.md`, `GEMINI.md`, `.agents/rules/rig.md`, `.agents/skills/rig-*/SKILL.md`, `.agents/workflows/` |
| Kiro | `.kiro/steering/rig.md` |
| OpenCode, CodeWhale, Swival | `AGENTS.md` |
| Other agents | Configure the host to read `.rig/routing.md`, or add the one-line pointer from `rig/tier-1/adapters/pointer.md` to its project instructions. |

## Install Full Plugin Distribution

Rig also ships richer native adapters for hosts that can load plugins,
extensions, commands, hooks, or statusline integrations. Tier 1 stays the
markdown bootstrap above; use the full distribution when you want the host's
native install surface.

Capability legend: **full-hook** = the host runs Rig's lifecycle hooks
(session/subagent/prompt) for real tool-boundary behavior; **pointer-only** =
the host loads the instruction set but cannot run hooks, so the workflow is
advisory.

| Host | Install / load path | Capability |
|---|---|---|
| Claude Code | local plugin bundle in `.claude-plugin/` with commands, hooks, and statusline support | full-hook |
| Codex | local plugin bundle in `.codex-plugin/` with bundled skills and lifecycle hooks | full-hook |
| GitHub Copilot CLI | `copilot plugin marketplace add qaynel/Rig`, then `copilot plugin install rig@rig` | full-hook (session/prompt) |
| Hermes Agent | native plugin (`plugin.yaml`) — see below | full-hook |
| pi | package extension in `pi-extension/` | full-hook |
| OpenCode | load `.opencode/plugins/rig.mjs`; commands live in `.opencode/command/` | pointer-only + commands |
| Gemini CLI | extension manifest in `gemini-extension.json`; commands live in `commands/` | pointer-only + commands |
| Swival | `swival skills add https://github.com/qaynel/Rig` | pointer-only |
| OpenClaw | `clawhub install rig` | pointer-only |
| Devin | `devin plugins install qaynel/Rig` | pointer-only |

Hosts whose only injection point is a prompt menu can serve Rig through the
standalone MCP server in `rig-mcp/` (the `rig` prompt / `rig_instructions`
tool). See `docs/agent-portability.md` for the full adapter matrix and fallback
instruction-mode paths.

### Hermes Agent

Install Rig as a native Hermes plugin (`plugin.yaml`): it injects the active
mode through `pre_llm_call`, registers `/rig` mode switching, and exposes the
skills as `rig:<skill>`.

## À-la-carte catalogue

Rig offers a scan-recommended menu. The user selects leaf services and grades in
`rig.json`; missing dependencies auto-pull only their exact required slices.
Install grafts onto existing agent infrastructure while the beta focuses on the
catalogue and host integration.

```text
inspect → host review → recommend → select (rig.json) → plan → apply → check
```

```sh
node rig/materialize.js inspect --target <repo> --host <host-id> --out inspection.json
node rig/materialize.js recommend --target <repo> --review review.json --out menu.json
node rig/materialize.js plan --target <repo> --manifest <repo>/rig.json --review review.json --out plan.json
node rig/materialize.js apply --target <repo> --manifest <repo>/rig.json --review review.json --plan plan.json
node .rig/bin/check.js --scope repo
```

For a tagged install, replace `node rig/materialize.js` with
`.rig/bin/rig`. The installed command is available only when the active runtime
is selected; tagged installs select it automatically.

Operator details: [`docs/advanced/operator.md`](docs/advanced/operator.md).
Design sources and reasoning: [`wiki/`](wiki/).

The legacy MCP-configurator CLI (`node rig/materialize.js --target … --manifest …`)
remains available as a compatibility path; it is no longer a separate install
tier.

## Curation Spine

| Phase | Rig owner |
|---|---|
| Intent and acceptance tests | Grilling |
| Product and technical design | Product design |
| Implementation | Ponytail |
| Execution and parallelism | Execution |
| TDD | Curated graft |
| Debugging | Curated graft |
| Code review | Curated graft |

The curated skills label their checks by workflow phase. They merge the
distinctive parts of each workflow instead of concatenating source documents.

## Markdown bootstrap boundary

The Tier 1 bootstrap has a fixed file list and mechanical host detection only.
It has no catalogue resolver, runtime, keys, or `.env` handling. The shared
layout is predictable so the catalogue materializer can describe it without
reshaping what was installed.

The workflow is advisory because the bootstrap ships markdown only. Claude and
other hook-capable hosts can provide real tool-boundary enforcement where the
host supports it; Cursor cannot. Rig states that limitation instead of claiming
prose is a hard guardrail.

## Verify

```sh
npm run test:rig
```

The tests cover detected-host-only installation, explicit host trimming, the
write journal, the complete shared payload, preservation of existing host
files, the markdown-only boundary, and absence of secret placeholders.

Catalogue acceptance lives in `tests/advanced-*.test.js` and is included in
`npm test`.
