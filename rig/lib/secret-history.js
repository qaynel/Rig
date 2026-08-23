'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SCANNERS = [
  { name: 'gitleaks', args: ['detect', '--source', '.', '--no-banner', '--redact'] },
  { name: 'trufflehog', args: ['git', 'file://.', '--no-update', '--fail', '--json'] },
];

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function executable(name) {
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    const file = dir && path.join(dir, name);
    if (!file) continue;
    try { fs.accessSync(file, fs.constants.X_OK); return file; } catch { /* continue */ }
  }
  return null;
}

function gitState(target) {
  const result = spawnSync('git', ['rev-list', '--objects', '--all'], {
    cwd: target, encoding: 'utf8', shell: false, timeout: 60_000,
  });
  return result.status === 0 ? digest(result.stdout) : null;
}

function scanBeforeActivation(target) {
  const configured = SCANNERS.map((entry) => ({ ...entry, command: executable(entry.name) }))
    .find((entry) => entry.command);
  if (!configured) {
    return { activated: false, history_scan: { status: 'missing_scanner', exit_code: 127 } };
  }
  const before = gitState(target);
  const result = spawnSync(configured.command, configured.args, {
    cwd: target,
    encoding: 'utf8',
    shell: false,
    timeout: 10 * 60 * 1000,
  });
  const after = gitState(target);
  const combined = `${result.stdout || ''}\n${result.stderr || ''}`;
  const exitCode = result.status == null ? 1 : result.status;
  const stable = before && before === after;
  const ok = !result.error && exitCode === 0 && stable;
  return {
    activated: ok,
    history_scan: {
      status: ok ? 'verified' : !stable ? 'stale_history' : result.error?.code === 'ETIMEDOUT' ? 'timeout' : 'failed',
      scanner: configured.name,
      argv: [...configured.args],
      exit_code: exitCode,
      repository_state_digest: after,
      finding_set_digest: exitCode === 0 ? null : digest(combined),
      output: 'redacted',
    },
  };
}

module.exports = { SCANNERS, scanBeforeActivation };
