# Host and CI coverage

## What it is

Host onboarding is detection-driven and CI integration is separately approved.
No absent host tree is inferred. The CI roster is exactly GitHub Actions,
GitLab CI, CircleCI, Jenkins, Buildkite, and Azure Pipelines.

## Current implementation

All six CI providers now render a provider-visible repository check and apply
it through a bounded additive path. Compatible existing configuration keeps its
unrelated bytes, approved absent-provider bootstrap creates the canonical file,
repeat apply is byte-stable, and every mutation is journaled for teardown. The
job runs `.rig/bin/check.js --scope repo`, requests no repository secrets, and
does not upload local finding detail.

Provider evidence is a first-wire matrix that seeds compatible user config,
plans with separate approval, applies twice, preserves the sentinel, and checks
the repository command at the provider path. Unknown CI markers remain
byte-identical and unverified until a supported provider is selected.

Host discovery still uses the 19-host registry and exact marker provenance.
The withdrawn verified/unverified tier is absent from registry state. Each host
has separate `instruction`, `native_skill`, `shell_hook`, `web_hook`,
`mcp_hook`, and `mcp_config` contracts that name its vendor path, event, input
schema, matcher, denial/exit behavior, namespace, merge boundary, and
first/repeat apply behavior. Git and CI remain separate deterministic
surfaces. Unsupported axes are explicit no-emit contracts rather than inferred
gaps. Inspection discovers all marker-present hosts by default and records the
marker provenance; an explicit host remains a compatibility override.
The neutral payload is independent of host detection, so bare repositories get
the complete neutral product without receiving `.claude`, `.agents`, or other
fabricated host trees.

Hermes is a first-class host surface, not a candidate to prune: the root
`plugin.yaml` and `__init__.py` are Rig's Hermes plugin, and its test suite —
including the `.venv`/pandas-backed benchmark import — is part of the supported
`npm test` run, not a thing to deprecate or relocate.

Subagent mode propagation (RIG-106) is researched per host, not inferred:
Claude, Codex/vscode-codex, and Copilot/Copilot CLI have a confirmed subagent
lifecycle hook that can inject context, and all three are wired
(`hooks/claude-codex-hooks.json`, `hooks/copilot-hooks.json` ->
`hooks/rig-subagent.js`, tested in `tests/hooks.test.js`). Every other host in
the 19-host roster is recorded N/A for a specific, evidenced reason — no
subagent-scoped hook event, a subagent hook that can only gate/observe rather
than inject, or no hook mechanism at all — see host-coverage-spec §3.1a and
[the disposition trace](../reasoning/2026-08-24-subagent-mode-propagation-disposition.md).

MCP disposition is unified (RIG-103/RIG-104, 2026-08-24): `rig/lib/mcp-hosts.js`
derives one `{ disposition, autoWrite, file, key }` table from
`host-capabilities.js`'s researched `REGISTRY`, and both the legacy Basic
`renderers.js` path and the catalogue descriptor path read it. The two paths'
prior divergences are resolved: `pi` no longer emits `.omp/mcp.json` (a
pre-existing user file is preserved with migration guidance, AT-HOST-5, now
covered end-to-end and not only via the catalogue path's `direct-require`
test); OpenClaw's registry metadata was corrected to the shipped, tested shape
(`.openclaw/openclaw.json`, nested `mcp.servers`) rather than the other way
around; `codewhale`'s repo-write override (`DEEPSEEK_MCP_CONFIG` redirect) is
now an explicit, documented exception to its raw `user_global` scope pending
RIG-110's resolution of the underlying project-vs-global conflict. A single
`mergeMcpEntry` merge writer places every JSON-shaped host's entry at its
governing key and is idempotent + preserves unrelated entries for every shape,
proven by `tests/basic-mcp-merge.test.js`. Network-capable (http-transport)
MCP entries are evaluated through the same `evaluateAction` engine and the
same active policy as shell/web, recorded on the install receipt — MCP is not
an enforcement bypass. See
[reasoning](../reasoning/2026-08-24-rig-104-mcp-unification.md).

OpenClaw's active MCP surface has since been verified as the user-global
`~/.openclaw/openclaw.json` JSON5 configuration, managed through `openclaw
mcp set`. The intent owner requested a clearly warned, explicit install opt-in
for the bundled `rig-mcp` server. Its complete amended oracle is now drafted:
the default install remains untouched, the selected path uses a per-clone
server name plus the native CLI, and uninstall keeps the runtime if it cannot
remove the global entry. The matching installer test is red until the owner
signs the new contract. [Intent record](../reasoning/2026-08-24-openclaw-global-mcp-opt-in-request.md)

Antigravity MCP is first-class manual setup by owner decision (RIG-105), not an
automatic global write. Onboarding renders the exact selected stdio
`mcpServers` object for `~/.gemini/config/mcp_config.json` and prints
`.rig/bin/rig check --host antigravity`; that check structurally verifies the
selected entries and reports missing, malformed, or drifted configuration.
The repository template remains empty and explanatory while upstream CLI issue
#60 makes the project-local `.agents/mcp_config.json` path unreliable.

## Authorities and sources

- Frozen host/CI intent: [business specification](../gate1/business-spec.md)
- Working contracts: [technical specification](../gate2/technical-spec.md#11-host-and-ci-coverage-one-uniform-path)
- Captured provider research: [host/CI reference](../sources/reference/host-ci-capability-verification.raw.md)
- Production findings: [intent-owner trace](../reasoning/2026-08-23-production-release-blockers.md)
- Hermes first-class ruling: [intent-owner trace](../reasoning/2026-08-20-hermes-first-class.md)

## Remaining work

No CI-provider or shared-host-contract implementation blocker from the
production findings remains. Fresh release review still judges the final bytes
together with the rest of the product.
