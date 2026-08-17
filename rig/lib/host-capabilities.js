// Host capability registry (impl-design §10, AD-13).
// Evidence-gated: an axis is only 'verified' with an official-doc citation.
// Sources (persisted): project-dev-docs/current/reference/
//   host-ci-capability-verification.raw.md (2026-07-24) and
//   host-config-surfaces-verification.raw.md (2026-07-25).
// `mcp`: 'repo' = committable per-repo file; 'user_global' = advisory only
//   (vendor ships no per-repo file); 'unsupported' = vendor refuses MCP.
// Host identity notes: `devin` = Devin CLI; `windsurf` = Devin Desktop
//   (ex-Windsurf, vendor-renamed); Cloud Devin is out of scope.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const VERIFIED_ON = '2026-07-25';

const REGISTRY = {
  claude: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'CLAUDE.md', skills: '.claude/skills/', hooks: '.claude/settings.json', mcp: '.mcp.json' },
    evidence: { citation: 'https://docs.anthropic.com/en/docs/claude-code/hooks' },
  },
  codex: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md', skills: 'skills/plugins', hooks: '.codex/config.toml', mcp: '.codex/config.toml', mcp_key: '[mcp_servers]' },
    evidence: { citation: 'https://developers.openai.com/codex/hooks' },
  },
  'vscode-codex': {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md', skills: 'codex skills/plugins', hooks: '.codex/config.toml', mcp: '.codex/config.toml', mcp_key: '[mcp_servers]' },
    evidence: { citation: 'https://developers.openai.com/codex' },
  },
  cursor: {
    // native_skill + live_hook both upgraded per 2026-07-25 report (reversal).
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: '.cursor/rules/*.mdc', skills: '.cursor/skills/', hooks: '.cursor/hooks.json', mcp: '.cursor/mcp.json' },
    evidence: { citation: 'https://cursor.com/docs/skills; https://cursor.com/docs/agent/hooks' },
  },
  copilot: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: '.github/copilot-instructions.md', skills: 'Agent Skills', hooks: '.github/hooks/*.json', mcp: '.vscode/mcp.json', mcp_key: 'servers' },
    evidence: { citation: 'https://code.visualstudio.com/docs/agent-customization/overview' },
  },
  'copilot-cli': {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: '.github/copilot-instructions.md', skills: '.github/agents', hooks: '.github/hooks/*.json', mcp: '.github/mcp.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers' },
  },
  kiro: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: '.kiro/steering/*.md', skills: 'Powers/POWER.md', hooks: '.kiro/hooks/*.json', mcp: '.kiro/settings/mcp.json' },
    evidence: { citation: 'https://kiro.dev/docs/mcp' },
  },
  opencode: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md', skills: '.opencode/agents/', hooks: '.opencode/plugins/', mcp: 'opencode.json', mcp_key: 'mcp' },
    evidence: { citation: 'https://opencode.ai/docs/mcp-servers' },
  },
  openclaw: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md', skills: 'native + bundles', hooks: 'HOOK.md + handler', mcp: 'openclaw.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.openclaw.ai/plugins/bundles' },
  },
  antigravity: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    // rig: CLI variant ignores project-local MCP (issue #60); .agents/ is the reliable IDE/SDK path.
    surfaces: { instruction: '.agents/rules/', skills: '.agents/skills/', hooks: '.agents/hooks.json', mcp: '.agents/mcp_config.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://antigravity.google/docs/hooks; https://antigravity.google/docs/mcp' },
  },
  gemini: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'GEMINI.md', skills: '.gemini/extensions/', hooks: '.gemini/settings.json', mcp: '.gemini/settings.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://github.com/google-gemini/gemini-cli (docs/hooks, tools/mcp-server.md)' },
  },
  devin: {
    // devin = Devin CLI (committable .devin/ surface). Cloud Devin is out of scope.
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md + .devin/config.json', skills: '.devin/skills/', hooks: '.devin/hooks.v1.json', mcp: '.devin/config.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.devin.ai/cli/extensibility/mcp/configuration' },
  },
  windsurf: {
    // windsurf = Devin Desktop (ex-Windsurf). MCP is user-global only.
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'user_global',
    surfaces: { instruction: '.devin/rules/', skills: '.windsurf/skills/', hooks: '.windsurf/hooks.json', mcp: '~/.codeium/windsurf/mcp_config.json' },
    evidence: { citation: 'https://docs.windsurf.com/windsurf/cascade/hooks; https://docs.devin.ai/desktop/cascade/mcp' },
  },
  cline: {
    instruction: 'project', native_skill: 'verified', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'user_global',
    surfaces: { instruction: '.clinerules', skills: '.cline/skills/', hooks: '.cline/hooks/', mcp: '~/.cline/data/settings/cline_mcp_settings.json' },
    evidence: { citation: 'https://docs.cline.bot/cline-cli/configuration' },
  },
  swival: {
    // Hooks are startup/exit + command-middleware only — no edit-time gate.
    instruction: 'project', native_skill: 'verified', live_hook: 'unverified',
    git_floor: 'available', ci_floor: 'available', mcp: 'repo',
    surfaces: { instruction: 'AGENTS.md', skills: '.swival/skills/', hooks: 'startup/exit + command_middleware', mcp: '.swival/mcp.json' },
    evidence: { citation: 'https://swival.dev/pages/mcp.html; https://swival.dev/pages/customization.html' },
  },
  codewhale: {
    // MCP + skills project-vs-global unresolved across reports -> advisory. Hooks are repo-scoped.
    instruction: 'project', native_skill: 'absent', live_hook: 'verified',
    git_floor: 'available', ci_floor: 'available', mcp: 'user_global',
    surfaces: { instruction: 'AGENTS.md + .codewhale/constitution.json', skills: '~/.deepseek/skills/', hooks: '.codewhale/hooks.toml', mcp: '~/.deepseek/mcp.json' },
    evidence: { citation: 'https://github.com/Hmbown/CodeWhale/blob/main/config.example.toml' },
  },
  hermes: {
    // Instruction is repo-scoped (AGENTS.md); hooks + MCP are user-global; skills repo-scope unclear.
    instruction: 'project', native_skill: 'absent', live_hook: 'unverified',
    git_floor: 'available', ci_floor: 'available', mcp: 'user_global',
    surfaces: { instruction: 'AGENTS.md', skills: 'bundled/catalog (repo-scope unclear)', hooks: '~/.hermes/hooks/<n>/HOOK.yaml', mcp: '~/.hermes/config.yaml' },
    evidence: { citation: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp' },
  },
  pi: {
    // Skills reversed to verified (.agents/skills/). No hook file (extensions only). MCP refused by design.
    instruction: 'project', native_skill: 'verified', live_hook: 'unverified',
    git_floor: 'available', ci_floor: 'available', mcp: 'unsupported',
    surfaces: { instruction: 'AGENTS.md / .pi/settings.json', skills: '.agents/skills/', hooks: 'extensions (.ts) only', mcp: null },
    evidence: { citation: 'https://pi.dev/docs/latest/skills' },
  },
  generic: {
    instruction: 'advisory', native_skill: 'absent', live_hook: 'unverified',
    git_floor: 'available', ci_floor: 'available', mcp: 'unsupported',
  },
};

