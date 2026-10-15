'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const cp = require('node:child_process');
const { proposeSetup, applySetup, approvalMessage } = require('../rig/lib/lint-format');
const { uninstall, readManifest } = require('../rig/lib/lifecycle');
function repo(t) { const p = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-setup-')); t.after(() => fs.rmSync(p, {recursive:true, force:true})); return p; }
function sign(target, proposal) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-setup-key-'));
  try {
    cp.execFileSync('ssh-keygen', ['-q', '-t', 'ed25519', '-N', '', '-f', path.join(dir, 'key')]);
    fs.mkdirSync(path.join(target, '.rig'), {recursive:true});
    fs.writeFileSync(path.join(target, '.rig/allowed-signers'), `owner ${fs.readFileSync(path.join(dir, 'key.pub'), 'utf8')}`);
    fs.writeFileSync(path.join(dir, 'message'), approvalMessage(proposal.digest));
    cp.execFileSync('ssh-keygen', ['-Y', 'sign', '-f', path.join(dir, 'key'), '-n', 'rig-lint-format-setup', path.join(dir, 'message')], {stdio:'ignore'});
    return { identity:'owner', signature:fs.readFileSync(path.join(dir, 'message.sig'), 'utf8') };
  } finally {fs.rmSync(dir, {recursive:true, force:true});}
}
test('good tool has no setup proposal and decline leaves old bytes untouched', t => {
  const target = repo(t); fs.writeFileSync(path.join(target, 'biome.json'), '{"old":true}\n');
  assert.equal(proposeSetup({target, ecosystem:'js', existing_tool:'biome'}).action, 'preserve');
  const proposal = proposeSetup({target, ecosystem:'js', existing_tool:'tslint', signals:['tslint.json deprecated'], writes:[{path:'biome.json',content:'{}\n'}]});
  assert.equal(proposal.action, 'replace');
  assert.equal(applySetup(target, proposal, null).status, 'declined');
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'), '{"old":true}\n');
  assert.equal(fs.existsSync(path.join(target,'.rig')), false);
});
test('setup only writes exact approved config scope and rejects plan approval', t => {
  const target = repo(t); const proposal = proposeSetup({target,ecosystem:'js',writes:[{path:'biome.json',content:'{}\n'}]});
  assert.throws(() => applySetup(target, proposal, {verified:true}), /approval/);
  applySetup(target, proposal, sign(target,proposal));
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),'{}\n');
  assert.throws(() => proposeSetup({target,ecosystem:'js',writes:[{path:'package.json',content:'{}'}]}), /scope/);
  uninstall(target); assert.equal(fs.existsSync(path.join(target,'biome.json')), false);
});
test('replaced JSON restores exact original bytes and retained preimage survives conflict and retry', t => {
  const target = repo(t); const old = '{"indent":4}\r\n'; fs.writeFileSync(path.join(target,'biome.json'), old);
  const proposal = proposeSetup({target,ecosystem:'js',existing_tool:'biome',signals:['archived'],writes:[{path:'biome.json',content:'{}\n'}]});
  applySetup(target,proposal,sign(target,proposal));
  const record = readManifest(target).records.find(r => r.ownership === 'lint_format_config');
  assert.ok(record.preimage_digest);
  fs.writeFileSync(path.join(target,'biome.json'),'user edit\n');
  assert.equal(uninstall(target).status, 'best_effort');
  assert.equal(fs.readFileSync(path.join(target,'.rig/preimages',record.preimage_digest),'utf8'), old);
  fs.writeFileSync(path.join(target,'biome.json'),'{}\n');
  assert.equal(uninstall(target).status,'removed');
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),old);
});
test('shared TOML preserves unapproved sections and restore recognizes interrupted reversal', t => {
  const target = repo(t); const old = '[project]\nname="mine"\n\n[tool.ruff]\nline-length=88\n';
  fs.writeFileSync(path.join(target,'pyproject.toml'),old);
  assert.throws(() => proposeSetup({target,ecosystem:'python',writes:[{path:'pyproject.toml',content:old.replace('mine','other')}]}), /section/);
  const proposal = proposeSetup({target,ecosystem:'python',existing_tool:'ruff',signals:['coverage'],writes:[{path:'pyproject.toml',content:old.replace('88','100')} ]});
  applySetup(target,proposal,sign(target,proposal));
  // Simulate crash after restore write and before journal cleanup.
  fs.writeFileSync(path.join(target,'pyproject.toml'),old);
  assert.equal(uninstall(target).status,'removed');
  assert.equal(fs.readFileSync(path.join(target,'pyproject.toml'),'utf8'),old);
});
test('successive replacements retain the original configuration lineage', t => {
  const target=repo(t);fs.writeFileSync(path.join(target,'biome.json'),'original\n');
  for (const content of ['first\n','second\n']) {
    const p=proposeSetup({target,ecosystem:'js',existing_tool:'biome',signals:['archived'],writes:[{path:'biome.json',content}]});
    applySetup(target,p,sign(target,p));
  }
  uninstall(target);
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),'original\n');
});
test('an interrupted apply resumes the same approved bytes and uninstall retains original bytes', t => {
  const target=repo(t);fs.writeFileSync(path.join(target,'biome.json'),'original\n');
  const p=proposeSetup({target,ecosystem:'js',existing_tool:'biome',signals:['archived'],writes:[{path:'biome.json',content:'replacement\n'}]});
  const approval=sign(target,p);
  const originalWrite=fs.writeFileSync;
  fs.writeFileSync=function(file,...args){const result=originalWrite.call(fs,file,...args);if(String(file).endsWith('/biome.json'))throw Error('simulated crash after write');return result;};
  try {assert.throws(()=>applySetup(target,p,approval),/simulated crash/);} finally {fs.writeFileSync=originalWrite;}
  assert.equal(applySetup(target,p,approval).status,'applied');
  uninstall(target);assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),'original\n');
});
test('an interrupted restore retains the backup until a retry succeeds', t => {
  const target=repo(t);fs.writeFileSync(path.join(target,'biome.json'),'original\n');
  const p=proposeSetup({target,ecosystem:'js',existing_tool:'biome',signals:['archived'],writes:[{path:'biome.json',content:'replacement\n'}]});
  applySetup(target,p,sign(target,p));
  const originalWrite=fs.writeFileSync;
  fs.writeFileSync=function(file,...args){const result=originalWrite.call(fs,file,...args);if(String(file).endsWith('/biome.json'))throw Error('simulated restore interruption');return result;};
  try {assert.equal(uninstall(target).status,'best_effort');} finally {fs.writeFileSync=originalWrite;}
  const record=readManifest(target).records.find(r=>r.ownership==='lint_format_config');
  assert.ok(fs.existsSync(path.join(target,'.rig/preimages',record.preimage_digest)));
  assert.equal(uninstall(target).status,'removed');
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),'original\n');
});
test('replacement refuses a corrupt existing preimage before changing configuration', t => {
  const target=repo(t);fs.writeFileSync(path.join(target,'biome.json'),'original\n');
  const p=proposeSetup({target,ecosystem:'js',existing_tool:'biome',signals:['archived'],writes:[{path:'biome.json',content:'replacement\n'}]});
  const approval=sign(target,p);
  fs.mkdirSync(path.join(target,'.rig/preimages'),{recursive:true});
  fs.writeFileSync(path.join(target,'.rig/preimages',p.writes[0].preimage_digest),'corrupt\n');
  assert.throws(()=>applySetup(target,p,approval),/preimage/);
  assert.equal(fs.readFileSync(path.join(target,'biome.json'),'utf8'),'original\n');
});
test('installed CLI proposes, separately approves, applies, and uninstalls lint setup', async () => {
  const h = require('./helpers/path-b');
  await h.withRepo(async target => {
    const cli = path.join(target, '.rig/bin/rig');
    const run = (request) => {
      const input = path.join(target, 'lint-setup-request.json');
      fs.writeFileSync(input, `${JSON.stringify(request)}\n`);
      const result = cp.spawnSync(cli, ['lint-setup', '--input', input], { encoding: 'utf8' });
      assert.equal(result.status, 0, result.stderr || result.stdout);
      return JSON.parse(result.stdout);
    };
    const proposal = run({
      action: 'propose', target, ecosystem: 'js',
      writes: [{ path: 'biome.json', content: '{"formatter":{"indentWidth":2}}\n' }],
    });
    assert.equal(proposal.action, 'setup');
    const applied = run({ action: 'apply', target, proposal, approval: sign(target, proposal) });
    assert.equal(applied.status, 'applied');
    assert.equal(fs.readFileSync(path.join(target, 'biome.json'), 'utf8'), '{"formatter":{"indentWidth":2}}\n');
    const removed = cp.spawnSync(cli, ['--target', target, '--uninstall'], { encoding: 'utf8' });
    assert.equal(removed.status, 0, removed.stderr || removed.stdout);
    assert.equal(fs.existsSync(path.join(target, 'biome.json')), false);
    assert.equal(fs.existsSync(cli), false);
  }, { install: true });
});
