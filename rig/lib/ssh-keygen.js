'use strict';

const fs = require('node:fs');
const path = require('node:path');

function sshKeygenPath() {
  let candidates;
  if (process.platform === 'win32') {
    const systemRoot = process.env.SystemRoot || 'C:\\Windows';
    const driveRooted = /^[A-Za-z]:[\\/]/.test(systemRoot);
    const shareRooted = /^\\\\[^\\/]+[\\/][^\\/]+(?:[\\/]|$)/.test(systemRoot);
    if (!driveRooted && !shareRooted) {
      throw new Error('trusted ssh-keygen requires a drive-qualified or UNC Windows SystemRoot');
    }
    candidates = [path.win32.join(systemRoot, 'System32', 'OpenSSH', 'ssh-keygen.exe')];
  } else candidates = ['/usr/bin/ssh-keygen', '/bin/ssh-keygen'];
  const executable = candidates.find((candidate) => fs.existsSync(candidate));
  if (!executable) throw new Error(`trusted ssh-keygen not found at ${candidates.join(' or ')}`);
  return executable;
}

module.exports = { sshKeygenPath };
