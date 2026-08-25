// Host capability registry (impl-design §10, AD-13).
// Rig documents each surface but has not observed enforcement fire on any host.
// Evidence-gated: supported axes carry an official-doc citation.
// Sources (persisted): wiki/sources/reference/
//   host-ci-capability-verification.raw.md (2026-07-24) and
//   host-config-surfaces-verification.raw.md (2026-07-25).
// `mcp`: 'repo' = committable per-repo file; 'user_global' = advisory only
//   (vendor ships no per-repo file); 'unsupported' = vendor refuses MCP.
// Host identity notes: `devin` = Devin CLI; `windsurf` = Devin Desktop
//   (ex-Windsurf, vendor-renamed); Cloud Devin is out of scope.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RESEARCHED_ON = '2026-07-25';

const REGISTRY = {
  claude: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'CLAUDE.md', skills: '.claude/skills/', hooks: '.claude/settings.json', mcp: '.mcp.json' },
    evidence: { citation: 'https://docs.anthropic.com/en/docs/claude-code/hooks' },
  },
  codex: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md', skills: 'skills/plugins', hooks: '.codex/config.toml', mcp: '.codex/config.toml', mcp_key: '[mcp_servers]' },
    evidence: { citation: 'https://developers.openai.com/codex/hooks' },
  },
  'vscode-codex': {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md', skills: 'codex skills/plugins', hooks: '.codex/config.toml', mcp: '.codex/config.toml', mcp_key: '[mcp_servers]' },
    evidence: { citation: 'https://developers.openai.com/codex' },
  },
  cursor: {
    // Native skill and hook axes upgraded per 2026-07-25 report (reversal).
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: '.cursor/rules/*.mdc', skills: '.cursor/skills/', hooks: '.cursor/hooks.json', mcp: '.cursor/mcp.json' },
    evidence: { citation: 'https://cursor.com/docs/skills; https://cursor.com/docs/agent/hooks' },
  },
  copilot: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: '.github/copilot-instructions.md', skills: 'Agent Skills', hooks: '.github/hooks/*.json', mcp: '.vscode/mcp.json', mcp_key: 'servers' },
    evidence: { citation: 'https://code.visualstudio.com/docs/agent-customization/overview' },
  },
  'copilot-cli': {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: '.github/copilot-instructions.md', skills: '.github/agents', hooks: '.github/hooks/*.json', mcp: '.github/mcp.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers' },
  },
  kiro: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: '.kiro/steering/*.md', skills: 'Powers/POWER.md', hooks: '.kiro/hooks/*.json', mcp: '.kiro/settings/mcp.json' },
    evidence: { citation: 'https://kiro.dev/docs/mcp' },
  },
  opencode: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md', skills: '.opencode/agents/', hooks: '.opencode/plugins/', mcp: 'opencode.json', mcp_key: 'mcp' },
    evidence: { citation: 'https://opencode.ai/docs/mcp-servers' },
  },
  openclaw: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md', skills: 'native + bundles', hooks: 'HOOK.md + handler', mcp: 'openclaw.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.openclaw.ai/plugins/bundles' },
  },
  antigravity: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    // rig: CLI issue #60 ignores `.antigravitycli/mcp_config.json`; IDE still
    // reads `.agents/mcp_config.json`. Shipped MCP setup is manual → HOME.
    surfaces: { instruction: '.agents/rules/', skills: '.agents/skills/', hooks: '.agents/hooks.json', mcp: '.agents/mcp_config.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://antigravity.google/docs/hooks; https://antigravity.google/docs/mcp' },
  },
  gemini: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'GEMINI.md', skills: '.gemini/extensions/', hooks: '.gemini/settings.json', mcp: '.gemini/settings.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://github.com/google-gemini/gemini-cli (docs/hooks, tools/mcp-server.md)' },
  },
  devin: {
    // devin = Devin CLI (committable .devin/ surface). Cloud Devin is out of scope.
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md + .devin/config.json', skills: '.devin/skills/', hooks: '.devin/hooks.v1.json', mcp: '.devin/config.json', mcp_key: 'mcpServers' },
    evidence: { citation: 'https://docs.devin.ai/cli/extensibility/mcp/configuration' },
  },
  windsurf: {
    // windsurf = Devin Desktop (ex-Windsurf). MCP is user-global only.
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'user_global' },
    surfaces: { instruction: '.devin/rules/', skills: '.windsurf/skills/', hooks: '.windsurf/hooks.json', mcp: '~/.codeium/windsurf/mcp_config.json' },
    evidence: { citation: 'https://docs.windsurf.com/windsurf/cascade/hooks; https://docs.devin.ai/desktop/cascade/mcp' },
  },
  cline: {
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'user_global' },
    surfaces: { instruction: '.clinerules', skills: '.cline/skills/', hooks: '.cline/hooks/', mcp: '~/.cline/data/settings/cline_mcp_settings.json' },
    evidence: { citation: 'https://docs.cline.bot/cline-cli/configuration' },
  },
  swival: {
    // Hooks are startup/exit + command-middleware only — no edit-time gate.
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'unsupported', web_hook: 'unsupported', mcp_hook: 'unsupported',
    mcp_config: { emission: 'emitted', scope: 'repo' },
    surfaces: { instruction: 'AGENTS.md', skills: '.swival/skills/', hooks: 'startup/exit + command_middleware', mcp: '.swival/mcp.json' },
    evidence: { citation: 'https://swival.dev/pages/mcp.html; https://swival.dev/pages/customization.html' },
  },
  codewhale: {
    // MCP + skills project-vs-global unresolved across reports -> advisory. Hooks are repo-scoped.
    instruction: 'emitted', native_skill: 'unsupported', shell_hook: 'emitted', web_hook: 'emitted', mcp_hook: 'emitted',
    mcp_config: { emission: 'emitted', scope: 'user_global' },
    surfaces: { instruction: 'AGENTS.md + .codewhale/constitution.json', skills: '~/.deepseek/skills/', hooks: '.codewhale/hooks.toml', mcp: '~/.deepseek/mcp.json' },
    evidence: { citation: 'https://github.com/Hmbown/CodeWhale/blob/main/config.example.toml' },
  },
  hermes: {
    // Instruction is repo-scoped (AGENTS.md); hooks + MCP are user-global; skills repo-scope unclear.
    instruction: 'emitted', native_skill: 'unsupported', shell_hook: 'unsupported', web_hook: 'unsupported', mcp_hook: 'unsupported',
    mcp_config: { emission: 'emitted', scope: 'user_global' },
    surfaces: { instruction: 'AGENTS.md', skills: 'bundled/catalog (repo-scope unclear)', hooks: '~/.hermes/hooks/<n>/HOOK.yaml', mcp: '~/.hermes/config.yaml' },
    evidence: { citation: 'https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp' },
  },
  pi: {
    // Skills use .agents/skills/. No hook file (extensions only). MCP is
    // available via the first-party pi-mcp-extension; Rig has no mergeable
    // first-party config file, so it does not auto-write.
    instruction: 'emitted', native_skill: 'emitted', shell_hook: 'unsupported', web_hook: 'unsupported', mcp_hook: 'unsupported',
    mcp_config: { emission: 'unsupported', scope: 'unsupported' },
    surfaces: { instruction: 'AGENTS.md / .pi/settings.json', skills: '.agents/skills/', hooks: 'extensions (.ts) only', mcp: null },
    evidence: { citation: 'https://pi.dev/packages/pi-mcp-extension' },
  },
  generic: {
    instruction: 'emitted', native_skill: 'unsupported', shell_hook: 'unsupported', web_hook: 'unsupported', mcp_hook: 'unsupported',
    mcp_config: { emission: 'unsupported', scope: 'unsupported' },
    surfaces: { instruction: null },
  },
};

