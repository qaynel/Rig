'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

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
      // ENOTDIR shows up when an earlier path segment is a file where a
      // directory was expected — e.g. a manifest record under `.git/...` in a
      // linked worktree, where `.git` is itself a file. That makes the path
      // impossible rather than unsafe: nothing further down it to inspect for
      // a symlink escape, so treat it like ENOENT instead of crashing the
      // caller (uninstall, resume, etc. all check `fs.existsSync` next).
      if (error.code === 'ENOENT' || error.code === 'ENOTDIR') break;
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

// Resolves a git-dir-relative path through git itself. Returns null (never
// throws) when `target` is not a git repository or git is unavailable.
// Linked worktrees have a `.git` *file*, so callers must not join `.git/...`
// themselves — this is the safe way to find hooks, the common dir, etc.
function gitPath(target, rel) {
  const result = spawnSync('git', ['rev-parse', '--git-path', rel], {
    cwd: target,
    encoding: 'utf8',
    shell: false,
  });
  if (result.error || result.status !== 0) return null;
  const out = (result.stdout || '').trim();
  if (!out) return null;
  return path.isAbsolute(out) ? out : path.join(target, out);
}

module.exports = { containedPath, gitPath };
