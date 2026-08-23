'use strict';

const fs = require('node:fs');
const path = require('node:path');

function containedPath(target, rel) {
  if (typeof rel !== 'string' || !rel || path.isAbsolute(rel)) {
    throw new Error(`unsafe repository path: ${rel}`);
  }
  const root = fs.realpathSync(target);
  const abs = path.resolve(root, rel);
  if (abs === root || !abs.startsWith(`${root}${path.sep}`)) {
    throw new Error(`repository path escapes target: ${rel}`);
  }

  let cursor = root;
  for (const part of path.relative(root, abs).split(path.sep)) {
    cursor = path.join(cursor, part);
    let stat;
    try {
      stat = fs.lstatSync(cursor);
    } catch (error) {
      if (error.code === 'ENOENT') break;
      throw error;
    }
    if (!stat.isSymbolicLink()) continue;
    const resolved = fs.realpathSync(cursor);
    if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) {
      throw new Error(`repository path follows an outside symlink: ${rel}`);
    }
  }
  return abs;
}

module.exports = { containedPath };
