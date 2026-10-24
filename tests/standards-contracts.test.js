'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const root=path.resolve(__dirname,'..');
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
test('Copilot subagent hook emits context and respects inactive mode',()=>{
  const result=spawnSync(process.execPath,[path.join(root,'tests/hooks.test.js')],{encoding:'utf8',timeout:30000});
  assert.equal(result.status,0,result.stdout+result.stderr);
  assert.match(result.stdout,/hook compatibility checks passed/);
});
test('MCP package tests are included in the full repository gate and execute successfully',()=>{
  const scripts=JSON.parse(read('package.json')).scripts;
  assert.match(scripts['test:code'],/npm test --prefix rig-mcp/);
  const env={...process.env};delete env.NODE_TEST_CONTEXT;
  const result=spawnSync('npm',['test','--prefix','rig-mcp'],{cwd:root,encoding:'utf8',timeout:30000,env});
  assert.equal(result.status,0,result.stdout+result.stderr);
  assert.match(result.stdout,/pass [1-9]/);
});
test('adaptation rubric preserves distinct gates axes repeatability and calibration ceiling',()=>{
  const text=read('wiki/specs/adaptation-measurement-rubric.md');
  for(const requirement of ['G1 — Config Preserved','G2 — Zero New Breakages','A1 — Signal-vs-Noise','A2 — Net Capability Added','A3 — Reversibility','MET','UNMET','fail','partial','pass','equal weight','LOW CONFIDENCE','Clean-Checkout Procedure','Prompt Template','claude-sonnet-5-20251022','≥ 3 runs required','mean and observed spread','Model EOL re-pin procedure','eyaltoledano/claude-task-master']) assert.ok(text.includes(requirement),requirement);
  assert.match(text,/do not\s+collapse to a scalar/);
});
test('grilling requires explicit inferred acceptance and resolves one decision at a time',()=>{
  const text=read('rig/corpus/skills/grilling/SKILL.md');
  assert.match(text,/infer a criterion[\s\S]*declare it\s+outright/);
  assert.match(text,/one decision at a time/);
  assert.match(text,/externally observable examples/);
  assert.doesNotMatch(text,/\b(?:maybe|possibly|perhaps)\b/i);
});
test('TDD guidance keeps focused checks in the inner loop and the full gate before push',()=>{
  const text=read('rig/corpus/skills/tdd/SKILL.md');
  assert.match(text,/npm run test:rig/);
  assert.match(text,/single test file/);
  assert.match(text,/full `npm test` gate[\s\S]*right before push/);
});
test('routing and contributor instructions preserve the lightweight carveout and running traces',()=>{
  assert.match(read('rig/corpus/routing.md'),/single-step task[\s\S]*lightweight path/);
  assert.match(read('rig/corpus/routing.md'),/switch to the full cadence/);
  assert.match(read('CLAUDE.md'),/at least every three minutes/);
  assert.match(read('CLAUDE.md'),/single-step task on the lightweight path/);
});
test('README documents the single 6.0.0 install command and agent-led onboarding without a host matrix',()=>{
  const readme=read('README.md');
  assert.match(readme,/## Install[\s\S]*git clone --depth 1 --branch v6\.0\.0/);
  assert.match(readme,/invoke `rig-onboarding`/);
  assert.match(readme,/catalogue services and grades/);
  assert.doesNotMatch(readme,/per-host support matrix|\| Claude Code \|.*\| Codex \|/i);
});
test('identity guard rejects a stale repository slug in an otherwise aligned manifest set',t=>{
  const target=fs.mkdtempSync(path.join(os.tmpdir(),'rig-identity-proof-'));t.after(()=>fs.rmSync(target,{recursive:true,force:true}));
  fs.mkdirSync(path.join(target,'scripts'));
  fs.copyFileSync(path.join(root,'scripts/check-versions.js'),path.join(target,'scripts/check-versions.js'));
  for(const rel of ['.claude-plugin/plugin.json','.codex-plugin/plugin.json','.devin-plugin/plugin.json','.github/plugin/plugin.json','antigravity-plugin/plugin.json','gemini-extension.json','package.json','rig-mcp/package.json']){
    fs.mkdirSync(path.dirname(path.join(target,rel)),{recursive:true});fs.writeFileSync(path.join(target,rel),JSON.stringify({version:'6.0.0'}));
  }
  for(const name of ['check-ticket-traceability','check-raw-registry-access','build-skill-catalog']) fs.writeFileSync(path.join(target,'scripts',`${name}.js`),'process.exit(0);\n');
  const run=()=>spawnSync(process.execPath,[path.join(target,'scripts/check-versions.js')],{encoding:'utf8',env:{...process.env,GITHUB_REF_TYPE:''}});
  assert.equal(run().status,0);
  fs.writeFileSync(path.join(target,'.claude-plugin/plugin.json'),JSON.stringify({version:'6.0.0',homepage:'https://example.com/agentic-harness-demo'}));
  const failed=run();assert.notEqual(failed.status,0);assert.match(failed.stderr,/stale repository identity/);
});
test('historical spec corrections mark retired claims and agree with actual workflow boundaries',()=>{
  const product=read('wiki/specs/product-spec.md');
  assert.match(product,/~~`publish.yml`[\s\S]*Resolved/);
  assert.match(product,/~~CI gates pushes to `main`[\s\S]*Resolved/);
  assert.equal(fs.existsSync(path.join(root,'.github/workflows/publish.yml')),false);
  assert.match(read('.github/workflows/test.yml'),/branches: \['\*\*'\]/);
  assert.match(read('wiki/specs/lint-format-roadmap.md'),/Authored at Policy grade, no placeholders[\s\S]*Superseded/);
});
