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
function treeDigest(dir) {
  const files = inventory(dir);
  return sha256(JSON.stringify(Object.fromEntries(Object.entries(files).sort(([a], [b]) => a.localeCompare(b)))));
}
function json(file) { return JSON.parse(fs.readFileSync(file, 'utf8')); }
function archiveRoot(dir) {
  const roots = fs.readdirSync(dir).map((name) => path.join(dir, name));
  assert.equal(roots.length, 1, 'source archive must contain one top-level directory');
  assert.ok(fs.lstatSync(roots[0]).isDirectory());
  return roots[0];
}
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
  const bin = path.join(work, 'bin');
  const home = path.join(work, 'home');
  const openclawConfig = path.join(home, '.openclaw', 'openclaw.json');
  fs.mkdirSync(bin);
  fs.mkdirSync(path.dirname(openclawConfig), { recursive: true });
  fs.writeFileSync(openclawConfig, JSON.stringify({ mcp: { servers: { keep: { command: 'keep' } } } }, null, 2) + '\n');
  fs.writeFileSync(path.join(bin, 'openclaw'), [
    '#!/usr/bin/env node',
    "const fs = require('node:fs');",
    "const [, , group, action, name, value] = process.argv;",
    "if (group !== 'mcp' || !['show', 'set', 'unset'].includes(action)) process.exit(2);",
    'const file = process.env.OPENCLAW_CONFIG_PATH;',
    "const config = JSON.parse(fs.readFileSync(file, 'utf8'));",
    'config.mcp ??= {}; config.mcp.servers ??= {};',
    "if (action === 'show' && name === '--json') { process.stdout.write(JSON.stringify(config.mcp.servers)); process.exit(0); }",
    "if (action === 'set') config.mcp.servers[name] = JSON.parse(value);",
    "else if (action === 'unset') delete config.mcp.servers[name];",
    "fs.writeFileSync(file, JSON.stringify(config, null, 2) + '\\n');",
    '',
  ].join('\n'), { mode: 0o755 });
  const env = {
    ...process.env,
    HOME: home,
    PATH: `${bin}${path.delimiter}${process.env.PATH}`,
    OPENCLAW_CONFIG_PATH: openclawConfig,
    npm_config_cache: path.join(work, 'empty-npm-cache'),
    GIT_CONFIG_GLOBAL: '/dev/null',
    GIT_CONFIG_NOSYSTEM: '1',
  };
  const checkoutSha = run('git', ['rev-parse', 'HEAD']);
  const evidence = { schema_version: 1, checkout_sha: checkoutSha, sha: opts.sha || run('git', ['rev-parse', 'HEAD']), node: process.version, os: { platform: process.platform, release: os.release(), arch: process.arch }, registry: run('npm', ['config', 'get', 'registry'], { env }), scenarios: [] };
  let candidateUrl = null;
  assert.match(evidence.sha, /^[a-f0-9]{40}$/);
  evidence.provisional = evidence.sha !== checkoutSha || Boolean(run('git', ['status', '--porcelain']));
  try {
    let archive = opts.artifact;
    if (!opts.tag && !archive) {
      assert.equal(run('git', ['status', '--porcelain']), '', 'Commit final candidate bytes before exact-SHA E2E');
      const repo = process.env.RIG_REPO || 'qaynel/Rig';
      candidateUrl = `https://github.com/${repo}/archive/${evidence.sha}.tar.gz`;
      archive = path.join(work, 'downloaded-candidate.tar.gz');
      run('curl', ['-fsSL', candidateUrl, '-o', archive], { env });
      evidence.archive_source_url = candidateUrl;
      evidence.archive_downloaded_sha = evidence.sha;
      evidence.archive_digest = sha256(fs.readFileSync(archive));

      // Compare the remotely fetched exact-SHA archive with Git's archive of
      // the same checked-out commit before exercising the public installer.
      const localArchive = path.join(work, 'checkout-candidate.tar.gz');
      const remoteTree = path.join(work, 'remote-tree');
      const localTree = path.join(work, 'local-tree');
      fs.mkdirSync(remoteTree);
      fs.mkdirSync(localTree);
      run('git', ['archive', '--format=tar.gz', '--prefix=rig-candidate/', '-o', localArchive, evidence.sha]);
      run('tar', ['-xzf', archive, '-C', remoteTree]);
      run('tar', ['-xzf', localArchive, '-C', localTree]);
      assert.deepEqual(inventory(archiveRoot(remoteTree)), inventory(archiveRoot(localTree)),
        'downloaded source tree must match the exact checked-out commit');
      evidence.archive_tree_digest = treeDigest(archiveRoot(localTree));
    }
    if (archive && !evidence.archive_digest) evidence.archive_digest = sha256(fs.readFileSync(archive));
    if (opts.tag) evidence.tag = opts.tag;
    run('ssh-keygen', ['-t', 'ed25519', '-N', '', '-C', 'disposable-clean-install@rig', '-f', path.join(work, 'fixture-key')]);
    const [type, key] = fs.readFileSync(path.join(work, 'fixture-key.pub'), 'utf8').trim().split(/\s+/);
    for (const scenario of ['fresh', 'existing']) {
      const target = path.join(work, scenario);
      fs.mkdirSync(target);
      run('git', ['init', '-q', target], { env });
      const cloneState = path.resolve(target, run('git', ['rev-parse', '--git-path', 'rig'], { cwd: target, env }));
      fs.mkdirSync(cloneState, { recursive: true });
      fs.writeFileSync(path.join(cloneState, 'install-id'), `e2e-${scenario}\n`);
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
      const installArgs = opts.tag ? ['--version', opts.tag] : candidateUrl
        ? ['--candidate-url', candidateUrl, '--candidate-sha', evidence.sha, '--candidate-digest', evidence.archive_digest, '--candidate-tree-digest', evidence.archive_tree_digest]
        : ['--candidate-artifact', path.resolve(archive), '--candidate-sha', evidence.sha, '--candidate-digest', evidence.archive_digest];
      const installed = run('sh', [path.join(root, 'install.sh'), ...installArgs, '--target', target, '--hosts', 'codex', '--openclaw-mcp'], { env });
      const downloadedDigest = installed.match(/archive-sha256=([a-f0-9]{64})/)?.[1];
      assert.ok(downloadedDigest, 'installer must identify downloaded archive bytes');
      if (evidence.archive_digest) assert.equal(downloadedDigest, evidence.archive_digest);
      else evidence.archive_digest = downloadedDigest;
      assert.ok(fs.existsSync(path.join(target, '.rig/routing.md')));
      assert.deepEqual(json(openclawConfig).mcp.servers.keep, { command: 'keep' });
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
      // The installer ships the Gate 1 public key as the only trust root. The
      // disposable signer replaces it only while the approval is verified.
      const trustFile = path.join(target, '.rig/trust/gate1.allowed-signers');
      const shippedRoot = fs.readFileSync(trustFile);
      assert.deepEqual(shippedRoot, fs.readFileSync(path.join(root, 'wiki/gate1/gate1.allowed-signers')), 'installer must ship the Gate 1 key as the trust root');
      fs.writeFileSync(trustFile, `disposable-clean-install@rig ${type} ${key}\n`);
      let applied;
      try { applied = onboarding({ action: 'apply', expected_revision: proposed.revision, approval: fixtureApproval(work, target, proposed.proposal_digest) }); }
      finally { fs.writeFileSync(trustFile, shippedRoot); }
      const checked = onboarding({ action: 'check', expected_revision: applied.revision });
      assert.deepEqual(checked.hard_failures, []);
      assert.equal(checked.phase, 'checked');
      const checks = json(path.join(target, '.rig/state.json')).checks.service_checks;
      assert.ok(checks?.executed_count > 0, 'selected service must execute nonzero check IDs');
      assert.ok(checks.results.some(r => r.service_id === 'development.documentation.onboarding-docs' && r.executed_checks?.includes('onboarding-docs-source-code-boundary')), 'approved named check ID must actually execute');
      evidence.scenarios.push({ scenario, selected_services: selected, service_checks: checks, mcp_tool: 'rig_instructions', baseline_files: Object.keys(before).length });
      run(cli, ['--target', target, '--uninstall', '--purge-generated'], { env });
      assert.deepEqual(inventory(target), before, `${scenario}: complete inventory and bytes after uninstall`);
      assert.deepEqual(json(openclawConfig).mcp.servers, { keep: { command: 'keep' } }, `${scenario}: unrelated OpenClaw server survives`);
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
