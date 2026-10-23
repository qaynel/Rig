'use strict';
const fs = require('node:fs');
const path = require('node:path');
const {spawnGuardedSync} = require('./spawn-guarded');
const {containedPath} = require('./path-safety');
const {sha256} = require('./skill-catalog');
function verifyTestEvidence(target, {file,title}) {
  if (typeof file !== 'string' || !/^tests\/[A-Za-z0-9_./-]+\.test\.js$/.test(file) || typeof title !== 'string' || !title.trim()) return {status:'invalid'};
  let abs;
  try {abs=containedPath(target,file); if (!fs.statSync(abs).isFile()) return {status:'missing'};} catch {return {status:'missing'};}
  const sourceDigest=sha256(fs.readFileSync(abs));
  const pattern = `^${title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')}$`;
  const env = {...process.env}; delete env.NODE_TEST_CONTEXT;
  const result=spawnGuardedSync(process.execPath,['--test',`--test-name-pattern=${pattern}`,`--test-reporter=${require.resolve('./test-evidence-reporter')}`,abs],{cwd:target,encoding:'utf8',timeout:120000,maxBuffer:4194304,env});
  let rows;
  try {rows=result.stdout.split('\n').filter(Boolean).map(line=>JSON.parse(line));} catch {return {status:'runner-error'};}
  const matches=rows.filter(row=>row.name === title && !row.suite && row.file && path.resolve(row.file) === abs);
  const passed=result.status === 0 && !result.error && matches.length > 0
    && matches.every(row=>row.type === 'test:pass' && !row.skip && !row.todo);
  if (sha256(fs.readFileSync(abs)) !== sourceDigest) return {status:'changed'};
  return {status:passed?'passed':'not-passed',file,title,source_digest:sourceDigest,executed:matches.filter(row=>!row.skip&&!row.todo).length};
}
function standardsGraft(target, rel, {source = path.join(__dirname,'../corpus/standards/ai-sdlc.md')} = {}) {
  const abs=containedPath(target,rel);
  const content=fs.readFileSync(source,'utf8').trim();
  return {capability:'development.ai-sdlc',path:rel,version:1,content,content_digest:sha256(content),preimage_digest:fs.existsSync(abs)?sha256(fs.readFileSync(abs)):null};
}
module.exports={verifyTestEvidence,standardsGraft};