const DEFAULT_CAPABILITIES = {
  instruction: 'emitted', native_skill: 'unsupported', shell_hook: 'unsupported', web_hook: 'unsupported', mcp_hook: 'unsupported',
  mcp_config: { emission: 'unsupported', scope: 'unsupported' },
};

function getCapabilities(host) {
  return REGISTRY[host] || DEFAULT_CAPABILITIES;
}

function materializeHostAdapters(target, host, writeFile = null) {
  const caps = getCapabilities(host);
  const emittedAxes = [];
  const pointers = [];
  if (caps.instruction === 'emitted') {
    pointers.push('.rig/catalog-routing.md');
  }
  const contract = contractFor(host, caps);
  for (const [axis, axisContract] of Object.entries(contract.axes)) {
    if (axisContract.emission === 'unsupported' && axis !== 'mcp_config') continue;
    const rel = `.rig/host-contracts/${host}/${axis}.json`;
    const contents = `${JSON.stringify(axisContract, null, 2)}\n`;
    if (writeFile) {
      writeFile(rel, contents);
    } else {
      const marker = path.join(target, rel);
      fs.mkdirSync(path.dirname(marker), { recursive: true });
      fs.writeFileSync(marker, contents);
    }
    if (axisContract.emission === 'emitted') emittedAxes.push(rel);
  }
  return { capabilities: caps, emitted_axes: emittedAxes, emitted_live_hooks: [], pointers };
}

