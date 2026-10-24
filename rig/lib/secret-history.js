'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { writeEvidence } = require('./evidence-artifacts');
const { verifyTrustRootApproval } = require('./trust-root');
const { redact } = require('./redaction');

const VERSION = [8, 30, 1].join('.');
// Official v8.30.1 release binaries, extracted from checksum-verified archives.
const BINARIES = new Set([
  'ba52fb1bfabbcde42f032afad3d6e0b19dff8ed105229a16e7caa338bbc0e84f',
  'cee01fea7173f1b779dff188e1c26ecbcb4027d394acc573b23aaf0be260e291',
  '88f91962aa2f93ac6ab281d553b9e125f5197bbbce38f9f2437f7299c32e5509',
  '00e91bbe655bd7c47753e8cfe61cb76ea1a5d7e7702fe161ee40102b46b3823b',
]);
const CONFIG = '[extend]\nuseDefault = true\n';
const SCANNERS = [{ name: 'gitleaks', version: VERSION }];
const WAIVER_NAMESPACE = 'rig-history-waiver';
const GUIDANCE = `Install the official Gitleaks ${VERSION} release binary on PATH (https://github.com/gitleaks/gitleaks/releases/tag/v${VERSION}); remediate historical findings and rescan, or sign the exact report waiver with the Gate 1 key.`;
const digest = value => crypto.createHash('sha256').update(value).digest('hex');
function executable() {
  for (const dir of (process.env.PATH || '').split(path.delimiter)) {
    const file = dir && path.join(dir, 'gitleaks');
    if (!file) continue;
    try { fs.accessSync(file, fs.constants.X_OK); if (fs.statSync(file).isFile()) return fs.realpathSync(file); } catch { /* next */ }
  }
  return null;
}
function environment(directory) {
  // No parent credentials, global Git configuration, or scanner overrides.
  return { PATH: process.env.PATH || '/usr/bin:/bin', HOME: directory, XDG_CONFIG_HOME: directory,
    GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_NO_REPLACE_OBJECTS: '1', GIT_TERMINAL_PROMPT: '0' };
}
function gitState(target, env) {
  const git = args => spawnSync('git', args, { cwd: target, env, encoding: 'utf8', timeout: 60_000, maxBuffer: 32 * 1024 * 1024 });
  const shallow = git(['rev-parse', '--is-shallow-repository']);
  if (shallow.status !== 0 || shallow.stdout.trim() !== 'false') return null;
  const refs = git(['show-ref', '--head']);
  const objects = git(['rev-list', '--objects', '--all']);
  if (![0, 1].includes(refs.status) || objects.status !== 0) return null;
  return digest(`${refs.stdout}\n${objects.stdout}`);
}
function waiverMessage(target, binding) {
  return `rig-history-waiver\ntarget=${path.resolve(target)}\nbinding=${binding}\n`;
}
function normalizeFindings(raw) {
  if (!Array.isArray(raw)) throw new Error('report must be a JSON array');
  const rows = raw.map(row => {
    if (!row || typeof row.RuleID !== 'string' || !/^[A-Za-z0-9_.-]+$/.test(row.RuleID)
      || typeof row.File !== 'string' || path.isAbsolute(row.File) || row.File.split(/[\\/]/).includes('..')
      || /[\x00-\x1f]/.test(row.File) || !Number.isInteger(row.StartLine) || row.StartLine < 1
      || typeof row.Commit !== 'string' || !/^[a-f0-9]{40,64}$/.test(row.Commit)) throw new Error('invalid finding record');
    return { path: redact(row.File), line: row.StartLine, rule: row.RuleID, commit: row.Commit,
      remediation: 'Revoke or rotate any real credential; remove it from reachable Git history, then rescan.' };
  });
  return rows.sort((a,b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
}
function scanBeforeActivation(target, { waiver = null } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-history-'));
  const env = environment(directory);
  const evidence = { scanner: 'gitleaks', version: VERSION, scope: 'all reachable refs and HEAD; full history', configuration_digest: digest(CONFIG), guidance: GUIDANCE, findings: [] };
  const finish = (status, exitCode, activated = false) => {
    const history_scan = { ...evidence, status, exit_code: exitCode, report: 'reports/rig/history-scan.json' };
    writeEvidence(target, history_scan.report, `${JSON.stringify(history_scan, null, 2)}\n`);
    return { activated, history_scan };
  };
  try {
    const command = executable();
    if (!command) return finish('missing_scanner', 127);
    const version = spawnSync(command, ['version'], { env, encoding: 'utf8', timeout: 10_000, maxBuffer: 4096 });
    if (version.status !== 0 || version.stdout.trim() !== VERSION) return finish('unsupported_scanner_version', version.status || 1);
    const identity = digest(fs.readFileSync(command));
    evidence.scanner_digest = identity;
    if (!BINARIES.has(identity)) return finish('untrusted_scanner_identity', 1);
    const before = gitState(target, env);
    if (!before) return finish('history_unavailable_or_shallow', 1);
    const config = path.join(directory, 'config.toml');
    const output = path.join(directory, 'findings.json');
    fs.writeFileSync(config, CONFIG, { mode: 0o600 });
    const args = ['git', '.', '--log-opts=--all --full-history', '--config', config, '--gitleaks-ignore-path', directory,
      '--ignore-gitleaks-allow', '--report-format=json', '--report-path', output, '--redact=100', '--no-banner', '--no-color'];
    const result = spawnSync(command, args, { cwd: target, env, encoding: 'utf8', timeout: 10 * 60 * 1000, maxBuffer: 1024 * 1024 });
    evidence.repository_state_digest = before;
    if (before !== gitState(target, env) || fs.readFileSync(config, 'utf8') !== CONFIG || digest(fs.readFileSync(command)) !== identity) return finish('stale_history_or_configuration', 1);
    if (result.error || result.signal || ![0,1].includes(result.status)) return finish(result.error?.code === 'ETIMEDOUT' ? 'timeout' : 'scanner_execution_failed', result.status || 1);
    try { evidence.findings = normalizeFindings(JSON.parse(fs.readFileSync(output, 'utf8'))); }
    catch { return finish('malformed_scanner_output', 1); }
    if ((result.status === 0) !== (evidence.findings.length === 0)) return finish('inconsistent_scanner_output', 1);
    evidence.finding_set_digest = digest(JSON.stringify(evidence.findings));
    evidence.binding_digest = digest(JSON.stringify({ repository: path.resolve(target), history: before, scanner: identity, version: VERSION, configuration: evidence.configuration_digest, findings: evidence.finding_set_digest }));
    evidence.waiver_message = waiverMessage(target, evidence.binding_digest);
    if (!evidence.findings.length) return finish('verified', 0, true);
    if (waiver) {
      try {
        if (waiver.binding_digest !== evidence.binding_digest) throw new Error('stale waiver');
        verifyTrustRootApproval(target, { identity: waiver.identity, namespace: WAIVER_NAMESPACE, message: evidence.waiver_message, signature: waiver.signature });
      } catch { return finish('invalid_or_stale_waiver', 1); }
      return finish('accepted_findings', 0, true);
    }
    return finish('findings', 1);
  } finally { fs.rmSync(directory, { recursive: true, force: true }); }
}
module.exports = { SCANNERS, scanBeforeActivation, WAIVER_NAMESPACE, waiverMessage };
