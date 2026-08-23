// Additive CI adapters for the six release providers.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('./path-safety');
const { journalWriter } = require('./payload');

const CHECK = 'node .rig/bin/check.js --scope repo';
const PROVIDERS = Object.fromEntries([
  ['github-actions', '.github/workflows/rig.yml'],
  ['gitlab_ci', '.gitlab-ci.yml'],
  ['circleci', '.circleci/config.yml'],
  ['jenkins', 'Jenkinsfile'],
  ['buildkite', '.buildkite/pipeline.yml'],
  ['azure_pipelines', 'azure-pipelines.yml'],
].map(([id, file]) => [id, {
  id,
  status: 'verified',
  strategy: id === 'github-actions' ? 'standalone_additive_job' : 'namespaced_additive_job',
  file,
  evidence: { kind: 'first_wire_test', test: 'tests/release-blockers.test.js' },
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
    '# rig-check:start', 'rig_check:', '  stage: test', '  image: node:22',
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

function insertAfter(body, heading, lines) {
  const match = new RegExp(`^${heading}:\\s*$`, 'm').exec(body);
  if (!match) return `${body}${body.endsWith('\n') ? '' : '\n'}${heading}:\n${lines.join('\n')}\n`;
  const at = match.index + match[0].length;
  return `${body.slice(0, at)}\n${lines.join('\n')}${body.slice(at)}`;
}

function matchingBrace(text, open) {
  let depth = 0;
  for (let i = open; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    if (text[i] === '}' && --depth === 0) return i;
  }
  return -1;
}

function mergeExisting(provider, body, spec) {
  if (!body) return standalone(provider, spec);
  if (body.includes(CHECK) || /rig-check:start|rig_check|rig-check:/.test(body)) return body;
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
    if (!stages) return `${body}${body.endsWith('\n') ? '' : '\n'}${standalone(provider, spec)}`;
    const close = matchingBrace(body, stages.index + stages[0].lastIndexOf('{'));
    if (close < 0) throw new Error('jenkins adapter: malformed stages block');
    const block = [
      '    // rig-check:start', "    stage('Rig check') {", `      steps { sh '${CHECK}' }`, '    }', '    // rig-check:end',
    ].join('\n');
    return `${body.slice(0, close)}${block}\n${body.slice(close)}`;
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
  if (fs.existsSync(path.join(target, '.github', 'workflows'))) return 'github-actions';
  if (fs.existsSync(path.join(target, '.gitlab-ci.yml'))) return 'gitlab_ci';
  if (fs.existsSync(path.join(target, '.circleci', 'config.yml'))) return 'circleci';
  if (fs.existsSync(path.join(target, 'Jenkinsfile'))) return 'jenkins';
  if (fs.existsSync(path.join(target, '.buildkite'))) return 'buildkite';
  if (fs.existsSync(path.join(target, 'azure-pipelines.yml')) || fs.existsSync(path.join(target, 'azure-pipelines.yaml'))) return 'azure_pipelines';
  return null;
}

const UNKNOWN_CI_MARKERS = ['.ci', '.drone.yml', 'bitbucket-pipelines.yml', '.teamcity'];
function detectUnknownCi(target) {
  return UNKNOWN_CI_MARKERS.some((marker) => fs.existsSync(path.join(target, marker)));
}

function artifactFor(providerId, target, spec = {}) {
  const provider = PROVIDERS[providerId];
  if (!provider) return null;
  const rel = providerId === 'azure_pipelines' && fs.existsSync(path.join(target, 'azure-pipelines.yaml'))
    ? 'azure-pipelines.yaml' : provider.file;
  if (providerId === 'github-actions') return githubActionsStandalone(spec);
  const abs = containedPath(target, rel);
  const existing = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : '';
  return { relativePath: rel, contents: mergeExisting(providerId, existing, spec), ownership: existing ? 'merge_namespaced' : 'create_owned' };
}

function resolveAdapter(providerId, target = process.cwd(), spec = {}) {
  const provider = PROVIDERS[providerId];
  if (!provider) return { status: 'unknown', artifact: null, reason: `Unknown CI provider "${providerId}"` };
  return { status: 'verified', strategy: provider.strategy, evidence: provider.evidence, artifact: artifactFor(providerId, target, spec) };
}

function planCiIntegration(target, options = {}) {
  if (options.provider) {
    if (!options.approved) return { status: 'approval_required', provider: options.provider, approved: false, artifact: null, evidence: 'unverified' };
    const adapter = resolveAdapter(options.provider, target, options.spec);
    if (adapter.status !== 'verified' || !adapter.artifact) throw new Error(`no working adapter for ${options.provider}`);
    return { status: 'integrated', provider: options.provider, approved: true, artifact: adapter.artifact, evidence: 'verified', always_install_check_command: true };
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
        const line = '# rig-check: additive job installed at .github/workflows/rig.yml';
        if (!body.split('\n').includes(line)) write(target, rel, `${body}${body.endsWith('\n') ? '' : '\n'}${line}\n`, undefined, 'append_managed', { managed_line: line });
      }
    }
  }
  write(target, plan.artifact.relativePath, plan.artifact.contents, undefined, plan.artifact.ownership);
  write.finish();
  return { status: 'integrated', provider: plan.provider };
}

function renderPipeline(providerId, spec) {
  return standalone(providerId, spec);
}

module.exports = {
  PROVIDERS, REPORTS_UPLOAD, detectProvider, detectUnknownCi, resolveAdapter,
  planCiIntegration, applyCiPlan, renderPipeline, githubActionsStandalone,
};