const DEFAULT_CAPABILITIES = {
  instruction: 'advisory', native_skill: 'absent', live_hook: 'unverified',
  git_floor: 'available', ci_floor: 'available', mcp: 'unsupported',
};

function getCapabilities(host) {
  return REGISTRY[host] || DEFAULT_CAPABILITIES;
}

function materializeHostAdapters(target, host, writeFile = null) {
  const caps = getCapabilities(host);
  const emitted_live_hooks = [];
  const pointers = [];
  if (caps.instruction === 'project' || caps.instruction === 'advisory') {
    pointers.push('.rig/catalog-routing.md');
  }
  if (caps.live_hook === 'verified') {
    // Thin additive marker only when verified — no speculative hook bodies for others.
    const hookSurface = (caps.surfaces && caps.surfaces.hooks) || 'host-native hooks';
    const rel = '.rig/hooks/semantic-review.hint.md';
    const contents = `# Verified live-hook host: ${host}\n\nInvoke semantic drift review via ${hookSurface}.\n`;
    if (writeFile) {
      writeFile(rel, contents);
    } else {
      const marker = path.join(target, rel);
      fs.mkdirSync(path.dirname(marker), { recursive: true });
      fs.writeFileSync(marker, contents);
    }
    emitted_live_hooks.push('.rig/hooks/semantic-review.hint.md');
  }
  return { capabilities: caps, emitted_live_hooks, pointers };
}

module.exports = { REGISTRY, DEFAULT_CAPABILITIES, VERIFIED_ON, getCapabilities, materializeHostAdapters };
