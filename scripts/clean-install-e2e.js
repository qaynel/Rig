#!/usr/bin/env node
'use strict';
// Real network E2E is intentionally separate from the unit gate. It uses no
// checkout node_modules and creates a fresh cache and disposable SSHSIG signer.
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnGuardedSync } = require('../rig/lib/spawn-guarded');
const { pathToFileURL } = require('node:url');
const root = path.resolve(__dirname, '..');
const sha256 = (b) => crypto.createHash('sha256').update(b).digest('hex');
function run(cmd, args, options = {}) {
  const result = spawnGuardedSync(cmd, args, { cwd: root, encoding: 'utf8', timeout: 240000, maxBuffer: 20 * 1024 * 1024, ...options });
  if (result.status !== 0) throw new Error(`${cmd}: ${result.stderr || result.stdout || result.error}`);
  return result.stdout.trim();
}
function inventory(dir, prefix = '') {
  const out = {};
  for (const entry of fs.readdirSync(path.join(dir, prefix), { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const file = path.join(dir, rel);
    const st = fs.lstatSync(file);
    if (entry.isDirectory()) Object.assign(out, inventory(dir, rel));
    else out[rel] = { type: entry.isSymbolicLink() ? 'symlink' : 'file', mode: st.mode & 0o777, digest: sha256(entry.isSymbolicLink() ? fs.readlinkSync(file) : fs.readFileSync(file)) };
  }
  return out;
}
function json(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function fixtureApproval(work, target, planDigest) {
  // rig: scheduled authority is deliberately limited to this process's two
  // disposable directories. Never use the owner's release signing key.
  assert.ok([path.join(work, 'fresh'), path.join(work, 'existing')].includes(target));
  const key = path.join(work, 'fixture-key');
  const message = path.join(work, 'approval-message');
  const identity = 'disposable-clean-install@rig';
  fs.writeFileSync(message, `rig-plan-approval\ndigest=${planDigest}\n`);
  if (fs.existsSync(`${message}.sig`)) fs.unlinkSync(`${message}.sig`);
  run('ssh-keygen', ['-Y', 'sign', '-f', key, '-n', 'rig-plan-approval', message]);
  return { schema_version: 1, kind: 'plan-approval', plan_digest: planDigest, approval: { method: 'external-sshsig', identity, signature: fs.readFileSync(`${message}.sig`, 'utf8') } };
}
async function main() {
  const opts = Object.fromEntries(process.argv.slice(2).reduce((a, item, i, all) => item.startsWith('--') ? [...a, [item.slice(2), all[i + 1]]] : a, []));
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-clean-e2e-'));
  const env = { ...process.env, npm_config_cache: path.join(work, 'empty-npm-cache'), GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1' };
  const checkoutSha = run('git', ['rev-parse', 'HEAD']);
  const evidence = { schema_version: 1, checkout_sha: checkoutSha, sha: opts.sha || run('git', ['rev-parse', 'HEAD']), node: process.version, os: { platform: process.platform, release: os.release(), arch: process.arch }, registry: run('npm', ['config', 'get', 'registry'], { env }), scenarios: [] };
  assert.match(evidence.sha, /^[a-f0-9]{40}$/);
  evidence.provisional = evidence.sha !== checkoutSha || Boolean(run('git', ['status', '--porcelain']));
  try {
    let archive = opts.artifact;
    if (!opts.tag && !archive) {
      assert.equal(run('git', ['status', '--porcelain']), '', 'Commit final candidate bytes before exact-SHA E2E');
      archive = path.join(work, 'candidate.tar.gz');
      run('git', ['archive', '--format=tar.gz', '--prefix=rig-candidate/', '-o', archive, evidence.sha]);
    }
    if (archive) evidence.archive_digest = sha256(fs.readFileSync(archive));
    if (opts.tag) evidence.tag = opts.tag;
    run('ssh-keygen', ['-t', 'ed25519', '-N', '', '-C', 'disposable-clean-install@rig', '-f', path.join(work, 'fixture-key')]);
    const [type, key] = fs.readFileSync(path.join(work, 'fixture-key.pub'), 'utf8').trim().split(/\s+/);
    for (const scenario of ['fresh', 'existing']) {
      const target = path.join(work, scenario);
      fs.mkdirSync(target);
      run('git', ['init', '-q', target], { env });
      fs.mkdirSync(path.join(target, '.rig'));
      fs.writeFileSync(path.join(target, '.rig/allowed-signers'), `disposable-clean-install@rig ${type} ${key}\n`);
      if (scenario === 'existing') {
        fs.writeFileSync(path.join(target, 'AGENTS.md'), '# User agent instructions\r\nPreserve these bytes.\r\n');
        fs.writeFileSync(path.join(target, '.gitignore'), 'ignored/\nreports/\n');
        fs.mkdirSync(path.join(target, 'ignored'));
        fs.writeFileSync(path.join(target, 'ignored/user.bin'), Buffer.from([0, 255, 12, 1]));
        fs.mkdirSync(path.join(target, 'reports/rig'), { recursive: true });
        fs.writeFileSync(path.join(target, 'reports/rig/last-uninstall.json'), '{"owner":"user"}\r\n');
        fs.writeFileSync(path.join(target, 'reports/rig/user.json'), 'existing ignored report');
      }
      // Named service checks inspect real fixture docs. These bytes are part of
      // the baseline and must survive uninstall.
      fs.writeFileSync(path.join(target, 'README.md'), '# Example\n## Setup\nRun npm install.\n## Run\nRun node app.js.\n## Check\nRun node --test.\n');
      const before = inventory(target);
      const installArgs = opts.tag ? ['--version', opts.tag] : ['--candidate-artifact', path.resolve(archive), '--candidate-sha', evidence.sha, '--candidate-digest', evidence.archive_digest];
      const installed = run('sh', [path.join(root, 'install.sh'), ...installArgs, '--target', target, '--hosts', 'codex'], { env });
      const downloadedDigest = installed.match(/archive-sha256=([a-f0-9]{64})/)?.[1];
      assert.ok(downloadedDigest, 'installer must identify downloaded archive bytes');
      if (evidence.archive_digest) assert.equal(downloadedDigest, evidence.archive_digest);
      else evidence.archive_digest = downloadedDigest;
      assert.ok(fs.existsSync(path.join(target, '.rig/routing.md')));
      const descriptor = json(path.join(target, '.rig/mcp-server.json'));
      const sdk = path.join(target, '.rig/runtime/rig-mcp/node_modules/@modelcontextprotocol/sdk/dist/esm');
      const [{ Client }, { StdioClientTransport }] = await Promise.all([import(pathToFileURL(path.join(sdk, 'client/index.js')).href), import(pathToFileURL(path.join(sdk, 'client/stdio.js')).href)]);
      const client = new Client({ name: 'real-clean-install', version: '1.0.0' });
      const transport = new StdioClientTransport({ ...descriptor, cwd: target, env });
      await client.connect(transport);
      try {
        const result = await client.callTool({ name: 'rig_instructions', arguments: { mode: 'full' } });
        assert.equal(result.isError, undefined);
        assert.match(result.structuredContent.instructions, /lazy senior/i);
      } finally { await client.close(); }
      const cli = path.join(target, '.rig/bin/rig');
      const requestFile = path.join(work, `${scenario}-request.json`);
      function onboarding(request) {
        fs.writeFileSync(requestFile, JSON.stringify({ schema_version: 1, target, ...request }));
        return JSON.parse(run(cli, ['onboarding', '--input', requestFile], { env }));
      }
      const prepared = onboarding({ action: 'prepare' });
      const state = json(path.join(target, '.rig/state.json'));
      const summary = ['Existing state', 'Rig interpretation', 'Reuse', 'Grafts and improvements', 'New capabilities', 'Important decisions', 'Resulting pipeline', 'Expected user experience'].map((h) => `## ${h}\nPreserve user files and check approved onboarding documentation.`).join('\n');
      const selected = { 'development.documentation.onboarding-docs': 'minimal' };
      const proposed = onboarding({ action: 'propose', expected_revision: prepared.revision, proposal: { inventory_digest: state.inventory.digest, catalog_digest: state.release.catalog_digest, capabilities: [], selected_skills: [], selected_services: selected, grafts: [], owned_files: [], critical_decisions: [] }, summary_markdown: `# Rig onboarding summary\n${summary}\n` });
      const applied = onboarding({ action: 'apply', expected_revision: proposed.revision, approval: fixtureApproval(work, target, proposed.proposal_digest) });
      const checked = onboarding({ action: 'check', expected_revision: applied.revision });
      assert.deepEqual(checked.hard_failures, []);
      assert.equal(checked.phase, 'checked');
      const checks = json(path.join(target, '.rig/state.json')).checks.service_checks;
      assert.ok(checks?.executed_count > 0, 'selected service must execute nonzero check IDs');
      assert.ok(checks.results.some(r => r.service_id === 'development.documentation.onboarding-docs' && r.executed_checks?.includes('onboarding-docs-source-code-boundary')), 'approved named check ID must actually execute');
      evidence.scenarios.push({ scenario, selected_services: selected, service_checks: checks, mcp_tool: 'rig_instructions', baseline_files: Object.keys(before).length });
      run(cli, ['--target', target, '--uninstall', '--purge-generated'], { env });
      assert.deepEqual(inventory(target), before, `${scenario}: complete inventory and bytes after uninstall`);
    }
    evidence.status = 'pass';
  } catch (error) { evidence.status = 'fail'; evidence.failure = error.message; throw error; }
  finally {
    const out = path.resolve(opts.out || '.context/e2e-evidence.json');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    fs.writeFileSync(out, JSON.stringify(evidence, null, 2) + '\n');
    fs.rmSync(work, { recursive: true, force: true });
  }
  console.log(JSON.stringify(evidence, null, 2));
}
if (require.main === module) main().catch((error) => { console.error(error.stack); process.exitCode = 1; });
module.exports = { inventory };