const HOST_DETECTION = {
  claude: ['.claude'],
  codex: ['.codex'],
  'vscode-codex': ['.vscode/mcp.json'],
  cursor: ['.cursor'],
  copilot: ['.github/copilot-instructions.md'],
  'copilot-cli': ['.github/mcp.json', '.github/agents'],
  kiro: ['.kiro'],
  opencode: ['.opencode'],
  openclaw: ['openclaw.json'],
  gemini: ['.gemini', 'GEMINI.md'],
  antigravity: ['.agents/rules', '.agents/mcp_config.json'],
  hermes: ['plugin.yaml'],
  devin: ['.devin'],
  windsurf: ['.windsurf'],
  cline: ['.clinerules'],
  swival: ['.swival'],
  codewhale: ['.codewhale'],
  pi: ['.pi'],
  // 'generic' is intentionally undetectable; it is reachable only via explicit
  // selection when no other host signal matches.
};

function discoverHosts(target, options = {}) {
  const detected = [];
  for (const id of Object.keys(REGISTRY)) {
    const signals = HOST_DETECTION[id];
    if (!signals) continue;
    const marker_paths = signals.filter((rel) => fs.existsSync(path.join(target, rel)));
    if (marker_paths.length) {
      detected.push({ id, provenance: 'detected', marker_paths });
    }
  }
  const seen = new Set(detected.map((entry) => entry.id));
  for (const id of options.explicit || []) {
    if (!REGISTRY[id]) continue;
    if (seen.has(id)) continue;
    detected.push({ id, provenance: 'explicit', marker_paths: [] });
    seen.add(id);
  }
  return detected;
}

function interpretedMcp(id) {
  return require('./mcp-hosts').MCP_HOSTS[id];
}

function contractFor(id, caps) {
  const surfaces = caps.surfaces || {};
  const mcp = interpretedMcp(id) || {};
  const statuses = {
    instruction: caps.instruction,
    native_skill: caps.native_skill,
    shell_hook: caps.shell_hook,
    web_hook: caps.web_hook,
    mcp_hook: caps.mcp_hook,
    mcp_config: mcp.emission || caps.mcp_config.emission,
  };
  const axisPath = {
    instruction: surfaces.instruction ?? null,
    native_skill: surfaces.skills ?? null,
    shell_hook: surfaces.hooks ?? null,
    web_hook: surfaces.hooks ?? null,
    mcp_hook: surfaces.hooks ?? null,
    mcp_config: mcp.file ?? surfaces.mcp ?? null,
  };
  const events = {
    instruction: 'session-context-load', native_skill: 'native-skill-discovery',
    shell_hook: 'before-shell-action', web_hook: 'before-web-action',
    mcp_hook: 'before-mcp-action', mcp_config: 'mcp-server-discovery',
  };
  const axes = {};
  for (const axis of Object.keys(statuses)) {
    if (statuses[axis] === 'unsupported') {
      axes[axis] = {
        host: id, axis, emission: 'unsupported',
        ...(axis === 'mcp_config' ? { auto_write: false } : {}),
        evidence: { vendor: id, researched_on: RESEARCHED_ON, official_citation: caps.evidence?.citation || 'product-defined generic fallback' },
      };
      continue;
    }
    const format = /\.toml|\[mcp_servers\]/.test(axisPath[axis] || '') ? 'toml' : /\.md|\.mdc|AGENTS|CLAUDE|GEMINI/.test(axisPath[axis] || '') ? 'markdown' : 'json';
    axes[axis] = {
      host: id,
      axis,
      emission: 'emitted',
      config_scope: axis === 'mcp_config' ? (mcp.config_scope || caps.mcp_config.scope) : 'repo',
      ...(axis === 'mcp_config' ? { auto_write: Boolean(mcp.autoWrite) } : {}),
      output: {
        path: axisPath[axis], format, owned_namespace: `rig.${id}.${axis}`,
        ...(axis === 'mcp_config' && mcp.key ? { key: mcp.key } : {}),
        first_apply: 'additive_merge', repeat_apply: 'idempotent_replace_owned_namespace',
        preserve: 'all bytes and values outside the owned namespace',
      },
      input: {
        event: events[axis], schema_version: `${id}-${axis}-v1`,
        matcher_fields: axis.endsWith('_hook') ? ['surface', 'category', 'target'] : ['path', 'digest'],
      },
      deny: {
        payload: 'rig deny with category and rule', exit_or_process_behavior: 'native deny or nonzero exit',
        category_field: 'category', rule_field: 'rule',
      },
      proceed: { native_user_presence: null, external_signature_fallback: 'rig-policy-activation SSHSIG' },
      evidence: {
        vendor: id, version: `surface-current-at-${RESEARCHED_ON}`, researched_on: RESEARCHED_ON,
        official_citation: caps.evidence?.citation || 'product-defined generic fallback',
        byte_landing_test: {
          target: 'tests/advanced-hosts.test.js',
          case: `${id} ${axis} byte landing`,
          assertion: 'the exact contract bytes land at the exact receipt-owned path on a fresh target',
        },
      },
    };
    axes[axis].evidence.adapter_digest = require('node:crypto').createHash('sha256').update(JSON.stringify(axes[axis].output)).digest('hex');
    axes[axis].evidence.fixture_digest = require('node:crypto').createHash('sha256').update(JSON.stringify(axes[axis].input)).digest('hex');
  }
  return {
    id,
    path: surfaces.mcp ?? surfaces.instruction ?? null,
    input_schema: 'axis-local',
    deny_behavior: 'axis_contract',
    proceed_protocol: 'record_and_continue',
    merge_boundary: 'user_content_preserved',
    first_apply: 'axis_contract',
    repeat_apply: 'axis_contract',
    axes,
  };
}

