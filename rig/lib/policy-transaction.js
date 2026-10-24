'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { containedPath } = require('./path-safety');

// These files contain authority: reject symlinks even when their destination is
// inside the repository, and create temporary files exclusively before rename.
function policyPath(target, rel) {
  const file = containedPath(target, rel);
  let cursor = fs.realpathSync(target);
  for (const part of path.relative(cursor, file).split(path.sep)) {
    cursor = path.join(cursor, part);
    try { if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`policy file follows a symlink: ${rel}`); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return file;
}
function syncDirectory(dir) {
  const fd = fs.openSync(dir, 'r');
  try { fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function atomicWrite(target, rel, bytes) {
  const file = policyPath(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${crypto.randomUUID()}.tmp`;
  let fd;
  try {
    fd = fs.openSync(tmp, 'wx', 0o600);
    fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); fs.closeSync(fd); fd = undefined;
    policyPath(target, rel);
    fs.renameSync(tmp, file); syncDirectory(path.dirname(file));
  } finally {
    if (fd !== undefined) fs.closeSync(fd);
    fs.rmSync(tmp, { force: true });
  }
}
function withPolicyLock(target, fn, { recover = false } = {}) {
  const file = policyPath(target, '.rig/policy/activation.lock');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let recoveryFd;
  const recoveryFile = policyPath(target, '.rig/policy/recovery.lock');
  if (recover) {
    try { recoveryFd = fs.openSync(recoveryFile, 'wx', 0o600); }
    catch (error) { if (error.code === 'EEXIST') throw new Error('policy recovery busy: exclusive recovery lock exists'); throw error; }
    try {
      fs.writeFileSync(recoveryFd, String(process.pid)); fs.fsyncSync(recoveryFd);
      if (fs.existsSync(file)) {
        const pid = Number(fs.readFileSync(file, 'utf8'));
        if (!Number.isSafeInteger(pid) || pid < 1) throw new Error('policy recovery: malformed activation lock; inspect before removing it');
        try { process.kill(pid, 0); throw new Error('policy activation busy: lock owner is alive'); }
        catch (error) { if (error.code !== 'ESRCH') throw error; }
        fs.unlinkSync(file);
      }
    } catch (error) { fs.closeSync(recoveryFd); fs.unlinkSync(recoveryFile); throw error; }
  }
  let fd;
  try { fd = fs.openSync(file, 'wx', 0o600); }
  catch (error) {
    if (recoveryFd !== undefined) { fs.closeSync(recoveryFd); fs.unlinkSync(recoveryFile); }
    if (error.code === 'EEXIST') throw new Error('policy activation busy: exclusive publication lock exists'); throw error;
  }
  try {
    fs.writeFileSync(fd, String(process.pid)); fs.fsyncSync(fd);
    return fn();
  } finally {
    fs.closeSync(fd); fs.unlinkSync(file);
    if (recoveryFd !== undefined) { fs.closeSync(recoveryFd); fs.unlinkSync(recoveryFile); }
    syncDirectory(path.dirname(file));
  }
}
module.exports = { policyPath, atomicWrite, withPolicyLock, syncDirectory };
