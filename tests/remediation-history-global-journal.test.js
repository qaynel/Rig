'use strict';
require('./helpers/hermetic-git-env');
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { parseJournalRecords, readManifest, resumeInstall, uninstall } = require('../rig/lib/lifecycle');
const { checkOnboarding } = require('../rig/lib/onboarding-check');
const { mergeHostGlobalMcp, removeGlobalMcp } = require('../rig/lib/global-writes');
function fixture(run) {
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'rig-remediation-hgj-')); const old=process.env.HOME;
 process.env.HOME=root;
 try { return run(root); } finally { process.env.HOME=old; fs.rmSync(root,{recursive:true,force:true}); }
}
test('journal readers reject contradictory ownership and valid JSON invalid tails',()=>fixture(target=>{
 fs.mkdirSync(path.join(target,'.rig'));
 const digest='a'.repeat(64);
 const a={seq:1,path:'.rig/a',ownership:'create_owned',operation:'create_owned',transaction_kind:'install',state:'pending',preimage_digest:null,desired_digest:digest};
 for(const bad of [{...a,state:'invented'},{...a,ownership:'invented'}]) assert.throws(()=>parseJournalRecords(JSON.stringify(bad)),/line 1/);
 const text=[a,{...a,state:'applied',ownership:'replace_owned',operation:'replace_owned',digest}].map(JSON.stringify).join('\n')+'\n';
 fs.writeFileSync(path.join(target,'.rig/install-manifest.jsonl'),text);
 for(const reader of [()=>readManifest(target),()=>resumeInstall(target,{operations:[]}),()=>checkOnboarding(target,{},{}),()=>uninstall(target)]) assert.throws(reader,/line 2/);
}));
test('weight charges stored preimages once and ignores unrelated data',()=>fixture(target=>{
 fs.mkdirSync(path.join(target,'.rig/preimages'),{recursive:true});
 fs.writeFileSync(path.join(target,'.rig/preimages/a'),'abc');
 const one=checkOnboarding(target,{},{}).weight;
 assert.equal(one.files,1); assert.equal(one.bytes,3);
 fs.writeFileSync(path.join(target,'.rig/preimages/a'),'abcdefg');
 fs.writeFileSync(path.join(target,'unrelated'),'user');
 const two=checkOnboarding(target,{},{}).weight;
 assert.equal(two.files,1); assert.equal(two.bytes,7);
}));
test('shared JSON creator-first removal and reinstall restores original lexical bytes',()=>fixture(home=>{
 const file=path.join(home,'.codeium/windsurf/mcp_config.json');fs.mkdirSync(path.dirname(file),{recursive:true});
 const seed='{\n "n":9007199254740993, "e":1e+09, "s":"\\u0061"\n}\n'; fs.writeFileSync(file,seed);
 const args=id=>({install_id:id,server_name:'db',value:{command:'node',args:[id]}});
 const a=mergeHostGlobalMcp('windsurf',home,args('a'));
 const b=mergeHostGlobalMcp('windsurf',home,args('b'));
 const again=mergeHostGlobalMcp('windsurf',home,args('a'));
 assert.equal(removeGlobalMcp(again).removed,true);
 assert.match(fs.readFileSync(file,'utf8'),/rig-b-db/);
 assert.equal(removeGlobalMcp(b).removed,true);
 assert.equal(fs.readFileSync(file,'utf8'),seed);
 assert.ok(a.path);
}));
const { scanBeforeActivation } = require('../rig/lib/secret-history');
test('history activation rejects a no-op impostor and publishes actionable setup guidance',()=>fixture(target=>{
 spawnSync('git',['init','-q'],{cwd:target});
 fs.mkdirSync(path.join(target,'bin'));
 fs.writeFileSync(path.join(target,'bin/gitleaks'),'#!/bin/sh\nexit 0\n',{mode:0o755});
 const old=process.env.PATH; process.env.PATH=path.join(target,'bin')+path.delimiter+old;
 try {
  const result=scanBeforeActivation(target);
  assert.equal(result.activated,false);
  assert.match(result.history_scan.status,/unsupported|identity|contract/);
  assert.match(result.history_scan.guidance,/gitleaks/i);
 } finally {process.env.PATH=old;}
}));
const realScanner = process.env.RIG_TEST_GITLEAKS || path.resolve(__dirname,'../.context/gitleaks-bin/gitleaks');
function git(target,args) {
 const result=spawnSync('git',['-c','user.name=Fixture','-c','user.email=fixture@example.test',...args],{cwd:target,encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);return result.stdout.trim();
}
test('real pinned scanner finds earlier history, verifies exact-key waiver, rejects ref drift and rescans clean', {skip:!fs.existsSync(realScanner) && 'set RIG_TEST_GITLEAKS to official Gitleaks 8.30.1'},()=>fixture(target=>{
 const old=process.env.PATH;process.env.PATH=path.dirname(realScanner)+path.delimiter+old;
 try {
  git(target,['init','-q']); const branch=git(target,['symbolic-ref','--short','HEAD']);
  const credential=['ghp_','a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8'].join('');
  fs.writeFileSync(path.join(target,'secret.txt'),`github_token = "${credential}"\n`);git(target,['add','secret.txt']);git(target,['commit','-qm','historic finding']);
  fs.writeFileSync(path.join(target,'secret.txt'),'clean\n');git(target,['add','secret.txt']);git(target,['commit','-qm','current clean']);
  const first=scanBeforeActivation(target);assert.equal(first.activated,false);assert.equal(first.history_scan.status,'findings');
  assert.ok(first.history_scan.findings.some(row=>row.path==='secret.txt'&&row.rule&&row.line));
  const report=fs.readFileSync(path.join(target,first.history_scan.report),'utf8'); assert.ok(!report.includes(credential));
  const { signApproval }=require('./helpers/path-b-approval');
  const signed=signApproval(target,first.history_scan.binding_digest,{namespace:'rig-history-waiver',message:first.history_scan.waiver_message});
  const waiver={...signed.approval,binding_digest:first.history_scan.binding_digest};
  const accepted=scanBeforeActivation(target,{waiver});assert.equal(accepted.activated,true);assert.equal(accepted.history_scan.status,'accepted_findings');
  assert.equal(scanBeforeActivation(target,{waiver:{...waiver,signature:'forged'}}).history_scan.status,'invalid_or_stale_waiver');
  git(target,['tag','changed-ref']);assert.equal(scanBeforeActivation(target,{waiver}).history_scan.status,'invalid_or_stale_waiver');git(target,['tag','-d','changed-ref']);
  git(target,['checkout','--orphan','remediated']);git(target,['add','secret.txt']);git(target,['commit','-qm','remove historical credential']);git(target,['branch','-D',branch]);
  const clean=scanBeforeActivation(target);assert.equal(clean.activated,true);assert.equal(clean.history_scan.status,'verified');assert.deepEqual(clean.history_scan.findings,[]);
 } finally {process.env.PATH=old;}
}));
test('truncated final journal cannot claim clean and canonical resume preserves recovery evidence',()=>fixture(target=>{
 const { installState,canonicalJournalText }=require('../rig/lib/lifecycle');
 fs.mkdirSync(path.join(target,'.rig'));
 const file=path.join(target,'.rig/install-manifest.jsonl');
 const original=JSON.stringify({kind:'install_state',complete:true})+'\n'+ '{"seq":2,"path":'; fs.writeFileSync(file,original);
 assert.equal(installState(target).complete,false);
 assert.ok(checkOnboarding(target,{},{}).hardFailures.some(row=>row.code==='journal-truncated-tail'));
 assert.throws(()=>uninstall(target),/truncated/);
 const canonical=canonicalJournalText(original);assert.equal(parseJournalRecords(canonical).at(-1).complete,false);
 assert.equal(Buffer.from(parseJournalRecords(canonical).at(-1).truncated_record_base64,'base64').toString(),'{"seq":2,"path":');
 assert.equal(resumeInstall(target,{operations:[{path:'.rig/a',content:'applied'}]}).complete,true);
 assert.equal(installState(target).complete,true);
 assert.ok(readManifest(target).records.some(row=>row.recovery==='truncated-final-record'));
}));
test('history activation names missing, unsupported and spoofed scanner identities',()=>fixture(target=>{
 fs.mkdirSync(path.join(target,'bin'));const old=process.env.PATH;process.env.PATH=path.join(target,'bin');
 try {
  assert.equal(scanBeforeActivation(target).history_scan.status,'missing_scanner');
  const fake=path.join(target,'bin/gitleaks');
  fs.writeFileSync(fake,'#!/bin/sh\necho 0.1.0\n',{mode:0o755});assert.equal(scanBeforeActivation(target).history_scan.status,'unsupported_scanner_version');
  fs.writeFileSync(fake,'#!/bin/sh\necho 8.30.1\n',{mode:0o755});assert.equal(scanBeforeActivation(target).history_scan.status,'untrusted_scanner_identity');
 } finally {process.env.PATH=old;}
}));
test('real scanner rejects concurrent ref mutation and missing full-history evidence', {skip:!fs.existsSync(realScanner) && 'set RIG_TEST_GITLEAKS to official Gitleaks 8.30.1'},()=>fixture(target=>{
 git(target,['init','-q']);fs.writeFileSync(path.join(target,'clean.txt'),'clean\n');git(target,['add','clean.txt']);git(target,['commit','-qm','clean']);
 const bin=path.join(target,'git-bin');fs.mkdirSync(bin); const old=process.env.PATH;
 // The genuine scanner invokes Git; a one-time ref write simulates another process.
 fs.writeFileSync(path.join(bin,'git'),`#!/bin/sh\ncase "$*" in *log*) /usr/bin/git -C '${target}' update-ref refs/tags/concurrent HEAD;; esac\nexec /usr/bin/git "$@"\n`,{mode:0o755});
 process.env.PATH=bin+path.delimiter+path.dirname(realScanner)+path.delimiter+old;
 try {assert.equal(scanBeforeActivation(target).history_scan.status,'stale_history_or_configuration');}
 finally {process.env.PATH=old;}
 fs.writeFileSync(path.join(target,'.git/shallow'),git(target,['rev-parse','HEAD'])+'\n');
 process.env.PATH=path.dirname(realScanner)+path.delimiter+old;
 try {assert.equal(scanBeforeActivation(target).history_scan.status,'history_unavailable_or_shallow');}
 finally {process.env.PATH=old;}
}));
test('actual payload install rejects middle corruption across readers and recovers a truncated tail',()=>fixture(target=>{
 const {runPayload}=require('../rig/lib/payload');git(target,['init','-q']);runPayload(target,['codex'],{releaseTag:'v6.0.0'});
 const file=path.join(target,'.rig/install-manifest.jsonl'); const valid=fs.readFileSync(file,'utf8');
 const rows=valid.trimEnd().split('\n');rows[2]='{broken}';const broken=rows.join('\n')+'\n';
 for(const reader of [()=>runPayload(target,['codex'],{releaseTag:'v6.0.0'}),()=>resumeInstall(target,{operations:[]}),()=>checkOnboarding(target,{},{}),()=>uninstall(target)]) {
  fs.writeFileSync(file,broken);assert.throws(reader,/line 3/);assert.equal(fs.readFileSync(file,'utf8'),broken,'corruption cannot be discarded by a writer');
 }
 fs.writeFileSync(file,valid+'{"seq":');runPayload(target,['codex'],{releaseTag:'v6.0.0'});
 const recovered=readManifest(target);assert.ok(recovered.records.some(row=>row.recovery==='truncated-final-record'));
 assert.equal(require('../rig/lib/lifecycle').installState(target).complete,true);
 assert.equal(uninstall(target).status,'removed');
}));
test('global ownership survives both removal orders and preserves user-edited lexical members',()=>fixture(home=>{
 for(const reversed of [false,true]) {
  const args=id=>({install_id:id,server_name:'db',value:{command:'node',args:[id]}});
  const a=mergeHostGlobalMcp('windsurf',home,args('a'));const b=mergeHostGlobalMcp('windsurf',home,args('b'));
  for(const entry of reversed?[b,a]:[a,b]) assert.equal(removeGlobalMcp(entry).removed,true);
  assert.equal(fs.existsSync(a.path),false);assert.equal(fs.existsSync(a.ownership_file),false);
 }
 const a=mergeHostGlobalMcp('windsurf',home,{install_id:'a',server_name:'db',value:{command:'node'}});
 const edited=fs.readFileSync(a.path,'utf8').replace('{"command":"node"}','{ "command" : "node" }');fs.writeFileSync(a.path,edited);
 assert.throws(()=>mergeHostGlobalMcp('windsurf',home,{install_id:'a',server_name:'db',value:{command:'changed'}}),/changed|manual repair/);
 assert.equal(removeGlobalMcp(a).removed,false);assert.equal(fs.readFileSync(a.path,'utf8'),edited);
}));
test('real scanner refuses unreadable output, concurrent configuration edits and abnormal scanner end', {skip:!fs.existsSync(realScanner) && 'set RIG_TEST_GITLEAKS to official Gitleaks 8.30.1'},()=>fixture(target=>{
 git(target,['init','-q']);fs.writeFileSync(path.join(target,'clean.txt'),'clean\n');git(target,['add','clean.txt']);git(target,['commit','-qm','clean']);
 const bin=path.join(target,'git-bin');fs.mkdirSync(bin);const old=process.env.PATH;
 process.env.PATH=bin+path.delimiter+path.dirname(realScanner)+path.delimiter+old;
 try {
  for(const [action,status] of [
   ['mkdir "$HOME/findings.json"','malformed_scanner_output'],
   ['printf "changed" > "$HOME/config.toml"','stale_history_or_configuration'],
   ['kill -TERM "$PPID"','scanner_execution_failed'],
  ]) {
   fs.writeFileSync(path.join(bin,'git'),`#!/bin/sh\ncase "$*" in *log*) ${action};; esac\nexec /usr/bin/git "$@"\n`,{mode:0o755});
   const result=scanBeforeActivation(target);assert.equal(result.activated,false);assert.equal(result.history_scan.status,status);
  }
 } finally {process.env.PATH=old;}
}));