function validateRegistryContracts() {
  const contracts = [];
  const failures = [];
  for (const [id, caps] of Object.entries(REGISTRY)) {
    const contract = contractFor(id, caps);
    contracts.push(contract);
    for (const field of ['input_schema', 'deny_behavior', 'proceed_protocol', 'merge_boundary', 'first_apply', 'repeat_apply']) {
      if (!contract[field]) failures.push({ id, field });
    }
    if (contract.path === undefined) failures.push({ id, field: 'path' });
    for (const [axis, axisContract] of Object.entries(contract.axes)) {
      if (!['emitted', 'unsupported'].includes(axisContract.emission)) failures.push({ id, axis, field: 'emission' });
      if (axisContract.emission === 'emitted' && (!axisContract.output || !axisContract.input || !axisContract.deny || !axisContract.proceed)) {
        failures.push({ id, axis, field: 'complete emitted contract' });
      }
      if (!axisContract.evidence?.official_citation) failures.push({ id, axis, field: 'evidence.official_citation' });
    }
    const documented = Object.values(contract.axes).some((axis) => axis.emission === 'emitted');
    if (documented && id !== 'generic' && !(caps.evidence && caps.evidence.citation)) {
      failures.push({ id, field: 'evidence.citation' });
    }
  }
  return { hosts: Object.keys(REGISTRY).length, contracts, failures };
}

function materializeSelectedHosts(target, hostIds) {
  const results = {};
  for (const id of hostIds) {
    const caps = REGISTRY[id] || DEFAULT_CAPABILITIES;
    const mcpStatus = caps.mcp_config;
    const entry = {
      instruction: { status: caps.instruction },
      skills: { status: caps.native_skill },
      hooks: {
        shell: caps.shell_hook, web: caps.web_hook, mcp: caps.mcp_hook,
      },
    };
    if (mcpStatus.emission === 'unsupported') {
      entry.mcp = {
        status: 'unsupported',
        guidance: 'MCP is unsupported for this host; preserving user files unchanged.',
      };
    } else {
      entry.mcp = { status: mcpStatus.scope, path: caps.surfaces && caps.surfaces.mcp };
    }
    results[id] = entry;
  }
  return results;
}

module.exports = {
  REGISTRY,
  DEFAULT_CAPABILITIES,
  RESEARCHED_ON,
  HOST_DETECTION,
  getCapabilities,
  materializeHostAdapters,
  discoverHosts,
  validateRegistryContracts,
  materializeSelectedHosts,
};
