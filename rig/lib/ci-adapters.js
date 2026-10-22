// Additive CI adapters for the six release providers.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('./path-safety');
const { journalWriter } = require('./payload');

const CHECK = 'node .rig/bin/check.js --scope repo';
const GITHUB_WORKFLOW_POINTER = '# rig-check: additive job installed at .github/workflows/rig.yml';
const PROVIDERS = Object.fromEntries([
  ['github-actions', '.github/workflows/rig.yml'],
  ['gitlab_ci', '.gitlab-ci.yml'],
  ['circleci', '.circleci/config.yml'],
  ['jenkins', 'Jenkinsfile'],
  ['buildkite', '.buildkite/pipeline.yml'],
  ['azure_pipelines', 'azure-pipelines.yml'],
].map(([id, file]) => [id, {
  id,
  status: 'supported',
  strategy: id === 'github-actions' ? 'standalone_additive_job' : 'namespaced_additive_job',
  file,
  evidence: { kind: 'render_test', test: 'tests/release-blockers.test.js', execution: 'unverified' },
}]));

const REPORTS_UPLOAD = {
  path: 'reports/rig/',
  when: 'never_in_ci',
  github_actions: {
    evidence: {
      kind: 'official_doc',
      citation: 'https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions',
    },
  },
};

function annotations(spec = {}, prefix = '#') {
  return [
    ...(spec.services || []).filter((service) => service.ci_applicable)
      .map((service) => `${prefix} service: ${service.id} (${service.grade})`),
    ...(spec.controls || []).map((control) => `${prefix} control: ${control}`),
  ];
}

function githubActionsStandalone(spec = {}) {
  return {
    relativePath: '.github/workflows/rig.yml',
    contents: [
      'name: rig-check', '', 'on:', '  push:', '  pull_request:', '', 'jobs:', '  rig:',
      '    runs-on: ubuntu-latest', '    permissions:', '      contents: read', '    steps:',
      '      - uses: actions/checkout@v4', '      - uses: actions/setup-node@v4', '        with:',
      "          node-version: '22'", ...annotations(spec, '      #'),
      '      - name: Rig repository check', `        run: ${CHECK}`, '',
    ].join('\n'),
  };
}

function standalone(provider, spec = {}) {
  if (provider === 'github-actions') return githubActionsStandalone(spec).contents;
  if (provider === 'gitlab_ci') return [
    '# rig-check:start', 'rig_check:', '  stage: .pre', '  image: node:22',
    ...annotations(spec, '  #'), '  script:', `    - ${CHECK}`, '# rig-check:end', '',
  ].join('\n');
  if (provider === 'circleci') return [
    'version: 2.1', 'jobs:', '  rig-check:', '    docker:', '      - image: cimg/node:22.0',
    '    steps:', '      - checkout', ...annotations(spec, '      #'), `      - run: ${CHECK}`,
    'workflows:', '  rig-check:', '    jobs:', '      - rig-check', '',
  ].join('\n');
  if (provider === 'jenkins') return [
    'pipeline {', '  agent any', '  stages {', "    stage('Rig check') {", '      steps {',
    ...annotations(spec, '        //'), `        sh '${CHECK}'`, '      }', '    }', '  }', '}', '',
  ].join('\n');
  if (provider === 'buildkite') return [
    'steps:', '  - label: "Rig check"', ...annotations(spec, '    #'), `    command: "${CHECK}"`, '',
  ].join('\n');
  if (provider === 'azure_pipelines') return [
    'jobs:', '  - job: rig_check', '    displayName: Rig check', '    pool:', '      vmImage: ubuntu-latest',
    '    steps:', ...annotations(spec, '      #'), '      - script: node .rig/bin/check.js --scope repo',
    '        displayName: Rig repository check', '',
  ].join('\n');
  throw new Error(`unknown CI provider "${provider}"`);
}

// Rig's merged jobs sit between rig-check start/end comment lines. Removal is
// attributed to the exact bytes Rig wrote: a region is stripped only when its
// digest was journaled at install time, so user edits elsewhere are never touched.
const REGION_START = /^[ \t]*(?:#|\/\/) rig-check:start(?:-inline)?$/;
const REGION_END = /^[ \t]*(?:#|\/\/) rig-check:end$/;
const regionDigest = (lines) => crypto.createHash('sha256').update(`${lines.join('\n')}\n`).digest('hex');

function ciRegions(body) {
  const lines = String(body).split('\n');
  const regions = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!REGION_START.test(lines[i])) continue;
    const end = lines.findIndex((line, j) => j > i && REGION_END.test(line));
    if (end === -1) continue;
    regions.push({ start: i, end, inline: lines[i].trim().endsWith('start-inline'), digest: regionDigest(lines.slice(i, end + 1)) });
    i = end;
  }
  return regions;
}

