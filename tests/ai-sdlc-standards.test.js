'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { verifyTestEvidence, standardsGraft } = require('../rig/lib/ai-sdlc');
test('actual test evidence rejects comments skipped failing and stale test titles', t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(),'rig-evidence-')); t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'tests'));
  const file='tests/proof.test.js';
  fs.writeFileSync(path.join(root,file), `const test=require('node:test');\n// comment only\ntest('green',()=>{});\ntest.skip('skipped',()=>{});\ntest('failing',()=>{throw Error('no')});`);
  assert.equal(verifyTestEvidence(root,{file,title:'green'}).status,'passed');
  for (const title of ['comment only','skipped','failing','renamed']) assert.notEqual(verifyTestEvidence(root,{file,title}).status,'passed',title);
});
test('standards graft preserves existing instructions and offers only shipped checks as enforced', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'rig-standard-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.writeFileSync(path.join(root,'AGENTS.md'),'Mine\n');
  const graft=standardsGraft(root,'AGENTS.md');
  const {upsertGraftSection,journalWriter}=require('../rig/lib/payload');
  const writer=journalWriter(root); upsertGraftSection(root,{...graft,expected_file_digest:graft.preimage_digest},writer);writer.finish();
  const text=fs.readFileSync(path.join(root,'AGENTS.md'),'utf8');
  assert.ok(text.startsWith('Mine\n'));
  assert.match(text,/Guidance/);
  assert.match(text,/verifyTestEvidence/);
});
test('installed runtime ships standards and its checker and grafts existing docs', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'rig-installed-standard-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.writeFileSync(path.join(root,'AGENTS.md'),'Existing policy\n');
  const {spawnSync}=require('node:child_process');
  const result=spawnSync('sh',[path.join(__dirname,'../rig/bootstrap.sh'),'--target',root,'--hosts','codex','--with-runtime'],{encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  const runtime=require(path.join(root,'.rig/runtime/rig/lib/ai-sdlc.js'));
  const graft=runtime.standardsGraft(root,'AGENTS.md',{source:path.join(root,'.rig/standards/ai-sdlc.md')});
  const {upsertGraftSection,journalWriter}=require(path.join(root,'.rig/runtime/rig/lib/payload.js'));
  const writer=journalWriter(root);upsertGraftSection(root,{...graft,expected_file_digest:graft.preimage_digest},writer);writer.finish();
  assert.ok(fs.readFileSync(path.join(root,'AGENTS.md'),'utf8').startsWith('Existing policy\n'));
  fs.mkdirSync(path.join(root,'tests'));fs.writeFileSync(path.join(root,'tests/proof.test.js'),"require('node:test')('installed proof',()=>{});\n");
  assert.equal(runtime.verifyTestEvidence(root,{file:'tests/proof.test.js',title:'installed proof'}).status,'passed');
});
test('a title imported from another file cannot prove a comment-only reference', t => {
  const root=fs.mkdtempSync(path.join(os.tmpdir(),'rig-evidence-source-'));t.after(()=>fs.rmSync(root,{recursive:true,force:true}));
  fs.mkdirSync(path.join(root,'tests'));
  fs.writeFileSync(path.join(root,'tests/other.test.js'),"require('node:test')('borrowed proof',()=>{});\n");
  fs.writeFileSync(path.join(root,'tests/comment.test.js'),"// borrowed proof\nrequire('./other.test.js');\n");
  assert.notEqual(verifyTestEvidence(root,{file:'tests/comment.test.js',title:'borrowed proof'}).status,'passed');
});
