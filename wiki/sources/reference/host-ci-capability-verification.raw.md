# Rig Capability Registry: Host & CI Provider Verification Report

**Date of research: July 24, 2026.** This report documents four capability axes — Instruction Graft, Native Skill Wrapper, Live Hooks, Native MCP Config — for 19 AI coding-agent hosts, plus additive-CI-job mechanics for 5 CI providers. Statuses used: **VERIFIED** (official doc + exact path/schema), **NOT SUPPORTED** (official confirmation of absence), **COULD NOT VERIFY** (no primary source found), **PARTIAL** (feature confirmed but exact path/schema not captured from a primary source).

## TL;DR

- **All five "no-known-MCP-path" hosts now have verified MCP config paths**: Antigravity (`~/.gemini/config/mcp_config.json`), Windsurf (`~/.codeium/windsurf/mcp_config.json`), Cline (`~/.cline/data/settings/cline_mcp_settings.json` for the CLI; a VS Code `globalStorage` path for the extension), Hermes Agent (Nous Research — a real, MIT-licensed product), and Copilot CLI (`~/.copilot/mcp-config.json`, root key `mcpServers`).
- **The five "obscure" names are all real, documented products** — Hermes (Nous Research), CodeWhale (Hmbown, Rust CLI), OpenClaw (self-hosted gateway), Swival (Frank Denis' Python CLI) and Pi (earendil-works / Mario Zechner) all have official docs. The most important non-obvious finding: **Pi explicitly refuses MCP by design in core** ("pi does not and will not support MCP") — do not fabricate a path.
- **Native hooks are now widespread and mostly recent**: Codex, Cursor, Kiro, Copilot (VS Code + CLI via `.github/hooks`), CodeWhale and OpenClaw all ship native event hooks. Cursor's shipped Sept 29, 2025 (v1.7, still beta); Codex's are experimental (first appeared in v0.114.0, March 2026, initially with only `SessionStart`/`Stop`).

## Key Findings

- **MCP config has largely converged** on the `{ "mcpServers": { … } }` JSON shape (Antigravity, Windsurf, Cline, Gemini CLI, Copilot CLI, Kiro, Devin, CodeWhale, Cursor, Claude). Notable key-name divergences to store as per-host overrides: **VS Code Copilot uses `servers`**; **opencode uses `mcp`** (with `type: local|remote`); **Codex uses TOML `[mcp_servers]`**. CodeWhale reads BOTH `servers` and `mcpServers`.
- **Instruction-graft standardization**: `AGENTS.md` is now a de-facto cross-tool standard (opencode, Codex, Pi, Copilot/VS Code, CodeWhale, OpenClaw, Kiro-CLI). Vendor-specific always-on files persist: `GEMINI.md` (Gemini CLI), `.github/copilot-instructions.md` (Copilot, auto-injected every request), `.kiro/steering/*.md` with `inclusion: auto` (Kiro), `.cursor/rules/*.mdc` with `alwaysApply: true` (Cursor), `CLAUDE.md` (Claude).
- **Credential handling splits into two camps**: tools that accept `env`/API keys inline in the config file (most — Antigravity, Windsurf, Cline, Kiro, OpenClaw, CodeWhale), and those that prefer out-of-band or interpolated secrets (Copilot recommends `${VAR}`; opencode uses `{env:VAR}`; Codex sources bearer tokens from env and blocks project-local credential overrides; Swival offers `--encrypt-secrets`; Antigravity supports Google ADC to avoid inline tokens).

---

## Host-by-Host Details

### 1. antigravity (Google Antigravity IDE)
- **Instruction Graft — VERIFIED.** Uses Customizations (Settings → Customizations) and skills (`SKILL.md`); per-project settings inherit from a global config, and the IDE shares configuration with Antigravity 2.0 and the Antigravity CLI. Official: antigravity.google/docs.
- **Native Skill Wrapper — VERIFIED.** Skills (`SKILL.md`), shared across Antigravity 2.0 / IDE / CLI; Google Cloud docs describe editing `SKILL.md` to control skill invocation.
- **Live Hooks — COULD NOT VERIFY.** No official hooks/event-callback documentation found as of July 2026.
- **Native MCP Config — VERIFIED.** Central file `~/.gemini/config/mcp_config.json`, shared by Antigravity 2.0, IDE, and CLI (Google Codelabs; antigravity.google/docs/ide-mcp). Schema: `{ "mcpServers": { "name": { "command", "args", "env" } } }` for stdio; remote servers use `"serverUrl"` + `"headers"`, or `"authProviderType": "google_credentials"` for Application Default Credentials. OAuth via dynamic client registration is auto-handled. Access in-IDE via the "…" dropdown → Manage MCP Servers → View raw config. Secrets: env/headers can be written directly, or use Google ADC to avoid inline secrets.

Example (official):
```json
{ "mcpServers": { "cpln": { "env": { "BEARER_TOKEN": "<token>" }, "command": "npx", "args": ["mcp-remote", "https://mcp.cpln.io/mcp", "--header", "Authorization: ${BEARER_TOKEN}"] } } }
```

### 2. windsurf (Codeium / Windsurf editor — rebranded "Devin Desktop")
- **Product note:** Cognition rebranded Windsurf to **Devin Desktop on June 2, 2026** (OTA build 2026.5.26; "We're excited to launch the next generation of Windsurf: Devin Desktop"). The Cascade agent is **EOL July 1, 2026**, replaced by "Devin Local." MCP docs remain at docs.windsurf.com. Registry entries should carry a date stamp.
- **Instruction Graft — VERIFIED.** Rules/memories via Cascade; workspace rules under `.windsurf/rules/` plus global rules. Official: docs.windsurf.com.
- **Native Skill Wrapper — COULD NOT VERIFY** a documented repo-local skills directory; Windsurf uses "Workflows" and rules rather than a documented skills folder.
- **Live Hooks — COULD NOT VERIFY.** No official native hooks documentation found.
- **Native MCP Config — VERIFIED.** User-scoped `~/.codeium/windsurf/mcp_config.json` (Windows: `%USERPROFILE%\.codeium\windsurf\mcp_config.json`). Schema `{ "mcpServers": { … } }`, supporting stdio (`command`/`args`/`env`) and remote via `serverUrl`/`url` for Streamable HTTP or SSE. Access via Cascade → MCP icon → Configure, or Windsurf Settings → Manage MCPs → View raw config. Secrets: env/API keys can be written directly; docs warn to keep the file out of version control. Official: docs.windsurf.com/windsurf/cascade/mcp.

### 3. cline (Cline VS Code extension)
- **Instruction Graft — VERIFIED.** `.clinerules/` (project) and Cline Rules; custom instructions in settings. Official: docs.cline.bot.
- **Native Skill Wrapper — COULD NOT VERIFY** a formal skills directory; Cline uses "Workflows" and `.clinerules`.
- **Live Hooks — COULD NOT VERIFY** native event hooks.
- **Native MCP Config — VERIFIED (two paths by surface):**
  - **VS Code extension:** `~/Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json` (macOS); Windows `%APPDATA%\Code\User\globalStorage\saoudrizwan.claude-dev\settings\cline_mcp_settings.json`; Linux `~/.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json`.
  - **Cline CLI:** `~/.cline/data/settings/cline_mcp_settings.json` (code path `resolveMcpSettingsPath()`, overridable via `CLINE_MCP_SETTINGS_PATH` / `CLINE_DATA_DIR`).
  - **Documentation-inconsistency flag:** Cline's own `mcp-overview.mdx` historically pointed to an incorrect `~/.cline/mcp.json`. GitHub issue **#11671** (opened June 19, 2026) confirms the CLI actually reads the `data/settings` path; the wrong path was introduced in PR #9390 (merged 2026-02-20) and was still on `main` at the time of this research. The canonical config doc (`getting-started/config.mdx`) already lists the correct `~/.cline/data/settings/` location, so the docs internally disagree.
  - Schema: `{ "mcpServers": { "name": { "command", "args", "env", "disabled": false, "autoApprove": [] } } }`; remote servers via the Remote Servers tab (URL). Secrets: env/API keys written directly; docs explicitly advise `chmod 600` and never committing. Separate from VS Code's own `.vscode/mcp.json` (both coexist).

### 4. hermes (Hermes Agent — Nous Research)
- **Identity — VERIFIED REAL.** Open-source (MIT) self-improving AI agent by Nous Research. Docs: hermes-agent.nousresearch.com/docs; GitHub NousResearch/hermes-agent.
- **Instruction Graft — VERIFIED.** "Context Files" ("Project context files that shape every conversation"), a global `SOUL.md` (personality), and an agent-curated `MEMORY.md`. Official doc pages: "Context Files" and "Personality & SOUL.md."
- **Native Skill Wrapper — VERIFIED.** Skills system ("procedural memory the agent creates and reuses"), compatible with the agentskills.io open standard / Skills Hub; auto-created and self-improved. Official: /docs/user-guide/features/skills.
- **Live Hooks — COULD NOT VERIFY.** No documented native edit-time event-hook system found (Hermes emphasizes a learning loop and cron scheduler, not edit/commit hooks).
- **Native MCP Config — PARTIAL.** Hermes documents MCP support ("Connect to any MCP server"; /docs/user-guide/features/mcp and /docs/guides/use-mcp-with-hermes) with config in its main config file (/docs/user-guide/configuration), but the exact config file path and JSON schema were not captured verbatim from a primary source in this pass. Flag for follow-up.

### 5. copilot-cli (GitHub Copilot CLI)
- **Instruction Graft — VERIFIED.** Repo-level `.github/copilot-instructions.md` and `.github/instructions/**/*.instructions.md` (auto-loaded); `AGENTS.md` supported. Official: docs.github.com Copilot CLI.
- **Native Skill Wrapper — VERIFIED.** Skills (open standard, `SKILL.md`) shared with Copilot in VS Code / coding agent / Claude Code; repo-level `.github/agents/` custom agents; `.github/lsp.json` for LSP. Official: GitHub Copilot customization docs.
- **Live Hooks — VERIFIED.** Hooks as JSON in `.github/hooks/*.json`; events include `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `agentStop`, `subagentStop`, `errorOccurred`. `preToolUse` can approve/deny (block) tool executions before they happen; hooks receive detailed JSON input. Shared with the Copilot coding agent.
- **Native MCP Config — VERIFIED.** User-scoped `~/.copilot/mcp-config.json` (relocatable via `COPILOT_HOME`), **root key `mcpServers`** (differs from VS Code's `servers`). Repo-level `.github/mcp.json` is auto-discovered (loaded after the user confirms folder trust; historically the CLI was user-scope-only — issue #2528). Teams can also ship an in-repo `.copilot/mcp-config.json`. Per-server schema: `type` (`stdio`|`http`|`sse`), `command`, `args`, `env`; supports `${VAR}` interpolation. Secrets: docs recommend env-var references over hardcoding. The built-in GitHub MCP server needs no config. Official: docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers.

### 6. gemini (Gemini CLI)
- **Instruction Graft — VERIFIED.** `GEMINI.md` context files (name configurable via `contextFileName`), loaded from workspace and `~/.gemini`; project `.gemini/settings.json` and user `~/.gemini/settings.json`. Official: google-gemini/gemini-cli docs.
- **Native Skill Wrapper — VERIFIED.** Extensions in `<workspace>/.gemini/extensions/` or `~/.gemini/extensions/`, each a directory with `gemini-extension.json` (can define `mcpServers`, `contextFileName`, `excludeTools`). Precedence: a same-named server in `settings.json` overrides the extension's. Official: gemini-cli extensions guide.
- **Live Hooks — COULD NOT VERIFY** a native external-command lifecycle-hook framework (Gemini CLI has `--checkpointing`/`/restore`, which is snapshotting, not an event-hook system). **In-transition flag:** following Google I/O 2026, the Antigravity CLI (Go-based) replaces Gemini CLI and unifies config into the Antigravity suite — re-verify.
- **Native MCP Config — VERIFIED.** `mcpServers` key in `~/.gemini/settings.json` (global) or `.gemini/settings.json` (project). Transports: Stdio (`command`/`args`/`env`), SSE, Streamable HTTP (`httpUrl`); global controls under an `mcp` object (`mcp.allowed`, `mcp.excluded`, `mcp.serverCommand`). Manage via `gemini mcp add|list|remove`. Secrets: env vars mapped into the config (docs show mapping host env into containers rather than hardcoding). Official: gemini-cli/docs/tools/mcp-server.md.

### 7. pi (Pi Coding Agent — earendil-works / Mario Zechner)
- **Identity — VERIFIED REAL.** Minimal terminal coding harness (badlogic/pi-mono; earendil-works/pi; `@earendil-works/pi-coding-agent`). Official site pi.dev. Four built-in tools (`read`, `write`, `edit`, `bash`); everything else via extensions.
- **Instruction Graft — VERIFIED.** `AGENTS.md` (project instructions, loaded at startup from `~/.pi/agent/`, parent directories, and the current directory) plus `SYSTEM.md` (replace/append to the default system prompt per-project). Official: pi.dev.
- **Native Skill Wrapper — PARTIAL (by design).** Pi's stated philosophy is "build CLI tools with READMEs" and progressive disclosure rather than an auto-discovered skills directory; capabilities are added via extensions. Curated third-party distributions (e.g., `@spences10/my-pi`) add skills/LSP/MCP. No skills directory in core.
- **Live Hooks — COULD NOT VERIFY** a native hook framework in core Pi.
- **Native MCP Config — NOT SUPPORTED (core, by design).** The author explicitly states "pi does not and will not support MCP" (context-overhead rationale). MCP is available only via a third-party extension (`pi-mcp-adapter`) or curated distributions; a `.mcp.json` appears only when using that adapter. Core config surface is `.pi/settings.json`. **Do not populate an MCP path for pi core.**

### 8. copilot (GitHub Copilot in VS Code)
- **Instruction Graft — VERIFIED.** `.github/copilot-instructions.md` (auto-detected, injected into every chat request, workspace-wide); scoped `.github/instructions/*.instructions.md` (with `applyTo` frontmatter globs); `AGENTS.md` supported. Instructions do NOT affect inline gray completions. Official: code.visualstudio.com/docs/agent-customization/custom-instructions.
- **Native Skill Wrapper — VERIFIED.** Agent Skills (`SKILL.md` with name/description frontmatter; progressive 3-level loading), `.github/prompts/*.prompt.md`, `.github/agents/*.agent.md`. Auto-discovered from the repo root (even when a subfolder is opened, if the discovery setting is enabled). Official: code.visualstudio.com/docs/agent-customization/overview.
- **Live Hooks — VERIFIED.** Hooks as JSON in `.github/hooks/*.json`; events: `sessionStart`, `sessionEnd`, `userPromptSubmitted`, `preToolUse`, `postToolUse`, `agentStop`, `subagentStop`, `errorOccurred`; `preToolUse` can block. Shared with Copilot CLI / coding agent.
- **Native MCP Config — VERIFIED.** Workspace: `.vscode/mcp.json`; user-profile scope also supported (VS Code user settings). **Top-level key is `servers`** (differs from the CLI's `mcpServers`). Explicit trust prompts on add. Supports input/prompted variables for secrets. Official: code.visualstudio.com "Add and manage MCP servers in VS Code."

### 9. kiro (AWS Kiro)
- **Instruction Graft — VERIFIED.** Steering files in `.kiro/steering/*.md` with frontmatter `inclusion` control: `inclusion: auto` = always-loaded (plus fileMatch/manual variants); read automatically. CLI custom agents inherit steering + skills + `AGENTS.md`. Official: kiro.dev/docs.
- **Native Skill Wrapper — VERIFIED.** "Kiro Powers" bundles combine MCP tools, steering files, and hooks; custom Powers are built with `POWER.md`. Skills/`AGENTS.md` inheritance documented in the CLI custom-agents reference. Official: kiro.dev/docs.
- **Live Hooks — VERIFIED.** IDE hooks in `.kiro/hooks/*.json`, e.g. `{ "name": "Lint on Save", "version": "1.0.0", "when": { "type": "fileEdited", "patterns": ["*.py"] }, "then": { "type": "runCommand", "command": "python3 -m pylint ${file}" } }` (event-driven or manual button). CLI hooks (in custom-agent config) support triggers `agentSpawn`, `userPromptSubmit`, `preToolUse` (can block), `postToolUse`, `stop`; matchers use internal tool names (`fs_read`, `fs_write`, `execute_bash`, `use_aws`). Official: kiro.dev/docs.
- **Native MCP Config — VERIFIED.** Workspace `<project-root>/.kiro/settings/mcp.json`; user `~/.kiro/settings/mcp.json`. Per-server schema: `command`, `args`, `env`, `disabled`, `autoApprove` (or `url` for remote). CLI: `kiro-cli mcp add --name … --scope global|workspace --command … --args … --env …`. Agent config `includeMcpJson` toggles inclusion. Secrets: env written directly (e.g., `POSTGRES_CONNECTION_STRING`). Official: kiro.dev/docs/mcp, kiro.dev/docs/cli/mcp.

### 10. opencode (OpenCode)
- **Instruction Graft — VERIFIED.** `AGENTS.md` (project rules) plus an `instructions` array in `opencode.json` accepting file paths and globs (e.g. `["CONTRIBUTING.md", ".cursor/rules/*.md"]`). Official: opencode.ai/docs/rules.
- **Native Skill Wrapper — VERIFIED.** Agent Skills (opencode.ai/docs/skills); Markdown agent definitions in `.opencode/agents/` or `~/.config/opencode/agents/` (frontmatter `description`, `mode: subagent`, `permission`); slash commands in `.opencode/commands/`; plugins in `.opencode/plugins/` or `~/.config/opencode/plugins/`. Custom tools/skills auto-discovered from the config dir (`OPENCODE_CONFIG_DIR` overridable).
- **Live Hooks — VERIFIED (plugin-mediated).** Plugins "extend OpenCode with custom tools, hooks, and integrations"; hooks are exposed through the plugin API (JS/TS files in `.opencode/plugins/`) rather than a standalone `hooks.json`. Official: opencode.ai/docs/plugins.
- **Native MCP Config — VERIFIED.** Under the `mcp` key in `opencode.json`/`opencode.jsonc`. Local: `{ "type": "local", "command": ["npx","-y","pkg"], "environment": { "VAR": "val" }, "enabled": true }`. Remote: `{ "type": "remote", "url": "…", "headers": { "Authorization": "Bearer …" }, "enabled": true }`. OAuth auto-handled (RFC 7591 dynamic client registration); tokens stored in `~/.local/share/opencode/mcp-auth.json`. Secrets: `{env:VAR}` interpolation in headers/oauth; set `oauth: false` for API-key servers. Official: opencode.ai/docs/mcp-servers.

### 11. codewhale (CodeWhale — Hmbown, Rust CLI)
- **Identity — VERIFIED REAL.** Open-source (MIT) terminal-native coding agent by Hmbown; codewhale.net; GitHub Hmbown/CodeWhale. Rust CLI + `codewhale-tui`; also a VS Code extension (xmdszzz/codewhale-vscode). Installable via `npm install -g codewhale` or Cargo.
- **Instruction Graft — VERIFIED.** Per-repo `AGENTS.md` (ordinary project instructions) plus `.codewhale/constitution.json` (repo-scoped authority/prioritization policy). Layered "nested constitution": bundled global constitution (compiled into the binary) → user-global → repo-local, with order enforced in code (tests assert it can't drift). Expert override at `$CODEWHALE_HOME/prompts/constitution.md` (opt-in flag). Official: github.com/Hmbown/CodeWhale/docs/CONFIGURATION.md.
- **Native Skill Wrapper — VERIFIED.** User skills in `~/.codewhale/skills/` (each with `SKILL.md`), loaded via `/skills`; project-scoped `./.codewhale/skills/`. Landing/third-party pages claim `.claude/skills` and `.cursor/skills` compatibility. Official: CodeWhale README + docs.
- **Live Hooks — VERIFIED (event list PARTIAL).** Hooks configured in `~/.codewhale/config.toml` (and project `./.codewhale/`); "each repo can carry its own MCP servers, hooks, skills, and config overrides." The full event-name list was not enumerated in the captured docs. Official: codewhale.net/install; docs/CONFIGURATION.md.
- **Native MCP Config — VERIFIED.** User `~/.codewhale/mcp.json`; project `./.codewhale/mcp.json` (optional per-repo). Resolved path overridable via `--config`, `CODEWHALE_CONFIG_PATH`, legacy `DEEPSEEK_CONFIG_PATH`. Reads BOTH `servers` and `mcpServers` top-level keys. CLI: `codewhale-tui mcp add <name> --command … --arg …` or `--url …`; bidirectional (`codewhale mcp-server` exposes CodeWhale itself as an MCP server). Secrets: env in config; a repo `.env` is read for credentials ONLY (variable expansion rejected, symlinks/hardlinks rejected, capped at 1 MiB) — control-plane keys (`base_url`, `mcp_config_path`, provider/model routing) from repo `.env` are explicitly ignored. Official: github.com/Hmbown/CodeWhale/docs/MCP.md.

### 12. openclaw (OpenClaw)
- **Identity — VERIFIED REAL.** Self-hosted multi-channel gateway connecting chat apps to AI coding agents; docs.openclaw.ai; GitHub openclaw/openclaw. Config is JSON5 at `~/.openclaw/openclaw.json`.
- **Instruction Graft — VERIFIED.** Reads bootstrap files including `AGENTS.md`, `TOOLS.md`, `MEMORY.md`; agent workspace and per-agent config in `openclaw.json`.
- **Native Skill Wrapper — VERIFIED.** Native skills plus "bundles" that map external ecosystems (Codex, Claude, Cursor) into native skills/hooks/MCP. Skill roots load automatically; Claude `commands/` and Cursor `.cursor/commands/` roots are treated as additional skill roots. Skill visibility via `agents.defaults.skills`; MCP client registry at `~/.openclaw/skills/config/mcporter.json`. Official: docs.openclaw.ai/plugins/bundles, /tools/skills-config.
- **Live Hooks — VERIFIED.** Native hook-pack layout: `HOOK.md` + `handler.ts`/`handler.js` (Codex-compatible bundle hooks map into this layout). Config docs list "automation (cron, hooks)." Official: docs.openclaw.ai/plugins/bundles.
- **Native MCP Config — VERIFIED.** MCP servers under `mcpServers` in `openclaw.json` (JSON5), settable via `openclaw config set mcpServers.<name>.command "npx"`. Bundle MCP config merges into the effective `mcpServers`; launches stdio servers or connects to HTTP. Secrets: env/credentials in config or via `openclaw config set`; managed hosting (Blink Claw) uses a Secrets panel. Official: docs.openclaw.ai; openclaw-ai.com/en/docs/gateway/configuration.

### 13. devin (Cognition Devin)
- **Instruction Graft — VERIFIED.** Cloud-hosted "Knowledge" (reusable instructions recalled automatically across sessions) and DeepWiki (`.devin/wiki.json` for repo docs). Playbooks live in Devin Cloud, not repo files. Official: docs.devin.ai.
- **Native Skill Wrapper — VERIFIED (Playbooks).** Playbooks = reusable task templates (steps, success criteria, guardrails), invoked by name; managed in Devin Cloud rather than a repo-local directory. Official: cognition.com; docs.devin.ai.
- **Live Hooks — COULD NOT VERIFY** repo-local edit-time hooks; Devin uses trigger integrations (Linear labels, Slack) rather than a documented local hook config.
- **Native MCP Config — VERIFIED (two modes).** (a) Devin **consumes** MCP servers via an in-product MCP Marketplace (Settings), UI-managed rather than a documented repo file. (b) Devin also **publishes** an official MCP server at `https://mcp.devin.ai/mcp`; clients configure `{ "mcpServers": { "devin": { "serverUrl": "https://mcp.devin.ai/mcp", "headers": { "Authorization": "Bearer <API_KEY>", "X-Org-Id": "<ORG_ID>" } } } }`. Secrets: Bearer API key + `X-Org-Id` in headers. Official: docs.devin.ai/work-with-devin/devin-mcp. Flag: Devin's own inbound MCP config is UI/marketplace-based; no documented project-scoped JSON file.

### 14. swival (Swival — Frank Denis CLI)
- **Identity — VERIFIED REAL.** Open-source Python CLI coding agent by Frank Denis (libsodium/dnscrypt-proxy author); swival.dev; GitHub Swival/swival; PyPI `swival`.
- **Instruction Graft — VERIFIED (filename PARTIAL).** "Customization — config files, project instructions, system prompt overrides, tuning parameters" documented (project instructions + system-prompt override). Exact filename not captured verbatim in this pass. Official: github.com/Swival/swival docs.
- **Native Skill Wrapper — VERIFIED.** `SKILL.md`-based agent skills (Swival maintains a SKILL.md linter, "skillscheck", and a VS Code SKILL.md lint extension); "Metaskills" is a portable dynamic-skill workflow spec. Official: github.com/Swival/swival.
- **Live Hooks — COULD NOT VERIFY** a native lifecycle-hook framework (Swival emphasizes a review loop, `/audit`, and OS sandboxing, not edit-time hooks).
- **Native MCP Config — VERIFIED feature / schema PARTIAL.** Swival documents MCP support ("connect to external tools via the Model Context Protocol") and A2A; the exact config file path/schema was not captured verbatim. Secrets: `--encrypt-secrets` encrypts API keys/credentials in LLM messages locally. Official: swival.dev; github.com/Swival/swival.

### 15. vscode-codex (Codex VS Code / IDE extension)
- **Instruction Graft — VERIFIED (shared with Codex CLI).** `AGENTS.md` project-root discovery (walks up to the git root or `project_root_markers`); `model_instructions_file` override. Official: developers.openai.com/codex (AGENTS.md, Rules).
- **Native Skill Wrapper — VERIFIED.** Codex Skills & Plugins, shared across CLI/IDE/cloud. Official: developers.openai.com/codex/skills-and-plugins, build-skills, build-plugins.
- **Live Hooks — VERIFIED (shared Codex hooks).** Same framework as Codex CLI (see #16): `hooks.json` / `[hooks]` in `config.toml`, applied to the IDE extension's local runtime.
- **Native MCP Config — VERIFIED (shared).** `[mcp_servers]` tables in `~/.codex/config.toml` (see #16 for schema). Official: developers.openai.com/codex/extend/mcp.

### 16. codex (OpenAI Codex CLI) — focus: native hooks
- **Instruction Graft — VERIFIED.** `AGENTS.md` (discovered by walking up to a `.git` root or `project_root_markers`); `model_instructions_file` / `experimental_instructions_file` to replace built-in instructions; project-local `.codex/config.toml` layers (credential-redirecting keys such as `notify`, `model_provider(s)`, `profile`, `openai_base_url`, `otel` are IGNORED in project-local config with a startup warning). Official: developers.openai.com/codex/config-advanced.
- **Native Skill Wrapper — VERIFIED.** Codex Skills & Plugins; plugins can bundle MCP servers and hooks via `.codex-plugin/plugin.json` (`hooks/hooks.json` default). Official: developers.openai.com/codex/build-plugins.
- **Live Hooks — VERIFIED (experimental; evolving).** Hooks are an extensibility framework, discovered in `hooks.json` files or inline `[hooks]` tables in `config.toml`, at `~/.codex/hooks.json`, `~/.codex/config.toml`, `<repo>/.codex/hooks.json`, `<repo>/.codex/config.toml`. **Evolution:** first shipped in **v0.114.0 (March 2026, PR #13276) with only `SessionStart` and `Stop`**; the event set expanded subsequently. As documented in the current (July 2026) official docs, events are: `PreToolUse`, `PermissionRequest`, `PostToolUse`, `PreCompact`, `PostCompact`, `UserPromptSubmit`, `SubagentStop`, `Stop` (during a turn); `SessionStart`, `SubagentStart` (start); `SessionEnd` (main-thread end). Structure: event → matcher group (regex on tool name/trigger) → handlers `{ "type": "command", "command": "…", "timeout": <sec>, "statusMessage": "…" }`. Contract: one JSON object on stdin; JSON or exit codes on stdout/stderr. **Blocking**: `PreToolUse` can deny via `permissionDecision: "deny"` (and, per current docs, rewrite via `permissionDecision: "allow"` + `updatedInput` across Bash/`apply_patch`/MCP) or exit code `2` + stderr; `PermissionRequest` can allow/deny; `PostToolUse`/`Stop`/`SubagentStop` can block/continue. Only `type: "command"` runs today (`prompt`/`agent` parsed but skipped). Enabled by default; feature key is `hooks` (canonical) with `codex_hooks` as a deprecated alias — set `[features] hooks = false` to disable. Managed hooks via `requirements.toml` (`allow_managed_hooks_only`); project-local hooks load only when the `.codex/` layer is trusted; not available on Windows in early releases. Official: developers.openai.com/codex/hooks. *(Some third-party references still describe the initial Bash-only/`SessionStart`+`Stop` state; the current official docs supersede them.)*
- **Native MCP Config — VERIFIED.** `[mcp_servers.<name>]` tables in `~/.codex/config.toml`: stdio `command`/`args`/`env`; Streamable HTTP remote; `codex mcp` command group (experimental). Since v0.121.0 tools are namespaced `<server>:<tool>`. Secrets: env-sourced bearer tokens for HTTP servers; `mcp_oauth_callback_port` for OAuth login; project-local config cannot override credential keys. Official: developers.openai.com/codex/config-reference.

### 17. cursor (Cursor) — focus: skills + hooks
- **Instruction Graft — VERIFIED.** Project rules in `.cursor/rules/*.mdc` (MDC format; frontmatter `description`, `globs`, `alwaysApply`); `alwaysApply: true` = always-on. User/global rules in settings; legacy `.cursorrules` deprecated. `AGENTS.md` also supported. Official: cursor.com/docs.
- **Native Skill Wrapper — PARTIAL / COULD NOT FULLY VERIFY.** Cursor has commands (`.cursor/commands/`) and rules; a formal auto-discovered "skills" directory was **not confirmed** from primary Cursor docs. Third-party tools (e.g., CodeWhale) claim `.cursor/skills` compatibility, but that is not a Cursor-documented path. **Registry status: commands = verified; dedicated skills directory = unverified.**
- **Live Hooks — VERIFIED (v1.7, Sept 29, 2025; beta).** Per the official Cursor changelog ("Browser Controls, Plan Mode, and Hooks," cursor.com/changelog/1-7): hooks let you "observe, control, and extend the Agent loop using custom scripts … still in beta." Config in `.cursor/hooks.json` (project), `~/.cursor/hooks.json` (user/global), `/etc/cursor/hooks.json` (enterprise) — ALL matching hooks across scopes run (additive). Schema: `{ "version": 1, "hooks": { "<event>": [ { "command": "…", "timeout": <sec>, "failClosed": <bool>, "matcher": "…" } ] } }`. Events: `beforeShellExecution`, `beforeMCPExecution`, `beforeReadFile`, `afterFileEdit`, `beforeSubmitPrompt`, `stop`. Contract: JSON over stdin, JSON on stdout, exit code. **Blocking**: `beforeShellExecution`/`beforeMCPExecution` return `permission: allow|deny|ask`; `beforeReadFile` can rewrite content before it reaches the model. Official: cursor.com/docs/agent/hooks. Flag: beta; some output fields not yet honored.
- **Native MCP Config — VERIFIED.** Project `.cursor/mcp.json`; user/global `~/.cursor/mcp.json`. Schema `{ "mcpServers": { "name": { "command", "args", "env" } } }` (stdio) or `url` for remote. Secrets: env inline supported. Official: cursor.com/docs.
- **Task-specified gap resolution:** native skill discovery = **unverified**; hooks = **verified**.

### 18. claude (Claude Code) — confirmation only
- **Instruction Graft — VERIFIED.** `CLAUDE.md` (project + `~/.claude/CLAUDE.md` user/global), auto-loaded; `.claude/` project dir.
- **Native Skill Wrapper — VERIFIED.** `.claude/skills/` with `SKILL.md` (name/description frontmatter); auto-discovered.
- **Live Hooks — VERIFIED.** `.claude/settings.json` hooks with events `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop`, etc.; can block.
- **Native MCP Config — VERIFIED.** `.mcp.json` (project) + user config; `{ "mcpServers": { … } }`. (Pre-verified; confirmed unchanged.)

---

## Summary Table (Host × Capability)

| # | Host | Instruction Graft | Native Skill Wrapper | Live Hooks | Native MCP Config |
|---|------|-------------------|----------------------|------------|-------------------|
| 1 | antigravity | ✅ Customizations/SKILL.md | ✅ Skills (SKILL.md) | ❔ Could not verify | ✅ `~/.gemini/config/mcp_config.json` |
| 2 | windsurf (→Devin Desktop) | ✅ `.windsurf/rules/` | ❔ Could not verify | ❔ Could not verify | ✅ `~/.codeium/windsurf/mcp_config.json` |
| 3 | cline | ✅ `.clinerules/` | ❔ Could not verify | ❔ Could not verify | ✅ `cline_mcp_settings.json` (2 paths; docs bug #11671) |
| 4 | hermes | ✅ Context Files/SOUL.md | ✅ Skills (agentskills.io) | ❔ Could not verify | ⚠️ Feature verified; path unconfirmed |
| 5 | copilot-cli | ✅ `.github/copilot-instructions.md` | ✅ Skills/`.github/agents` | ✅ `.github/hooks/*.json` | ✅ `~/.copilot/mcp-config.json` + `.github/mcp.json` |
| 6 | gemini | ✅ `GEMINI.md` | ✅ `.gemini/extensions/` | ❔ Could not verify | ✅ `~/.gemini/settings.json` (`mcpServers`) |
| 7 | pi | ✅ `AGENTS.md`/`SYSTEM.md` | ⚠️ CLI-tools by design | ❔ Could not verify | ❌ Not supported (core); adapter only |
| 8 | copilot (VS Code) | ✅ `.github/copilot-instructions.md` | ✅ Skills/prompts/agents | ✅ `.github/hooks/*.json` | ✅ `.vscode/mcp.json` (`servers`) |
| 9 | kiro | ✅ `.kiro/steering/*.md` | ✅ Powers/`POWER.md` | ✅ `.kiro/hooks/*.json` + CLI hooks | ✅ `.kiro/settings/mcp.json` |
| 10 | opencode | ✅ `AGENTS.md`+`instructions` | ✅ skills/agents/commands | ✅ plugin-mediated | ✅ `opencode.json` (`mcp`) |
| 11 | codewhale | ✅ `AGENTS.md`+`constitution.json` | ✅ `~/.codewhale/skills/` | ✅ `config.toml` hooks (events partial) | ✅ `~/.codewhale/mcp.json` |
| 12 | openclaw | ✅ `AGENTS.md`/`MEMORY.md` | ✅ native + bundles | ✅ `HOOK.md`+handler | ✅ `openclaw.json` (`mcpServers`) |
| 13 | devin | ✅ Knowledge/DeepWiki | ✅ Playbooks (cloud) | ❔ Could not verify | ✅ Marketplace + `mcp.devin.ai` (publishes) |
| 14 | swival | ✅ project instructions (file partial) | ✅ `SKILL.md` | ❔ Could not verify | ⚠️ Feature verified; path unconfirmed |
| 15 | vscode-codex | ✅ `AGENTS.md` | ✅ Codex skills/plugins | ✅ shared Codex hooks | ✅ `config.toml` `[mcp_servers]` |
| 16 | codex | ✅ `AGENTS.md` | ✅ skills/plugins | ✅ `hooks.json`/`[hooks]` (v0.114+, experimental) | ✅ `~/.codex/config.toml` |
| 17 | cursor | ✅ `.cursor/rules/*.mdc` | ⚠️ commands ✅ / skills ❔ | ✅ `.cursor/hooks.json` (v1.7, beta) | ✅ `.cursor/mcp.json` |
| 18 | claude | ✅ `CLAUDE.md` | ✅ `.claude/skills/` | ✅ `.claude/settings.json` | ✅ `.mcp.json` |

Legend: ✅ VERIFIED · ❌ NOT SUPPORTED · ❔ COULD NOT VERIFY · ⚠️ PARTIAL

---

## CI Providers (additive job: run Node script + upload `reports/rig/`)

### gitlab_ci (GitLab CI/CD)
- **Config file:** `.gitlab-ci.yml` (repo root).
- **Artifact mechanism:** `artifacts:paths:` (+ optional `artifacts:expire_in`). Docs: "To create job artifacts, use the `artifacts` keyword"; `artifacts:paths` is "An array of file paths, relative to the project directory" supporting glob/doublestar patterns; "The `expire_in` keyword determines how long GitLab keeps the artifacts." Default: collected only for successful jobs (add `when: always` to also collect on failure).
- **Minimal job:**
```yaml
rig-check:
  stage: test
  image: node:20
  script:
    - node scripts/rig-check.js
  artifacts:
    paths:
      - reports/rig/
    expire_in: 1 week
```
- Official: docs.gitlab.com/ci/jobs/job_artifacts, docs.gitlab.com/ci/yaml.

### circleci (CircleCI)
- **Config file:** `.circleci/config.yml`.
- **Artifact mechanism:** `store_artifacts` step. Docs: "`store_artifacts` has two keys: `path` and `destination`. `path` is a path to the file or directory to be uploaded as artifacts. `destination` (Optional) is a prefix added to the artifact paths." UI-downloadable; does NOT pass to later jobs (use `persist_to_workspace`/`attach_workspace` for that). Multiple `store_artifacts` steps allowed.
- **Minimal job:**
```yaml
version: 2.1
jobs:
  rig-check:
    docker:
      - image: cimg/node:20.11
    steps:
      - checkout
      - run: node scripts/rig-check.js
      - store_artifacts:
          path: reports/rig
          destination: rig-reports   # optional
workflows:
  main:
    jobs: [rig-check]
```
- Official: circleci.com/docs/guides/optimize/artifacts (older `/docs/2.0/artifacts/` URLs redirect here).

### jenkins (Jenkins)
- **Config file:** `Jenkinsfile` (declarative pipeline).
- **Artifact mechanism:** `archiveArtifacts artifacts: 'reports/rig/**'` (Ant-style glob), typically in a `post { always { … } }` block. Docs: "This is easily done with the `archiveArtifacts` step and a file-globbing expression"; "Archived files will be accessible from the Jenkins webpage." `sh` runs the shell command (use `bat` on Windows).
- **Minimal pipeline:**
```groovy
pipeline {
  agent any
  stages {
    stage('Rig check') {
      steps { sh 'node scripts/rig-check.js' }
    }
  }
  post {
    always { archiveArtifacts artifacts: 'reports/rig/**', fingerprint: true }
  }
}
```
- Official: jenkins.io/doc/pipeline/tour/tests-and-artifacts, jenkins.io/doc/pipeline/steps/core, jenkins.io/doc/book/pipeline/jenkinsfile.

### buildkite (Buildkite)
- **Config file:** `.buildkite/pipeline.yml`.
- **Artifact mechanism:** `artifact_paths` key on a command step (accepts a single string glob or a YAML list of globs; the source path is replicated exactly at the destination). Built-in mechanism (an alternative is the `artifacts` plugin's `upload:`).
- **Minimal step:**
```yaml
steps:
  - label: ":node: Rig check"
    command: "node scripts/rig-check.js"
    artifact_paths:
      - "reports/rig/**/*"
```
- Official: buildkite.com/docs/pipelines/configure/step-types/command-step, buildkite.com/docs/pipelines/configure/artifacts.

### azure_pipelines (Azure DevOps Pipelines)
- **Config file:** `azure-pipelines.yml` (repo root).
- **Artifact mechanism:** newer **`PublishPipelineArtifact@1`**, or the **`publish`** shortcut ("The `publish` keyword is a shortcut for the Publish Pipeline Artifact task"). `targetPath` = folder/file to publish (variables allowed, **wildcards not supported**); `artifact` = artifact name. Older **`PublishBuildArtifacts@1`** (`PathtoPublish`/`ArtifactName`/`publishLocation: 'Container'`) is required on Azure DevOps Server/TFS 2018 (Pipeline Artifacts are Azure DevOps Services-only). Run a Node script via a plain `script:` step, `Bash@3`, and/or `NodeTool@0` to pin the Node version.
- **Minimal pipeline (recommended):**
```yaml
trigger: [main]
pool: { vmImage: ubuntu-latest }
steps:
  - task: NodeTool@0
    inputs: { versionSpec: '20.x' }
  - script: node scripts/rig-check.js
    displayName: 'Run rig check'
  - publish: reports/rig
    artifact: rig-reports
```
- **Equivalent explicit task:** `PublishPipelineArtifact@1` with `targetPath: 'reports/rig'`, `artifact: 'rig-reports'`, `publishLocation: 'pipeline'`. **Older (Server/TFS):** `PublishBuildArtifacts@1` with `PathtoPublish: 'reports/rig'`, `ArtifactName: 'rig-reports'`, `publishLocation: 'Container'`.
- Official: learn.microsoft.com/azure/devops/pipelines/artifacts/pipeline-artifacts, .../tasks/reference/publish-pipeline-artifact-v1, .../yaml-schema/steps-publish, .../tasks/reference/publish-build-artifacts-v1.

---

## Recommendations

**Stage 1 — Populate now (do immediately).** Enter all VERIFIED axes using the exact paths/schemas above (the large majority of cells). For MCP, standardize the registry on the `{ "mcpServers": { … } }` shape but store per-host key overrides: `servers` (VS Code Copilot), `mcp`/`type:local|remote` (opencode), TOML `[mcp_servers]` (Codex/vscode-codex), and note that CodeWhale accepts both `servers` and `mcpServers`. Implement the five CI snippets as-is — they are copy-paste ready.

**Stage 2 — Mark explicit non-support / by-design gaps.** Set **Pi MCP = NOT SUPPORTED (core)** and record the community `pi-mcp-adapter` as the only path; do not synthesize a config file. Leave `COULD NOT VERIFY` cells empty rather than inferring paths.

**Stage 3 — Close the thin spots (targeted follow-up).** Capture verbatim from primary docs: (a) Hermes Agent's exact MCP config file path/schema; (b) Swival's project-instruction filename and MCP config path/schema; (c) Antigravity's exact always-on rules-file path (vs. Customizations UI); (d) CodeWhale's full hook event-name list; (e) whether Cursor documents any auto-discovered skills directory. **Threshold to upgrade a cell to VERIFIED:** a vendor docs page or official GitHub README/changelog stating the exact path or schema.

**Stage 4 — Date-stamp volatile entries** and set a re-verify cadence (quarterly): Gemini CLI → Antigravity CLI unification (Google I/O 2026); Windsurf → Devin Desktop (June 2, 2026; Cascade EOL July 1, 2026); Cursor hooks (beta since v1.7 / Sept 29 2025); Codex hooks (experimental since v0.114.0 / March 2026, event set still expanding); Copilot repo-level `.github/mcp.json` (recently added); Cline docs-path bug (#11671, PR #9390).

## Caveats

- **Recency/volatility:** Several capabilities are beta/experimental (Cursor hooks, Codex hooks) or mid-reorganization (Antigravity absorbing Gemini CLI; Windsurf rebranded to Devin Desktop). Treat exact schemas as version-pinned to July 2026.
- **Primary vs. secondary sourcing:** Where I could not capture a primary doc verbatim (Hermes/Swival MCP schema; CodeWhale full hook event list; Antigravity rules path), the item is marked PARTIAL or COULD NOT VERIFY rather than asserted. Two Codex claims relayed by a secondary source (Bash-only `PreToolUse`; `codex_hooks` as the required flag) describe the *initial* v0.114 state; the current official Codex hooks docs (fetched July 2026) supersede them, showing an expanded event set, `updatedInput` rewrite support, and `hooks` as the canonical feature key with `codex_hooks` as a deprecated alias.
- **"COULD NOT VERIFY" ≠ "not supported":** absence of found documentation is not proof the feature is absent.
- **Third-party path claims** (e.g., `.cursor/skills`, `.claude/skills` compatibility asserted by other tools) are excluded from VERIFIED status unless the owning vendor documents them.