// Returns the body without the journaled regions, or null when any is missing
// or was edited (the caller then reports best effort and leaves the file alone).
function stripCiRegions(body, digests) {
  const lines = String(body).split('\n');
  const wanted = new Set(digests);
  const found = new Set();
  const ranges = [];
  const offsets = [0];
  for (const line of lines) offsets.push(offsets.at(-1) + line.length + 1);
  for (const region of ciRegions(body)) {
    if (!wanted.has(region.digest)) continue;
    found.add(region.digest);
    ranges.push([offsets[region.start] - (region.inline ? 1 : 0), offsets[region.end + 1]]);
  }
  if (found.size !== wanted.size) return null;
  let result = body;
  for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) result = result.slice(0, start) + result.slice(end);
  return result;
}

function insertAfter(body, heading, lines) {
  const match = new RegExp(`^${heading}:\\s*$`, 'm').exec(body);
  if (!match) return `${body}${body.endsWith('\n') ? '' : '\n'}${heading}:\n${lines.join('\n')}\n`;
  const at = match.index + match[0].length;
  return `${body.slice(0, at)}\n${lines.join('\n')}${body.slice(at)}`;
}

function matchingBrace(text, open) {
  let depth = 0, quote = null, lineComment = false, blockComment = false;
  for (let i = open; i < text.length; i += 1) {
    const c = text[i], next = text[i + 1];
    if (lineComment) { if (c === '\n') lineComment = false; continue; }
    if (blockComment) { if (c === '*' && next === '/') { blockComment = false; i++; } continue; }
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = null; continue; }
    if (c === '/' && next === '/') { lineComment = true; i++; continue; }
    if (c === '/' && next === '*') { blockComment = true; i++; continue; }
    if (c === '"' || c === "'") { quote = c; continue; }
    if (c === '{') depth++;
    if (c === '}' && --depth === 0) return i;
  }
  return -1;
}

