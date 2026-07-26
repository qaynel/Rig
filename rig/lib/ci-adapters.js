// Target-repo CI adapter registry (impl-design §7.5, §11.3).
// Emits only verified adapters. Unverified providers degrade to advisory —
// never fabricate speculative CI config.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

/**
 * Evidence kinds:
 * - official_doc: citation to provider docs
 * - first_wire_test: recorded test path that proved the adapter
 */
const PROVIDERS = {
  'github-actions': {
    id: 'github-actions',
    status: 'verified',
    evidence: {
      kind: 'official_doc',
      citation:
        'https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions',
      notes: 'Standalone additive job/file under .github/workflows/ is supported.',
    },
    strategy: 'standalone_additive_job',
    adapter: 'githubActionsStandalone',
  },
  gitlab_ci: {
    id: 'gitlab_ci',
    status: 'degraded',
    evidence: null,
    strategy: 'advisory_patch',
    reason: 'No official-doc citation or first-wire test recorded yet.',
  },
  circleci: {
    id: 'circleci',
    status: 'degraded',
    evidence: null,
    strategy: 'advisory_patch',
    reason: 'No official-doc citation or first-wire test recorded yet.',
  },
  jenkins: {
    id: 'jenkins',
    status: 'degraded',
    evidence: null,
    strategy: 'advisory_patch',
    reason: 'No official-doc citation or first-wire test recorded yet.',
  },
  buildkite: {
    id: 'buildkite',
    status: 'degraded',
    evidence: null,
    strategy: 'advisory_patch',
    reason: 'No official-doc citation or first-wire test recorded yet.',
  },
  azure_pipelines: {
    id: 'azure_pipelines',
    status: 'degraded',
    evidence: null,
    strategy: 'advisory_patch',
    reason: 'No official-doc citation or first-wire test recorded yet.',
  },
};

const REPORTS_UPLOAD = {
  path: 'reports/rig/',
  when: 'actionable_reports_exist',
  github_actions: {
    step: {
      name: 'Upload Rig reports',
      if: "hashFiles('reports/rig/**/*.json') != ''",
      uses: 'actions/upload-artifact@v4',
      with: {
        name: 'rig-reports',
        path: 'reports/rig/',
        'if-no-files-found': 'ignore',
      },
    },
    evidence: {
      kind: 'official_doc',
      citation: 'https://docs.github.com/en/actions/using-workflows/storing-workflow-data-as-artifacts',
    },
  },
};

function githubActionsStandalone() {
  return {
    relativePath: '.github/workflows/rig-check.yml',
    contents: [
      'name: rig-check',
      '',
      'on:',
      '  push:',
      '  pull_request:',
      '',
      'jobs:',
      '  rig:',
      '    runs-on: ubuntu-latest',
      '    steps:',
      '      - uses: actions/checkout@v4',
      '      - uses: actions/setup-node@v4',
      '        with:',
      "          node-version: '22'",
      '      - name: Rig catalogue floor',
      '        run: node .rig/bin/check.js --scope repo',
      '      - name: Upload Rig reports',
      "        if: hashFiles('reports/rig/**/*.json') != ''",
      '        uses: actions/upload-artifact@v4',
      '        with:',
      '          name: rig-reports',
      '          path: reports/rig/',
      '          if-no-files-found: ignore',
      '',
    ].join('\n'),
  };
}

function detectProvider(target) {
  if (fs.existsSync(path.join(target, '.github', 'workflows'))) return 'github-actions';
  if (fs.existsSync(path.join(target, '.gitlab-ci.yml'))) return 'gitlab_ci';
  if (fs.existsSync(path.join(target, '.circleci', 'config.yml'))) return 'circleci';
  if (fs.existsSync(path.join(target, 'Jenkinsfile'))) return 'jenkins';
  if (fs.existsSync(path.join(target, '.buildkite'))) return 'buildkite';
  if (fs.existsSync(path.join(target, 'azure-pipelines.yml'))) return 'azure_pipelines';
  return null;
}

function resolveAdapter(providerId) {
  const provider = PROVIDERS[providerId];
  if (!provider) {
    return {
      status: 'degraded',
      strategy: 'advisory_patch',
      reason: `Unknown CI provider "${providerId}"; no speculative config emitted.`,
      artifact: null,
    };
  }
  if (provider.status !== 'verified') {
    return {
      status: 'degraded',
      strategy: provider.strategy,
      reason: provider.reason,
      artifact: null,
      evidence: provider.evidence,
    };
  }
  if (provider.adapter === 'githubActionsStandalone') {
    return {
      status: 'verified',
      strategy: provider.strategy,
      evidence: provider.evidence,
      artifact: githubActionsStandalone(),
      reports_upload: REPORTS_UPLOAD.github_actions,
    };
  }
  return {
    status: 'degraded',
    strategy: 'advisory_patch',
    reason: 'Verified provider lacks a wired adapter implementation.',
    artifact: null,
  };
}

function planCiIntegration(target) {
  const detected = detectProvider(target);
  if (!detected) {
    return {
      provider: null,
      status: 'degraded',
      strategy: 'advisory_patch',
      reason:
        'No recognized CI config; `.rig/bin/check.js` still installs. User approves additive patch.',
      artifact: null,
      always_install_check_command: true,
    };
  }
  return { provider: detected, always_install_check_command: true, ...resolveAdapter(detected) };
}

module.exports = {
  PROVIDERS,
  REPORTS_UPLOAD,
  detectProvider,
  resolveAdapter,
  planCiIntegration,
  githubActionsStandalone,
};
