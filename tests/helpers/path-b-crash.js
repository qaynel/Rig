'use strict';

// Crash injection for the Path B journalled-write recovery tests.
//
// This lives beside `tests/helpers/path-b.js` rather than inside it because
// that helper is part of the signed Gate 1 manifest (see the same note in
// `path-b-approval.js`). Everything here is new surface, so it can move
// without an oracle re-sign.

const fs = require('node:fs');
const path = require('node:path');

const SIMULATED = 'simulated crash';

// Every journalled write is three observable steps: append the `pending`
// record, put the bytes on disk, append the `applied` record. A process that
// dies between any two of them leaves the repository in a state a later run
// has to recognise as *its own* unfinished work rather than as a conflict.
//
// `crashAfter` reproduces those interruptions faithfully by letting the real
// operation complete and then throwing, so the on-disk evidence is exactly
// what a `kill -9` at that instant would have left behind.
//
//   stage 'pending' — pending record written, bytes not yet on disk
//   stage 'write'   — bytes on disk, applied record not yet written
//   stage 'applied' — applied record written, caller state not yet advanced
//
// Only paths inside `target` count, and `.rig/preimages/` copies are ignored,
// so the crash lands on a payload file rather than on bookkeeping. `match`
// narrows it further to the first journalled path containing that substring,
// which is how a test aims at a graft file instead of the first projection.
function crashAfter(target, stage, run, { match } = {}) {
  if (!['pending', 'write', 'applied'].includes(stage)) {
    throw new Error(`crashAfter: unknown stage "${stage}"`);
  }
  const realAppend = fs.appendFileSync;
  const realWrite = fs.writeFileSync;
  const root = fs.realpathSync(target);
  let armed = true;
  // Node implements appendFileSync on top of the exported writeFileSync, so a
  // journal append would otherwise look like a payload disk write.
  let appending = false;

  const relative = (file) => {
    if (typeof file !== 'string') return null;
    const rel = path.relative(root, path.resolve(file));
    if (!rel || rel.startsWith('..') || path.isAbsolute(rel)) return null;
    return rel.split(path.sep).join('/');
  };
  const targeted = (rel) => typeof rel === 'string'
    && !rel.startsWith('.rig/preimages/')
    && !rel.endsWith('.tmp')
    && (!match || rel.includes(match));
  const detonate = () => {
    armed = false;
    throw new Error(SIMULATED);
  };

  fs.appendFileSync = (file, data, ...rest) => {
    appending = true;
    try { realAppend(file, data, ...rest); } finally { appending = false; }
    if (!armed || stage === 'write') return;
    let record = null;
    try { record = JSON.parse(String(data)); } catch { /* not a journal line */ }
    if (record && record.state === stage && relative(file) && targeted(record.path)) detonate();
  };
  fs.writeFileSync = (file, data, ...rest) => {
    realWrite(file, data, ...rest);
    if (!armed || appending || stage !== 'write') return;
    const rel = relative(file);
    if (rel && targeted(rel)) detonate();
  };

  try {
    run();
    throw new Error(`crashAfter: stage "${stage}"${match ? ` at "${match}"` : ''} never fired`);
  } catch (error) {
    if (error.message !== SIMULATED) throw error;
  } finally {
    fs.appendFileSync = realAppend;
    fs.writeFileSync = realWrite;
  }
}

module.exports = { crashAfter };