function validateExisting(provider, body) {
  if (!body.trim()) return;
  if (/^\s*(?:rig_check|rig-check):/m.test(body) && !/rig-check:start/.test(body)) throw new Error(`${provider}: owned job name collision`);
  if (provider === 'azure_pipelines' && /^(?:steps|stages):/m.test(body)) throw new Error('azure_pipelines: unsupported root steps/stages merge; use an explicit jobs pipeline');
  if (provider === 'azure_pipelines' && /^\s*-\s*job:\s*rig_check(?:\s|$)/m.test(body)) throw new Error('azure_pipelines: owned job name collision');
  if (provider === 'jenkins') {
    if (/stage\s*\(\s*['"]Rig check['"]/.test(body)) throw new Error('jenkins: owned stage name collision');
    const pipelines = [...body.matchAll(/\bpipeline\s*\{/g)];
    const stages = [...body.matchAll(/\bstages\s*\{/g)];
    if (pipelines.length !== 1 || stages.length !== 1 || matchingBrace(body, pipelines[0].index + pipelines[0][0].lastIndexOf('{')) < 0 || matchingBrace(body, stages[0].index + stages[0][0].lastIndexOf('{')) < 0) throw new Error('jenkins: unsupported or malformed declarative pipeline/stages');
    return;
  }
  // rig: deliberately bounded YAML merge shapes, not a YAML reserializer.
  // Flow collections, aliases/tags, documents and tabs need a provider-native
  // adapter; reject them rather than guessing and rewriting user bytes.
  const maps = new Map();
  for (const line of body.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    if (/\t|^---|^\.\.\./.test(line) || /^(?:[^#"']*[: -]\s*)[&*!][\w]/.test(trimmed)) throw new Error(`${provider}: unsupported YAML shape`);
    if (/^[\w.-]+:\s*[\[\{]/.test(trimmed) || /^\s*(?:jobs|workflows|steps|stages):\s*\S/.test(line)) throw new Error(`${provider}: unsupported or malformed YAML collection`);
    const quoted = trimmed.match(/:\s*(["'])(.*)$/);
    if (quoted && !new RegExp(`${quoted[1]}(?:\\s*#.*)?$`).test(quoted[2])) throw new Error(`${provider}: malformed quoted YAML scalar`);
    if (/^\s*-\s/.test(line)) {
      const depth = line.length - line.trimStart().length;
      for (const key of maps.keys()) if (key > depth) maps.delete(key);
    }
    const match = /^( *)([\w.-]+):(?:\s|$)/.exec(line);
    if (!match) {
      if (!/^\s+(?:-\s|[|>])/.test(line)) throw new Error(`${provider}: unsupported or malformed YAML line`);
      continue;
    }
    const depth = match[1].length;
    for (const key of maps.keys()) if (key > depth) maps.delete(key);
    const seen = maps.get(depth) || new Set();
    if (seen.has(match[2])) throw new Error(`${provider}: duplicate YAML key ${match[2]}`);
    seen.add(match[2]); maps.set(depth, seen);
  }
  const required = { 'github-actions': /^jobs:\s*$/m, gitlab_ci: /^[\w.-]+:\s*$/m, circleci: /^version:\s*2\.1\s*$/m, buildkite: /^steps:\s*$/m, azure_pipelines: /^(?:jobs|trigger|pr|pool|variables|resources|name):/m }[provider];
  if (!required?.test(body)) throw new Error(`${provider}: unsupported provider configuration`);
}

function mergeExisting(provider, body, spec) {
  if (!body) return standalone(provider, spec);
  if (body === standalone(provider, spec)) return body;
  const regions = ciRegions(body);
  if (regions.length) {
    const base = stripCiRegions(body, regions.map(region => region.digest));
    const expected = mergeExisting(provider, base, spec);
    if (JSON.stringify(ciRegions(expected).map(region => region.digest).sort()) !== JSON.stringify(regions.map(region => region.digest).sort())) throw new Error(`${provider}: managed CI region changed or is not an executable Rig job`);
    return body;
  }
  if (/rig-check:(?:start|end)/.test(body)) throw new Error(`${provider}: malformed managed CI region`);
  validateExisting(provider, body);
  if (provider === 'gitlab_ci') return `${body}${body.endsWith('\n') ? '' : '\n'}${standalone(provider, spec)}`;
  if (provider === 'circleci') {
    let next = insertAfter(body, 'jobs', [
      '  # rig-check:start', '  rig-check:', '    docker:', '      - image: cimg/node:22.0',
      '    steps:', '      - checkout', `      - run: ${CHECK}`, '  # rig-check:end',
    ]);
    next = insertAfter(next, 'workflows', [
      '  # rig-check:start', '  rig-check:', '    jobs:', '      - rig-check', '  # rig-check:end',
    ]);
    return next;
  }
  if (provider === 'jenkins') {
    const stages = /stages\s*\{/.exec(body);
    if (!stages) throw new Error('jenkins: unsupported pipeline without stages');
    const close = matchingBrace(body, stages.index + stages[0].lastIndexOf('{'));
    if (close < 0) throw new Error('jenkins adapter: malformed stages block');
    const block = [
      '    // rig-check:start', "    stage('Rig check') {", `      steps { sh '${CHECK}' }`, '    }', '    // rig-check:end',
    ].join('\n');
    // Start the block on its own line so removal restores the closing brace's indentation.
    const lineStart = body.lastIndexOf('\n', close) + 1;
    const at = lineStart > 0 && !body.slice(lineStart, close).trim() ? lineStart : close;
    const inline = at > 0 && body[at - 1] !== '\n';
    return `${body.slice(0, at)}${inline ? '\n' : ''}${inline ? block.replace('rig-check:start', 'rig-check:start-inline') : block}\n${body.slice(at)}`;
  }
  if (provider === 'buildkite') return insertAfter(body, 'steps', [
    '  # rig-check:start', '  - label: "Rig check"', `    command: "${CHECK}"`, '  # rig-check:end',
  ]);
  if (provider === 'azure_pipelines') return insertAfter(body, 'jobs', [
    '  # rig-check:start', '  - job: rig_check', '    displayName: Rig check', '    pool:',
    '      vmImage: ubuntu-latest', '    steps:', '      - script: node .rig/bin/check.js --scope repo',
    '        displayName: Rig repository check', '  # rig-check:end',
  ]);
  return body;
}

function detectProvider(target) {
  const found = (id) => { artifactFor(id, target); return id; };
  if (fs.existsSync(path.join(target, '.github', 'workflows'))) return found('github-actions');
  if (fs.existsSync(path.join(target, '.gitlab-ci.yml'))) return found('gitlab_ci');
  if (fs.existsSync(path.join(target, '.circleci', 'config.yml'))) return found('circleci');
  if (fs.existsSync(path.join(target, 'Jenkinsfile'))) return found('jenkins');
  if (fs.existsSync(path.join(target, '.buildkite'))) return found('buildkite');
  if (fs.existsSync(path.join(target, 'azure-pipelines.yml')) || fs.existsSync(path.join(target, 'azure-pipelines.yaml'))) return found('azure_pipelines');
  return null;
}

const UNKNOWN_CI_MARKERS = ['.ci', '.drone.yml', 'bitbucket-pipelines.yml', '.teamcity'];
function detectUnknownCi(target) {
  return UNKNOWN_CI_MARKERS.some((marker) => fs.existsSync(path.join(target, marker)));
}

// The file a provider's artifact would land at, independent of approval —
// so plan time can CAS-track it even before it's known whether the plan
// will be approved (see `resolveProviderPath` callers in plan.js).
function resolveProviderPath(providerId, target) {
  const provider = PROVIDERS[providerId];
  if (!provider) return null;
  return providerId === 'azure_pipelines' && fs.existsSync(path.join(target, 'azure-pipelines.yaml'))
    ? 'azure-pipelines.yaml' : provider.file;
}

function artifactFor(providerId, target, spec = {}) {
  const provider = PROVIDERS[providerId];
  if (!provider) return null;
  const rel = resolveProviderPath(providerId, target);
  if (providerId === 'github-actions') {
    const dir = containedPath(target, '.github/workflows');
    if (fs.existsSync(dir)) for (const name of fs.readdirSync(dir).filter(name => /\.ya?ml$/.test(name) && name !== 'rig.yml')) validateExisting(providerId, fs.readFileSync(containedPath(target, `.github/workflows/${name}`), 'utf8'));
    const file = containedPath(target, rel);
    const desired = githubActionsStandalone(spec);
    if (fs.existsSync(file) && fs.readFileSync(file, 'utf8') !== desired.contents) throw new Error('github-actions: owned workflow collision or changed configuration');
    return desired;
  }
  const abs = containedPath(target, rel);
  const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
  return { relativePath: rel, contents: mergeExisting(providerId, existing, spec), ownership: existing ? 'merge_namespaced' : 'create_owned' };
}

function resolveAdapter(providerId, target = process.cwd(), spec = {}) {
  const provider = PROVIDERS[providerId];
  if (!provider) return { status: 'unknown', artifact: null, reason: `Unknown CI provider "${providerId}"` };
  return { status: 'ready', strategy: provider.strategy, evidence: provider.evidence, artifact: artifactFor(providerId, target, spec) };
}

function planCiIntegration(target, options = {}) {
  if (options.provider) {
    if (PROVIDERS[options.provider]) artifactFor(options.provider, target, options.spec);
    if (!options.approved) return { status: 'approval_required', provider: options.provider, approved: false, artifact: null, evidence: 'unverified' };
    if (detectUnknownCi(target)) throw new Error('unsupported CI configuration; existing unknown provider markers require an approved native adapter');
    const adapter = resolveAdapter(options.provider, target, options.spec);
    if (adapter.status !== 'ready' || !adapter.artifact) throw new Error(`no working adapter for ${options.provider}`);
    return { status: 'integrated', provider: options.provider, approved: true, artifact: adapter.artifact, evidence: 'unverified', execution: { status: 'first_run_required', setup_guidance: 'Run the emitted Rig job on this exact candidate in the selected provider and retain its job URL, commit SHA, command and successful result.' }, always_install_check_command: true };
  }
  const detected = detectProvider(target);
  if (detected) return { status: 'approval_required', provider: detected, approved: false, artifact: null, evidence: 'unverified', always_install_check_command: true };
  if (detectUnknownCi(target)) return { status: 'unknown', provider: null, artifact: null, evidence: 'unverified', always_install_check_command: true };
  return { status: 'approval_required', provider: null, artifact: null, evidence: 'unverified', always_install_check_command: true };
}

function applyCiPlan(target, plan) {
  if (!plan || plan.status !== 'integrated' || !plan.provider || !plan.artifact) throw new Error('applyCiPlan: provider and approval required');
  const write = journalWriter(target);
  write.begin();
  if (plan.provider === 'github-actions') {
    const dir = containedPath(target, '.github/workflows');
    if (fs.existsSync(dir)) {
      for (const entry of fs.readdirSync(dir)) {
        if (entry === 'rig.yml') continue;
        const rel = path.join('.github/workflows', entry);
        const abs = containedPath(target, rel);
        if (!fs.statSync(abs).isFile()) continue;
        const body = fs.readFileSync(abs, 'utf8');
        if (!body.split('\n').includes(GITHUB_WORKFLOW_POINTER)) {
          write(target, rel, `${body}${body.endsWith('\n') ? '' : '\n'}${GITHUB_WORKFLOW_POINTER}\n`, undefined, 'append_managed', { managed_line: GITHUB_WORKFLOW_POINTER });
        }
      }
    }
  }
  const merged = plan.artifact.ownership === 'merge_namespaced';
  write(target, plan.artifact.relativePath, plan.artifact.contents, undefined, plan.artifact.ownership,
    merged ? { managed_regions: ciRegions(plan.artifact.contents).map((region) => region.digest) } : undefined);
  write.finish();
  return { status: 'integrated', provider: plan.provider };
}

function renderPipeline(providerId, spec) {
  return standalone(providerId, spec);
}

module.exports = {
  PROVIDERS, REPORTS_UPLOAD, GITHUB_WORKFLOW_POINTER, detectProvider, detectUnknownCi,
  resolveAdapter, planCiIntegration, applyCiPlan, renderPipeline, githubActionsStandalone,
  resolveProviderPath, ciRegions, stripCiRegions, validateExisting,
};
