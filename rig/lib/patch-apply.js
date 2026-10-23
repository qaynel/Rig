// Strict unified-diff applier (git diff form). Pure: Map of path -> Buffer in,
// Map out. Every context and removed line must match exactly; a hunk may sit at
// a different line offset than its header says but never differ in content.
// New-file patches are supported; deletions and renames are not needed.
'use strict';

class PatchError extends Error {}

function parsePatch(text) {
  const files = [];
  let current = null;
  let hunk = null;
  for (const line of text.split('\n')) {
    if (line.startsWith('diff --git ')) {
      const match = line.match(/^diff --git a\/(\S+) b\/(\S+)$/);
      if (!match) throw new PatchError(`unsupported diff header: ${line}`);
      current = { path: match[2], created: false, hunks: [] };
      files.push(current);
      hunk = null;
    } else if (!current) {
      continue;
    } else if (line.startsWith('new file mode')) {
      current.created = true;
    } else if (/^(deleted file mode|rename from|rename to|Binary files)/.test(line)) {
      throw new PatchError(`unsupported patch operation: ${line}`);
    } else if (line.startsWith('@@')) {
      const match = line.match(/^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (!match) throw new PatchError(`malformed hunk header: ${line}`);
      hunk = { oldStart: Number(match[1]), oldLines: Number(match[2] ?? 1), newLines: Number(match[4] ?? 1), lines: [] };
      current.hunks.push(hunk);
    } else if (hunk && /^[ +\-\\]/.test(line)) {
      if (line.startsWith('\\')) continue;
      hunk.lines.push(line);
    } else if (hunk && line === '') {
      // trailing newline of the patch text, or an empty context line stripped by an editor
      hunk.lines.push(' ');
    }
  }
  for (const file of files) {
    for (const h of file.hunks) {
      while (h.lines.length && h.lines.at(-1) === ' ' && h.lines.filter((l) => l[0] !== '+').length > h.oldLines) h.lines.pop();
      const oldCount = h.lines.filter((l) => l[0] !== '+').length;
      const newCount = h.lines.filter((l) => l[0] !== '-').length;
      if (oldCount !== h.oldLines || newCount !== h.newLines) throw new PatchError(`hunk line counts do not match its header in ${file.path}`);
    }
  }
  return files;
}

function applyHunks(source, file) {
  const hadFinalNewline = source.length === 0 || source.endsWith('\n');
  const lines = source.length ? source.replace(/\n$/, '').split('\n') : [];
  let delta = 0;
  for (const hunk of file.hunks) {
    const oldLines = hunk.lines.filter((l) => l[0] !== '+').map((l) => l.slice(1));
    const newLines = hunk.lines.filter((l) => l[0] !== '-').map((l) => l.slice(1));
    const expectedAt = Math.max(0, hunk.oldStart - 1 + delta);
    const matchesAt = (at) => at >= 0 && at + oldLines.length <= lines.length && oldLines.every((l, i) => lines[at + i] === l);
    let at = -1;
    for (let d = 0; d <= lines.length && at === -1; d += 1) {
      if (matchesAt(expectedAt - d)) at = expectedAt - d;
      else if (matchesAt(expectedAt + d)) at = expectedAt + d;
    }
    if (at === -1) throw new PatchError(`a hunk of ${file.path} does not match the pinned bytes`);
    lines.splice(at, oldLines.length, ...newLines);
    delta += newLines.length - oldLines.length;
  }
  return lines.join('\n') + (lines.length && hadFinalNewline ? '\n' : '');
}

// `files` is Map(path -> Buffer); returns a new Map.
function applyPatch(files, patchText) {
  const out = new Map(files);
  for (const file of parsePatch(patchText)) {
    if (file.created) {
      if (out.has(file.path)) throw new PatchError(`${file.path} already exists`);
      out.set(file.path, Buffer.from(applyHunks('', file)));
      continue;
    }
    if (!out.has(file.path)) throw new PatchError(`${file.path} is not present in the fetched bytes`);
    out.set(file.path, Buffer.from(applyHunks(out.get(file.path).toString('utf8'), file)));
  }
  return out;
}

module.exports = { applyPatch, parsePatch, PatchError };
